from rest_framework import serializers
from vac_management.models import *


class BaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        d = super().to_representation(instance)
        return d


class VaccineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineCategory
        fields = ['id', 'category_name']


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


class CitizenSerializer(BaseUserSerializer):
    class Meta:
        model = Citizen
        return_lists = BaseUserSerializer.Meta.fields + ['health_note']
        return_lists.remove('password')
        return_lists.remove('username')
        fields = return_lists


class StaffSerializer(BaseUserSerializer):
    class Meta:
        model = Staff
        return_lists = BaseUserSerializer.Meta.fields + ['shift', 'hire_date']
        return_lists.remove('password')
        return_lists.remove('hire_date')
        return_lists.remove('username')
        fields = return_lists


class DoctorSerializer(BaseUserSerializer):
    class Meta:
        model = Doctor
        return_lists = BaseUserSerializer.Meta.fields + ['specialty', 'years_of_experience', 'medical_license']
        return_lists.remove('password')
        fields = return_lists


class VaccineSerializer(BaseSerializer):
    category = VaccineCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Vaccine
        fields = ['id', 'category', 'category_id', 'vaccine_name', 'dose_quantity', 'image', 'instruction',
                  'unit_price']


class AppointmentSerializer(BaseSerializer):
    citizen_info = CitizenSerializer(source='citizen', read_only=True)
    staff_info = StaffSerializer(source='staff', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'citizen', 'citizen_info', 'staff', 'staff_info', 'scheduled_date', 'location', 'notes']
        extra_kwargs = {
            'citizen': {'write_only': True},
            'staff': {'write_only': True}
        }


class AppointmentVaccineSerializer(BaseSerializer):
    vaccine_info = VaccineSerializer(source='vaccine', read_only=True)
    doctor_info = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = AppointmentVaccine
        fields = ['id', 'appointment', 'vaccine', 'vaccine_info', 'doctor', 'doctor_info', 'dose_quantity_used',
                  'status', 'notes', 'cost']
        extra_kwargs = {
            'vaccine': {'write_only': True},
            'doctor': {'write_only': True}
        }


class CampaignSerializer(BaseSerializer):
    class Meta:
        model = Campaign
        fields = ['id', 'start_date', 'end_date', 'target_population', 'status', 'image']


class CampaignCitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignCitizen
        fields =  ['id', 'injection_date', 'campaign_id', 'citizen_id']


class CampaignVaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignVaccine
        fields = ['id', 'dose_quantity_used', 'campaign_id', 'vaccine_id']
