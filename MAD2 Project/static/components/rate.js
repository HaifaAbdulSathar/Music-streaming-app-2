export default{
    template:`<div>
    <h1>Rate this song</h1>
    <h2>Song: {{$route.query.song.title}}</h2>
    
    <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" v-model="value" value=1>
        <label class="form-check-label" for="inlineRadio1">1</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" v-model="value" value=2>
        <label class="form-check-label" for="inlineRadio2">2</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" v-model="value" value=3 >
        <label class="form-check-label" for="inlineRadio3">3</label>
      </div>
      <input type="submit" value="submit" class="btn btn-primary" @click="submit">
    
    
    </div>`,
    props:['song'],
    data(){
        return{
            value:0,
            song_id: this.$route.query.song.id,
            authtoken: localStorage.getItem('auth-token')
        }
    },
    methods:{
        async submit(){
            const res = await fetch('/api/ratesong',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': this.authtoken
                },
                body: JSON.stringify({
                    song_id: this.song_id,
                    value: this.value
                })
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
    }
}