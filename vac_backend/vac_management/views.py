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

    # @action(methods=['get'], url_path='lessons', detail=True)
    # def get_lessons(self, request, pk):
    #     lessons = self.get_object().lesson_set.filter(active=True)
    #     return Response(serializers.LessonSerializer(lessons, many=True).data)


# NOTE: NOT COMPLETED
class CitizenViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = Citizen.objects.filter(is_active=True)
    serializer_class = serializers.CitizenSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [perms.OwnerPerms()]

        return [permissions.AllowAny()]

