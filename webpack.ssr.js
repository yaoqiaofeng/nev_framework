const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base.js');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const path = require("path");
const fs = require("fs");

let servers = [];
let clients = [];

function doGetEntry(dir, template) {
    let fileList = fs.readdirSync(dir, "utf-8");
    let stat, file, entry, ext;
    for (let i = 0; i < fileList.length; i++) {
        file = dir + fileList[i];
        stat = fs.lstatSync(file);
        ext = path.extname(file);
        // 是目录，需要继续
        if (stat.isDirectory()) {
            doGetEntry(file + "/", template);
        } else if (ext == ".js") {
            if ((fileList[i] == 'ssr-client.js') || (fileList[i] == 'ssr-server.js')) {
                continue;
            }
            //服务端
            if (fileList[i] == 'server.js' ) {
                entry = dir ;
                entry = entry.replace("./app/views/web-ssr/", "");
                servers.push(webpackMerge(webpackBase, {
                    // 将 entry 指向应用程序的 server entry 文件
                    entry: file,
                    // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
                    // 并且还会在编译 Vue 组件时，
                    // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
                    target: 'node',
                    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
                    output: {
                        //因为服务器是 Node，所以必须按照 commonjs 规范打包才能被服务器调用。
                        libraryTarget: 'commonjs2'
                    },
                    plugins: [
                        new ExtractTextPlugin(entry + "/[name].[chunkhash].css"),
                        new VueSSRServerPlugin({
                            filename: entry + '/server-bundle.json'
                        })
                    ]
                }));
            }
            //客户端
            if (fileList[i] == 'client.js') {
                entry = dir;
                entry = entry.replace("./app/views/web-ssr/", "");
                clients.push(webpackMerge(webpackBase, {
                    entry: file,
                    output: {
                        filename: entry + '/[name].js'
                    },
                    plugins: [
                        new ExtractTextPlugin(entry + "/[name].[chunkhash].css"),
                        // 将依赖模块提取到 vendor chunk 以获得更好的缓存，是很常见的做法。
                        new webpack.optimize.CommonsChunkPlugin({
                            name: 'vendor',
                            minChunks: function (module) {
                                // 一个模块被提取到 vendor chunk 时……
                                return (
                                    // 如果它在 node_modules 中
                                    /node_modules/.test(module.context) &&
                                        // 如果 request 是一个 CSS 文件，则无需外置化提取
                                        !/\.css$/.test(module.request)
                                );
                            }
                        }),
                        new webpack.optimize.CommonsChunkPlugin({
                            name: "manifest",
                            minChunks: Infinity
                        }),
                        new VueSSRClientPlugin({
                            filename: entry + '/client-manifest.json'
                        })
                    ]
                }));
            }
        }
    }
}
doGetEntry("./app/views/web-ssr/");

function log(err, stats) {
    if (err === null && stats.compilation.errors.length === 0) {
        console.log(stats.compilation.options.entry+ ' 编译成功');
    } else {
        console.log(stats.compilation.options.entry+' 编译出现错误...');
        console.log(stats.compilation.errors, err);
    }
}
for (let client of clients) {
    webpack(client, log);
}
for (let server of servers) {
    webpack(server, log);
}