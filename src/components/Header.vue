<template>
    <div class="header">
        <div class="button">
            <md-activity-indicator :size="24" :text-size="16" :color="'#ffffff'" v-if="loading"></md-activity-indicator>
        </div>
        <div class="app-name">
            Grow<span>fy</span>
        </div>
        <div class="button" @click="openDrawer()">
            <v-icon>mdi mdi-apps</v-icon>
        </div>
    </div>
</template>

<script>
import ActivityIndicator from "mand-mobile/components/activity-indicator";

export default {
    name: "Header",
    props: ["loading", "openDrawer"],
    components: {
        "md-activity-indicator": ActivityIndicator
    }
};
</script>

<style scoped lang="scss">
$headerHeight: 70px;

.header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    box-shadow: inset 10px 10px 10px rgba(59, 31, 71, 1);
    .v-icon {
        color: rgba(255, 255, 255, 0.5) !important;
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
    .app-name {
        color: #c5ef8c;
        display: block;
        height: $headerHeight;
        line-height: $headerHeight * 0.9;
        text-align: center;
        font-size: $headerHeight * 0.5;
        font-family: Righteous;

        span {
            color: #fff;
        }
    }
    .button {
        color: rgba(255, 255, 255, 0.4);
        display: block;
        width: $headerHeight;
        max-width: 70px;
        font-size: $headerHeight * 0.3;
        line-height: $headerHeight;
        text-align: center;

        .indicator-loading {
            margin: auto;
        }
    }
}

.toolbar {
    display: flex;
    justify-content: center;
}
</style>
