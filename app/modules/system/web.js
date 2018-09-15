const https = require("https");
const http = require("http");

module.exports={

    parser(url, option){
        let h;
        let port;
        let host;
        let path;
        if (url.search(/^http:[/][/]/)>=0){
            h = http;
            port =80;
            url = url.replace(/^http:[/][/]/,'');
        } else if (url.search(/^https:[/][/]/)>=0){
            h = https;
            port = 443;
            url = url.replace(/^https:[/][/]/,'');
        } else {
            h = http;
            port =80;
        }
        host= url.match(/(.+?)[/,:]/)[1];
        let matchs = url.match(/[:](\d+)/);
        port= (matchs && (matchs.length>0))?matchs[1]:port;
        path =url.replace(/.+?([/])/,'$1');

        let symbol = url.search(/[?]/)>0?'&':'?';
        if (option.params) {
            for(let e in option.params){
                if (option.params[e]){
                    path=path+symbol+e+'='+option.params[e];
                    symbol = '&';
                }
            }
        }
        return {
            h ,
            host,
            port,
            path
        }
    },

    format(data) {
        let result = "";
        for (let i = 0; i < data.length; i++) {
            let t = data.charCodeAt(i).toString(16);
            if (t.length == 4) {
                result = result + "\\u" + t;
            } else {
                result = result + data[i];
            }
        }
        return result;
    },

    get(url, option={}){
        return new Promise(async (resolve, reject) => {
            let {h,  port, host, path} = this.parser(url, option);                    
            const req = h.request(
                {
                    hostname:  host,
                    port: port,
                    path: path,
                    method: "GET"
                },
                res => {
                    res.setEncoding("utf8");
    
                    let response = "";                    
                    res.on("data", function(data) {
                        response += data;
                    });
    
                    res.on("end", async function() {
                        let result;
                        try {                            
                            result = JSON.parse(response);
                        } catch (error) {
                            result = response
                        }
                        resolve(result);
                    });
    
                }
            );

            req.on("error", function(e) {
                reject( e.message);
            });

            req.end();
        });
    },

    post(url, body, option={}){
        return new Promise(async (resolve, reject) => {
            let {h,  port, host, path} = this.parser(url, option);     
            let headers= {};
            if (option.json){
                body = this.format(JSON.stringify(body));
				headers = {
					"Content-Type": "application/json;charset=utf-8",
					"Content-Length": body.length
				}
            }
            const req = h.request(
                {
                    hostname:  host,
                    port: port,
                    path: path,
                    method: "POST",
                    headers: headers
                },
                res => {
                    res.setEncoding("utf8");
    
                    let response = "";                    
                    res.on("data", function(data) {
                        response += data;
                    });
    
                    res.on("end", async function() {
                        let result;
                        try {                            
                            result = JSON.parse(response);
                        } catch (error) {
                            result = response
                        }
                        resolve(result);
                    });
    
                }
            );

            req.on("error", function(e) {
                reject(e.message);
            });

            req.write(body);

            req.end();
        });
    }
}
