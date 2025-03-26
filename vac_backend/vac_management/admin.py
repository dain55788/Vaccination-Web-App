from django.contrib import admin
from django.utils.html import mark_safe
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.db.models import Count
from django.template.response import TemplateResponse
from django.urls import path
from vac_management.models import *


class MyAdminSite(admin.AdminSite):
    site_header = 'Vaccination Management Online'

    def get_urls(self):
        return [
            path('vaccine-stats/', self.stats_view)
        ] + super().get_urls()

    def stats_view(self, request):
        stats = Vaccine.objects.annotate(vaccine_count=Count('vaccine__id')).values('id', 'vaccine_name', 'vaccine_count')

        return TemplateResponse(request, 'admin/stats_view.html', {
            'stats': stats
        })


admin_site = MyAdminSite(name='admin')


# ADD MORE VIEWS INTO THE ADMIN SITE VIEW
admin_site.register(Vaccine)
admin_site.register(VaccineCategory)
admin_site.register(Appointment)
admin_site.register(Campaign)
admin_site.register(Doctor)
admin_site.register(Staff)
admin_site.register(Citizen)

