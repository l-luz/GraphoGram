from logger.models import Log
from django.contrib.auth.models import AnonymousUser
import string
import random


def log_event(request, event, description=None, user=None, info=None):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    if user is None and not isinstance(request.user, AnonymousUser):
        user = request.user

    Log(ip=ip, user=user, event=event, description=description, info=info).save()


# def generate_random_password():
#     characters = list(string.ascii_letters + string.digits + "!@#$%^&*()")
#     length = 20
#     # shuffling the characters
#     random.shuffle(characters)
#     # picking random characters from the list
#     password = []
#     for i in range(length):
#         password.append(random.choice(characters))
#     # shuffling the resultant password
#     random.shuffle(password)
#     print("".join(password))
#     return "".join(password)
