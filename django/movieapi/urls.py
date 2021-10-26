from django.urls import path
from movieapi.views import listSimilarMovies

app_name = 'movieapi'
urlpatterns = [
    path('movieapi/listSimilarMovies/<str:name>', listSimilarMovies),
]