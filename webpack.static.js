const webpack = require("webpack");
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const fs = require("fs");
const conf = require("./config");

let entrys = {};
let plugins = [
    //把js和css注入到html文件里
    new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([{ from: "./app/views/lib", to: "lib" }]),
    new CopyWebpackPlugin([{ from: "./app/views/images", to: "images" }])
];

function doGetEntry(dir, template) {
	try {
		fs.accessSync(dir + "Template.html");
		template = dir + "Template.html";
	} catch (err) {}
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
            entry = dir + path.basename(fileList[i], ext);
            entry = entry.replace("./app/views/web/", "");
			entrys[entry] = file;
			let plugin = {
				inject: true,
				filename: name + ".html",
				chunks: [entry],
				title: conf.name,
                template: template,
                inlineSource: '.(js|css)$'
			};
			plugins.push(new HtmlWebpackPlugin(plugin));
		}
	}
}

doGetEntry("./app/views/web/", "");

module.exports = webpackMerge(webpackBase, {
	entry: entrys,
	plugins: plugins
});