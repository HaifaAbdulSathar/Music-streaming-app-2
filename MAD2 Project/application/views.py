from datetime import date
from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required,roles_required, current_user

from application.tasks import say_hello
from .models import User,db,Songs
from application.src import datastore
from werkzeug.security import check_password_hash
from flask_restful import marshal,fields



@app.get('/')
def home():
    return render_template('index.html')

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return 'hello admin'

@app.get('/activate/creator/<int:creator_id>')
@auth_required("token")
@roles_required("admin")
def activate_creator(creator_id):
    creator=User.query.get(creator_id)
    if not creator or "creator" not in creator.roles:
        return jsonify({'message':'creator not found'}), 404
    creator.active=True
    db.session.commit()
    return jsonify({'message':'creator activated'})

@app.get('/deactivate/creator/<int:creator_id>')
@auth_required("token")
@roles_required("admin")
def deactivate_creator(creator_id):
    creator=User.query.get(creator_id)
    if not creator or "creator" not in creator.roles:
        return jsonify({'message':'creator not found'}), 404
    creator.active=False
    db.session.commit()
    return jsonify({'message':'creator deactivated'})

@app.get('/flagsong/<int:song_id>')
@auth_required("token")
@roles_required("admin")
def flag_song(song_id):
    song=Songs.query.get(song_id)
    if not song:
        return jsonify({'message':'song not found'}), 404
    song.flag=True
    db.session.commit()
    return jsonify({'message':'song flagged'})

@app.get('/unflagsong/<int:song_id>')
@auth_required("token")
@roles_required("admin")
def unflag_song(song_id):
    song=Songs.query.get(song_id)
    if not song:
        return jsonify({'message':'song not found'}), 404
    song.flag=False
    db.session.commit()
    return jsonify({'message':'song unflagged'})

@app.get('/deletesong/<int:song_id>')
@auth_required("token")
@roles_required("admin")
def delete_song(song_id):
    song=Songs.query.get(song_id)
    if not song:
        return jsonify({'message':'song not found'}), 404
    db.session.delete(song)
    db.session.commit()
    return jsonify({'message':'song deleted'})

@app.post('/user-login')
def user_login():
    data=request.get_json()
    email=data.get('email')
    if not email:
        return jsonify({'message':'email is required'}), 400
    user=datastore.find_user(email=email)
    if not user:
        return jsonify({'message':'user not found'}), 404
    if check_password_hash(user.password, data.get('password')):
        user.last_login=date.today()
        db.session.commit()
        return jsonify({'token':user.get_auth_token(), 'email':user.email, 'roles':user.roles[0].name,'id':user.id})
    return jsonify({'message':'invalid credentials'}), 400




user_fields={
    "id":fields.Integer,
    "email":fields.String,
    "active":fields.Boolean,
    "roles":fields.List(fields.String)
}
@app.get('/users')
@auth_required("token")
@roles_required("admin")
def users():
    users=User.query.all()
    if len(users)==0:
        return jsonify({'message':'no users found'}), 404
    return marshal(users,user_fields)

@app.get('/say_hello')
def say_hello_view():
    t=say_hello.delay()
    return jsonify({'task_id': t.id})