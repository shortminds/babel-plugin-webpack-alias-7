const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@libs': path.join(__dirname, 'app/js/myLibs')
        }
    }
};
