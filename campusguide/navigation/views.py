from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def display_directions(request):
    return render(request, 'display_directions.html')
