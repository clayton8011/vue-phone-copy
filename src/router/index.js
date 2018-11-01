import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'

import Home from '@/page/home/home'
import City from '@/page/city/city'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HelloWorld',
      component: App,
        children:[
            {
                path:'',
                redirect:'/home'
            },
            {
                path:'/home',
                component:Home
            },
            {
                path:'/city',
                component:City
            }
        ]
    }
  ]
})
