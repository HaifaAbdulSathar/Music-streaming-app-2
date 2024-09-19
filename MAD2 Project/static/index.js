import router from './router.js'
import navbar from './components/navbar.js'


router.beforeEach((to, from, next) => {
    if(to.name == 'registration' && !localStorage.getItem('auth-token') ? true : false )
    next()
    else
    if(to.name !== 'login' && !localStorage.getItem('auth-token') ? true : false)
    next({name:'login'})
    else
    next()
        
    }
)


new Vue({
    el: '#app',
    template: `<div><navbar :key='has_changed'/>
    <router-view class="m-3"/></div>`,
    router,
    components:{
        navbar
    },
    data: {
        has_changed:true,
    },
    watch:{
        $route(to,from) {
            this.has_changed = !this.has_changed
        },
    }
}) 