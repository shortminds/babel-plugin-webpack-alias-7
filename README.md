> ## 🛠 Status: In Development
> This plugin is currently in development and not even available on npm.


# babel-plugin-webpack-alias-7

> This Babel 7 plugin allows you to use webpack resolve aliases from webpack configs in Babel. Many thanks to the [Babel 6 version](https://github.com/trayio/babel-plugin-webpack-alias) that this plugin borrows a lot from.

[![Build Status](https://travis-ci.com/shortminds/babel-plugin-webpack-alias.svg?branch=master)](https://travis-ci.com/shortminds/babel-plugin-webpack-alias)
[![Coverage Status](https://coveralls.io/repos/github/shortminds/babel-plugin-webpack-alias/badge.svg?branch=master)](https://coveralls.io/github/shortminds/babel-plugin-webpack-alias?branch=master)

This plugin is simply going to take the aliases defined in your webpack config and replace require paths. It is especially useful when you rely on webpack aliases to keep require paths nicer (and sometimes more consistent depending on your project configuration) but you can't use webpack in a context, for example for unit testing.

## Example

`webpack.config.js`
```js
var path = require('path');
...

module.exports = {
    ...
    resolve: {
        ...
        alias: {
            '@libs': path.join(__dirname, '/myLibs/')
        }
    }
    ...
};

```
Code:
```js
    const myLib = require('@libs/myLib');
```
Transpiles to:
```js
    const myLib = require('/myLibs/myLib');
```

## Installation
```console
    # nothing yet
```

Add the plugin to your `.babelrc`.  Optionally, add a path to a webpack config file, otherwise the plugin will look for `webpack.config.js` or `webpack.config.babel.js` in the root where the build was run.  Setting the config option will transform all alias destinations to be relative to the custom config.

```json
    {
        "plugins": [
            "@babel/plugin-transform-strict-mode",
            "@babel/plugin-transform-parameters",
            "@babel/plugin-transform-destructuring",
            "@babel/plugin-transform-modules-commonjs",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-transform-spread",
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-export-namespace-from"
        ],
        "env": {
            "test": {
                "plugins": [
                    [ "babel-plugin-webpack-alias-7", { "config": "./configs/webpack.config.test.js" } ]
                ]
            }
        }
    }
```
In this case, the plugin will only be run when `NODE_ENV` is set to `test`.

## Changes from the Babel 6 version

- `config` option no longer uses lodash templates
- `findConfig` option has been removed
- `noOutputExtension` option has been removed

Change my mind on their usefulness or better yet open a PR to re-add them!
