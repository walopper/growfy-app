<template>
    <div id="snapshot-container">
        <div class="image-container">
            <img 
                v-if="snapshotImageData" 
                v-gallery 
                :src="snapshotImageData" />
        </div>
    </div>
</template>

<script>
import socket from '../services/sio.service';

export default {
    name: "snapshot",
    components: {

    },
    data: () => ({
        snapshotImageData: ''
    }),
    mounted: function(){
        this.getSnapshot();
    },
    methods: {
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
                    console.log("--> Got Snapshot", this.snapshotImageData);
                }
            );
        },
    }
};
</script>
<style lang="scss" scoped>
#control-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}

$w : 100px;
$h : 100px;
.image-container {
    text-align: center;
    width: 90vw;
    margin: 30px auto 0 auto;

    img {
        width: 90vw;
        height: auto;
        border-radius: 4px;
        transform: rotate(180deg);
    }
}
</style>