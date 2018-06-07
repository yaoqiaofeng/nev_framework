const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const conf = require("./config");
const path = require("path");

let config = {
	output: {
		//设置打包后的js的输出位置
		path: path.resolve(process.cwd(), conf.path.public),
		//浏览器会从这个目录开始查找模块
		publicPath: "/",
		//和入口文件的名字相同
		filename: "[name].js"
    },
	resolve: {
	    alias: {
	        plugin: path.resolve(__dirname, 'app/views/plugin'),
            lib: path.resolve(__dirname, 'app/views/lib'),
            js: path.resolve(__dirname, 'app/views/common/lib'),
	        style: path.resolve(__dirname, 'app/views/common/style')
	    }
	},
    plugins: [],
	module: {
		//加载器，关于各个   加载器的参数配置，可自行搜索之。
		rules: [{
            //配置css的抽取器、加载器。
            //由于使用了 postCss插件，需要用!postcss-loader优先调用
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader"]
            })
        },{
            test: /\.js$/,
            use: "babel-loader",
            exclude: /node_modules/
        },{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader", "sass-loader"]
            })
        },{
            test: /\.sass$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader", "sass-loader"]
            })
        },{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader", "less-loader"]
            })
        },{
            //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            //如下配置，将小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: "url-loader",
                    options: {
                        name: "./images/[hash].[ext]",
                        limit: 8192
                    }
                }
            ]
        },{
            test: /\.(svg|ttf|eot|woff|woff2)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "./fonts/[hash].[ext]"
                    }
                }
            ]
		}, {
		    test: /\.vue$/,
		    loader: "vue-loader",
		    options: {
                loaders: {
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
		}]
    },
    watch: true,
    devtool: '#eval-source-map'
};

if (process.env.NODE_ENV=== 'production'){
    config.watch= false,
    config.devtool = "#source-map";   
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