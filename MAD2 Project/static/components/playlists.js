export default{
    template:`<div class="bg-success-subtle border border-dark"><h3>My Playlists</h3>
    <router-link class="btn btn-success" to="/createPlaylist" :songs="songs">Create Playlist</router-link>              
    <router-link class="btn btn-success" to="/editPlaylist" :songs="songs">Edit Playlists</router-link><br>

    <p class="d-inline-flex gap-1">
        
    <button v-for="playlist in playlists" class="btn btn-outline-success" type="button" data-bs-toggle="collapse" :data-bs-target="'#'+playlist.playlist_name" aria-expanded="false" :aria-controls="playlist.playlist_name">
        {{playlist.playlist_name}}
      </button>
      
    </p>
    
    <div v-for="playlist in playlists" class="collapse" :id="playlist.playlist_name">
        <div class="card card-body">
            <ul>
            
            <li v-for="song in playlist.songs">
            {{song.title}}
            {{song.song_lyrics}}
            </li>
            
            </ul>
        </div>
      </div>
    
    </div>`,
    props:['playlists'],
    data(){
        return{
            userRole: localStorage.getItem('role'),
            songs:[],
            authtoken: localStorage.getItem('auth-token')
        }
    },
    async mounted(){
        const res = await fetch('/api/songs',{
            headers:{
                'Authentication-token': this.authtoken
            }
        })
        const data= await res.json()
        if (res.ok){
            this.songs=data
        }
        else{
            alert(data.message)
        }
        // const res2 = await fetch('/api/playlists',{
        //     headers:{
        //         'Authentication-token': this.authtoken
        //     }
        // })
        // const data2= await res2.json()
        // if (res2.ok){
        //     this.playlists=data2
        // }
        // else{
        //     alert(data2.message)
        // }
    }
}