module.exports = function override(config, env) {
    config.optimization.minimizer[0].options.terserOptions.mangle.reserved = ['NetworkError']
    //console.log(JSON.stringify(config, null, 2));
    return config;
}
