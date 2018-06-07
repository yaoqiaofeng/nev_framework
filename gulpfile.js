const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const pump = require('pump');


gulp.task('config', function () {
    return gulp.src([".babelrc",".esintrc","pm.js","config.js","package.json"])
        .pipe(gulp.dest("dist"));
});

gulp.task("uglify", function (cb) {
    pump([
        gulp.src(["app.js","load.js","batch.js"]),
        babel(),
        uglify(),
        gulp.dest('./dist')
    ],
    cb//函数有参数
    );
});

gulp.task("public", function () {
    return  gulp.src(["public/**/*.*"],{base:'public'})
        .pipe(gulp.dest("dist/public"));
});

gulp.task("uglifyApp", function (cb) {
    pump([
        gulp.src(["app/controllers/**/*.js","app/models/**/*.js","app/node_modules/**/*.js","app/services/**/*.js"],{base:'app'}),
        babel(),
        uglify(),
        gulp.dest('./dist/app')
    ],
    cb//函数有参数
    );
});

gulp.task("lib", function () {
    return  gulp.src(["app/views/lib/**/*.*"],{base:'app/views'})
        .pipe(gulp.dest("public"));
});

gulp.task("images", function () {
    return  gulp.src(["app/views/images/**/*.*"],{base:'app/views'})
        .pipe(gulp.dest("public"));
});

gulp.task("watch", function () {
    gulp.watch('app/views/lib/**/*.*', ["lib"]);
    gulp.watch('app/views/images/**/*.*', ["images"]);
});

if (process.env.NODE_ENV=== 'production'){
    gulp.task('default', ['lib','images','config','uglify','uglifyApp', 'public']);
} else {
    gulp.task('default', ["lib","images",'watch']);
}