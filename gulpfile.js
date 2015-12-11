
var gulp = require('gulp'),
    clean = require('gulp-clean'),
    shell = require('gulp-shell'),
    gulpGit = require('gulp-git'),
    gulpSequence = require('gulp-sequence').use(gulp),
    vinylPaths = require('vinyl-paths'),
    gulpFooter = require('gulp-footer'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    gulpMinify = require('gulp-minify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    gulpFilter = require('gulp-filter'),    //过滤文件
    revappend = require('gulp-rev-append'), //使用gulp-rev-append给页面的引用添加版本号，清除页面引用缓存。
    Q = require('q');
    
    
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


gulp.task('build_public_del', function () {        
    return gulp.src(destDir, {read: false})
		.pipe(clean({force: true}));  
});

gulp.task('public_main', function () {
    // 主要Main.js
    gulp.src('./public/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/js'));

});

gulp.task('public_lessCSS', function () {
    gulp.src('./public/styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/styles'));
});


gulp.task('public_copy', function () {
    gulp.src('./public/3rdparty/**')
        .pipe(gulp.dest(destDir + '/3rdparty'));

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

    gulp.src('./public/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest(destDir + '/css'));

    gulp.src('./public/l10n/**')
        .pipe(gulp.dest(destDir + '/l10n'));

    gulp.src('./public/lang/**')
        .pipe(gulp.dest(destDir + '/lang'));

    gulp.src('./public/tmpl/**')
        .pipe(gulp.dest(destDir + '/tmpl'));

    gulp.src('./public/templates/**')
        .pipe(gulp.dest(destDir + '/templates'));

    gulp.src('./public/view/**')
        .pipe(gulp.dest(destDir + '/view'));

    gulp.src('./public/app/**')
        .pipe(gulp.dest(destDir + '/app'));

    gulp.src('./public/assets/**')
        .pipe(gulp.dest(destDir + '/assets'));

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


gulp.task('node-server', function () {

    gulp.src(['./server/*', '!./server/*.js', '!./server/node_modules'])
        .pipe(gulp.dest(destDir + '/server'));

    gulp.src(['./server/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/server'));

    gulp.src('./public/www')
        .pipe(uglify())
        .pipe(gulp.dest(destDir));

});

gulp.task('extend_task', function () {
    "use strict";

    gulp.src('./public/locales/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/locales'));

    gulp.src('./public/locales/extend/editormd/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(destDir + '/locales/extend/editormd'));

});

gulp.task('delayWait', function(){
    var deferred = Q.defer();
    // do async stuff
    setTimeout(function() {
        deferred.resolve();
    }, 3000);
    
    return deferred.promise;    
});

// 测试包处理
gulp.task('default', gulpSequence(
    'build_public_del', 
    'public_main', 
    'public_lessCSS', 
    'public_copy', 
    'extend_task', 
    'node-server',
    'delayWait'
    ));

var g_AppInfoPlist = nm_plist.parse(sysFS.readFileSync(__dirname + "/electron/bundle.app/Contents/info.plist", 'utf8'));;



var forElectronDir = "D:/workspace/testprj/0git_html/MyDicTool/for_electron";
// Windows准备打包
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var release_win_dir = releaseDir + "/win";
var tmp64Dir = release_win_dir + "/tmp64";
var tmp32Dir = release_win_dir + "/tmp32";

var g_cur_task_win_isX64 = true;  // 当前执行

gulp.task('package_win_del', function (cb) {
    return gulp.src(release_win_dir, {read: false})
		.pipe(clean({force: true}));
});

gulp.task('package_win_copy_exe', function () {
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;

    if (g_cur_task_win_isX64) {
       return gulp.src('./electron/exe/win64/**/*')
            .pipe(gulp.dest(tmp64Dir));
    } else {
       return gulp.src('./electron/exe/win32/**/*')
            .pipe(gulp.dest(tmp32Dir));
    }

});

gulp.task('package_win_copy_bundle.app', function () {
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
   return gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/'));
});


gulp.task('package_win_copy_publish', function () {
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
   return gulp.src(destDir + "/**")
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/'));
});

var g_copy_romanysoft_func = function (tmp_destDir) {

    gulp.src(forElectronDir + '/main.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(tmp_destDir + '/resources/app/'));


    gulp.src(forElectronDir + '/romanysoft/Classes/**/*.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/Classes/'));

    gulp.src(forElectronDir + '/romanysoft/l10n/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/l10n/'));

    gulp.src(forElectronDir + '/romanysoft/UI/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/UI/'));

    gulp.src(forElectronDir + '/romanysoft/UnitTest/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/UnitTest/'));


    gulp.src(forElectronDir + '/romanysoft/maccocojs.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(tmp_destDir + '/resources/app/romanysoft/'));


};

gulp.task('package_win_copy_romanysoft', function () {
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
    g_copy_romanysoft_func(tmp_destDir);
    
    var deferred = Q.defer();
    // do async stuff
    setTimeout(function() {
        deferred.resolve();
    }, 3000);
    
    return deferred.promise;
});

var g_getInfoFromInfoPlist_func = function () {
    var info = g_AppInfoPlist;

    return {
        appName: info.CFBundleDisplayName,
        appVersion: info.CFBundleShortVersionString,
        copyright: info.NSHumanReadableCopyright,
        appDescription: info.RomanysoftAppDescription || "",
        company: "Romanysoft, LAB."
    };
}

gulp.task('package_win_npm', function (cb) {
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;

    var install = require("gulp-install");
    var replace = require('gulp-replace');

    var info = g_getInfoFromInfoPlist_func();
    var validAppName = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppName);

    return gulp.src(forElectronDir + '/package.json')
        .pipe(replace(/for_electronSDK/g, validAppName))  //修改app目录下面的resources\app\package.json 修改name
        .pipe(gulp.dest(tmp_destDir + '/resources/app/'))
        .pipe(install());

});

gulp.task('package-win-git-version', function (cb) {
    var tmp_destDir = g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;

    gulpGit.revParse({ args: '--short HEAD', cwd: forElectronDir, quiet: true }, function (err, hash) {
        console.log('current git hash: ' + hash);
        var filePath = tmp_destDir + '/resources/app/version';
        var sysFS = require('fs');

        sysFS.writeFile(filePath, hash, 'utf8', function (err) {
            cb && cb(err);
        });
    });
});


gulp.task('package_win_getInstaller', function (cb) {
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
        appDescription = info.RomanysoftAppDescription || "",
        company = "Romanysoft, LAB.";

    var validAppName = appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppName);

    var opts = {
        path: tmp_destDir,
        out: tmp_destDir + "/../installer/" + platform,
        name: validAppName,
        version: appVersion,
        description: appDescription,
        copyright: copyright,
        product_name: validAppName,
        authors: company,
        owners: company,
        title: appName + " " + appVersion,
        overwrite: true,
        exe: validAppName + ".exe",
        setup_filename: validAppName + "-v" + appVersion + "-win32" + "-" + platform + "-setup.exe",
        setup_icon: __dirname + '/electron/setup.ico',
        loading_gif: __dirname + '/electron/loading.gif',
        iconUrl: __dirname + "/electron/bundle.app/Contents/Resources/app.ico"
    };

    createInstaller(opts, function done(err) {
        cb(err);
    });
});

gulp.task('set_win32', function () {
    g_cur_task_win_isX64 = false;
});

gulp.task('set_win64', function () {
    g_cur_task_win_isX64 = true;
});


gulp.task('release_win_32', gulpSequence(
    'set_win32', 
    'package_win_copy_exe', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version', 
    'package_win_getInstaller'));

gulp.task('release_win_64', gulpSequence(
    'set_win64', 
    'package_win_copy_exe', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version', 
    'package_win_getInstaller'));

gulp.task('release_win_32_noInstaller', gulpSequence(
    'package_win_del',     
    'set_win32', 
    'package_win_copy_exe', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version'));

gulp.task('release_win_64_noInstaller', gulpSequence(
    'package_win_del',     
    'set_win64', 
    'package_win_copy_exe', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version'));

gulp.task('release_win', gulpSequence(
    'package_win_del', 
    'release_win_64', 
    'release_win_32'));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Linux 处理
g_cur_task_linux_isX64 = true;
var release_linux_dir = releaseDir + "/linux";
var tmp_linux64Dir = release_linux_dir + "/tmp64";
var tmp_linux32Dir = release_linux_dir + "/tmp32";

gulp.task('set_linux32', function () {
    g_cur_task_linux_isX64 = false;
    var info = g_getInfoFromInfoPlist_func();
    var validAppName = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppName);

    var platform = g_cur_task_linux_isX64 ? 'x64' : 'ia32';
    tmp_linux32Dir = release_linux_dir + "/" + validAppName + "-v" + info.appVersion + "-linux" + "-" + platform + "-install";
});

gulp.task('set_linux64', function () {
    g_cur_task_linux_isX64 = true;

    var info = g_getInfoFromInfoPlist_func();
    var validAppName = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppName);

    var platform = g_cur_task_linux_isX64 ? 'x64' : 'ia32';
    tmp_linux64Dir = release_linux_dir + "/" + validAppName + "-v" + info.appVersion + "-linux" + "-" + platform + "-install";
});

gulp.task('package_linux_del', function () {
    return gulp.src(release_linux_dir, {read: false})
		.pipe(clean({force: true}));      
});

gulp.task('package_linux_copy_bin', function () {
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;

    if (g_cur_task_win_isX64) {
        return gulp.src('./electron/linux/x64/**/*')
            .pipe(gulp.dest(tmp_destDir));
    } else {
        return gulp.src('./electron/linux/ia32/**/*')
            .pipe(gulp.dest(tmp_destDir));
    }
});

gulp.task('package_linux_copy_bundle.app', function () {
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    return gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/'));
});

gulp.task('package_linux_copy_publish', function () {
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    return gulp.src(destDir + "/**")
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/'));
});

gulp.task('package_linux_copy_romanysoft', function () {
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    g_copy_romanysoft_func(tmp_destDir);
    
    var deferred = Q.defer();
    // do async stuff
    setTimeout(function() {
        deferred.resolve();
    }, 3000);
    
    return deferred.promise;
});

gulp.task('package_linux_no_npm', function () {
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;

    var install = require("gulp-install");
    var replace = require('gulp-replace');

    var info = g_getInfoFromInfoPlist_func();
    var validAppName = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppName);

    return gulp.src(forElectronDir + '/package.json')
        .pipe(replace(/for_electronSDK/g, validAppName))  //修改app目录下面的resources\app\package.json 修改name
        .pipe(gulp.dest(tmp_destDir + '/resources/app/'));

});

gulp.task('package-linux-git-version', function (cb) {
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;

    gulpGit.revParse({ args: '--short HEAD', cwd: forElectronDir, quiet: true }, function (err, hash) {
        console.log('current git hash: ' + hash);
        var filePath = tmp_destDir + '/resources/app/version';
        var sysFS = require('fs');

        sysFS.writeFile(filePath, hash, 'utf8', function (err) {
            cb && cb(err);
        });
    });
});


gulp.task('release_linux_32', gulpSequence(
    'set_linux32', 
    'package_linux_copy_bin', 
    'package_linux_copy_bundle.app', 
    'package_linux_copy_publish', 
    'package_linux_copy_romanysoft', 
    'package_linux_no_npm', 
    'package-linux-git-version'));
    
gulp.task('release_linux_64', gulpSequence(
    'set_linux64', 
    'package_linux_copy_bin', 
    'package_linux_copy_bundle.app', 
    'package_linux_copy_publish', 
    'package_linux_copy_romanysoft', 
    'package_linux_no_npm', 
    'package-linux-git-version'));
    
gulp.task('release_linux', gulpSequence(
    'package_linux_del', 
    'release_linux_64', 
    'release_linux_32'));


gulp.task('release', gulpSequence('default','release_win', 'release_linux'));
