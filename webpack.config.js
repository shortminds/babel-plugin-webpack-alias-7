// here just for tests to find

var path = require('path');

module.exports = {
    module: {},
    resolve: {
        extensions: ['.js'],
        alias: {
            'libs': path.join(__dirname, 'src')
        }
    }
};
