module.exports = {
  configureWebpack: {
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true
  },
  runtimeCompiler: true,
  devServer: {
    proxy: 'http://localhost:5000',
  }
}
