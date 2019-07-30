<template>
    <div class="onoff-button--container">
        <div class="label">
            {{label}}
        </div>
        <div :class="rotateClass(icon, isOn)">
            <span :class="'fi flaticon-'+icon" :style="{color: isOn ? color : 'rgba(255, 255, 255, .3)'}"></span>
        </div>
        <div class="switch">
            <toggle-button :value="isOn"
               :labels="{checked: 'On', unchecked: 'Off'}"
               :disalbed="disabled"
            />
        </div>
    </div>
</template>
<script>
export default {
    name: 'onoff-button',
    props: [
        'isOn',
        'color',
        'label',
        'icon',
        'disabled',
    ],
    methods: {
        rotateClass(icon, isOn) {
            if(icon === 'fan' && isOn) return 'icon girando';
            else return 'icon';
        }
    }
}
</script>
<style lang="scss" scoped>
$size: 130px;

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.onoff-button--container {
    box-sizing: border-box;
    display: flex;
    width: $size * .9;
    height: $size;
    color: rgba(255, 255, 255, .75);
    align-items: center;
    align-content: space-between;
    justify-content: space-between;
    flex-direction: column;

    .label {
        font-size: 16px;
        font-family: nunito;
        padding-top: 5px;
        margin-bottom: -5px;
    }

    .icon {
        &.girando {
            animation-name: spin;
            animation-duration: 10s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
        .fi:before {
            font-size: 48px;
            margin-left: 0px;
        }
    }
}
</style>


