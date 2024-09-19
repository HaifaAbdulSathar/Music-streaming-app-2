export default{
    template:`<div>
    create playlist
    <input type="text" placeholder="Playlist Name" v-model="playlist.name"/>
    <ul >
    <li v-for="song in all_songs" :key="song.id">
    <input type="checkbox" name="checkbox_item" class="checkbox-class" :value="song.id" v-model="playlist.songs"/>{{song.title}}   
    </li>
    </ul>
    <button class="btn btn-primary" @click="createPlaylist">Create Playlist</button>
    </div>`,
    //props:['songs'],
    data(){
        return{
            playlist:{
                name:null,
                songs:[]

            },
            selected_songs:[],
            all_songs:[],
            authtoken: localStorage.getItem('auth-token'),
            user_id: localStorage.getItem('id'),
        }
    },
    methods:{
        async createPlaylist(){
            const res= await fetch('/api/playlists',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': this.authtoken,
                    'user-id': this.user_id
                },
                body: JSON.stringify(this.playlist)
            })
            const data= await res.json()
            if(res.ok){
                alert(data.message)
            }
            else{
                alert(data.message)
            }
            this.$router.push({path:'/'})
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
            this.all_songs=data
            
        }
        else{
            alert(data.message)
        }
    }
}