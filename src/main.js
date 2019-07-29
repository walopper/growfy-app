import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import Trend from "vuetrend";
import FastClick from 'fastclick';
import VueRouter from 'vue-router'

import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log(`Service Worker registered! Scope: ${registration.scope}`);
            })
            .catch(err => {
                console.log(`Service Worker registration failed: ${err}`);
            });
    });
}

if ('addEventListener' in document && 'ontouchstart' in window) {
    FastClick.prototype.focus = function (targetElement) {
        targetElement.focus()
    }
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}

Vue.config.productionTip = false;

Vue.use(Trend);
Vue.use(VueRouter)
Vue.use(Vuetify, {
    iconfont: 'mdi',
    icons: {
        'account': 'mdi account-details',
        'termo': 'fi flaticon-termo',
        'menu': 'fas fa-ellipsis-v'
    }
});

new Vue({
    render: h => h(App),
}).$mount('#app');
