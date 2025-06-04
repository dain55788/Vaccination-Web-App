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
    pagination_class = paginators.CampaignPaginator


class CampaignCitizenViewSet(viewsets.ModelViewSet):
    queryset = CampaignCitizen.objects.filter(active=True)
    serializer_class = serializers.CampaignCitizenSerializer
    pagination_class = paginators.CampaignPaginator

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
        period = request.query_params.get('period', 'month')  # month, quarter, year
        if period == 'month':
            truncate_func = TruncMonth
        elif period == 'quarter':
            truncate_func = TruncQuarter
        elif period == 'year':
            truncate_func = TruncYear
        total_completed = AppointmentVaccine.objects.filter(status='completed').count()
        total_cancelled = AppointmentVaccine.objects.filter(status='cancelled').count()
        queryset = (
            AppointmentVaccine.objects.filter(active=True)
            .annotate(period=truncate_func('appointment__scheduled_date'))
            .values('period', 'status')
            .annotate(count=Count('id'))
        )

        summary = {}
        for item in queryset:
            period = item['period'].isoformat()
            status = item['status']
            count = item['count']

            if period not in summary:
                summary[period] = {
                    'total_completed': 0,
                    'total_cancelled': 0,
                    'total_appointments': 0,
                    'completion_rate_percent': 0,
                }

            if status == 'completed':
                summary[period]['total_completed'] += count
            elif status == 'cancelled':
                summary[period]['total_cancelled'] += count

            summary[period]['total_appointments'] += count

        # Tính tỷ lệ hoàn thành (%)
        for stats in summary.values():
            total = stats['total_appointments']
            if total > 0:
                stats['completion_rate_percent'] = round(stats['total_completed'] / total * 100, 2)

        result = [
            {
                'period': period,
                **stats
            }
            for period, stats in sorted(summary.items())
        ]

        return Response(result)

    @action(methods=['get'], url_path='people-completed', detail=False)
    def people_completed(self, request):
        period_type = request.query_params.get('period', 'month')

        if period_type == 'month':
            truncate_func = TruncMonth
        elif period_type == 'quarter':
            truncate_func = TruncQuarter
        elif period_type == 'year':
            truncate_func = TruncYear

        appointments = (
            Appointment.objects
            .filter(active=True)
            .annotate(period=truncate_func('scheduled_date'))
            .values('period', 'citizen_id')
            .distinct()
        )

        grouped = {}
        for item in appointments:
            period = item['period'].isoformat()
            grouped.setdefault(period, set()).add(item['citizen_id'])

        result = [
            {
                'period': period,
                'people_completed_count': len(citizen_ids)
            }
            for period, citizen_ids in sorted(grouped.items())
        ]

        return Response(result)


class VaccineUsageViewSet(viewsets.ViewSet, generics.GenericAPIView):
    @action(methods=['get'], url_path='vaccine-types-by-time', detail=False)
    def vaccine_types_by_time(self, request):
        period = request.query_params.get('period', 'month')  # month, quarter, year
        if period == 'month':
            truncate_func = TruncMonth
        elif period == 'quarter':
            truncate_func = TruncQuarter
        elif period == 'year':
            truncate_func = TruncYear

        appointment_usage = (
            AppointmentVaccine.objects
            .filter(status='completed')
            .annotate(period=truncate_func('appointment__scheduled_date'))
            .values('period', 'vaccine__category__category_name')
            .annotate(usage=Sum('dose_quantity_used'))
            .values('period', 'vaccine__category__category_name', 'dose_quantity_used')
        )

        campaign_usage = (
            CampaignVaccine.objects
            .annotate(period=truncate_func('campaign__start_date'))
            .values('period', 'vaccine__category__category_name')
            .annotate(usage=Sum('dose_quantity_used'))
            .values('period', 'vaccine__category__category_name', 'dose_quantity_used')
        )

        combined = {}
        for item in appointment_usage:
            key = (item['period'].isoformat(), item['vaccine__category__category_name'])
            combined[key] = combined.get(key, 0) + item['dose_quantity_used']

        for item in campaign_usage:
            key = (item['period'].isoformat(), item['vaccine__category__category_name'])
            combined[key] = combined.get(key, 0) + item['dose_quantity_used']

        result = [
            {
                'period': period,
                'category_name': category_name,
                'dose_quantity_used': dose_quantity_used,
            }
            for (period, category_name), dose_quantity_used in combined.items()
        ]

        result = sorted(result, key=lambda x: (x['period'], x['category_name']))
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
    pagination_class = paginators.UsersPaginator

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [perms.OwnerPerms()]
        if self.action == 'get_users':
            return [perms.IsStaffPermission()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='get-users', detail=False, permission_classes=[perms.IsStaffPermission])
    def get_users(self, request):
        queryset = self.queryset
        user_id = request.query_params.get('id')
        if user_id:
            queryset = queryset.filter(id=user_id)
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request, view=self)
        return paginator.get_paginated_response(serializers.BaseUserSerializer(paginated_queryset, many=True).data)

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.BaseUserSerializer(request.user).data)


from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import stripe, os, json

STRIPE_API_VERSION = f"{os.getenv('STRIPE_API_VERSION')}"
STRIPE_SECRET_KEY = f"{os.getenv('STRIPE_SECRET_KEY')}"
stripe.api_version = STRIPE_API_VERSION
stripe.api_key = STRIPE_SECRET_KEY


@csrf_exempt
def payment_sheet(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request'}, status=400)

    try:
        data = json.loads(request.body)
        av_id = data.get('vaccine_id')
        av = AppointmentVaccine.objects.get(id=av_id)
        amount = int(av.cost * 100)
        customer = stripe.Customer.create()

        ephemeral_key = stripe.EphemeralKey.create(
            customer=customer.id,
            stripe_version=STRIPE_API_VERSION
        )

        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            customer=customer.id,
            automatic_payment_methods={"enabled": True},
        )

        return JsonResponse({
            'paymentIntent': payment_intent.client_secret,
            'ephemeralKey': ephemeral_key.secret,
            'customer': customer.id
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
