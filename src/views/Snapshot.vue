<template>
    <div id="snapshot-container">
        <img :src="imageData" alt="">
    </div>
</template>

<script>


export default {
    name: "snapshot",
    components: {

    },
    data: () => ({
        imageData: ''
    }),
};
</script>
<style lang="scss" scoped>
#control-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
</style>