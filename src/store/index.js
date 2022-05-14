import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routerHistory: [],
    wallet_connected: false,
    wallet_addr: "",
  },
  mutations: {
    set_wallet_connected(state, connected) {
      state.wallet_connected = connected;
    },
    
    set_wallet_addr(state, addr) {
      state.wallet_addr = addr;
    },

    clear_wallet_addr(state) {
      state.wallet_addr = "";
    },

  },
  actions: {
  },
  modules: {
  }
})
