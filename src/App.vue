<template>
    <div id="app">
        <Header :loading="false" :openDrawer="openDrawer" :class="'with-blur ' + blurredClass" />
        <router-view :class="'view with-blur ' + blurredClass" foo="123"></router-view>

        <Drawer 
            :direction="'right'" 
            :exist="true" 
            ref="Drawer" 
            :onDrawerStatusChange="onDrawerStatusChange">
            <div class="drawer--container" @click="closeDrawer()">
                <div class="button profile">
                    <div class="profile-picture">

                    </div>
                    <div class="label profile">Perfil</div>
                </div>
                <router-link class="button" @click="closeDrawer()" to="/">
                    <md-icon class="time" name="time" size="lg"></md-icon>
                    <div class="label">Monitoreo</div>
                </router-link>
                <router-link class="button" @click="closeDrawer()" to="/control">
                    <md-icon class="switch" name="switch" size="lg"></md-icon>
                    <div class="label">Control</div>
                </router-link>
                <router-link class="button" @click="closeDrawer()" to="/snapshot">
                    <md-icon class="camera" name="camera" size="lg"></md-icon>
                    <div class="label">Snapshot</div>
                </router-link>
                <router-link class="button" @click="closeDrawer()" to="/config">
                    <md-icon class="setting" name="setting" size="lg"></md-icon>
                    <div class="label">Configuración</div>
                </router-link>
            </div>
        </Drawer>
    </div>
</template>

<script>
import VueRouter from 'vue-router';

import Drawer from './components/Drawer';
import Header from "./components/Header";
import Dashboard from "./views/Dashboard";
import Control from "./views/Control";
import Snapshot from "./views/Snapshot";

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', component: Dashboard }, // No props, no nothing
        { path: '/control', component: Control, props: true }, // Pass route.params to props
        { path: '/snapshot', component: Snapshot, props: { name: 'world' }}, // static values
        // { path: '/config', component: Header, Dashboard: { name: 'attrs' }},
    ]
})

export default {
    name: "app",
    router,
    components: {
        Dashboard,
        Header,
        Drawer,
        Control,
    },
    data: () => ({
        menu: [
          { title: 'Configuracion', icon: 'dashboard' },
          { title: 'Snapshot', icon: 'question_answer' },
        ],
        blurredClass: ''
    }),
    mounted: function() {
        // this.openDrawer();
    },
    methods: {
        closeDrawer() {
            this.$refs.Drawer.close();					
        },
        onDrawerStatusChange() {
            if(this.$refs && this.$refs.Drawer && this.$refs.Drawer.active) {
                this.blurredClass = 'blurred';
            } else {
                this.blurredClass = '';
            }
        },
        openDrawer(){
            if(this.$refs.Drawer.active){
                this.$refs.Drawer.close();					
            }else{
                this.$refs.Drawer.open();
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
