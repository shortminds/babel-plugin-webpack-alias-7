"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _core = require("@babel/core");

var _path = require("path");

var _fs = _interopRequireDefault(require("fs"));

var _lodash = _interopRequireDefault(require("lodash.isempty"));

var _lodash2 = _interopRequireDefault(require("lodash.template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const PLUGIN_KEY = 'webpack alias';
const REQUIRE = 'require';
const DEFAULT_CONFIG_NAMES = ['webpack.config.js', 'webpack.config.babel.js'];
let configPath;
let webpackConfig;
let aliasConfig = {};
let aliases;

const fileExists = path => {
  try {
    return !_fs.default.accessSync(path, _fs.default.F_OK);
  } catch (e) {
    return false;
  }
};

const getConfigPath = configPaths => {
  let conf = null; // Try all config paths and return for the first found one

  configPaths.some(configPath => {
    const pathRenderer = (0, _lodash2.default)(configPath);
    const resolvedConfigPath = (0, _path.resolve)(process.cwd(), pathRenderer(process.env));

    if (resolvedConfigPath && fileExists(resolvedConfigPath)) {
      conf = resolvedConfigPath;
    }

    return conf;
  });
  return conf;
};

var _default = (0, _helperPluginUtils.declare)(api => {
  api.assertVersion(7);
  return {
    name: 'webpack alias',

    pre(state) {
      const plugins = state.opts.plugins;
      const plugin = plugins.find(plugin => plugin.key === PLUGIN_KEY);
      const config = plugin.options.config;
      const configPaths = config ? [config].concat(DEFAULT_CONFIG_NAMES) : DEFAULT_CONFIG_NAMES; // Get webpack config

      configPath = getConfigPath(configPaths); // If the config comes back as null, we didn't find it, so throw an exception.

      if (!configPath) {
        throw new Error(`Cannot find any of these configuration files: ${configPaths.join(', ')}`);
      } // Require the config


      webpackConfig = require(configPath);

      if (Array.isArray(webpackConfig)) {
        // Uses webpacks multi-compiler option
        aliasConfig = webpackConfig.reduce((previous, current) => {
          const next = Object.assign({}, previous);

          if (current.resolve && current.resolve.alias) {
            Object.assign(next, current.resolve.alias);
          }

          return next;
        }, {});
      } else if (!(0, _lodash.default)(webpackConfig.resolve)) {
        aliasConfig = webpackConfig.resolve.alias;
      } // Exit if there's no alias config


      if ((0, _lodash.default)(aliasConfig)) {
        throw new Error(`The webpack config file at — ${configPath} — does not contain an alias configuration`);
      }

      aliases = Object.keys(aliasConfig);
    },

    visitor: {
      CallExpression(path, state) {
        const nodeArguments = path.node.arguments;
        const _state$filename = state.filename,
              filename = _state$filename === void 0 ? '' : _state$filename; // Prevent @babel/register from running babel to run on the webpack config

        if (filename === (0, _path.resolve)(configPath)) {
          return;
        } // If not a require statement do nothing


        if (!_core.types.isIdentifier(path.node.callee, {
          name: REQUIRE
        })) {
          return;
        } // Make sure required value is a string


        if (nodeArguments.length === 0 || !_core.types.isStringLiteral(nodeArguments[0])) {
          return;
        } // Get the path of the StringLiteral


        const _nodeArguments = _slicedToArray(nodeArguments, 1),
              filePath = _nodeArguments[0].value;

        for (const alias of aliases) {
          let aliasDestination = aliasConfig[alias];
          const regex = new RegExp(`^${alias}(\/|$)`);

          if (regex.test(filePath)) {
            // notModuleRegExp from https://github.com/webpack/enhanced-resolve/blob/master/lib/Resolver.js
            const notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
            const isModule = !notModuleRegExp.test(aliasDestination);

            if (isModule) {
              path.node.arguments = [_core.types.StringLiteral(aliasDestination)];
              return;
            } // If the filepath is not absolute, make it absolute


            if (!(0, _path.isAbsolute)(aliasDestination)) {
              aliasDestination = (0, _path.join)(process.cwd(), aliasDestination);
            }

            let relativeFilePath = (0, _path.relative)((0, _path.dirname)(filename), aliasDestination); // In case the file path is the root of the alias, need to put a dot to avoid having an absolute path

            if (relativeFilePath.length === 0) {
              relativeFilePath = '.';
            }

            let requiredFilePath = filePath.replace(alias, relativeFilePath); // If the file is requiring the current directory which is the alias, add an extra slash

            if (requiredFilePath === '.') {
              requiredFilePath = './';
            } // In the case of a file requiring a child directory of the current directory, we need to add a dot slash


            if (['.', '/'].indexOf(requiredFilePath[0]) === -1) {
              requiredFilePath = `./${requiredFilePath}`;
            } // TODO: should honor enforceExtension and then use extensionConf to make sure extension


            path.node.arguments = [_core.types.StringLiteral(requiredFilePath)];
            return;
          }
        }
      }

    }
  };
});

exports.default = _default;