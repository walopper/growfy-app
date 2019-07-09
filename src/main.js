import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import VueApexCharts from 'vue-apexcharts';
import Trend from "vuetrend";
import vuemoment from 'vue-moment';
import VueSvgGauge from 'vue-svg-gauge';

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

Vue.use(Trend);
Vue.use(vuemoment);
Vue.use(VueSvgGauge);
Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);

Vue.config.productionTip = false;

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
