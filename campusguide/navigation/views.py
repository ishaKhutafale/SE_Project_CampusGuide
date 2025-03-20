from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def display_directions(request):
    start_location = request.GET.get('start')
    end_location = request.GET.get('end')
    return render(request, 'display_directions.html', {
        'start': start_location,
        'end': end_location
    })
