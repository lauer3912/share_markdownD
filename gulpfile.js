
var gulp    = require('gulp'),
    del     = require('del'),
    shell = require('gulp-shell'),
    gulpSequence = require('gulp-sequence'),
    vinylPaths = require('vinyl-paths'),
    gulpFooter = require('gulp-footer'),
    gutil    = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    gulpMinify = require('gulp-minify'),
    concat  = require('gulp-concat'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    gulpFilter = require('gulp-filter'),    //过滤文件
    revappend = require('gulp-rev-append'); //使用gulp-rev-append给页面的引用添加版本号，清除页面引用缓存。
    
    
/// 来源于NodejS系统内置的
var sysUtil = require('util'),
    sysURL = require('url'),
    sysFS = require('fs'),
    sysOS = require('os'),
    sysCluster = require('cluster'),
    sysChildProcess = require('child_process'),
    sysNet = require('net'),
    sysHTTP = require('http'),
    sysHTTPS = require('https'),
    sysEvents = require('events'),
    sysDNS = require('dns'),
    sysPunyCode = require('punycode'),
    sysReadline = require('readline'),
    sysStream = require('stream'),
    sysStringDecoder = require('string_decoder'),
    sysTLS = require('tls'),
    sysDatagram = require('dgram'),
    sysV8 = require('v8'),
    sysVM = require('vm'),
    sysZlib = require('zlib'),

    sysBuffer = require('buffer'),
    sysCrypto = require('crypto'),
    sysPath = require('path');  
    
var nm_plist = require('plist');    

var destDir = "./build/public"; // 构建临时目录
var releaseDir = "./release";   // 产品发布目录

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

// 测试包处理
gulp.task('default', ['public_main', 'public_lessCSS', 'public_copy', 'extend_task', 'node-server']);


// Windows准备打包
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var forElectronDir = "D:/workspace/testprj/0git_html/MyDicTool/for_electron";



var release_win_dir = releaseDir + "/win";
var tmp64Dir = release_win_dir + "/tmp64";
var tmp32Dir = release_win_dir + "/tmp32";

var g_cur_task_win_isX64 = true;  // 当前执行

gulp.task('package_win_del', function(){
     return del([release_win_dir]);
});

gulp.task('package_win_copy_exe', function(){
     var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
     
     if(g_cur_task_win_isX64){
         gulp.src('./electron/exe/win64/**/*')
            .pipe(gulp.dest(tmp64Dir));         
     }else{
         gulp.src('./electron/exe/win32/**/*')
            .pipe(gulp.dest(tmp32Dir));         
     }

});

gulp.task('package_win_copy_bundle.app',function(){
     var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
     gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app'));
});

gulp.task('package_win_copy_publish', function(){
     var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
     gulp.src(destDir + "/**") 
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public'));
});

gulp.task('package_win_copy_romanysoft', function(){  
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir; 
    
    gulp.src(forElectronDir + '/main.js') 
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(tmp_destDir + '/resources/app'));
        
    
    gulp.src(forElectronDir + '/romanysoft/Classes/**/*.js') 
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/Classes'));
    
    gulp.src(forElectronDir + '/romanysoft/l10n/**') 
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/l10n'));
        
    gulp.src(forElectronDir + '/romanysoft/UI/**') 
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/UI'));       

    gulp.src(forElectronDir + '/romanysoft/UnitTest/**') 
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/UnitTest')); 

        
    gulp.src(forElectronDir + '/romanysoft/maccocojs.js') 
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft'));   
});

gulp.task('package_win_npm', function(cb){
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir; 
    
    var install = require("gulp-install");
    var replace = require('gulp-replace');
    
   return gulp.src(forElectronDir + '/package.json') 
        .pipe(replace(/for_electronSDK/g, 'MarkdownD'))  //修改app目录下面的resources\app\package.json 修改name
        .pipe(gulp.dest(tmp_destDir + '/resources/app'))
        .pipe(install());        
           
});


gulp.task('package_win_getInstaller', function(cb){
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir; 
    var platform = g_cur_task_win_isX64 ? 'x64' : 'x86'
    
    console.log("创建安装包" + platform);
    
    //5.执行打包
    // 参照：https://github.com/mongodb-js/electron-installer-squirrel-windows/blob/master/test/index.test.js
    //       https://github.com/mongodb-js/electron-installer-squirrel-windows
    //       
    // 签名使用”数字签名克隆工具“，生成包后，替换. 注意：对64位程序无效
    var createInstaller = require('electron-installer-squirrel-windows');
    
    var info = {};
    info = nm_plist.parse(sysFS.readFileSync(__dirname + '/' + tmp_destDir + "/resources/app/bundle.app/Contents/info.plist", 'utf8'));
    
     var appName = info.CFBundleDisplayName, 
         appVersion = info.CFBundleShortVersionString,
         copyright = info.NSHumanReadableCopyright,
         company = "Romanysoft, LAB.";
     
    var opts = {
        path: tmp_destDir,
        out:  tmp_destDir + "/../installer/" + platform,
        name: appName,
        version: appVersion,
        description: "A full-featured Markdown editor",
        copyright: copyright,
        product_name: appName,
        authors:company,
        owners:company,
        title:appName + " " + appVersion,
        overwrite: true,
        exe: appName + ".exe",
        setup_filename: appName + "_" + platform + "_Setup.exe",
        setup_icon: __dirname + '/electron/setup.ico',
        iconUrl: __dirname + "/electron/bundle.app/Contents/Resources/app.ico"
    };
    
   createInstaller(opts, function done (err) { 
        cb(err);
   });
});

gulp.task('set_win32', function(){
    g_cur_task_win_isX64 = false;
});

gulp.task('set_win64', function(){
    g_cur_task_win_isX64 = true;
});


gulp.task('release_win_32', gulpSequence('set_win32','package_win_copy_exe', 'package_win_copy_bundle.app', 'package_win_copy_publish',  'package_win_copy_romanysoft', 'package_win_npm', 'package_win_getInstaller'));
gulp.task('release_win_64', gulpSequence('set_win64','package_win_copy_exe', 'package_win_copy_bundle.app', 'package_win_copy_publish',  'package_win_copy_romanysoft', 'package_win_npm', 'package_win_getInstaller'));
gulp.task('release_win', gulpSequence('default', 'package_win_del', 'release_win_64', 'release_win_32'));


// 全局发布
gulp.task('publish', gulpSequence('release_win'));
