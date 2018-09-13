const {spawn} = require('child_process');
const fs = require('fs');

function run(name, params){
    let cmd = /win32/ig.test(process.platform)?'npm.cmd':'npm';
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
        console.log(`${name}启动失败：`, err);
    });
}
 
if (fs.existsSync('app/views/web')){
    run('static', ["run", "dev-static"]);
}
if (fs.existsSync('app/views/web-ssr')){
    run('ssr', ["run", "dev-ssr"]);
}
run('gulp', ["run", "dev-gulp"]);
run('server', ["run", "dev-server"]);