export default{
    template:`<div>
    <input type="text" placeholder="User Name" v-model="resource.username"/>
    <input type="text" placeholder="Email" v-model="resource.email"/>
    <input type="password" placeholder="Password" v-model="resource.password"/>
    <input class="form-check-input" type="radio" id="user" v-model="resource.roles" value="user">
  <label class="form-check-label" for="user">
    General user
  </label>
  <input class="form-check-input" type="radio"  id="creator" v-model="resource.roles" value="creator">
  <label class="form-check-label" for="creator">
    Creator
  </label>
    <button class="btn btn-primary" @click=newUser>Register</button>
    </div>`,
    data(){
        return {
            resource:{
                username:null,
                email:null,
                password:null,
                roles:[]
            },
            error:null
        }
    },
    methods:{
        async newUser(){
            if (!Array.isArray(this.resource.roles)) {
                this.resource.roles = [this.resource.roles];
            }
            const res = await fetch('/api/newUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.resource)
            })
            console.log(this.resource)
            const data= await res.json()
            console.log(data)
            if(res.ok){
                alert(data.message)
                this.$router.push({path:'/login'})
            }
            else{
                this.error=data.message
            }
        }
    }
}