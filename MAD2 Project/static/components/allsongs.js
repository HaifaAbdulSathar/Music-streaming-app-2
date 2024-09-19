export default{
    template:`<div class="p-3 bg-primary-subtle border border-dark" :key='key'>
    <h1>All Songs</h1>
    <input type="text" placeholder="Search Song,Artist or Genre" v-model="search"/>
    <div class="row" v-for="song in filteredsongs">
  <div class="col-4">
    <div id="list-example" class="list-group">
      <a class="list-group-item list-group-item-action" :href="'#list-item'+song.id">{{song.title}}</a>
    </div>
  </div>
  <div class="col-8">
    <div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0">
      <p v-if="song.flag" class="text-danger">Song flagged by admin!</p>
      <h4 id="'list-item'+song.id">{{song.title}}</h4>
      <router-link :to="{ path: '/rate', query: { songId: song.id , song: song }}"  class="btn btn-warning " >Rate</router-link></br>
      Artist:{{song.artist}}</br>
      Genre:{{song.description}}</br>
      Release Date:{{song.release_date}}</br>
      Rating:{{song.average_rating}}  
      <button v-if="role=='admin'" class="btn btn-danger" @click="deleteSong(song.id)">Delete</button>
      <button v-if="role=='admin' && !song.flag" class="btn btn-secondary" @click="flagSong(song.id)">Flag</button>
      <button v-if="role=='admin' && song.flag" class="btn btn-secondary" @click="unflagSong(song.id)">Unflag</button></br>
      <p>{{song.song_lyrics}}</p>
    </div>
  </div>
</div>
    </div>`,
    data(){
        return{
            search:'',
            songs:[],
            authtoken: localStorage.getItem('auth-token'),
            role: localStorage.getItem('role'),
            key: 0
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
      }},
      computed:{
        filteredsongs: function(){
            return this.songs.filter((song)=>{
                return song.title.toLowerCase().match(this.search.toLowerCase()) || song.artist.toLowerCase().match(this.search.toLowerCase()) || song.description.toLowerCase().match(this.search.toLowerCase())
            })
        }
      },
      methods:{
        async deleteSong(song_id){
          const res= await fetch(`/deletesong/${song_id}`,{
              headers:{
                 
                  'Authentication-token': this.authtoken
              },
            
          })
          const data= await res.json()
          if(res.ok){
              alert(data.message)
          }
          else{
              alert(data.message)
          }
       this.key++
      },
      async flagSong(song_id){
        const res= await fetch(`/flagsong/${song_id}`,{
          headers:{
              'Authentication-token': this.authtoken,

          },

        })
        const data= await res.json()
          if(res.ok){
              alert(data.message)
          }
          else{
              alert(data.message)
          }
          this.key++
      },
      async unflagSong(song_id){
        const res= await fetch(`/unflagsong/${song_id}`,{
          headers:{
              'Authentication-token': this.authtoken
          },
        })
        const data= await res.json()
          if(res.ok){
              alert(data.message)
          }
          else{
              alert(data.message)
          }
          this.key++
          }
      },
      

}