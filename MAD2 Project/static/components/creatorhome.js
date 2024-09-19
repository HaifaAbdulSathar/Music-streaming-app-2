export default{
    template:`<div class="bg-primary-subtle border border-dark">
    <h3>My Songs</h3>
    <div class="row" v-for="song in filteredsongs">
  <div class="col-4">
    <div id="list-example" class="list-group">
      <a class="list-group-item list-group-item-action" :href="'#list-item'+song.id">{{song.title}}</a>
    </div>
  </div>
  <div class="col-8">
    <div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0">
      <h4 id="'list-item'+song.id">{{song.title}}</h4> <router-link :to="{ path: '/updatesong', query: { songId: song.id , song: song }}"  class="btn btn-primary" >Update</router-link>
      </br>
      Artist:{{song.artist}}</br>
      Genre:{{song.description}}</br>
      Release Date:{{song.release_date}}</br>
      Rating:{{song.average_rating}}  
      <p>{{song.song_lyrics}}</p>
    </div>
  </div>
</div>
    </div>`,
    data(){
        return{
            creator:localStorage.getItem('id'),
            songs:[],
            authtoken: localStorage.getItem('auth-token'),
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
    },
      computed:{
        filteredsongs: function(){
            return this.songs.filter((song)=>{
                return song.creator_id===parseInt(this.creator)
            })
        }
      },
      
}