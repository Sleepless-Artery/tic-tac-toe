from django.contrib import admin
from django.urls import path, include
from game.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('api/', include('game.urls')),
]