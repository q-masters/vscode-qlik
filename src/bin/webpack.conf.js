//@ts-check
'use strict';

const path = require('path');
const TsConfigPathsPlugin =  require('tsconfig-paths-webpack-plugin');

const config = {
    target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    entry: {
        "extension": './projects/extension/main.ts'
    },
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]',
        chunkFilename: "[name].chunk.js"
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },
    resolve: {
        // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js'],
        // @ts-ignore
        plugins: [new TsConfigPathsPlugin({
            configFile: path.resolve(process.cwd(), "./tsconfig.json")
        })]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(process.cwd(), "./tsconfig.json")
                        }
                    }
                ]
            }
        ]
    }
};
module.exports = config;
