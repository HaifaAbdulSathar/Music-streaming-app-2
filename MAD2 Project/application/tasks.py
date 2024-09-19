from datetime import date
from celery import shared_task
from .mailservice import send_message
from .models import User,Role
from jinja2 import Template

@shared_task(ignore_result=False)
def say_hello():
    return 'hello'

@shared_task(ignore_result=True)
def monthly_reminder(to,subject):
    users=User.query.filter(User.roles.any(Role.name=="creator")).all()
    for user in users:
        if user.last_login!=date.today():
            with open('application/report.html') as f:
                content=Template(f.read())
                send_message(user.email,subject,content.render(username=user.username,songs=user.songs))
    return 'ok'

@shared_task(ignore_result=True)
def daily_reminder(to,subject):
    users=User.query.all()
    for user in users:
        if user.last_login!=date.today():
            with open('application/daily_mail.html') as f:
                content=Template(f.read())
                send_message(user.email,subject,content.render(username=user.username))
    return 'ok'