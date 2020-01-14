require('@babel/register'); // Just to make sure @babe/register doesn't muck things up
const babel = require('@babel/core');
const aliasPlugin = require('../');

const simpleTransform = `
    const something = require('libs/index.js');
`;

// Config options and error tests

it('Should fallback to default configs it custom config not found', () => {
    const { code } = babel.transform(
        simpleTransform,
        {
            plugins: [
                [aliasPlugin, { config: 'src/__tests__/__configs__/doesNotExist.js' }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});

it('Should transform when webpack config has a dependency', () => {
    const configWithDependency = `
        const one = require('libs/index.js');
        const two = require('moreLibs/index.js');
    `;
    const { code } = babel.transform(
        configWithDependency,
        {
            plugins: [
                [aliasPlugin, { config: 'src/__tests__/__configs__/configWithDependency.js' }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});

it('Should handle webpack config using multi-compiler', () => {
    const multiCompiler = `
        const one = require('mobileLibs/index.js');
        const two = require('desktopLibs/index.js');
    `;
    const { code } = babel.transform(
        multiCompiler,
        {
            plugins: [
                [aliasPlugin, { config: 'src/__tests__/__configs__/multiCompiler.js' }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});

it('Should throw an error if webpack config does not contain a resolve object', () => {
    try {
        babel.transform(
            simpleTransform,
            {
                plugins: [
                    [aliasPlugin, { config: 'src/__tests__/__configs__/noResolve.js' }]
                ]
            }
        );
    } catch (error) {
        expect(error.message)
            .toEqual('The webpack config file does not contain an alias configuration');
    }
});

it('Should throw an error if webpack config does not contain an alias object', () => {
    try {
        babel.transform(
            simpleTransform,
            {
                plugins: [
                    [aliasPlugin, { config: 'src/__tests__/__configs__/noAlias.js' }]
                ]
            }
        );
    } catch (error) {
        expect(error.message)
            .toEqual('The webpack config file does not contain an alias configuration');
    }
});

it('Should resolve lodash templated config paths', () => {
    process.env.TESTS = '__tests__';
    const { code } = babel.transform(
        simpleTransform,
        {
            plugins: [
                // eslint-disable-next-line no-template-curly-in-string
                [aliasPlugin, { config: 'src/${TESTS}/__configs__/configWithDependency.js' }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});

// Visitor edge cases

it('Should not transform non require statements', () => {
    const noRequireHere = `
        var a = 'a';
        function callMe(a) {}
        callMe(a);
    `;
    const { code } = babel.transform(
        noRequireHere,
        {
            plugins: [aliasPlugin]
        }
    );
    expect(code).toMatchSnapshot();
});

it('Should not transform if not requireing a string literal', () => {
    const noStringLiteral = `
        const number = 1;
        const something = require(number);
    `;
    const { code } = babel.transform(
        noStringLiteral,
        {
            plugins: [aliasPlugin]
        }
    );
    expect(code).toMatchSnapshot();
});

it('Should return string literal destination when alias is a module', () => {
    const module = `
        const something = require('libs/module');
    `;
    const { code } = babel.transform(
        module,
        {
            plugins: [
                [aliasPlugin, { config: 'src/__tests__/__configs__/module.js' }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});

it('Should make non absolute aliases absolute', () => {
    const notAbsolute = `
        const something = require('libs/nonAbsolute');
    `;
    const { code } = babel.transform(
        notAbsolute,
        {
            plugins: [
                [aliasPlugin, { config: 'src/__tests__/__configs__/nonAbsolute.js' }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});

it('Should convert root aliases (relative to the config) properly', () => {
    const root = `
        const something = require('libs');
    `;
    const { code } = babel.transform(
        root,
        {
            plugins: [
                [aliasPlugin, { config: 'src/__tests__/__configs__/root.js' }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});

// Visitor tests

it('Should perform a simple transform', () => {
    const { code } = babel.transform(
        simpleTransform,
        {
            plugins: [
                [aliasPlugin, { /* no config options */ }]
            ]
        }
    );
    expect(code).toMatchSnapshot();
});
