import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

Vue.use(Vuex)

function loadData() {
    const datas = require.context('@/data', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const states = {};

    datas.keys().forEach(key => {

        const matched = key.match(/([A-Za-z0-9-_]+)\./i);

        if (matched && matched.length > 1) {
            const data = matched[1];
            states[data] = datas(key);
        }
    })

    return states;
}

export default new Vuex.Store({
    state: {
        storedata: loadData(),
        axiosdata: {
            clientinformations: []
        }
    },

    getters: {
        getClientInformations: (state) => {
            return state.axiosdata.clientinformations;
        }
    },

    actions: {
        loadClientInformations: ({commit}) => {
            axios.get( '/api/clientinformations.json' )
                 .then( response => {
                    commit('LOAD_CLIENT_INFO', response.data)
                 })
        },

        addClientInformations: (context, client) => {
            context.commit("ADD_CLIENT_INFO", client);
        },

        deleteClientInformations: (context, index) => {
            context.commit("DELETE_CLIENT_INFO", index);
        },

        updateGlobalClientId: (context, index) => {
            context.commit("UPDATE_GLOBAL_CLIENT_ID", index);
        }
    },

    mutations: {
        LOAD_CLIENT_INFO: (state, client) => {
            if ( window.localStorage.getItem("clients") !== null ) {
                state.axiosdata.clientinformations = JSON.parse( window.localStorage.getItem("clients") );
            } else {
                window.localStorage.setItem( "clients", JSON.stringify( client ) );
                state.axiosdata.clientinformations = client;
            }
        },

        ADD_CLIENT_INFO: (state, client) => {
            state.axiosdata.clientinformations.push( client );
            window.localStorage.setItem( "clients", JSON.stringify( state.axiosdata.clientinformations ) );
        },

        DELETE_CLIENT_INFO: (state, index) => {
            state.axiosdata.clientinformations.splice(index, 1);
            window.localStorage.setItem( "clients", JSON.stringify( state.axiosdata.clientinformations ) );
        },

        UPDATE_GLOBAL_CLIENT_ID: (state, index) => {
            state.storedata.global.clientid = index;
        }
    }
});