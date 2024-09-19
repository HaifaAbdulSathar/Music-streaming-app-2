import adminhome from "./adminhome.js"
import creatorhome from "./creatorhome.js"
import userhome from "./userhome.js"
import allsongs from "./allsongs.js"
import playlists from "./playlists.js"


export default{
    template:`<div>
    <allsongs :songs="songs"/>
    <userhome v-if="userRole=='user'"/>
    <adminhome v-if="userRole=='admin'"/>
    <creatorhome v-if="userRole=='creator'"/>
    <playlists v-if="userRole=='user' || userRole=='creator'" :playlists="playlists"/>
    
    </div>`,
    // <allsongs v-for="song in songs" :song="song"/>

    data(){
        return{
            userRole: localStorage.getItem('role'),
            songs:[],
            playlists:[],
            authtoken: localStorage.getItem('auth-token'),
            userRole: localStorage.getItem('role'),
        }
    },
    components:{
        adminhome,
        creatorhome,
        userhome,
        allsongs,
        playlists
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
                'Authentication-token': this.authtoken,
                'role': this.userRole
            }
        })
        const data2= await res2.json()
        if (res2.ok){
            this.playlists=data2
        }
    //     else{
    //         if(this.userRole=='user'){
    //             alert(data2.message)
    //         }
    //         if(this.userRole=='creator'){
    //         alert(data2.message)
    //     }
    // }
}}