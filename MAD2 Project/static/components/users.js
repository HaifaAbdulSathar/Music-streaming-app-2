export default{
    template:`<div>
    <div v-if="error">{{error}}</div>
    <div v-for="(user, index) in allUsers">{{user.email}}<button class="btn btn-light" v-if="!user.active && user.roles[0]==='<Role 2>'" @click="approve(user.id)">Whitelist</button>
    <button class="btn btn-dark" v-if=" user.active && user.roles[0]==='<Role 2>'" @click="disapprove(user.id)">Blacklist</button>
    </div>
    </div>`,
    data(){
        return{
            allUsers: [],
            token: localStorage.getItem('auth-token'),
            error:null,

        }
    },
    methods:{
        async approve(creator_id){
            const res=await fetch(`/activate/creator/${creator_id}`,{
                headers:{
                    'Authentication-token': this.token
                }
            })
            const data= await res.json()
            if(res.ok){
                alert(data.message)
            }
            
        },
        async disapprove(creator_id){
            const res=await fetch(`/deactivate/creator/${creator_id}`,{
                headers:{
                    'Authentication-token': this.token
                }
            })
            const data= await res.json()
            if(res.ok){
                alert(data.message)
            }
            
        }
    },
    async mounted(){
        const res= await fetch('/users',{
            headers:{
                'Authentication-token': this.token
            }
        }
        )
        const data= await res.json().catch((e) =>{})
        if(res.ok){
            this.allUsers=data
        }
        else{
            this.error=res.status
        }
    }
}