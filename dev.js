const {spawn} = require('child_process');
const fs = require('fs');

function run(name, cmd, params){
    const p = spawn(cmd, params);
    p.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
    
    p.stderr.on('data', (data) => {
        process.stdout.write(data);
    });
    
    p.on('close', (code) => {
        console.log(`${name}退出码：${code}`);
    });
    
    p.on('error', (err) => {
        pconsole.log(`${name}启动失败：`, err);
    });
}
 
if (fs.existsSync('app/views/web')){
    run('static','npm.cmd', ["run", "dev-static"]);
}
if (fs.existsSync('app/views/web-ssr')){
    run('ssr','npm.cmd', ["run", "dev-ssr"]);
}
run('gulp','npm.cmd', ["run", "dev-gulp"]);
run('server','npm.cmd', ["run", "dev-server"]);