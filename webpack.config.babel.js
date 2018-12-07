// here just for tests to find

import path from 'path';

export default {
    resolve: {
        extensions: ['.js'],
        alias: {
            libs: path.join(__dirname, 'src')
        }
    }
};
