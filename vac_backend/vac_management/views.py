from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, generics, parsers, permissions, status
from vac_management.models import *
from vac_management import serializers, perms, paginators
from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncMonth, TruncQuarter, TruncYear


class VaccineCategoryViewSet(viewsets.ModelViewSet):
    queryset = VaccineCategory.objects.filter(active=True)
    serializer_class = serializers.VaccineCategorySerializer


class VaccineViewSet(viewsets.ModelViewSet):
    queryset = Vaccine.objects.filter(active=True)
    serializer_class = serializers.VaccineSerializer
    pagination_class = paginators.VaccinePaginator

    def get_queryset(self):
        queryset = super().get_queryset()

        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset

    @action(methods=['get'], url_path='by-name/(?P<vaccine_name>[^/.]+)', detail=False)
    def get_by_name(self, request, vaccine_name=None):
        try:
            vaccine = Vaccine.objects.get(vaccine_name__iexact=vaccine_name, active=True)
            return Response(serializers.VaccineSerializer(vaccine).data)
        except Vaccine.DoesNotExist:
            return Response({"detail": "Vaccine not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], detail=True)
    def details(self, request, pk=None):
        try:
            vaccine = self.get_object()
            return Response(serializers.VaccineSerializer(vaccine).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.filter(active=True)
    serializer_class = serializers.CampaignSerializer
    pagination_class = paginators.CampaignPaginator

    def get_queryset(self):
        query = self.queryset

        q = self.request.query_params.get('q')
        if q:
            query = query.filter(subject__icontains=q)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        return query


class CampaignVaccineViewSet(viewsets.ModelViewSet):
    queryset = CampaignVaccine.objects.filter(active=True)
    serializer_class = serializers.CampaignVaccineSerializer


class CampaignCitizenViewSet(viewsets.ModelViewSet):
    queryset = CampaignCitizen.objects.filter(active=True)
    serializer_class = serializers.CampaignCitizenSerializer

    @action(methods=['get'], url_path='stats-by-campaign', detail=False)
    def stats_by_campaign(self, request):
        stats = (CampaignCitizen.objects
                 .values('campaign__campaign_name')
                 .annotate(total_vaccinated=Count('citizen', distinct=True))
                 .order_by('campaign__campaign_name'))
        return Response(stats)

    @action(methods=['get'], url_path='stats-by-time', detail=False)
    def stats_by_time(self, request):
        period = request.query_params.get('period', 'month')
        if period == 'month':
            truncate_func = TruncMonth
        elif period == 'quarter':
            truncate_func = TruncQuarter
        else:
            truncate_func = TruncYear

        stats = (CampaignCitizen.objects
                 .annotate(period=truncate_func('injection_date'))
                 .values('period')
                 .annotate(total_vaccinated=Count('citizen', distinct=True))
                 .order_by('period'))
        return Response(stats)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.filter(active=True)
    serializer_class = serializers.AppointmentSerializer
    pagination_class = paginators.AppointmentPaginator

    def get_queryset(self):
        queryset = super().get_queryset()

        citizen_id = self.request.query_params.get('citizen_id')
        if citizen_id:
            queryset = queryset.filter(citizen_id=citizen_id)

        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)

        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(scheduled_date=date)

        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        return queryset

    @action(methods=['get'], detail=True)
    def details(self, request, pk=None):
        try:
            appointment = self.get_object()
            appointment_data = serializers.AppointmentSerializer(appointment).data

            vaccines = AppointmentVaccine.objects.filter(appointment=appointment, active=True)
            vaccines_data = serializers.AppointmentVaccineSerializer(vaccines, many=True).data

            result = {
                'appointment': appointment_data,
                'vaccines': vaccines_data
            }

            return Response(result)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='by-citizen', detail=False)
    def get_by_citizen(self, request):
        citizen_id = request.query_params.get('citizen_id')
        try:
            if not citizen_id:
                return Response({"detail": "Citizen ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            appointments = Appointment.objects.filter(citizen_id=citizen_id, active=True)
            return Response(serializers.AppointmentSerializer(appointments, many=True).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['get'], url_path='completion-rate', detail=False)
    def completion_rate(self, request):
        total_scheduled = AppointmentVaccine.objects.filter(status='scheduled').count()
        total_completed = AppointmentVaccine.objects.filter(status='completed').count()
        total_cancelled = AppointmentVaccine.objects.filter(status='cancelled').count()

        total_appointments = total_scheduled + total_completed + total_cancelled
        if total_appointments > 0:
            completion_rate = (total_completed / total_appointments * 100)
        else:
            completion_rate = 0

        result = {
            'total_scheduled': total_scheduled,
            'total_completed': total_completed,
            'total_cancelled': total_cancelled,
            'completion_rate_percent': round(completion_rate, 2)
        }
        return Response(result)

    @action(methods=['get'], url_path='people-completed', detail=False)
    def people_completed(self, request):

        p = Appointment.objects.filter(active=True)
        data = Appointment.objects.filter(active=True)

        date_year = self.request.query_params.get('year')
        if date_year:
            data = data.filter(scheduled_date__year=date_year)
            p = p.filter(scheduled_date__year=date_year)

        date = self.request.query_params.get('date')
        if date:
            data = data.filter(scheduled_date=date)
            p = p.filter(scheduled_date=date)

        p = p.values('citizen__id').distinct().count()
        serializer = serializers.AppointmentSerializer(data, many=True)
        return Response({
            'people': p,
            'people_completed': serializer.data
        })


class VaccineUsageViewSet(viewsets.ViewSet, generics.GenericAPIView):
    @action(methods=['get'], url_path='vaccine-types-by-time', detail=False)
    def vaccine_types_by_time(self, request):
        period = request.query_params.get('period', 'month')  # month, quarter, year
        if period == 'month':
            truncate_func = TruncMonth
        elif period == 'quarter':
            truncate_func = TruncQuarter
        else:
            truncate_func = TruncYear

        appointment_vaccines = (AppointmentVaccine.objects
                                .filter(status='completed')
                                .annotate(period=truncate_func('appointment__scheduled_date'))
                                .values('period', 'vaccine__vaccine_name')
                                .distinct())

        campaign_vaccines = (CampaignVaccine.objects
                             .annotate(period=truncate_func('campaign__start_date'))
                             .values('period', 'vaccine__vaccine_name')
                             .distinct())

        combined_vaccines = {}
        for vaccine in appointment_vaccines:
            period = vaccine['period'].isoformat()
            combined_vaccines.setdefault(period, set()).add(vaccine['vaccine__vaccine_name'])

        for vaccine in campaign_vaccines:
            period = vaccine['period'].isoformat()
            combined_vaccines.setdefault(period, set()).add(vaccine['vaccine__vaccine_name'])

        result = [
            {
                'period': period,
                'vaccine_types': list(vaccines)
            }
            for period, vaccines in combined_vaccines.items()
        ]

        result = sorted(result, key=lambda x: x['period'])
        return Response(result)


class AppointmentVaccineViewSet(viewsets.ModelViewSet):
    queryset = AppointmentVaccine.objects.filter(active=True)
    serializer_class = serializers.AppointmentVaccineSerializer
    pagination_class = paginators.AppointmentVaccinesPaginator

    def get_queryset(self):
        queryset = super().get_queryset()

        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        vaccine_id = self.request.query_params.get('vaccine_id')
        if vaccine_id:
            queryset = queryset.filter(vaccine_id=vaccine_id)

        return queryset

    @action(methods=['get'], detail=True)
    def vaccine_details(self, request, pk=None):
        try:
            appointment_vaccine = self.get_object()
            vaccine = appointment_vaccine.vaccine
            return Response(serializers.VaccineSerializer(vaccine).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)


class CitizenViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = Citizen.objects.filter(is_active=True)
    serializer_class = serializers.CitizenSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [perms.OwnerPerms()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save()
    
    def perform_update(self, serializer):
        serializer.save()

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.CitizenSerializer(request.user).data)


class StaffViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = Staff.objects.all()
    serializer_class = serializers.StaffSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_queryset(self):
        queryset = super().get_queryset()

        shift = self.request.query_params.get('shift')
        if shift:
            queryset = queryset.filter(shift=shift)

        return queryset
    
    def perform_create(self, serializer):
        serializer.save()
    
    def perform_update(self, serializer):
        serializer.save()

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.StaffSerializer(request.user).data)


class DoctorViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = serializers.DoctorSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_queryset(self):
        queryset = super().get_queryset()

        specialty = self.request.query_params.get('specialty')
        if specialty:
            queryset = queryset.filter(specialty__icontains=specialty)

        return queryset
    
    def perform_create(self, serializer):
        serializer.save()
    
    def perform_update(self, serializer):
        serializer.save()

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.DoctorSerializer(request.user).data)

class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = BaseUser.objects.filter(is_active=True)
    serializer_class = serializers.BaseUserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [perms.OwnerPerms()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.BaseUserSerializer(request.user).data)