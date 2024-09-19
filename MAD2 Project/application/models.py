from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import date,datetime

db=SQLAlchemy()

class User(db.Model,UserMixin):
    id=db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(80), unique=True)
    email=db.Column(db.String(120), unique=True, nullable=False)
    password=db.Column(db.String(120), nullable=False)
    active=db.Column(db.Boolean())
    fs_uniquifier=db.Column(db.String(64), unique=True, nullable=False)
    roles=db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))
    songs=db.relationship('Songs', backref='user')
    last_login=db.Column(db.Date())

class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer(), primary_key=True)
    name=db.Column(db.String(80), unique=True, nullable=False)
    description=db.Column(db.String(120))

class RolesUsers(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    user_id=db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id=db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))    

class Songs(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    title=db.Column(db.String(80), unique=True, nullable=False)
    description=db.Column(db.String(120), nullable=False)  
    artist=db.Column(db.String(50))
    release_date=db.Column(db.String(50))  
    creator_id=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    song_lyrics=db.Column(db.String(), nullable=False)
    average_rating = db.Column(db.Float)  
    ratings = db.relationship('rating', backref='song', cascade='all, delete-orphan')
    flag=db.Column(db.Boolean(),default=False)
    


class playlists(db.Model):
    playlist_id=db.Column(db.Integer,primary_key=True)   
    playlist_name=db.Column(db.String(50), nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    playlistsong=db.relationship('playlistsong',backref='playlists', cascade='all, delete-orphan')
    songs=db.relationship('Songs',backref='playlists',secondary='playlistsong')

class playlistsong(db.Model):
    song_id=db.Column(db.Integer,db.ForeignKey('songs.id'),primary_key=True)    
    playlist_id=db.Column(db.Integer,db.ForeignKey('playlists.playlist_id'),primary_key=True)
  

class rating(db.Model):
    rating_id=db.Column(db.Integer,primary_key=True)
    value=db.Column(db.Integer)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    song_id=db.Column(db.Integer,db.ForeignKey('songs.id'))  
