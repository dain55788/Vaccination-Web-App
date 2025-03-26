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
        fields = ['id', 'category', 'vaccine_name', 'number_of_dose_required', 'description', 'manufacturer']


class AppointmentSerializer(BaseSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'citizen', 'vaccine', 'staff', 'dose_number', 'scheduled_date', 'status', 'notes']


class AppointmentVaccineSerializer(BaseSerializer):
    class Meta:
        model = AppointmentVaccine
        fields = '__all__'


class CampaignSerializer(BaseSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'


class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
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
