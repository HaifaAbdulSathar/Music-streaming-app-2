from main import app
from application.src import datastore
from application.models import db,Role
from flask_security import hash_password
import bcrypt
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name='admin',description='User is an admin')
    datastore.find_or_create_role(name='creator',description='User is a creator')
    datastore.find_or_create_role(name='user',description='User is an general user')

    db.session.commit()
    if not datastore.find_user(email='admin@email.com'):
        datastore.create_user(email='admin@email.com',password=generate_password_hash('admin'), roles=['admin'])
    if not datastore.find_user(email='creator1@email.com'):
        datastore.create_user(email='creator1@email.com',password=generate_password_hash('creator1'), roles=['creator'])    
    if not datastore.find_user(email='user1@email.com'):
        datastore.create_user(email='user1@email.com',password=generate_password_hash('user1'), roles=['user'])    
    db.session.commit()    

