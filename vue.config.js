module.exports = {
    productionSourceMap: false,
    css: {
        sourceMap: false
    },
    configureWebpack: {
        resolve: {
            alias: {

            }
        },
    },
    pwa: {
        themeColor: '#3b1f47',
        name: 'growfy-app',
    }
};