from django.contrib import admin
from django.utils.html import mark_safe
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.db.models import Count
from django.template.response import TemplateResponse
from django.urls import path
from vac_management.models import *
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm


class BaseUserCreationForm(UserCreationForm):
    class Meta:
        model = BaseUser
        fields = ('username', 'email')


class BaseUserChangeForm(UserChangeForm):
    class Meta:
        model = BaseUser
        fields = '__all__'


class MyAdminSite(admin.AdminSite):
    site_header = 'Vaccination Management Online'

    def has_permission(self, request):

        return request.user.is_active and request.user.is_staff or request.user.is_superuser
    
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


class BaseUserAdmin(UserAdmin):
    form = BaseUserChangeForm
    add_form = BaseUserCreationForm
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')

    add_fieldsets = (
        ('User Details', {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2',
                       'date_of_birth', 'avatar', 'phone_number', 'address', 'gender'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )


class CitizenCreationForm(BaseUserCreationForm):
    class Meta(BaseUserCreationForm.Meta):
        model = Citizen
        fields = BaseUserCreationForm.Meta.fields


class CitizenChangeForm(BaseUserChangeForm):
    class Meta(BaseUserChangeForm.Meta):
        model = Citizen
        fields = '__all__'


class CitizenAdmin(BaseUserAdmin):
    form = CitizenChangeForm
    add_form = CitizenCreationForm

    add_fieldsets = (
        ('Citizen Details', {
            'classes': ('wide',),
            'fields': ('username', 'first_name', 'last_name', 'email', 'password1', 'password2',
                       'date_of_birth', 'avatar', 'phone_number', 'address', 'gender', 'health_note'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )


class DoctorCreationForm(BaseUserCreationForm):
    class Meta(BaseUserCreationForm.Meta):
        model = Doctor
        fields = BaseUserCreationForm.Meta.fields


class DoctorChangeForm(BaseUserChangeForm):
    class Meta(BaseUserChangeForm.Meta):
        model = Doctor
        fields = '__all__'


class DoctorAdmin(BaseUserAdmin):
    form = DoctorChangeForm
    add_form = DoctorCreationForm

    add_fieldsets = (
        ('Doctor Details', {
            'classes': ('wide',),
            'fields': ('username', 'first_name', 'last_name', 'email', 'password1', 'password2',
                      'date_of_birth', 'avatar', 'phone_number', 'address', 'gender',
                      'specialty', 'years_of_experience', 'medical_license'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )


class StaffCreationForm(BaseUserCreationForm):
    class Meta(BaseUserCreationForm.Meta):
        model = Staff
        fields = BaseUserCreationForm.Meta.fields


class StaffChangeForm(BaseUserChangeForm):
    class Meta(BaseUserChangeForm.Meta):
        model = Staff
        fields = '__all__'


class StaffAdmin(BaseUserAdmin):
    form = StaffChangeForm
    add_form = StaffCreationForm

    add_fieldsets = (
        ('Staff Details', {
            'classes': ('wide',),
            'fields': ('username', 'first_name', 'last_name', 'email', 'password1', 'password2',
                       'date_of_birth', 'avatar', 'phone_number', 'address', 'gender',
                       'shift', 'hire_date'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )

admin_site.register(Vaccine)
admin_site.register(VaccineCategory)
admin_site.register(Appointment)
admin_site.register(Campaign)
admin_site.register(Doctor, DoctorAdmin)
admin_site.register(Staff, StaffAdmin)
admin_site.register(Citizen, CitizenAdmin)
admin_site.register(BaseUser, BaseUserAdmin)

