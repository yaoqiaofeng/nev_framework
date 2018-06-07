const {spawn} = require('child_process');
const fs = require("fs");

function run(name, cmd, params){
    return new Promise(function(resolve, reject){
        const p = spawn(cmd, params);
        p.stdout.on('data', (data) => {
            process.stdout.write(data);
        });
        
        p.stderr.on('data', (data) => {
            process.stdout.write(data);
        });
        
        p.on('close', (code) => {
            console.log(`${name}退出码：${code}`);
            resolve();
        });
        
        p.on('error', (err) => {
            pconsole.log(`'${name}启动失败：`, err);
            reject();
        });
    })
}

async function start(){
    if (fs.existsSync('app/views/web')){
        await run('static','npm.cmd', ["run", "build-static"]);
    }
    if (fs.existsSync('app/views/web-ssr')){
        await run('ssr','npm.cmd', ["run", "build-ssr"]);
    }
    await run('gulp','npm.cmd', ["run", "build-gulp"]);
}

start();