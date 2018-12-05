module.exports = [{
    name: 'mobile',
    module: {},
    resolve: {
        extensions: ['.js'],
        alias: {
            'mobileLibs': 'mobile'
        }
    }
}, {
    name: 'desktop',
    module: {},
    resolve: {
        extensions: ['.js'],
        alias: {
            'desktopLibs': 'desktop'
        }
    }
}, {
    name: 'noAliasDevice',
    module: {},
    resolve: {}
}];
