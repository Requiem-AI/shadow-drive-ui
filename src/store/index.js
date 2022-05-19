import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routerHistory: [],
    wallet_connected: false,
    wallet_addr: "",
    balances: {
      sol: 0,
      shdw: 0
    }
  },
  mutations: {
    set_wallet_connected(state, connected) {
      state.wallet_connected = connected;
    },
    
    set_wallet_addr(state, addr) {
      state.wallet_addr = addr;
    },

    set_token_balance(state, currency) {
      state.balances[currency.key] = currency.value
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
