from rest_framework import pagination


class VaccinePaginator(pagination.PageNumberPagination):
    page_size = 6


class AppointmentPaginator(pagination.PageNumberPagination):
    page_size = 3


class AppointmentVaccinesPaginator(pagination.PageNumberPagination):
    page_size = 3


class CampaignPaginator(pagination.PageNumberPagination):
    page_size = 3


class UsersPaginator(pagination.PageNumberPagination):
    page_size = 3
