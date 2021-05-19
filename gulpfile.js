'use strict';
var gulp            = require('gulp')
    ,mocha          = require('gulp-mocha')
    ,webpack        = require('webpack-stream')
    ,webpack_config = require('./webpack.config.js')
    ;

function test(){
    return gulp.src('./test/**/*.js', {read: false})
        .pipe(mocha({require: 'babel-register', timeout: 10000}))
        ;
}

function compile(){
    return gulp.src(' ')
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest(webpack_config.output.path))
        ;
}

function watch(){
    gulp.watch(['src/**', 'test/**'], ['build']);
}

exports.test = test;
exports.compile = compile;
exports.watch = watch;
exports.build = gulp.series(
    test,
    compile
);
