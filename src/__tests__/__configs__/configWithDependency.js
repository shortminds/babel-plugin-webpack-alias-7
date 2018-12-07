const path = require('path');
const merge = require('webpack-merge');
const moreConfig = require('./configDependency.js')();

const config = {
    module: {},
    resolve: {
        extensions: ['.js'],
        alias: {
            libs: path.join(__dirname, 'src')
        }
    }
};


module.exports = merge(config, moreConfig);
