export default{
    template:`<div>
    Song Title <input type="text" v-model="resource.title"/></br>
    Genre<input type="text" v-model="resource.description"/></br>
    Lyrics<input type="text" v-model="resource.song_lyrics"/></br>
    Artist<input type="text" v-model="resource.artist"/></br>
    Release Date<input type="text" v-model="resource.release_date"/></br>
    <button class="btn btn-primary" @click="updateSong">Update</button>
    <button class="btn btn-danger" @click="deleteSong">Delete</button>
    </div>`,
    data(){
        return {
            resource:{
                title:this.$route.query.song.title,
                description:this.$route.query.song.description,
                song_lyrics:this.$route.query.song.song_lyrics,
                artist:this.$route.query.song.artist,
                release_date:this.$route.query.song.release_date,
                id:this.$route.query.song.id
            },
            token: localStorage.getItem('auth-token'),
        }
    },
    methods:{
        async updateSong(){
            const res= await fetch('/api/songs',{
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': this.token
                },
                body: JSON.stringify(this.resource)
            })
            const data= await res.json()
            if(res.ok){
                alert(data.message)
            }
            this.$router.push('/')
        },
        async deleteSong(){
            const res= await fetch(`/api/songs`,{
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': this.token
                },
                body: JSON.stringify(this.resource)
            })
            const data= await res.json()
            if(res.ok){
                alert(data.message)
            }
            else{
                alert(data.message)
            }
            this.$router.push('/')
        }
    }
}