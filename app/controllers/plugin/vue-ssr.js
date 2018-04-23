const path = require("path");
const fs = require("fs");
const config = require("config");
const LRU = require('lru-cache');

//服务器渲染
const { createBundleRenderer } = require('vue-server-renderer');
const createRenderer = (bundle, options) => createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
  /*  cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
    }),*/
    // recommended for performance
    runInNewContext: false
}));

let rendererMap = {};

function getRenderer(dir, template){
	try {
		fs.accessSync(path.resolve(dir + "template.html"));
		template = fs.readFileSync(path.resolve(dir + "template.html"), 'utf8');
	} catch (err) {}
	let fileList = fs.readdirSync(dir, "utf-8");
	for (let filename of fileList) {
		let file = dir + filename;
		let stat = fs.lstatSync(file);
		let ext = path.extname(file);
		// 是目录，需要继续
		if (stat.isDirectory()) {          
			getRenderer(file + "/", template);
		} else if (ext == ".js") {
            if ((filename=='ssr-client.js') || (filename=='ssr-server.js')){
                continue;
            }
            if (filename == 'server.js') {
                let basepath = dir.replace('app/views/web-ssr', "");
                let url = dir.replace('app/views/web-ssr/', "");
                url = url.substr(0, url.length-1);
                let clientManifest = require(path.resolve(config.path.public+basepath+'/client-manifest.json'));
                let bundle = require(path.resolve(config.path.public +basepath+'/server-bundle.json'));
                rendererMap[url] = createRenderer(bundle, {
                    template, clientManifest 
                 });
            }
        }
    }
}

getRenderer('app/views/web-ssr/');

function render({ name, data, req }) {
    let context = {
        url: req.path,
        title: config.name,
        data: data,
        cookies: req.cookies
    };
    return new Promise((resolve, reject)=>{
        rendererMap[name].renderToString(context, (err, html) => {
            if (err) {
                return reject(err);
            }
            resolve(html);
        });
    })
}

module.exports = render;   