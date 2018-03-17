const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs");
const conf = require("./config");

let entrys = {};
let plugin = [];

function doGetEntry(dir, template) {
	try {
		fs.accessSync(dir + "Template.html");
		template = dir + "Template.html";
	} catch (err) {}
	let fileList = fs.readdirSync(dir, "utf-8");
	let stat, name, ext;
	for (let i = 0; i < fileList.length; i++) {
		name = dir + fileList[i];
		stat = fs.lstatSync(name);
		ext = path.extname(name);
		name = dir + path.basename(fileList[i], ext);
		name = name.replace("./app/views/web/", "");
		// 是目录，需要继续
		if (stat.isDirectory()) {
			doGetEntry(dir + fileList[i] + "/", template);
		} else if (ext == ".js" && fileList[i] != "base.js") {
			entrys[name] = dir + fileList[i];
			let pluginConfig = {
				inject: true,
				filename: name + ".html",
				chunks: [name],
				title: conf.name,
				template: template
			};
			plugin.push(new HtmlWebpackPlugin(pluginConfig));
		}
	}
}

doGetEntry("./app/views/web/", "");

let config = {
	entry: entrys,
	output: {
		//设置打包后的js的输出位置
		path: path.resolve(process.cwd(), conf.path.public),
		//浏览器会从这个目录开始查找模块
		publicPath: "/",
		//和入口文件的名字相同
		filename: "[name].js"
	},
	resolve: {},
	plugins: plugin.concat([
		//把css输出作为一个单独的文件
		new ExtractTextPlugin("[name].css"),
		new CopyWebpackPlugin([{ from: "./app/views/lib", to: "lib" }]),
		new CopyWebpackPlugin([{ from: "./app/views/images", to: "images" }])
	]),
	module: {
		//加载器，关于各个   加载器的参数配置，可自行搜索之。
		rules: [
			{
				//配置css的抽取器、加载器。
				//由于使用了 postCss插件，需要用!postcss-loader优先调用
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader"]
				})
			},
			{
				test: /\.js$/,
				use: "babel-loader",
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader", "sass-loader"]
				})
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader", "less-loader"]
				})
			},
			{
				//图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
				//如下配置，将小于8192byte的图片转成base64码
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 8192
						}
					}
				]
			},
			{
				test: /\.(svg|ttf|eot|woff|woff2)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "./fonts/[hash].[ext]"
						}
					}
				]
			},
			{
				test: /\.vue$/,
				use: {
					loader: "vue-loader",
					options: {
						loaders: {
							js: "babel-loader",
							css: ExtractTextPlugin.extract({
								use: ["css-loader", "postcss-loader"],
								fallback: "vue-style-loader"
							}),
							less: ExtractTextPlugin.extract({
								use: [
									"css-loader",
									"postcss-loader",
									"less-loader"
								],
								fallback: "vue-style-loader"
							}),
							scss: ExtractTextPlugin.extract({
								use: [
									"css-loader",
									"postcss-loader",
									"sass-loader"
								],
								fallback: "vue-style-loader"
							}),
							sass: ExtractTextPlugin.extract({
								use: [
									"css-loader",
									"postcss-loader",
									"sass-loader"
								],
								fallback: "vue-style-loader"
							})
						}
					}
				}
			}
		]
	}
};

if (process.argv[2]=='-w'){
    config.devtool = "inline-source-map";
} else {
    config.plugins.push(
		//webpack自带的js压缩插件
		new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: true  // remove all comments
            },
            compress: {
                warnings: true,
                drop_debugger: true,
                drop_console: true
            }
        })
    );
}
module.exports = config;