from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, generics, parsers, permissions, status
from vac_management.models import *
from vac_management import serializers, perms, paginators


class VaccineCategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = VaccineCategory.objects.filter(active=True)
    serializer_class = serializers.VaccineCategorySerializer


class VaccineViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Vaccine.objects.filter(active=True)
    serializer_class = serializers.VaccineSerializer
    pagination_class = paginators.VaccinePaginator

    def get_queryset(self):
        query = self.queryset

        q = self.request.query_params.get('q')
        if q:
            query = query.filter(subject__icontains=q)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        return query


class CampaignViewSet(viewsets.ViewSet, generics.GenericAPIView, generics.UpdateAPIView):
    queryset = Campaign.objects.filter(active=True)
    serializer_class = serializers.CampaignSerializer


class CampaignVaccineViewSet(viewsets.ViewSet, generics.GenericAPIView, generics.UpdateAPIView):
    queryset = CampaignVaccine.objects.filter(active=True)
    serializer_class = serializers.CampaignVaccineSerializer

    def get_permissions(self):
        if self.action.__eq__('get_vaccines'):
            if self.request.method.__eq__('POST'):
                return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    # SỬA
    @action(methods=['get', 'post'], url_path='vaccines', detail=True)
    def get_vaccines(self, request, pk):
        if request.method.__eq__('POST'):
            t = serializers.VaccineSerializer(data={
                'content': request.data.get('content'),
                'user': request.user.pk,
                'lesson': pk
            })
            t.is_valid(raise_exception=True)
            c = t.save()
            return Response(serializers.VaccineSerializer(c).data, status=status.HTTP_201_CREATED)
        else:
            comments = self.get_object().comment_set.select_related('user').filter(active=True)
            p = paginators.VaccinePaginator()
            page = p.paginate_queryset(comments, self.request)
            if page is not None:
                serializer = serializers.VaccineSerializer(page, many=True)
                return p.get_paginated_response(serializer.data)
            else:
                return Response(serializers.VaccineSerializer(comments, many=True).data)


class CampaignCitizenViewSet(viewsets.ViewSet, generics.GenericAPIView, generics.UpdateAPIView):
    queryset = CampaignCitizen.objects.filter(active=True)
    serializer_class = serializers.CampaignCitizenSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.filter(active=True)
    serializer_class = serializers.AppointmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by citizen
        citizen_id = self.request.query_params.get('citizen_id')
        if citizen_id:
            queryset = queryset.filter(citizen_id=citizen_id)

        # Filter by staff
        staff_id = self.request.query_params.get('staff_id')
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)

        return queryset


class AppointmentVaccineViewSet(viewsets.ModelViewSet):
    queryset = AppointmentVaccine.objects.filter(active=True)
    serializer_class = serializers.AppointmentVaccineSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        # Filter by vaccine
        vaccine_id = self.request.query_params.get('vaccine_id')
        if vaccine_id:
            queryset = queryset.filter(vaccine_id=vaccine_id)

        return queryset

    # SỬA
    @action(methods=['get', 'post'], url_path='vaccines', detail=True)
    def get_vaccines(self, request, pk):
        if request.method.__eq__('POST'):
            t = serializers.VaccineSerializer(data={
                'content': request.data.get('content'),
                'user': request.user.pk,
                'lesson': pk
            })
            t.is_valid(raise_exception=True)
            c = t.save()
            return Response(serializers.VaccineSerializer(c).data, status=status.HTTP_201_CREATED)
        else:
            comments = self.get_object().comment_set.select_related('user').filter(active=True)
            p = paginators.VaccinePaginator()
            page = p.paginate_queryset(comments, self.request)
            if page is not None:
                serializer = serializers.VaccineSerializer(page, many=True)
                return p.get_paginated_response(serializer.data)
            else:
                return Response(serializers.VaccineSerializer(comments, many=True).data)


class CitizenViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = Citizen.objects.filter(is_active=True)
    serializer_class = serializers.CitizenSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [perms.OwnerPerms()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.CitizenSerializer(request.user).data)


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = serializers.StaffSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by shift
        shift = self.request.query_params.get('shift')
        if shift:
            queryset = queryset.filter(shift=shift)

        return queryset

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.CitizenSerializer(request.user).data)


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = serializers.DoctorSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by specialty
        specialty = self.request.query_params.get('specialty')
        if specialty:
            queryset = queryset.filter(specialty__icontains=specialty)

        return queryset

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.CitizenSerializer(request.user).data)



