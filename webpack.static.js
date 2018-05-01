const webpack = require("webpack");
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base.js');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const fs = require("fs");
const conf = require("./config");

let entrys = {
};
let plugins = [
    //把js和css注入到html文件里
   // new HtmlWebpackInlineSourcePlugin(),
    new ExtractTextPlugin("[name].css"),
 //   new CopyWebpackPlugin([{ from: "./app/views/lib", to: "lib", ignore: ['base.css', 'base.js']}]),
//    new CopyWebpackPlugin([{ from: "./app/views/images", to: "images" }])
];

//编译公用链接库
function doGetCommon(dir) {
	let fileList = fs.readdirSync(dir, "utf-8");
	let stat, file, entry, ext;
	for (let i = 0; i < fileList.length; i++) {
		file = dir + fileList[i];
		stat = fs.lstatSync(file);
		ext = path.extname(file);
		// 是目录，需要继续
		if (stat.isDirectory()) {
			doGetCommon(file + "/");
		} else if (ext==".js"){
             entry = dir + path.basename(fileList[i], ext) ;
            entry = entry.replace("./app/views/common/", "");
			entrys[entry] = file;
		}
	}
}
doGetCommon("./app/views/common/lib/");

//编译静态页面
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
            entry = dir + path.basename (fileList[i], ext);
            entry = entry.replace("./app/views/web/", "");
			entrys[entry] = file;
			let plugin = {
				inject: true,
                filename: entry + ".html",
				chunks: [entry],
				title: conf.name,
                template: template,                
                inlineSource: '.(js|css)$',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true
                },
			};
			plugins.push(new HtmlWebpackPlugin(plugin));
		}
	}
}

doGetEntry("./app/views/web/", "");

let webpackConfig = webpackMerge(webpackBase, {
	entry: entrys,
	plugins: plugins
});

function log(err, stats) {
    if (err === null && stats.compilation.errors.length === 0) {
        console.log(stats.compilation.options.entry + ' 编译成功');
    } else {
        console.log(stats.compilation.options.entry + ' 编译出现错误...');
        console.log(stats.compilation.errors, err);
    }
}

webpack(webpackConfig, log);