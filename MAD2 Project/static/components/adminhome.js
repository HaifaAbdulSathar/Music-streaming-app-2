export default{
    template:`<div class="p-3 bg-success-subtle border border-dark"><h1>App Stats</h1>
    <div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col">
    <div class="card h-100">

      <div class="card-body">
        <h5 class="card-title">Total Users</h5>
        <p class="card-text">{{totalUsers}}</p>
      </div>
      
    </div>
  </div>
  <div class="col">
    <div class="card h-100">

      <div class="card-body">
        <h5 class="card-title">Total Songs</h5>
        <p class="card-text">{{totalSongs}}</p>
      </div>
      
    </div>
  </div>
  <div class="col">
    <div class="card h-100">

      <div class="card-body">
        <h5 class="card-title">Total Logins today</h5>
        <p class="card-text">{{totalLogins}}</p>
      </div>
      
    </div>
  </div>
</div>
    </div>`,
    data(){
        return{
        totalUsers:0,
        totalSongs:0,
        totalLogins:0
        }
    },
   
    async mounted(){
            const res = await fetch('/api/stats',{
                headers:{
                    'Authentication-token': localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            if(res.ok){
                this.totalUsers=data.totalUsers
                this.totalSongs=data.totalSongs
                this.totalLogins=data.totalLogins
            }
            else{
                alert(data.message)
            }
        }
    }
