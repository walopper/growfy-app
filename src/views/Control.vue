<template>
    <div id="control-container">
        <OnoffButton label="Intractor" color="#cfff20" icon="fan" :isOn="status.intractor" :onClange="onChange" />
        <OnoffButton label="Extractor" color="#cfff20" icon="fan" :isOn="status.extractor" />
        <OnoffButton label="Ventilador" color="#cfff20" icon="fan" :isOn="status.fan" />
        <OnoffButton label="Led 1, 2, 3" color="#ffff44" icon="bulb" :isOn="status.led1" />
        <OnoffButton label="Led 4, 5, 6" color="#ffff44" icon="bulb" :isOn="status.led2" />
        <OnoffButton label="Led 7, 8, 9" color="#ffff44" icon="bulb" :isOn="status.led3" />
        <OnoffButton label="Sodio" color="#ffff44" icon="bulb" :isOn="status.sodio" />
    </div>
</template>

<script>
import moment from "moment";

import OnoffButton from '../components/OnoffButton';

import ActivityIndicator from "mand-mobile/components/activity-indicator";

export default {
    name: "control",
    components: {
        "md-activity-indicator": ActivityIndicator,
        OnoffButton
    },
    data: () => ({
        status: {
            intractor: true,
            extractor: false,
            led1: true,
            led2: true,
            led3: false,
            sodio: true,
            fan: true
        }
    }),
    mounted: function() {

    },
    methods: {
        onChange(value) {
            console.log("change");
            console.log(value);
        }
    }
};
</script>
<style lang="scss" scoped>
#control-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
</style>
<style lang="scss">
.onoff-button--container {
    margin-bottom: 40px;
    margin-top: 30px; 
}
</style>
