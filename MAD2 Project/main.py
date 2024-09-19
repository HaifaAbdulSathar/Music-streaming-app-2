from flask import Flask
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from flask_security import Security,SQLAlchemyUserDatastore
from application.src import datastore
from application.worker import celery_init_app
from celery.schedules import crontab
from application.tasks import monthly_reminder,daily_reminder


def create_app():
    app= Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security=Security(app,datastore)
    with app.app_context():
        import application.views

    return app

app = create_app()
celery_app=celery_init_app(app)

@celery_app.on_after_configure.connect
def send_monthly_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=5, minute=30, day_of_month=1),
        monthly_reminder.s('test@email.com', 'test hello')
    )

@celery_app.on_after_configure.connect
def send_daily_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=6, minute=30),
        daily_reminder.s('test@email.com', 'test hello')
    )    

if __name__ == "__main__":
    app.run(debug=True)