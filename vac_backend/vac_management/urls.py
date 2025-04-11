from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('categories', views.VaccineCategoryViewSet, basename='category')
router.register('vaccines', views.VaccineViewSet, basename='vaccine')
router.register('campaigns', views.CampaignViewSet, basename='campaign')
router.register('appointments', views.AppointmentViewSet, basename='appointment')
router.register('citizen', views.CitizenViewSet, basename='citizen')
router.register('staffs', views.StaffViewSet, basename='staff')
router.register('doctors', views.DoctorViewSet, basename='doctor')


urlpatterns = [
    # API endpoints provided by the router
    path('', include(router.urls)),
    # path('register/', views.register_user, name='register'),
    # path('login/', views.login_user, name='login'),
    # path('api-token-auth/', views.custom_obtain_auth_token, name='api_token_auth'),
    # path('api-auth/', include('rest_framework.urls')),
]
