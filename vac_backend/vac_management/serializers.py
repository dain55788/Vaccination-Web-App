from rest_framework import serializers
from vac_management.models import *


class BaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        d = super().to_representation(instance)
        d['image'] = instance.image.url
        return d


class VaccineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineCategory
        fields = ['id', 'name']


class VaccineSerializer(BaseSerializer):
    class Meta:
        model = Vaccine
        fields = ['id', 'category_id', 'vaccine_name', 'dose_quantity', 'image', 'instruction', 'unit_price']


class AppointmentSerializer(BaseSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'citizen_id', 'vaccine', 'staff_id', 'scheduled_date', 'location', 'notes']


class AppointmentVaccineSerializer(BaseSerializer):
    class Meta:
        model = AppointmentVaccine
        fields = '__all__'


class CampaignSerializer(BaseSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'


class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True
        model = BaseUser
        fields = ['first_name', 'last_name', 'username', 'password', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()
        u = Citizen(**data)
        u.set_password(u.password)
        u.save()

        return u

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            instance.save()

        return instance

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d['avatar'] = instance.avatar.url if instance.avatar else ''
        return d


class CampaignCitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignCitizen
        fields = '__all__'


class CampaignVaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignVaccine
        fields = '__all__'


class CitizenSerializer(BaseUserSerializer):
    class Meta:
        model = Citizen
        fields = BaseUserSerializer.Meta.fields + ['health_note']


class StaffSerializer(BaseUserSerializer):
    class Meta:
        model = Staff
        fields = BaseUserSerializer.Meta.fields + ['shift', 'hire_date']


class DoctorSerializer(BaseUserSerializer):
    class Meta:
        model = Doctor
        fields = BaseUserSerializer.Meta.fields + ['speciality', 'years_of_experience', 'medical_license']
