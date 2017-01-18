import Vue from 'vue'
import VueTouch from 'vue-touch-easyhi'
import VueRouter from 'vue-router'
import App from './components/App.vue'
import Design from './components/Design.vue'
import List from './components/List.vue'
import Album from './components/Album.vue'
import Detail from './components/Detail.vue'
import store from './store'

Vue.use(VueTouch)
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
  	base: __dirname,
  	routes: [
    	{ path: '/design', name:'design', component: Design },
        { path: '/list', name:'list', component: List },
        { path: '/album/:id', name: 'album', component: Album },
        { path: '/detail/:id', name: 'detail', component: Detail },
  	]
})

const app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
