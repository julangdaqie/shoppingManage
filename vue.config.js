const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    outputDir: "dist",
    assetsDir: "static",
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
    devServer: {
        open: false,
        host: "192.168.1.4",
        port: 8009,
        https: false,
        hotOnly: false,
        // proxy: {
        //     '/api': {
        //         target: process.env.VUE_APP_URL,
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    },
    chainWebpack(config) {
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
};