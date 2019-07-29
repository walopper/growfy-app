<template>
    <div id="app">
        <Header :loading="false" />
        <router-view class="view" foo="123"></router-view>

        <Drawer :direction="'right'" :exist="true" ref="LeftDrawer">
            <div class="drawer--container">
                <div class="button">
                    <div class="profile-picture">

                    </div>
                    <div class="label profile">Perfil</div>
                </div>
                <div class="button">
                    <md-icon name="time" size="lg"></md-icon>
                    <div class="label">Monitoreo</div>
                </div>
                <div class="button">
                    <md-icon name="switch" size="lg"></md-icon>
                    <div class="label">Control</div>
                </div>
                <div class="button">
                    <md-icon name="camera" size="lg"></md-icon>
                    <div class="label">Snapshot</div>
                </div>
                <div class="button">
                    <md-icon name="setting" size="lg"></md-icon>
                    <div class="label">Configuración</div>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script>
import VueRouter from 'vue-router';

import Drawer from './components/Drawer';
import Header from "./components/Header";
import Dashboard from "./views/Dashboard";

import { Icon } from 'mand-mobile'

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', component: Dashboard }, // No props, no nothing
        { path: '/config', component: Dashboard, props: true }, // Pass route.params to props
        { path: '/static', component: Dashboard, props: { name: 'world' }}, // static values
        { path: '/attrs', component: Dashboard, Dashboard: { name: 'attrs' }}
    ]
})

export default {
    name: "app",
    router,
    components: {
        Dashboard,
        Header,
        Drawer,
        [Icon.name]: Icon
    },
    data: () => ({
        menu: [
          { title: 'Configuracion', icon: 'dashboard' },
          { title: 'Snapshot', icon: 'question_answer' },
        ],
    }),
    mounted: function() {
        this.openMenu();
    },
    methods: {
        openMenu(){
            if(this.$refs.LeftDrawer.active){
                this.$refs.LeftDrawer.close();					
            }else{
                this.$refs.LeftDrawer.open();
            }
        }
    }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Lobster|Righteous:300,300i,400,600,700|Nunito:300,400,600,700|Raleway:300,300i,400,600,700&display=swap");
@import url("../statics/font/flaticon.css");
@import url("../node_modules/vuetify/dist/vuetify.min.css");

@font-face{
  font-family: Mand-Mobile-Icon;
  font-style: normal;
  font-weight: 400;
  src: url(~mand-mobile/components/icon/iconfont.woff) format("woff"),url(~mand-mobile/components/icon/iconfont.woff) format("truetype")
}

@import "./scss/_variables.scss";
@import "./scss/main.scss";
@import "./scss/drawer.scss";
</style>
