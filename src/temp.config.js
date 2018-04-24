const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const webpack = require('webpack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const path = require('path');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const env = process.env.NODE_ENV || 'dev';

// console.log('"' + env + '"', typeof env, env === 'dev');
const config = {
    entry: {
        ec_cs: [path.resolve(__dirname, './client/index.js')],
        ec_cs_session: [path.resolve(__dirname, './client/session.js')],
        ec_cs_list: [path.resolve(__dirname, './client/cslist.js')],
        // polyfill: [path.resolve(__dirname, './client/polyfill.js')],
    },
    output: {
        path: path.resolve(__dirname, '../dist/public/cs/sdk'),
        chunkFilename: 'js/[name].[hash:5].js',
        filename: 'js/[name].js',
        publicPath: env === 'dev' ? '/' : 'https://1.staticec.com/kf/sdk/'
    },
    plugins: [
        new webpack.DefinePlugin({
            __PRODUCTION__: true
        }),
        // new ExtractTextPlugin('css/[name].[hash:5].css'),
        new webpack.DefinePlugin({
            /*eslint-disable*/
            'process.env': {
                'NODE_ENV': '"' + env + '"'
            }
            /*eslint-enable*/
        }),
        new HtmlWebpackPlugin({
            chunks: ['ec_cs'],
            template: path.resolve(__dirname, 'server', 'index.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            chunks: ['ec_cs_session'],
            template: path.resolve(__dirname, 'server', 'openwin.html'),
            filename: 'openwin.html',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            chunks: ['ec_cs_list'],
            template: path.resolve(__dirname, 'server', 'cslist.html'),
            filename: 'cslist.html',
            inject: 'body'
        })
    ],
    resolve: {
        root: [
            path.resolve(__dirname, './client')
        ],
        extensions: ['', '.js', '.jsx'],
        alias: {
            '~static': path.resolve(__dirname, '../../comm/public'),
            '~cscommon': path.resolve(__dirname, '../common'),
            '~sdkreact': path.resolve(__dirname, './client/react'),
            'react': path.resolve(__dirname, './node_modules/react')
        }
    },
    module: {
        loaders: [{
            test: /\.less?$/,
            loaders: ['style', 'css', 'postcss', 'less'],
        }, {
            test: /\.css$/,
            loaders: ['style', 'css', 'postcss'],
        }, {
            test: /\.jsx?$/,
            loader: 'es3ify-loader!jsx-loader',
            exclude: /node_modules/,
            include: path.resolve(__dirname, '../')
        }, {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file-loader?name=fonts/[hash].[ext]',
        }, {
            test: /\.(jpg|png|gif)$/,
            loaders: ['url-loader?limit=8192&name=image/[name].[ext]'],
            exclude: /node_modules/
        }, {
            test: /\.html/,
            loader: 'html',
            query: {
                minimize: false,
            },
        }]
    }
};

if (env === 'dev') {
    // const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
    // Object.keys(config.entry).forEach((key) => {
    //     config.entry[key].push(hotMiddlewareScript);
    // });
    config.devtool = '#source-map';
    // config.plugins.push(
    //     new webpack.HotModuleReplacementPlugin(),
    //     new webpack.NoErrorsPlugin()
    // );
} else {
    config.module.loaders.push({
        test: /\.html/,
        loader: StringReplacePlugin.replace({
            replacements: [{
                pattern: /<!-- report -->/ig,
                replacement(match, p1, offset, string) {
                    return '<!--#include file="/common/report.html"-->';
                }
            }]
        })

    }, {
        test: /\.html/,
        loader: StringReplacePlugin.replace({
            replacements: [{
                pattern: /<!-- pvapi -->/ig,
                replacement(match, p1, offset, string) {
                    return '<!--#include file="/common/pvapi.html"-->';
                }
            }]
        })

    });
    config.plugins.push(
        // 添加上报脚本
        // new HtmlWebpackIncludeAssetsPlugin({
        //     assets: ['//www.staticec.com/api/scripts/nreport.js'],
        //     append: true,
        //     publicPath: false
        // }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new ParallelUglifyPlugin({
            uglifyJS: {
                sourceMap: false,
                compress: {
                    unused: true,
                    dead_code: true,
                    warnings: false,
                    drop_console: true,
                    drop_debugger: true,
                    screw_ie8: false
                },
                mangle: {
                    screw_ie8: false
                },
                output: {
                    screw_ie8: false
                }
            },
        }),
        new StringReplacePlugin(),
        new ScriptExtHtmlWebpackPlugin({
            custom: {
                test: /.*/,
                attribute: 'crossorigin'
            }
        })
    );
}

module.exports = config;
