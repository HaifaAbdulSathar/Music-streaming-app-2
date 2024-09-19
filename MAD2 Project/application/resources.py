from datetime import date
from flask_restful import Resource, Api, reqparse , fields, marshal
from flask_security import auth_required,roles_required,roles_accepted, current_user
from .models import Songs, db, User, playlistsong, playlists, rating
from werkzeug.security import generate_password_hash
from application.src import datastore
from sqlalchemy import func, or_
from flask import request

api=Api(prefix='/api')

songs_parser=reqparse.RequestParser()
songs_parser.add_argument('title',type=str,help='title of the song is required', required=True)
songs_parser.add_argument('description',type=str,help='description of the song is required', required=True)
songs_parser.add_argument('song_lyrics',type=str,help='lyrics of the song is required',required=True)
songs_parser.add_argument('artist',type=str,help='artist of the song is required', required=True)
songs_parser.add_argument('release_date',type=str,help='release date of the song is required', required=True)
songs_parser.add_argument('id',type=int)

users_parser=reqparse.RequestParser()
users_parser.add_argument('email',type=str,help='email of the user is required', required=True)
users_parser.add_argument('password',type=str,help='password of the user is required', required=True)
users_parser.add_argument('username',type=str,help='username of the user is required', required=True)
users_parser.add_argument('roles',type=str,help='roles of the user is required', required=True)

all_playlists_parser=reqparse.RequestParser()
all_playlists_parser.add_argument('name',type=str,help='name of the playlist is required', required=True)
all_playlists_parser.add_argument('songs',type=list,help='songs of the playlist is required',location='json', required=True)


rating_parser=reqparse.RequestParser()
rating_parser.add_argument('value',type=int,help='value of the rating is required', required=True)
rating_parser.add_argument('song_id',type=int,help='song id of the rating is required', required=True)

deletePlaylists_parser=reqparse.RequestParser()
deletePlaylists_parser.add_argument('songsToDelete',type=list,help='songs of the playlist is required',location='json', required=True)

playlists_parser=reqparse.RequestParser()
playlists_parser.add_argument('songsToAdd',type=list,help='songs of the playlist is required',location='json', required=True)

class Creator(fields.Raw):
    def format(self, value):
        return value.email
    
    
users_fields={
    'id':fields.Integer,
    'email':fields.String,
    'username':fields.String,
    'password':fields.String,
    'roles':fields.String

}    

songs_fields={
    'id':fields.Integer,
    'title':fields.String,
    'description':fields.String,
    'song_lyrics':fields.String,
    'artist':fields.String,
    'release_date':fields.String,
    'creator':Creator,
    'creator_id':fields.Integer,
    'average_rating':fields.Float,
    'flag':fields.Boolean
}

playlists_fields={
    'playlist_id':fields.Integer,
    'playlist_name':fields.String,
    'songs':fields.List(fields.Nested(songs_fields))
}



class SongssList(Resource):
    @auth_required('token')
    def get(self):
        all_songs=Songs.query.all()
        if len(all_songs)>0:
            return marshal(all_songs,songs_fields)
        return {'message':'no songs found'}, 404
    
    @auth_required('token')
    @roles_required('creator')
    def post(self):
        args=songs_parser.parse_args()
        song=Songs(title=args['title'],description=args['description'],song_lyrics=args['song_lyrics'],creator_id=current_user.id,artist=args['artist'],release_date=args['release_date'])
        db.session.add(song)
        db.session.commit()
        return {'message':'song added'}
    
    @auth_required('token')
    @roles_accepted('creator','admin')
    def delete(self):
        args=songs_parser.parse_args()
        song=Songs.query.get(args['id'])
        if song:
            db.session.delete(song)
            db.session.commit()
            return {'message':'song deleted'}
        return {'message':'song not found'}
    @auth_required('token')
    @roles_required('creator')
    def put(self):
        args=songs_parser.parse_args()
        song=Songs.query.get(args['id'])
        if song:
            if 'title' in args:
                song.title = args['title']
            if 'description' in args:
                song.description = args['description']
            if 'song_lyrics' in args:
                song.song_lyrics = args['song_lyrics']
            if 'artist' in args:
                song.artist = args['artist']
            if 'release_date' in args:
                song.release_date = args['release_date']
            db.session.commit()
            return {'message':'song updated'}
        return {'message':'song not found'}

    
class createPlaylist(Resource):
    @auth_required('token')
    def get(self):
        all_playlists=playlists.query.filter_by(user_id=current_user.id).all()
        if len(all_playlists)>0:
           return marshal(all_playlists,playlists_fields)
        return {'message':'no playlists found'}, 404
    
    def post(self):
        user_id=current_user.id
        args=all_playlists_parser.parse_args()
        playlist_songs=args['songs']
        print(args['name'])
        print(playlist_songs)
        playlist=playlists(playlist_name=args['name'],user_id=user_id)
        db.session.add(playlist)
        db.session.commit()
        this_playlist=playlists.query.filter_by(playlist_name=args['name']).first()
        
        for song_id in playlist_songs:
            # song=Songs.query.filter_by(id=song_id).first()
            # # this_playlist=playlists.query.filter_by(playlist_name=args['name']).first()
            # this_playlist.songs.append(song)
            playlist_song=playlistsong(playlist_id=this_playlist.playlist_id,song_id=song_id)
            db.session.add(playlist_song)
        db.session.commit()
        return {'message':'playlist added'}

    
class NewUser(Resource):
    def post(self):
        args=users_parser.parse_args()
        user_roles = args.get('roles', [])
        if isinstance(user_roles, str):
            user_roles = [user_roles]
        if not datastore.find_user(email=args['email']):
            datastore.create_user(username=args['username'],email=args['email'],password=generate_password_hash(args['password']), roles=user_roles)
            db.session.commit()
            return {'message':'user added'}
        return {'message':'user already exists'}
    
class RateSong(Resource):
    @auth_required('token')
    def post(self):
        args=rating_parser.parse_args()
        this_user=rating.query.filter_by(user_id=current_user.id,song_id=args['song_id']).first()
        if not this_user:
            new_rating=rating(value=args['value'],user_id=current_user.id,song_id=args['song_id'])
            db.session.add(new_rating)
            db.session.commit()
            average_ratings=db.session.query(Songs.id,func.avg(rating.value).label('average_rating')).join(rating).group_by(Songs.id).all()
            for song_id,average_rating in average_ratings:
                this_song=Songs.query.get(song_id)
                this_song.average_rating=average_rating
                db.session.commit()
            return {'message':'rating added'}    
        return {'message':'you already rated this song'}
    
class DeletePlaylist(Resource):
    @auth_required('token')
    def post(self,playlist_id):
        args=deletePlaylists_parser.parse_args()
        playlist_songs=args.get('songsToDelete', [])
        for song_id in playlist_songs:
            this_song=playlistsong.query.filter_by(song_id=song_id,playlist_id=playlist_id).first()
            db.session.delete(this_song)
            db.session.commit()  
        playlist=playlists.query.get(playlist_id)
        if not playlist.songs:
            db.session.delete(playlist)
            db.session.commit()    
        return {'message':'songs in playlist deleted'}
    
class AddPlaylist(Resource):
    @auth_required('token')
    def post(self,playlist_id):
        args=playlists_parser.parse_args()
        playlist_songs=args.get('songsToAdd', [])
        for song_id in playlist_songs:
            new_playslistsong_rel=playlistsong(song_id=song_id,playlist_id=playlist_id)
            db.session.add(new_playslistsong_rel)
            db.session.commit()
        return {'message':'playlist updated'}

class PlaylistNames(Resource):
    @auth_required('token')
    def post(self,playlist_id):
        playlists_parser=reqparse.RequestParser()
        playlists_parser.add_argument('name',type=str)
        args=playlists_parser.parse_args()
        playlist_name=args['name']
        if playlist_name:
            this_playlist=playlists.query.filter_by(playlist_id=playlist_id).first()
            this_playlist.playlist_name=playlist_name
            db.session.commit()
            return {'message':'playlist name updated'}
        return {'message':'no playlist name provided'}

class Stats(Resource):
    @auth_required('token')
    def get(self):
        totalUsers=User.query.count()
        totalSongs=Songs.query.count()
       
        totalLogins=User.query.filter_by(last_login=date.today()).count()
        return {'totalUsers':totalUsers,'totalSongs':totalSongs,'totalLogins':totalLogins}


api.add_resource(SongssList,'/songs')
api.add_resource(NewUser,'/newUser')   
api.add_resource(createPlaylist,'/playlists') 
api.add_resource(RateSong,'/ratesong')
api.add_resource(DeletePlaylist,'/deletePlaylistSongs/<playlist_id>')
api.add_resource(AddPlaylist,'/addPlaylistSongs/<playlist_id>')
api.add_resource(PlaylistNames,'/changePlaylistName/<playlist_id>')
api.add_resource(Stats,'/stats')
