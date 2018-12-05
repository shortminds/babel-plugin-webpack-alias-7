const moreConfig = require('./configDependency.js')();
const path = require('path');
const merge = require('webpack-merge');

const config = {
    module: {},
    resolve: {
        extensions: ['.js'],
        alias: {
            'libs': path.join(__dirname, 'src')
        }
    }
};


module.exports = merge(config, moreConfig);
