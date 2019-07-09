<template>
    <div id="app">
        <div class="header" light>
            <div 
                :class="'button left ' + (updatingSnapshot ? 'loading' : '')" 
                @click="getSnapshot">
                <v-icon>mdi-camera</v-icon>
            </div>
            <div id="logo">
                Grow<span>fy</span>
            </div>
            <div 
                :class="'button right ' + (updatingData ? 'loading' : '')" 
                @click="updateStatus">
                <v-icon>mdi-autorenew</v-icon>
            </div>
        </div>

        <div class="content">
            <div class="fullchart">
                <div class="data">
                    <i class="icon fi flaticon-termo" :style="{color: current.tempColor}"></i>
                    <div class="value">{{current.temp }}<span style="font-size: .6em">ºC</span></div>
                </div>
                <div class="gauge">
                    <VueSvgGauge
                        :start-angle="-90"
                        :end-angle="90"
                        :value="current.temp - 18"
                        :separator-step="1"
                        :min="0"
                        :max="10"
                        :innerRadius="60"
                        :separatorThickness="3"
                        :baseColor="'#888888'"
                        :gauge-color="[
                            { offset: 0, color: '#49a6ff'}, 
                            { offset: 25, color: '#49f3ff'}, 
                            { offset: 50, color: '#f1ffae'}, 
                            { offset: 75, color: '#ffa600'}, 
                            { offset: 100, color: '#ff0000'}
                        ]"
                        :scale-interval="1"
                    />
                </div>
                <div class="main-chart">
                    <trend
                        :data="tempMainLogs()"
                        :gradient="['#f17e29', '#f1d729', '#cff257']"
                        auto-draw
                        :padding="graphConfig.padding"
                        :height="graphConfig.height"
                        smooth
                    >
                    </trend>
                </div>
            </div> 

            <div class="fullchart second">
                <div class="data">
                    <i class="icon fi flaticon-humidity" :style="{color: current.humidityColor, fontSize: '30px', margin: '4px 0 4px -14px'}"></i>
                    <div class="value">{{current.humidity}}<span style="font-size: .6em">%</span></div>
                </div>
                <div class="gauge">
                    <VueSvgGauge
                        :start-angle="-90"
                        :end-angle="90"
                        :value="current.humidity"
                        :separator-step="10"
                        :min="0"
                        :max="100"
                        :innerRadius="60"
                        :separatorThickness="3"
                        :baseColor="'#888888'"
                        :gauge-color="[
                            { offset: 0, color: '#fff370'}, 
                            { offset: 25, color: '#f6f6f6'}, 
                            { offset: 50, color: '#5aa4ef'}, 
                            { offset: 75, color: '#3c48dc'}, 
                            { offset: 100, color: '#8300fe'}
                        ]"
                        :scale-interval="10"
                    />
                </div>
                <div class="main-chart">
                    <trend
                        :data="humidityMainLogs()"
                        :gradient="['#fff370', '#ffffff', '#70c4ff', '#a670ff'].reverse()"
                        auto-draw
                        :padding="graphConfig.padding"
                        :height="graphConfig.height"
                        smooth
                    >
                    </trend>
                </div>
            </div>

            <div class="last-mesure-time">Ultima actualización: <strong>{{ lastUpdateAgo() }}</strong></div>

            <div class="indoor-image-preview">
                <img :src="snapshotImageData" v-if="snapshotImageData" />
            </div>
        </div>

        <v-bottom-nav
            :active.sync="bottomNav"
            :value="true"
            absolute
            dark
            v-if="false"
            color="rgba(255, 255, 255, .1)">
            <v-btn
                color="#ffffff"
                flat
                value="monitor">
                <v-icon>mdi mdi-home</v-icon>
            </v-btn>

            <v-btn
                color="#ffffff"
                flat
                value="control">
                <v-icon>mdi mdi-cogs</v-icon>
            </v-btn>
            </v-bottom-nav>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import io from 'socket.io-client';

const socket = io('http://growfy.pro:6440/app', function(algo){
    console.log(algo);
});

const reducePoints = (points, maxPoints) => {

    var puntos_x_tramo = Math.ceil(maxPoints / (points.length - 2));
    var offset = 0;
    var elementos_del_tramo = [];
    var response = [];
    var promedio = 0;

    for(var i = 0; i < maxPoints; i++) {
        offset = puntos_x_tramo * i;
        elementos_del_tramo = points.slice(offset, offset + puntos_x_tramo);
        promedio = elementos_del_tramo.reduce((prev, cur) => prev + cur, 0) / elementos_del_tramo.length;
        response.push(promedio);
    }

    return response;
}

export default {
    name: "app",
    components: {
        
    },
    data: () => ({
        updatingSnapshot: false,
        updatingData: false,
        snapshotImageData: '',
        lineResolution: 20,
        bottomNav: 'monitor',
        graphConfig: {
            padding: 0,
            height: 100,
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
            tempColor: '#9ad657',
            humidityColor: '#2bbdef'
        },
        lastUpdate: '-',
        loading: false,
        stats: [],
        umbrales: {
            maxTemp: 24,
            citicalMaxTemp: 26,
            minTemp: 18,
            criticalMinTemp: 16,
            maxHumidity: 70,
            minHumidity: 30
        }
    }),
    mounted: function () {
        this.updateStatus();
        this.getSnapshot();
        setTimeout(this.updateStatus, 60000);
    },
    methods: {
        lastUpdateAgo() {
            return this.lastUpdate 
                ? moment(this.lastUpdate).fromNow(true)
                : '-';
        },
        tempMainLogs(){
            return Array.isArray(this.stats) && reducePoints(this.stats.map(l => l.temp), this.lineResolution)
        },
        humidityMainLogs(){
            return Array.isArray(this.stats) && reducePoints(this.stats.map(l => l.humidity), this.lineResolution)
        },
        getTemp() {
            if(this.current.temp > this.umbrales.maxTemp) this.current.tempColor = '#efa220';
            if(this.current.temp > this.umbrales.citicalMaxTemp) this.current.tempColor = '#fb1010';

            if(this.current.temp < this.umbrales.minTemp) this.current.tempColor = '#2cd0ef';
            if(this.current.temp < this.umbrales.criticalMinTemp) this.current.tempColor = '#fff';
        },
        getSnapshot() {
            this.updatingSnapshot = true;
            socket.emit('GET_SNAPSHOT', { device_id: '0000000054105aca' }, data => {
                console.log("Respuesta de server al GET_SNAPSHOT: ", data);
                if(data && data.length > 10000) this.snapshotImageData = data;
                this.updatingSnapshot = false;
            });
        },
        updateStatus(){
            this.updatingData = true;
            const that = this;
            var current = { temp: 0, humidity: 0 };

            console.log("Actualizado datos");

            socket.emit('USER_INPUT', { device_id: '0000000054105aca', cmd: 'GET_STATS' }, (response) => {
                console.log("Respuesta de server: ", response);
                if(response && response.status && response.status.temp) {
                    var current = response.status;
                    this.current.temp = response.status.temp;
                    this.current.humidity = response.status.humidity;
                    this.lastUpdate = new Date();
                    this.stats = response.status.stats.map(l => ({
                        temp: l.temp,
                        humidity: l.humidity,
                        fan1: l.fan1,
                        fan2: l.fan2,
                        date: l.date
                    }));
                    this.updatingData = false;
                }
            });
        },
    }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Lobster|Righteous|Raleway:300,300i,400,600,700&display=swap");
@import url("../statics/font/_flaticon.scss");
@import url('../node_modules/vuetify/dist/vuetify.min.css');

$headerHeight: 90px;

@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}

body {
    background-color: #20221d;
    margin: 0;
    padding: 0;
    color: rgba(255, 255, 255, .6);
    font-family: Raleway, Helvetica;
}

.content {
    padding-bottom: 60px;
}

.header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    .v-icon {
        color: rgba(255, 255, 255, .5) !important;
        font-size: 30px;
    }
    .loading {
        .v-icon {
            color: #e2ff6f !important;
            animation-name: spin;
            animation-duration: 2500ms;
            animation-iteration-count: infinite;
            animation-timing-function: ease;
        }
    }
    #logo {
        color: #c5ef8c;
        display: block;
        height: $headerHeight;
        line-height: $headerHeight * .9;
        text-align: center;
        font-size: $headerHeight * .5;
        font-family: Righteous;

        span {
            color: #fff;
        }
    }
    .button {
        color: rgba(255, 255, 255, .4);
        display: block;
        width: $headerHeight *.7;
        font-size: $headerHeight * .3;
        line-height: $headerHeight;
        text-align: center;
    }
}
.indoor-image-preview {
    padding: 3%;
    img {
        width: 100%;
        border-radius: 10px;
    }
}

.fullchart {
    margin-top: 10px;
    display: block;
    // justify-content: space-between;
    // align-items: center;
    position: relative;
    white-space: nowrap;

    &.second {
        margin-top: 50px;
    }

    .data {
        width: 30vw;
        text-align: center;
        position: absolute;
        top: 66px;
        left: 36px;
        .icon {
            font-size: 38px;
            display: block;
            margin-right: 8px;
        }
        .value {
            font-size: 30px;
            display: block;
            font-family: Righteous;
        }
    }

    .main-chart {
        min-height: 120px;
        padding-right: 15px;
        vertical-align: -10px;
        display: inline-block;
        width: 60vw;
        box-sizing: border-box;
        padding: 5px 20px;
    }

    .gauge {
        display: inline-block;
        width: 40vw;
        margin-top: -20px;
        padding: 10px 10px 10px 10px;
    }
}
.last-mesure-time {
    text-align: center;
    margin-top: 60px;
    font-size: 18px;
    font-weight: 300;
    height: 30px;
    line-height: 30px;
    color: rgba(255, 255, 255, .4);

    strong {
        font-weight: 600;
    }
}

</style>
