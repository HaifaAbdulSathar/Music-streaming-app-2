import Home from './components/Home.js'
import login from './components/login.js'
import users from './components/users.js'
import songsform from './components/songsform.js'
import registration from './components/registration.js'
import createPlaylist from './components/createPlaylist.js'
import rate from './components/rate.js'
import editPlaylist from './components/editPlaylist.js'
import updatesong from './components/updatesong.js'

const routes=[
    {path:'/',component:Home},
    {path:'/login',component:login, name:'login'},
    {path:'/users',component:users},
    {path:'/songsform',component:songsform},
    {path:'/registration',component:registration, name:'registration'},
    {path:'/createPlaylist',component:createPlaylist},
    {path:'/rate',component:rate,props:true},
    {path:'/editPlaylist',component:editPlaylist,props:true},
    {path:'/updatesong',component:updatesong,props:true}
]

export default new VueRouter({routes})