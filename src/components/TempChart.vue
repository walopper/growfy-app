<template>

</template>

<script>
export default {
    name: 'TempChart',
    data() {
        return {
            type: "column2d",
            renderAt: "chart-container",
            width: "100%",
            height: "350",
            dataFormat: "json",
            datasource: {
                chart: {
                    caption: "Temperatura",
                    theme: "fusion",

                    bgAlpha: "100"
                },
                data: [{
                    label: "Mon",
                    value: "15123"
                    }, 
                    {
                    label: "Tue",
                    value: "14233"
                    }, 
                    {
                    label: "Wed",
                    value: "25507"
                    }
                ]
            }
        }
    },

}
</script>

<style scoped lang="scss">
</style>
