from django.contrib import admin
from django.urls import path
from navigation import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('display_directions/', views.display_directions, name='display_directions'),
]
