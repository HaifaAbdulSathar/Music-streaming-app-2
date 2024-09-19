export default{
    template:`<div>
    <h3>Edit Playlists</h3>
    <p class="d-inline-flex gap-1">
        
    <button v-for="playlist in playlists" class="btn btn-primary" type="button" data-bs-toggle="collapse" :data-bs-target="'#'+playlist.playlist_name" aria-expanded="false" :aria-controls="playlist.playlist_name">
        {{playlist.playlist_name}}
      </button>
      
    </p>
    
    <div v-for="playlist in playlists" class="collapse" :id="playlist.playlist_name">
        <div class="card card-body">
        <h3>{{playlist.playlist_name}}</h3>
        Change playlist Name<input type="text" placeholder="Playlist Name" v-model="resources.name"/>
        <input type="submit" value="Change" @click="changePlaylistName(playlist.playlist_id)">
            <h4>Delete</h4>
                <ul>
            
            <li v-for="song in playlist.songs">
                <input type="checkbox" name="delete_checkbox" class="checkbox-class" v-model='resources.songsToDelete' :value="song.id">{{song.title}}   

            </li>
            
            </ul>
            <input type="submit" value="Delete" @click="deletePlaylistSongs(playlist.playlist_id)">

        
        <h4>Add</h4>
            <ul>
            
            <li v-for="song in songs" v-if="!playlist.songs.some(ps => ps.id === song.id)" >
                <input  type="checkbox" name="add_checkbox" class="checkbox-class" v-model='resources.songsToAdd' :value="song.id">{{song.title}}   
 
            </li>
            
           
            </ul>
            <input type="submit" value="Add" @click="addPlaylistSongs(playlist.playlist_id)">

        
        </div>
      </div>
      
    </div>`,
    data(){
        return{ 
            resources:{
            name:null,
            songsToDelete:[],
            songsToAdd:[],
            },
            
            playlists:[],
            songs:[],
            myplaylists:[],
            
            userRole: localStorage.getItem('role'),
            authtoken: localStorage.getItem('auth-token')
        }
    },
   methods:{
    async deletePlaylistSongs(playlist_id){
        const res=await fetch(`/api/deletePlaylistSongs/${playlist_id}`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authentication-token': this.authtoken
            },
            body: JSON.stringify(this.resources)
        })
        const data= await res.json()
        if(res.ok){
            alert(data.message)
        }
        this.$router.push({path:'/'})
        
    },
    async addPlaylistSongs(playlist_id){
        const res=await fetch(`/api/addPlaylistSongs/${playlist_id}`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authentication-token': this.authtoken
            },
            body: JSON.stringify(this.resources)
        })
        const data= await res.json()
        if(res.ok){
            alert(data.message)
        }
        this.$router.push({path:'/'})
        
    },
    async changePlaylistName(playlist_id){
        console.log(this.resources)
        const res=await fetch(`/api/changePlaylistName/${playlist_id}`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authentication-token': this.authtoken
            },
            body: JSON.stringify(this.resources)
        })
        const data= await res.json()
        if(res.ok){
            alert(data.message)
        }
        this.$router.push({path:'/'})
        
    },
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
    const res2 = await fetch('/api/playlists',{
        headers:{
            'Authentication-token': this.authtoken
        }
    })
    const data2= await res2.json()
    if (res2.ok){
        this.playlists=data2
    }
    else{
        alert(data2.message)
    }
}
}