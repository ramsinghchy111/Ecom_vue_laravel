// store/index.js
import { createStore } from "vuex";

const store = createStore(  {
    state: {
        user:{
            token:1234,
            data:{}
        }
    },
    getters: {},
    actions: {},
    mutations: {},

});

console.log("Vuex Store Loaded ✅");

export default store;
