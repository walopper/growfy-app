<template>
    <div id="gf--dashboard-view">
        <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
                <v-flex xs6 grow class="main-screen--indicator-num" @click="updateStatus()">
                    <blockquote class="label-temp">Temperatura</blockquote>
                </v-flex>
                <v-flex xs6 grow class="main-screen--indicator-num temp" @click="updateStatus()">
                    <blockquote class="number">
                        {{current.temp}}
                        <span>ºC</span>
                    </blockquote>
                </v-flex>
            </v-layout>
        </v-container>

        <div class="graph-container">
            <div class="minmax max">{{Math.max(...tempMainLogs())}} <span>max</span></div>
            <div class="minmax min">{{Math.min(...tempMainLogs())}} <span>min</span></div>
            <div class="minmax avg">{{averageTemp()}} <span>avg</span></div>
            <trend
                :data="tempMainLogs()"
                :gradient="['rgba(255, 255, 255, .5)', 'rgba(255, 255, 200, .5)']"
                auto-draw
                :min="20"
                :max="26"
                :height="150"
                :width="windowWith()"
                smooth
            ></trend>
        </div>

        <v-container grid-list-md text-xs-center :style="{marginTop: '40px'}">
            <v-layout row wrap>
                <v-flex xs6 grow class="main-screen--indicator-num humidity" @click="updateStatus()">
                    <blockquote class="number">
                        {{current.humidity}}
                        <span>%</span>
                    </blockquote>
                </v-flex>
                <v-flex xs6 grow class="main-screen--indicator-num" @click="updateStatus()">
                    <blockquote class="label-humidity">Humedad</blockquote>
                </v-flex>
            </v-layout>
        </v-container>

        <div class="graph-container">
            <div class="minmax max">{{Math.max(...humidityMainLogs())}} <span>max</span></div>
            <div class="minmax min">{{Math.min(...humidityMainLogs())}} <span>min</span></div>
            <div class="minmax first-date">{{firstDate()}} count: {{stats.length}}</div>
            <div class="minmax last-date">{{lastDate()}}</div>
            <div class="minmax avg">{{averageHumidity()}} <span>avg</span></div>
            <trend
                :data="humidityMainLogs()"
                :gradient="['#d2efff']"
                auto-draw
                :min="50"
                :max="70"
                :height="150"
                :width="windowWith()"
                smooth
            ></trend>
        </div>

        <v-container grid-list-md text-xs-center class="lapsed-container">
            <v-layout row wrap>
                <v-flex xs4 grow class="lapsed" @click="updateStatus()">
                    <blockquote class="number">
                        {{growingTime().days}}
                    </blockquote>
                    <blockquote class="label">
                        <span>dias</span>
                    </blockquote>
                </v-flex>
                <v-flex xs4 grow class="lapsed" @click="updateStatus()">
                    <blockquote class="number">
                        {{floweringTime()}}
                    </blockquote>
                    <blockquote class="label">
                        <span>floración</span>
                    </blockquote>
                </v-flex>
                <v-flex xs4 grow class="lapsed" @click="updateStatus()">
                    <blockquote class="number">
                        {{growingTime().weeks}}
                    </blockquote>
                    <blockquote class="label">
                        <span>semanas</span>
                    </blockquote>
                </v-flex>
            </v-layout>
        </v-container>

        <div class="last-update">Ultima actualización: <span>{{lastUpdateAgo()}}</span></div>

        <TempChart />
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import thresholds from "../config/thresholds";
import socket from '../services/sio.service';

import ActivityIndicator from "mand-mobile/components/activity-indicator";

import TempChart from "../components/TempChart";

const growStartDate = moment('2019-06-23');

// const reducePoints = (points, maxPoints) => {
//     var puntos_x_tramo = Math.ceil(maxPoints / (points.length - 2));
//     var offset = 0;
//     var elementos_del_tramo = [];
//     var response = [];
//     var promedio = 0;

//     for (var i = 0; i < maxPoints; i++) {
//         offset = puntos_x_tramo * i;
//         elementos_del_tramo = points.slice(offset, offset + puntos_x_tramo);
//         promedio =
//             elementos_del_tramo.reduce((prev, cur) => prev + cur, 0) /
//             elementos_del_tramo.length;
//         response.push(promedio);
//     }

//     return response;
// };

export default {
    name: "dashboard",
    components: {
        TempChart,
        "md-activity-indicator": ActivityIndicator
    },
    data: () => ({
        floweringStarted: moment(),
        updatingSnapshot: false,
        updatingData: false,
        snapshotImageData: "",
        lineResolution: 5,
        bottomNav: "monitor",
        graphConfig: {
            padding: 0,
            height: 100
        },
        current: {
            temp: 0,
            humidity: 0,
            extractor: 0,
            intractor: 0,
            extractor_off_forzado: 0,
            intractor_off_forzado: 0,
            extractor_on_forzado: 0,
            intractor_on_forzado: 0,
            date: 345234,
            tempColor: "#9ad657",
            humidityColor: "#2bbdef"
        },
        lastUpdate: false,
        loading: false,
        stats: []
    }),
    mounted: function() {
        this.updateStatus();
        setTimeout(this.updateStatus, 10000);
        this.floweringStarted = moment('2019-08-02');
    },
    methods: {
        windowWith() {
            return (window && window.innerWidth) || 360;
        },
        lastUpdateAgo() {
            return this.lastUpdate
                ? moment(this.lastUpdate).format("D MMM, HH:mm")
                : "actualizando";
        },
        tempMainLogs() {
            return Array.isArray(this.stats) && this.stats.map(l => l.temp);
        },
        humidityMainLogs() {
            return Array.isArray(this.stats) && this.stats.map(l => l.humidity);
        },
        getTemp() {
            if (this.current.temp > this.umbrales.maxTemp)
                this.current.tempColor = "#efa220";
            if (this.current.temp > this.umbrales.citicalMaxTemp)
                this.current.tempColor = "#fb1010";

            if (this.current.temp < this.umbrales.minTemp)
                this.current.tempColor = "#2cd0ef";
            if (this.current.temp < this.umbrales.criticalMinTemp)
                this.current.tempColor = "#fff";
        },
        getSnapshot() {
            console.log("--> Getting Snapshot");
            this.updatingSnapshot = true;
            socket.emit(
                "GET_SNAPSHOT",
                { device_id: "0000000054105aca" },
                data => {
                    // console.log('Respuesta de server al GET_SNAPSHOT: ', data);
                    if (data && data.length > 10000)
                        this.snapshotImageData = data;
                    this.updatingSnapshot = false;
                    console.log("--> Got Snapshot");
                }
            );
        },
        updateStatus() {
            this.updatingData = true;
            const that = this;
            var current = { temp: 0, humidity: 0 };

            console.log("Actualizado datos");

            // quita el loading
            setTimeout(_ => this.updatingData = false, 10);

            socket.emit(
                "USER_INPUT",
                { device_id: "0000000054105aca", cmd: "GET_STATS" },
                response => {
                    console.log("Respuesta de server: ", response);
                    if (response && response.status && response.status.temp) {
                        var current = response.status;
                        this.current.temp = response.status.temp;
                        this.current.humidity = response.status.humidity;
                        this.lastUpdate = response.status.date;
                        this.stats = response.status.stats.map(l => ({
                            temp: l.temp,
                            humidity: l.humidity,
                            fan1: l.fan1,
                            fan2: l.fan2,
                            date: l.date
                        }));
                        this.updatingData = false;
                    }
                }
            );
        },
        growingTime() {
            return {
                days: moment().diff(growStartDate, 'days') + 1,
                weeks: moment().diff(growStartDate, 'weeks')
            }
        },
        averageTemp() {
            return Math.round(this.stats.reduce((prev, curr) => prev + curr.temp, 0) / this.stats.length * 10 ) / 10;
        },
        averageHumidity() {
            return Math.round(this.stats.reduce((prev, curr) => prev + curr.humidity, 0) / this.stats.length);
        },
        floweringTime() {
            return moment().diff(this.floweringStarted, 'days');
        },
        firstDate() {
            var _date = new Date(this.stats && this.stats[0] && this.stats[0].date || undefined);
            return moment(_date).format('D/M HH:mm');
        },
        lastDate() {
            const last = this.stats && (this.stats.length - 1) || 0;
            return moment(this.stats && this.stats[last] && this.stats[last].date || undefined).format("D/M HH:mm");
        }
    }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Lobster|Righteous:300,300i,400,600,700|Nunito:300,400,600,700|Raleway:300,300i,400,600,700&display=swap");
@import url("../../statics/font/flaticon.css");
@import url("../../node_modules/vuetify/dist/vuetify.min.css");
@import "../scss/main.scss";
</style>
