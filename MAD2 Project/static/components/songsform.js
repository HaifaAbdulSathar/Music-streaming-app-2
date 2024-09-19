export default{
    template:`<div>
    <input type="text" placeholder="Song Name" v-model="resource.title"/>
    <input type="text" placeholder="Genre" v-model="resource.description"/>
    <input type="text" placeholder="Song lyrics" v-model="resource.song_lyrics"/>
    <input type="text" placeholder="Artist" v-model="resource.artist"/>
    <input type="text" placeholder="Release Date" v-model="resource.release_date"/>
    <button class="btn btn-primary" @click="createSong">Add Song</button>
    </div>`,
    data(){
        return {
            resource:{
                title:null,
                description:null,
                song_lyrics:null,
                artist:null,
                release_date:null
            },
            token: localStorage.getItem('auth-token'),
        }
    },
    methods:{
        async createSong(){
            const res= await fetch('/api/songs',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': this.token
                },
                body: JSON.stringify(this.resource)
            })
            console.log(this.resource)
            const data= await res.json()
            if(res.ok){
                alert(data.message)
            }
            this.$router.push('/')
        }
    }
}