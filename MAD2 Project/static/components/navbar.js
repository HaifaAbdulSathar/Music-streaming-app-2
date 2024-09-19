export default{
    template: `<nav class="navbar navbar-expand-lg bg-body-secondary border border-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Music World</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
          </li>
          <li class="nav-item" v-if="role=='admin'"><router-link class="nav-link" to="/users">Users</router-link></li>
          <li class="nav-item" v-if="role=='creator'"><router-link class="nav-link" to="/songsform">Upload Song</router-link></li>

          <li class="nav-item text-end" v-if="is_login">
            <span class="nav-link" @click="logout">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>`,
  data(){
    return {
      role: localStorage.getItem('role'),
      is_login: localStorage.getItem('auth-token') 
    }
  },
  methods:{
    logout(){
      localStorage.removeItem('auth-token')
      localStorage.removeItem('role')
      localStorage.removeItem('id')
      this.$router.push({path:'/login'})
    }
  }
}