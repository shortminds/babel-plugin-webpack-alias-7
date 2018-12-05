// used for tests

import path from 'path';

export default {
    resolve: {
        extensions: ['.js'],
        alias: {
            'libs': path.join(__dirname, 'src')
        }
    }
};
