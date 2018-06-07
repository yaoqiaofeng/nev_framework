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

function getRenderer(dir){
	let fileList = fs.readdirSync(dir+'/', "utf-8");
	for (let filename of fileList) {
		let file = dir +'/'+ filename;
		let stat = fs.lstatSync(file);
		// 是目录，需要继续
		if (stat.isDirectory()) {          
			getRenderer(file);
        } 
    }
    if (fs.existsSync(dir+'/client-manifest.json') && fs.existsSync(dir+'/server-bundle.json')
        && fs.existsSync(dir+'/template.html')){
        let url = dir.replace(config.path.public+'/', "");
        let clientManifest = require(path.resolve( dir+'/client-manifest.json'));
        let bundle = require(path.resolve(dir+'/server-bundle.json'));
        let template = fs.readFileSync(path.resolve(dir+'/template.html'),"utf-8");
        rendererMap[url] = createRenderer(bundle, {
            template, clientManifest 
         });
    }
}

getRenderer(config.path.public);

function render({ name, data, req }) {
    let context = {
        url: req.path,
        title: config.name,
        data: data,
        cookies: req.cookies
    };
    console.log(rendererMap);
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