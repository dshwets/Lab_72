from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuoteViewSet, VoteApiView

router = DefaultRouter()
router.register('quote', QuoteViewSet, basename='quote')


app_name = 'api'


urlpatterns = [
    path('', include(router.urls)),
    path('quote/<int:pk>/like', VoteApiView.as_view(), name='quote_like'),
    path('quote/<int:pk>/dislike', VoteApiView.as_view(), name='quote_dislike')
]
