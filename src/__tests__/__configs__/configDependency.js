const path = require('path');

module.exports = () => ({
    resolve: {
        alias: {
            moreLibs: path.join(__dirname, 'moreSrc')
        }
    }
});
