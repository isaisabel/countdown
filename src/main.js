import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import HomeView from "./views/HomeView"
import PieChartView from "./views/PieChartView"

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
    { 
        name: "home",
        path: '/', 
        component: HomeView
    },
    { 
        name: "visualize",
        path: '/visualize', 
        component: PieChartView
    }
]

const router = new VueRouter({
    routes // short for `routes: routes`
})


new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
