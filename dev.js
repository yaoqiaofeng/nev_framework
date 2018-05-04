const {spawn} = require('child_process');

// common code
const gulp = spawn('npm.cmd', ["run", "dev-gulp"]);
const static = spawn('npm.cmd', ["run", "dev-static"]);
const server = spawn('npm.cmd', ["run", "dev-server"]);

gulp.stdout.on('data', (data) => {
    process.stdout.write(data);
});

gulp.stderr.on('data', (data) => {
    process.stdout.write(data);
});

gulp.on('close', (code) => {
    console.log(`gulp退出码：${code}`);
});

gulp.on('error', (err) => {
    console.log('启动gulp失败：', err);
});

static.stdout.on('data', (data) => {
    process.stdout.write(data);
});

static.stderr.on('data', (data) => {
    process.stdout.write(data);
});

static.on('close', (code) => {
    console.log(`webpack退出码：${code}`);
});

static.on('error', (err) => {    
    console.log('启动webpack失败：', err);
});

server.stdout.on('data', (data) => {
    process.stdout.write(data);
});

server.stderr.on('data', (data) => {
    process.stdout.write(data);
});

server.on('close', (code) => {
    console.log(`server退出码：${code}`);
});

server.on('error', (err) => {
    console.log('启动server失败：', err);
});
