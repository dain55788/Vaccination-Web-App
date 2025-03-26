from rest_framework import pagination


class VaccinePaginator(pagination.PageNumberPagination):
    page_size = 6


class AppointmentPaginator(pagination.PageNumberPagination):
    page_size = 3
