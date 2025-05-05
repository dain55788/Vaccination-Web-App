from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class BaseUser(AbstractUser):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )

    date_of_birth = models.DateField(null=True)
    avatar = CloudinaryField(null=True)
    phone_number = models.CharField(max_length=25)
    address = models.CharField(max_length=255, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True)

    def __str__(self):
        return self.username


class Citizen(BaseUser):
    health_note = models.CharField(max_length=255, null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.username


class Staff(BaseUser):
    SHIFT_CHOICES = (
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('evening', 'Evening'),
    )
    shift = models.CharField(max_length=10, choices=SHIFT_CHOICES, null=True, blank=True)
    hire_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.username


class Doctor(BaseUser):
    specialty = models.CharField(max_length=100, null=True, blank=True)
    years_of_experience = models.IntegerField(null=True, blank=True)
    medical_license = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.username


class VaccineCategory(BaseModel):
    category_name = models.CharField(max_length=100,  unique=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.category_name


class Vaccine(BaseModel):
    category = models.ForeignKey(VaccineCategory, on_delete=models.PROTECT)
    vaccine_name = models.CharField(max_length=100)
    dose_quantity = models.IntegerField()
    image = CloudinaryField(null=True)
    instruction = models.TextField()
    unit_price = models.FloatField()

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.vaccine_name


class Appointment(BaseModel):
    citizen = models.ForeignKey(Citizen, on_delete=models.CASCADE)
    scheduled_date = models.DateField()
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, null=True, blank=True)
    location = models.CharField(max_length=255)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Citizen {self.citizen}," \
               f"Staff {self.staff}," \
               f"Date {self.scheduled_date}"


class AppointmentVaccine(BaseModel):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    dose_quantity_used = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(null=True, blank=True)
    cost = models.FloatField()

    unique_together = ('appointment', 'vaccine', 'doctor')

    def __str__(self):
        return self.appointment.__str__


class Campaign(BaseModel):
    STATUS_CHOICES = (
        ('planned', 'Planned'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    campaign_name = models.CharField(max_length=100, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(max_length=255)
    location = models.CharField(max_length=255, null=True)
    image = CloudinaryField(null=True)
    target_population = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='planned')

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.campaign_name


class CampaignCitizen(BaseModel):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    citizen = models.ForeignKey(Citizen, on_delete=models.CASCADE)
    injection_date = models.DateField()


class CampaignVaccine(BaseModel):
    vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    dose_quantity_used = models.IntegerField()

