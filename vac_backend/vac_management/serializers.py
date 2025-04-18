from rest_framework import serializers
from vac_management.models import *
from django.contrib.auth import authenticate


class BaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        d = super().to_representation(instance)
        return d


class VaccineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineCategory
        fields = ['id', 'category_name']


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(max_length=255, write_only=True)
    
    class Meta:
        model = Citizen
        fields = ['first_name', 'last_name', 'username', 'password', 'confirm_password', 
                  'date_of_birth', 'phone_number', 'address', 'gender', 'health_note']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'date_of_birth': {'required': False},
            'phone_number': {'required': False},
            'address': {'required': False},
            'gender': {'required': False},
            'health_note': {'required': False}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.pop('confirm_password', '')

        if password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match'})
        
        return attrs

    def create(self, validated_data):
        user = Citizen(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


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
        password = validated_data.pop('password')
        model_class = self.Meta.model
        user = model_class(**validated_data)
        
        user.set_password(password)
        user.save()
        
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
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
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }
        fields = return_lists


class StaffSerializer(BaseUserSerializer):
    class Meta:
        model = Staff
        return_lists = BaseUserSerializer.Meta.fields + ['shift', 'hire_date']
        return_lists.remove('password')
        return_lists.remove('hire_date')
        return_lists.remove('username')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }
        fields = return_lists


class DoctorSerializer(BaseUserSerializer):
    class Meta:
        model = Doctor
        return_lists = BaseUserSerializer.Meta.fields + ['specialty', 'years_of_experience', 'medical_license']
        return_lists.remove('password')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }
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
