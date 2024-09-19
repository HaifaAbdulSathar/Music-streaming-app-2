export default{
    template:`
    <div class='d-flex justify-content-center' style='margin-top:30vh'>
    <div class="mb-3 p-5 bg-light">
    <div class="text-danger">{{error}}</div>
    <label for="user-email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
    <label for="user-password" class="form-label">Password</label>
    <input type="password" class="form-control" id="user-password" v-model="cred.password">
    <button class="btn btn-primary mt-3" @click="login">Login</button></br>
    Not Registered yet? <router-link class="text-decoration-none" to="/registration">Register now</router-link>
  </div>
  </div>
 `,
 data(){
     return{
      cred:{
         email:'',
         password:''
     },
     error:null,
    }
 },
 methods:{
  async login(){
const res =await fetch('/user-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(this.cred),
})
const data= await res.json()
if(res.ok){
  localStorage.setItem('auth-token', data.token)
  localStorage.setItem('role', data.roles)
  localStorage.setItem('id', data.id)
  console.log(data.roles)
  this.$router.push({path:'/'})
}
else{
this.error=data.message
}
  }
 }
}