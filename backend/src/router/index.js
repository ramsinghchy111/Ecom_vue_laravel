import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Login.vue"
import Dashboard from "../views/Dashboard.vue"
import RequestPassword from "../views/RequestPassword.vue"
import ResetPassword from "../views/ResetPassword.vue"
import AppLayout from "../components/AppLayout.vue"
import Ecommerece from '../views/Ecommerece.vue'
import Inventory from '../views/Inventory.vue'
import CRM from '../views/CRM.vue'
import POS from '../views/POS.vue'
import Accounting from '../views/Accounting.vue'
import store from '../store'
import NotFound from '../views/NotFound.vue'

const routes = [
      { path: '/', redirect: '/app/dashboard' },
    {
        path:'/app',
        name:'app',
        component:AppLayout,
        meta:{
            requiresAuth: true
        },
        children: [
        { path: 'dashboard', name: 'Dashboard', component: Dashboard },
        { path: 'crm', name: 'CRM', component:CRM },
        { path: 'accounting', name: 'Accounting', component:Accounting },
        { path: 'ecommerce', name: 'Ecommerce', component: Ecommerece },
        { path: 'inventory', name: 'Inventory', component:Inventory },
        { path: 'pos', name: 'POS', component:POS },
        ]
    },
     {
    path:'/login',
    name:'login',
    meta:{
        requiresGuest:true
    },
    component: Login
    },
    {
    path:'/request-password',
    name:'requestPassword',
     meta:{
        requiresGuest:true
    },
    component: RequestPassword
    },
    {
    path:'/reset-password',
    name:'resetPassword',
     meta:{
        requiresGuest:true
    },
    component: ResetPassword
    },
     {
    path:'/:pathMatch(.*)*',
    name:'notfound',
    component: NotFound
    },
];

const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach(async(to,from,next) => {
    if(to.meta.requiresAuth && !store.state.user.token ){
        next({name: 'login'})
    }else if (to.meta.requiresGuest && store.state.user.token){
        next({name:'Dashboard'})
    }else{
        next();
    }
})
export default router;