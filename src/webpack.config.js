// todo :: webpack react htmlreplacementplugin
const webpack = require('webpack');
const chalk = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

let buildRunning = false;
let startTime = 0;

const penv = process.env.NODE_ENV || 'development';
const env = {
    __DEV__: penv === 'development',
    __PROD__: penv === 'production',
    __TEST__: penv === 'test'
};
const APP_ENTRY = path.resolve(__dirname, './index.js');

const config = {
    mode: env.__DEV__ ? 'development' : 'production',
    entry: {
        index: env.__DEV__ ? ['webpack-dev-server/client?http://127.0.0.1/', 'webpack/hot/only-dev-server', 'babel-polyfill', APP_ENTRY] : ['babel-polyfill', APP_ENTRY]
    },
    output: {   
        path: path.resolve(__dirname, '../static'),
        filename: 'js/[name].[hash:5].js',
        publicPath: env.__DEV__ ? '/' : 'http://69.171.79.155/static/'
    },
    plugins: [
        new webpack.DefinePlugin(env),
        new webpack.DefinePlugin({
            /*eslint-disable*/
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }
            /*eslint-enable*/
        }),
        new webpack.ProgressPlugin((percentage, msg) => {
            const stream = process.stderr;

            if (!buildRunning) {
                buildRunning = true;
                startTime = new Date();
            } else if (stream.isTTY && percentage < 0.71) {
                stream.cursorTo(0);
                stream.write(`📦  ${chalk.magenta(msg)}`);
                stream.clearLine(1);
            } else if (percentage === 1) {
                const now = new Date();
                const buildTime = `${(now - startTime) / 1000}s`;
                console.log(chalk.green(`\nwebpack: bundle build completed in ${buildTime}.`));

                buildRunning = false;
            }
        })
    ],
    resolve: {
        // root: [
        //     path.resolve(__dirname, './')
        // ],
        // modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['.js', '.jsx'],
        alias: {
            views: path.resolve(__dirname, './views'),
            modules: path.resolve(__dirname, './modules')
        }
    },
    module: {
        rules: [
            {
                test: /\.less?$/,
                use: [
                    {loader: 'style-loader'}, 
                    {loader: 'css-loader'}, 
                    {loader: 'postcss-loader'},
                    {loader: 'less-loader'}
                ]
            }, {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'}
                ]
            }, {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react', 'stage-0'],
                            plugins: ["transform-decorators-legacy"]
                        }
                    }
                ],
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../')
            }, {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[hash].[ext]'
                        }
                    }
                ]
            }, {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'image/[name].[ext]'
                        }
                    }
                ],
                exclude: /node_modules/
            }, {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: false,
                        }
                    }
                ]
            }
        ]
    }
};

if (env.__DEV__) {
    config.devtool = '#eval';
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
        }),
    );
} else {
    config.plugins.push(
        new ParallelUglifyPlugin({
            uglifyJS: {
                sourceMap: false,
                compress: {
                    unused: true,
                    dead_code: true,
                    warnings: false,
                    drop_console: true,
                    drop_debugger: true,
                    ie8: false
                },
                mangle: {
                    ie8: false
                },
                output: {
                    ie8: false
                }
            },
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                discardComents: {
                    removeAll: true,
                },
                autoprefixer: false,
                zindex: false,
            },
        })
    );

    config.module.rules.filter(loader =>
        loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
    ).forEach((loader) => {
        const first = loader.loaders[0];
        const rest = loader.loaders.slice(1);
        /* eslint-disable no-param-reassign */
        loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
        delete loader.loaders;
        /* eslint-enable no-param-reassign */
    });
    config.plugins.push(
        new ExtractTextPlugin('css/[name].[contenthash].css', {
            allChunks: true,
        })
    );
};

module.exports = config;