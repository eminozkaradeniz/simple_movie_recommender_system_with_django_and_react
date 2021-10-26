from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
import pandas as pd
import json


@api_view(['GET'])
def listSimilarMovies(request, name):
    name.replace('%20', ' ')
    
    with open('movieapi/dataframes/responses.json', 'r') as f:
        responses = json.loads(f.read())
        
    if name in responses.keys():
        data = {
            "selectedMovie": name,
            "similarMovies": responses[name]['similars'],
            "links": responses[name]['links'],
        }
        return Response(data, status=status.HTTP_200_OK)

    movie_matrix = pd.read_csv('movieapi/dataframes/movie_matrix2.csv', index_col='userId')
    ratings = pd.read_csv('movieapi/dataframes/ratings2.csv', index_col='title')
    links = pd.read_csv('movieapi/dataframes/links2.csv', index_col='title')
    
    movie_user_ratings = movie_matrix[name]
    similar_to_movie = movie_matrix.corrwith(movie_user_ratings)
    corr_movie = pd.DataFrame(similar_to_movie, columns=['Correlation'])
    corr_movie.dropna(inplace=True)
    corr_movie = corr_movie.join(ratings['num of ratings'])
    
    results = corr_movie[corr_movie['num of ratings'] > 50].sort_values('Correlation', ascending=False).head(11)
    results = list(results.index.values[:])

    if name in results:
        results.remove(name)
    else:
        results = results[:10]
        
    tmdbLinks = []
    for movie in results:
        try:
            tmdbLinks.append(f"https://www.themoviedb.org/movie/{int(links.loc[movie]['tmdbId'])}")
        except:
            tmdbLinks.append("https://www.themoviedb.org/")

    if len(results) > 1:
        data = {
            "selectedMovie": name,
            "similarMovies": results,
            "links": tmdbLinks,
            }
        return Response(data, status=status.HTTP_200_OK)
        
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

