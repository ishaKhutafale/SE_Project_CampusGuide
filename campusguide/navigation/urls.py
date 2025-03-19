from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # Homepage
    path('directions/', views.display_directions, name='directions'),
]
