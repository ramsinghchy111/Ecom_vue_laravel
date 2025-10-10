import { createApp } from 'vue'
import App from './App.vue'
import store from './store'   // <-- import store
import router from './router';
import './style.css'

const app = createApp(App)
app.use(store) 
app.use(router)  // <-- register Vuex store
app.mount('#app')
