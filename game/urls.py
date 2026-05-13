from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, index

router = DefaultRouter()
router.register(r'games', GameViewSet)

urlpatterns = [
    path('', index),
] + router.urls