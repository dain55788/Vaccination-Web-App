from rest_framework import serializers
from vac_management.models import *
from cloudinary.uploader import upload


class BaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        d = super().to_representation(instance)
        return d


class VaccineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineCategory
        fields = ['id', 'category_name']


class BaseUserSerializer(serializers.ModelSerializer):
    avatar = serializers.FileField(required=False, allow_null=True)

    def get_avatar(self, obj):
        avatar = obj.avatar
        if hasattr(avatar, 'url'):
            return avatar.url
        elif isinstance(avatar, str):
            return avatar
        return None

    class Meta:
        abstract = True
        model = BaseUser
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'avatar', 'gender', 'address',
                  'date_of_birth', 'phone_number', 'email', 'is_superuser', 'is_staff', 'is_active', ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        avatar_file = validated_data.pop('avatar', None)
        data = validated_data.copy()
        user = BaseUser(**data)
        user.set_password(user.password)
        user.is_active = True
        if avatar_file:
            upload_result = upload(avatar_file)
            user.avatar = upload_result['public_id']

        user.save()

        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        instance.save()
        return instance

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d['avatar'] = self.get_avatar(instance)
        return d


class CitizenSerializer(BaseUserSerializer):
    class Meta:
        model = Citizen
        return_lists = BaseUserSerializer.Meta.fields + ['health_note']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }
        fields = return_lists

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        instance.save()
        return instance


class StaffSerializer(BaseUserSerializer):
    class Meta:
        model = Staff
        return_lists = BaseUserSerializer.Meta.fields + ['shift', 'hire_date']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }
        fields = return_lists

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        instance.save()
        return instance


class DoctorSerializer(BaseUserSerializer):
    class Meta:
        model = Doctor
        return_lists = BaseUserSerializer.Meta.fields + ['specialty', 'years_of_experience', 'medical_license']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True}
        }
        fields = return_lists

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        instance.save()
        return instance


class VaccineSerializer(BaseSerializer):
    image = serializers.FileField(required=False, allow_null=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=VaccineCategory.objects.all(),
        source='category',
        write_only=True
    )
    category_name = serializers.ReadOnlyField(source='category.category_name')

    class Meta:
        model = Vaccine
        fields = ['id', 'category_id', 'category_name', 'vaccine_name', 'dose_quantity', 'image', 'instruction',
                  'unit_price', 'created_date', 'updated_date']


class AppointmentSerializer(BaseSerializer):
    citizen_info = CitizenSerializer(source='citizen', read_only=True)
    staff_info = StaffSerializer(source='staff', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'citizen', 'citizen_info', 'staff', 'staff_info', 'scheduled_date', 'location', 'notes',
                  'created_date', 'updated_date']
        extra_kwargs = {
            'citizen': {'write_only': True},
            'staff': {'write_only': True}
        }


class AppointmentVaccineSerializer(BaseSerializer):
    vaccine_info = VaccineSerializer(source='vaccine', read_only=True)
    doctor_info = DoctorSerializer(source='doctor', read_only=True)
    appointment_info = AppointmentSerializer(source='appointment', read_only=True)

    class Meta:
        model = AppointmentVaccine
        fields = ['id', 'appointment', 'appointment_info', 'vaccine', 'vaccine_info', 'doctor', 'doctor_info',
                  'dose_quantity_used',
                  'status', 'notes', 'cost']
        extra_kwargs = {
            'vaccine': {'write_only': True},
            'doctor': {'write_only': True}
        }


class CampaignSerializer(BaseSerializer):
    image = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Campaign
        fields = ['id', 'created_date', 'updated_date', 'campaign_name', 'description', 'start_date', 'end_date',
                  'location', 'target_population', 'status', 'image']


class CampaignCitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignCitizen
        fields = ['id', 'injection_date', 'campaign_id', 'citizen_id']


class CampaignVaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignVaccine
        fields = ['id', 'dose_quantity_used', 'campaign_id', 'vaccine_id']
