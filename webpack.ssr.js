const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base.js');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const conf = require("./config");
const path = require("path");
const fs = require("fs");
const chokidar = require('chokidar')

let servers = [];
let clients = [];
let files = [];

function doGetEntry(dir, template) {
	try {
		fs.accessSync(dir + "template.html");
		template = dir + "template.html";
	} catch (err) {}
    let fileList = fs.readdirSync(dir, "utf-8");
    for (let i = 0; i < fileList.length; i++) {
        let file = dir + fileList[i];
        let stat = fs.lstatSync(file);
        // 是目录，需要继续
        if (stat.isDirectory()) {
            doGetEntry(file + "/", template);
        }
    }
    if (fs.existsSync(dir+'server.js') && fs.existsSync(dir+'client.js')){
        let entry = dir ;
        entry = entry.replace("./app/views/web-ssr/", "");
        //服务端
        servers.push(webpackMerge(webpackBase, {
            // 将 entry 指向应用程序的 server entry 文件
            entry: dir+'server.js',
            // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
            // 并且还会在编译 Vue 组件时，
            // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
            target: 'node',
            // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
            output: {
                //因为服务器是 Node，所以必须按照 commonjs 规范打包才能被服务器调用。
                libraryTarget: 'commonjs2',
            },
            plugins: [
                new ExtractTextPlugin(entry + "/[name].css"),
                new VueSSRServerPlugin({
                    filename: entry + '/server-bundle.json'
                })
            ]
        }));

        files.push({
            from: template, to: conf.path.public+'/'+entry+'template.html'
        });
                
        //客户端
        clients.push(webpackMerge(webpackBase, {
            entry: dir+'client.js',
            output: {
                filename: entry + '/[name].js'
            },
            plugins: [
                new ExtractTextPlugin(entry + "/[name].css"),
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

doGetEntry("./app/views/web-ssr/", "");

function log(err, stats) {
    if (err === null && stats.compilation.errors.length === 0) {
        console.log(stats.compilation.options.entry+ ' 编译成功');
    } else {
        console.log(stats.compilation.options.entry+' 编译出现错误...');
        console.log(stats.compilation.errors, err);
    }
}

for (let file of files) {
    let readStream = fs.createReadStream(file.from);
    let writeStream = fs.createWriteStream(file.to);
    readStream.pipe(writeStream);
    console.log(file.from+ ' 编译成功');
}
for (let client of clients) {
    webpack(client, log);
}
for (let server of servers) {
    webpack(server, log);
}