
var gulp    = require('gulp'),
    gutil    = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    gulpFilter = require('gulp-filter'),    //过滤文件
    revappend = require('gulp-rev-append'); //使用gulp-rev-append给页面的引用添加版本号，清除页面引用缓存。

var destDir = "./build/public";

gulp.task('public_main', function () {
    // 主要Main.js
    gulp.src('./public/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/js'));

});

gulp.task('public_lessCSS', function(){
    gulp.src('./public/styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/styles'));
});


gulp.task('public_copy', function(){
    gulp.src('./public/common/**')
        .pipe(gulp.dest(destDir + '/common'));

    gulp.src('./public/images/**')
        .pipe(gulp.dest(destDir + '/images'));

    gulp.src('./public/licenses/**')
        .pipe(gulp.dest(destDir + '/licenses'));

    gulp.src('./public/styles/fonts/**')
        .pipe(gulp.dest(destDir + '/styles/fonts'));

    gulp.src('./public/styles/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest(destDir + '/styles'));
    
    gulp.src('./public/l10n/**')
        .pipe(gulp.dest(destDir + '/l10n'));    
    
    gulp.src('./public/templates/**')
        .pipe(gulp.dest(destDir + '/templates'));        

    var htmlOptions = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    
    gulp.src('./public/index.html')
        .pipe(revappend())
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest(destDir));

    gulp.src('./public/project.json')
        .pipe(gulp.dest(destDir));
});


gulp.task('node-server', function(){
        
    gulp.src(['./server/*', '!./server/*.js','!./server/node_modules'])
        .pipe(gulp.dest(destDir + '/server'));
    
    gulp.src(['./server/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/server')); 

    
   
});

gulp.task('extend_task', function(){
    "use strict";

    gulp.src('./public/locales/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/locales'));

    gulp.src('./public/locales/extend/editormd/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/locales/extend/editormd'));

});

gulp.task('default', ['public_main', 'public_lessCSS', 'public_copy', 'extend_task', 'node-server']);
