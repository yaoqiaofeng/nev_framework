const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base.js');
const webpackNodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs");
const conf = require("./config");

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
            //服务端
            if (fileList[i].match(/-server\.js$/)){
                entry = dir + path.basename(fileList[i], ext);
                entry = entry.replace("./app/views/web-ssr/", "");
                entry = entry.replace(/-server$/, "");
                servers.push(webpackMerge(webpackBase,  {
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
                        new VueSSRServerPlugin({
                            filename: entry+'/server-bundle.json'
                        })
                    ]
                }));
            }
            //客户端
            if (!(fileList[i].match(/-server\.js$/))){
                entry = dir + path.basename(fileList[i], ext);
                entry = entry.replace("./app/views/web-ssr/", "");
                clients.push(webpackMerge(webpackBase,  {
                    target: 'node',
                    entry: file,
                    output: {
                        filename: entry+'/[name].js',
                    },
                    plugins: [
                        new webpack.optimize.CommonsChunkPlugin({
                            name: "manifest",
                            minChunks: Infinity
                        }),
                        new VueSSRClientPlugin({                            
                            filename: entry+'/client-manifest.json'
                        })
                    ]
                }));
            }
		}
	}
}
doGetEntry("./app/views/web-ssr/");
for(let server of servers){
    webpack(server, ()=>{});
}
for(let client of clients){
    webpack(client, ()=>{});
}
