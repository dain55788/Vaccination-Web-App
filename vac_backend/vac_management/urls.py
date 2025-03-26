from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
# router.register('categories', views.VaccineCategory, basename='category')
# router.register('courses', views.CourseViewSet, basename='course')
# router.register('lessons', views.LessonViewSet, basename='lesson')
router.register('citizen', views.CitizenViewSet, basename='citizen')
# router.register('comments', views.CommentViewSet, basename='comment')


urlpatterns = [
    path('', include(router.urls))
]
