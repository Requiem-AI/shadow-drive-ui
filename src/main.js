import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

import VueToastr from "vue-toastr";

import 'animate.css';

import "@fortawesome/fontawesome-free/js/all"
import "@/assets/css/theme_v2.css"

Vue.config.productionTip = false;

Vue.use(VueToastr, {
    defaultProgressBar: true,
    defaultPosition: "toast-bottom-left"

    /* OverWrite Plugin Options if you need */
});

const publicRoutes = {
    "Login": true,
    "Home": true,
    "Privacy Policy": true,
    "Terms and Conditions": true,
}


// GOOD
router.beforeEach((to, from, next) => {
    if (store.state.routerHistory.length > 5) {
        store.state.routerHistory.splice(-1, 1);
    }

    // if (to.name !== 'Login' && store.state.wallet_addr === "") {
    if (!publicRoutes[to.name] && store.state.wallet_addr === "") {
        store.state.routerHistory.push(to.fullPath);
        next({name: 'Login'})
        return
    }

    if (to.name !== 'Login') {
        store.state.routerHistory.push(from.fullPath);
    }

    next()
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')