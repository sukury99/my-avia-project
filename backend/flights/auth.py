import secrets

from django.contrib.auth.models import User
from ninja.security import HttpBearer

from .models import AuthToken


def create_token(user: User) -> str:
    AuthToken.objects.filter(user=user).delete()
    key = secrets.token_hex(20)
    AuthToken.objects.create(user=user, key=key)
    return key


class BearerAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            auth_token = AuthToken.objects.select_related('user').get(key=token)
            return auth_token.user
        except AuthToken.DoesNotExist:
            return None


bearer_auth = BearerAuth()
