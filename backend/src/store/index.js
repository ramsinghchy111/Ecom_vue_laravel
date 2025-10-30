// store/index.js
import { createStore } from "vuex";
import * as actions from './actions';
import * as mutations from './mutations';
import kanban from "./kanban";

const store = createStore(  {
    state: {
        user:{
            token:sessionStorage.getItem('TOKEN'),
            data:{}
        }
    },
    getters: {},
    actions,
    mutations,

      modules: {
        kanban
        }
});

export default store;


