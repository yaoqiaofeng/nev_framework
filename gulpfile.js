const gulp = require('gulp');
const uglify = require('gulp-uglify');
const pump = require('pump');
const babel = require('gulp-babel');


gulp.task('config', function () {
    return gulp.src([".babelrc",".esintrc","app.json","config.js","package.json"])
        .pipe(gulp.dest("dist"));
});

gulp.task("uglify", function (cb) {
    pump([
        gulp.src(["app.js","load.js"]),
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
        gulp.src(["app/controllers/**/*.js","app/models/**/*.js","app/node_modules/**/*.js"],{base:'app'}),
        babel(),
        uglify(),
        gulp.dest('./dist/app')
    ],
    cb//函数有参数
    );
});

gulp.task('default', ['config','uglify','uglifyApp', 'public']);