
var gulp = require('gulp'),
    clean = require('gulp-clean'),
    shell = require('gulp-shell'),
    gulpGit = require('gulp-git'),
    gulpSequence = require('gulp-sequence').use(gulp),
    vinylPaths = require('vinyl-paths'),
    gulpFooter = require('gulp-footer'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),        // 重命名
    uglify = require('gulp-uglify'),
    gulpMinify = require('gulp-minify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    rcedit = require('rcedit'),
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


gulp.task('build_public_del', function (cb) {        
    return gulp.src(destDir, {read: false})
		.pipe(clean({force: true}));  
        
        
    var deferred = Q.defer();
    
    var cleanor = clean({force: true});
    cleanor.on('finish', function(){
        console.log('### always delete dir... ####');
        deferred.resolve();
    })
    
    // 刪除原先文件 
    gulp.src(destDir, {read: false})
        .pipe(cleanor);         

    Q.when(deferred.promise).then(function(){
        cb && cb();
    });        
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

    gulp.src(['./server/**/*', '!./server/node_modules/**/*', '!./server/node_modules/'])
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var forElectronDir = "D:/workspace/testprj/0git_html/MyDicTool/for_electron";
var assReleasePackage = "D:/workspace/nACommonJS/common/electron/ass-release";
var assBundlePackage = __dirname + "/electron/bundle.app";

/// {}
var g_cur_task_for_os = 1; // 1. windows, 2.linux, 3. MacOS


/// {windows 变量}
var release_win_dir = releaseDir + "/win";
var tmp64Dir = release_win_dir + "/tmp64";
var tmp32Dir = release_win_dir + "/tmp32";
var g_cur_task_win_isX64 = true;  // 当前执行

/// {linux变量}
var g_cur_task_linux_isX64 = true;
var release_linux_dir = releaseDir + "/linux";
var tmp_linux64Dir = release_linux_dir + "/tmp64";
var tmp_linux32Dir = release_linux_dir + "/tmp32";
var tmp_linux64DirName = "";
var tmp_linux32DirName = "";

/// {MacOS 变量}


/**
 * 获得当前临时目标目录，根据当前任务属性
 */
function g_getOSTempDestDir(){
    if(1 === g_cur_task_for_os){
        return g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
    }else if(2 === g_cur_task_for_os){
        return g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    }else if(3 === g_cur_task_for_os){
        
    }
}


////
var g_AppInfoPlist = "";
try{
    g_AppInfoPlist = nm_plist.parse(sysFS.readFileSync(assBundlePackage + "/Contents/info.plist", 'utf8'));;
}catch(e){
    console.log(e);
}

var g_getInfoFromInfoPlist_func = function () {
    var info = g_AppInfoPlist;

    return {
        appName: info.CFBundleDisplayName,
        appVersion: info.CFBundleShortVersionString,
        copyright: info.NSHumanReadableCopyright,
        appDescription: info.RomanysoftAppDescription || "",
        useNodePlugin: info.RomanysoftUseNodePlugin || false,      /// 是否使用node插件
        usePythonPlugin: info.RomanysoftUsePythonPlugin || false,  /// 是否使用python插件
        company: "Romanysoft, LAB."
    };
}

/**
 * 公共处理Copy publish目录
 */
function g_package_copy_publish(tmp_destDir){
    var deferred = Q.defer();
    
    var dest = gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/');
    dest.on('finish', function(){
        deferred.resolve();
    });
    gulp.src(destDir + "/**")
        .pipe(dest);    
        
    return deferred.promise;    
}

/**
 * 公共的处理npm public下面的server
 */
function g_npm_public_server(tmp_destDir){
    /// 检查是否使用Node插件
    var info = g_getInfoFromInfoPlist_func();
    if(info.useNodePlugin){
        var install = require("gulp-install");
        return gulp.src(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/server/package.json')
                   .pipe(install());        
    }
    
    return gulp.src('./');
}

/**
 * 公共的压缩zip，public下面的server
 */
function g_common_zip_public_server(tmp_destDir, cb){
    var deferred = Q.defer();

    /// 检查是否使用Node插件
    var info = g_getInfoFromInfoPlist_func();
    if(info.useNodePlugin){
        var zip = require("gulp-zip");        
        function deleServerDir(){            
            var cleanor = clean({force: true});
            cleanor.on('finish', function(){
                console.log('### always delete server dir for zip ####');
                deferred.resolve();
            })
            
            // 刪除原先文件 
            gulp.src(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/server/', {read: false})
                .pipe(cleanor);
        }
        
        console.log('### start zip file ####');            
        gulp.src(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/server/**/**')
            .pipe(zip("server.zip"))
            .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/'))
            .on('finish', function(){deleServerDir();});   
                  
    }else{
        deferred.resolve();
    }
    
    Q.when(deferred.promise).then(function(){
        cb && cb();
    });
}

/**
 * 公共处理copy Romanysoft部分
 */
function g_copy_romanysoft_func (tmp_destDir) {
    var deferred = Q.defer();

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
        
    // do async stuff
    setTimeout(function() {
        deferred.resolve();
    }, 5000);    
        
    return deferred.promise;    
}

/**
 * 公共函数： 处理RomanysoftSDK的 npm
 */
function g_npm_romanysoftSDK(tmp_destDir){
    var install = require("gulp-install");
    var replace = require('gulp-replace');

    var info = g_getInfoFromInfoPlist_func();
    var validAppName = info.appName.replace(/\s/g, "-");
    console.log("validAppName = ", validAppName);

    return gulp.src(forElectronDir + '/package.json')
        .pipe(replace(/for_electronSDK/g, validAppName))  //修改app目录下面的resources\app\package.json 修改name
        .pipe(gulp.dest(tmp_destDir + '/resources/app/'))
        .pipe(install());    
}

/**
 * 公共 写入Romanysoft SDK 的版本号
 */
function g_write_git_version(tmp_destDir, cb){
    gulpGit.revParse({ args: '--short HEAD', cwd: forElectronDir, quiet: true }, function (err, hash) {
        console.log('current git hash: ' + hash);
        var filePath = tmp_destDir + '/resources/app/version';
        var sysFS = require('fs');

        sysFS.writeFile(filePath, hash, 'utf8', function (err) {
            cb && cb(err);
        });
    });    
}


// Windows准备打包
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('package_win_del', function (cb) {
    return gulp.src(release_win_dir, {read: false})
		.pipe(clean({force: true}));
});

gulp.task('package_win_copy_exe', function () {
    var tmp_destDir = g_getOSTempDestDir();

    if (g_cur_task_win_isX64) {
       return gulp.src( assReleasePackage + '/win/win64/**/*')
            .pipe(gulp.dest(tmp64Dir));
    } else {
       return gulp.src(assReleasePackage + '/win/win32/**/*')
            .pipe(gulp.dest(tmp32Dir));
    }
});

gulp.task('package_win_rcedit', function(cb){
    var tmp_destDir = g_getOSTempDestDir();
    
    
    var info = g_getInfoFromInfoPlist_func();
    var companyName = info.company;
    
    console.log('info =', info);
    
    var options = {
        "icon": assBundlePackage + "/Contents/Resources/app.ico",
        "file-version": info.appVersion,
        "product-version": info.appVersion,
        "version-string":{
            "ProductName":info.appName,
            "InternalName":info.appName,
            "OriginalFilename":info.appName,
            "Comments":info.appDescription,
            "FileDescription":info.appDescription,
            "CompanyName": companyName,
            "LegalCopyright": "Copyright " + (new Date()).getFullYear() + " " + companyName
        }
    }
    
    var destFilePath = tmp_destDir + "/electron.exe";
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
        
    rcedit(destFilePath, options, function(err){
        if(!err){
            
            function delElectronFile(){
                   console.log('2############');
                    // 刪除原先文件 
                    gulp.src(destFilePath, {read: false})
                    .on('end', function(){
                        console.log('3############');
                        cb && cb(); 
                    })
                    .pipe(clean({force: true}));
            }
            
            // 重命名，并刪除原先的文件
            gulp.src(destFilePath)
                .pipe(rename(validAppNameForSetup + ".exe"))
                .pipe(gulp.dest(tmp_destDir).on('finish', function(){
                    console.log('1############');
                    delElectronFile();
                }));
                    
        }else{
            cb &&　cb(err);  
        }
    });
    
});

gulp.task('package_win_copy_bundle.app', function () {
    var tmp_destDir = g_getOSTempDestDir();
    
    gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/'));
        
    /// 检查是否使用Node插件
    var info = g_getInfoFromInfoPlist_func();
    if(info.useNodePlugin){
        console.log('use node plugin....');
        var nodePluginPath = g_cur_task_win_isX64 
        ? assReleasePackage + '/plugins/node/win/win64/node.exe'
        : assReleasePackage + '/plugins/node/win/win32/node.exe';
         
        gulp.src(nodePluginPath)
            .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/PlugIns/'));
    }
});

gulp.task('package_win_copy_publish', function () {
    return g_package_copy_publish(g_getOSTempDestDir()); 
});

gulp.task('package_win_npm_public_server', function(){
    return g_npm_public_server(g_getOSTempDestDir());
});

gulp.task('package_win_zip_public_server', function(cb){
    g_common_zip_public_server(g_getOSTempDestDir(), cb);
});

gulp.task('package_win_copy_romanysoft', function () {
    return g_copy_romanysoft_func(g_getOSTempDestDir());
});

gulp.task('package_win_npm', function () {
    return g_npm_romanysoftSDK(g_getOSTempDestDir());
});

gulp.task('package-win-git-version', function (cb) {
    g_write_git_version(g_getOSTempDestDir(), cb);
});

gulp.task('package_win_getInstaller', function (cb) {
    var tmp_destDir = g_getOSTempDestDir();
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

    var validAppNameForSetup = appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);

    var opts = {
        path: tmp_destDir,
        out: tmp_destDir + "/../installer/" + platform,
        name: validAppNameForSetup,
        version: appVersion,
        description: appDescription,
        copyright: copyright,
        product_name: appName,
        authors: company,
        owners: company,
        title: appName + " " + appVersion,
        overwrite: true,
        debug: true,
        exe: validAppNameForSetup + ".exe",
        setup_filename: validAppNameForSetup + "-v" + appVersion + "-win32" + "-" + platform + "-setup.exe",
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
    g_cur_task_for_os = 1;
});

gulp.task('set_win64', function () {
    g_cur_task_win_isX64 = true;
    g_cur_task_for_os = 1;
});


gulp.task('release_win_32', gulpSequence(
    'set_win32', 
    'package_win_copy_exe', 
    'package_win_rcedit', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_npm_public_server',
    'package_win_zip_public_server',
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version', 
    'package_win_getInstaller'));

gulp.task('release_win_64', gulpSequence(
    'set_win64', 
    'package_win_copy_exe', 
    'package_win_rcedit', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_npm_public_server',
    'package_win_zip_public_server',
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version', 
    'package_win_getInstaller'));

gulp.task('release_win_32_noInstaller', gulpSequence(
    'package_win_del',     
    'set_win32', 
    'package_win_copy_exe', 
    'package_win_rcedit', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_npm_public_server',
    'package_win_zip_public_server',
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version'));

gulp.task('release_win_64_noInstaller', gulpSequence(
    'package_win_del',     
    'set_win64', 
    'package_win_copy_exe',
    
    'package_win_rcedit', 
    'package_win_copy_bundle.app', 
    'package_win_copy_publish', 
    'package_win_npm_public_server',
    'package_win_zip_public_server',
    'package_win_copy_romanysoft', 
    'package_win_npm', 
    'package-win-git-version'));

gulp.task('release_win', gulpSequence(
    'package_win_del', 
    'release_win_64', 
    'release_win_32'));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Linux 处理
gulp.task('set_linux32', function () {
    g_cur_task_linux_isX64 = false;
    g_cur_task_for_os = 2;
    
    var info = g_getInfoFromInfoPlist_func();
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);

    var platform = g_cur_task_linux_isX64 ? 'x64' : 'ia32';
    tmp_linux32DirName = validAppNameForSetup + "-v" + info.appVersion + "-linux" + "-" + platform + "-install";
    tmp_linux32Dir = release_linux_dir + "/" + tmp_linux32DirName;
});

gulp.task('set_linux64', function () {
    g_cur_task_linux_isX64 = true;
    g_cur_task_for_os = 2;

    var info = g_getInfoFromInfoPlist_func();
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);

    var platform = g_cur_task_linux_isX64 ? 'x64' : 'ia32';
    tmp_linux64DirName = validAppNameForSetup + "-v" + info.appVersion + "-linux" + "-" + platform + "-install";
    tmp_linux64Dir = release_linux_dir + "/" + tmp_linux64DirName;
});

gulp.task('package_linux_del', function (cb) {
    var deferred = Q.defer();
    
    var cleanor = clean({force: true});
    cleanor.on('finish', function(){
        deferred.resolve();
    });   
    return gulp.src(release_linux_dir, {read: false})
		.pipe(cleanor);  
        
    Q.when(deferred.promise).then(function(){
        cb && cb();
    });            
});

gulp.task('package_linux_copy_bin', function () {
    var tmp_destDir = g_getOSTempDestDir();

    if (g_cur_task_win_isX64) {
        return gulp.src(assReleasePackage +'/linux/x64/**/*')
            .pipe(gulp.dest(tmp_destDir));
    } else {
        return gulp.src(assReleasePackage +'/linux/ia32/**/*')
            .pipe(gulp.dest(tmp_destDir));
    }
});

gulp.task('package_linux_rename_bin', function(cb){
    var tmp_destDir = g_getOSTempDestDir();
    
    var info = g_getInfoFromInfoPlist_func();
    var companyName = info.company;
    
    console.log('info =', info);
        
    var destFilePath = tmp_destDir + "/electron";
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
    
    // 重命名，并刪除原先的文件
    gulp.src(destFilePath)
        .pipe(rename(validAppNameForSetup))
        .pipe(gulp.dest(tmp_destDir))
        ; 
        
    // 刪除原先文件     
    gulp.src(destFilePath, {read: false})
        .pipe(clean({force: true}))
        .on('finish', function(){
            cb && cb();
        });
});

gulp.task('package_linux_copy_bundle.app', function () {
    var tmp_destDir = g_getOSTempDestDir();
    var deferred = Q.defer();
        
    gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/'))
        .on('finish', function(){
            /// 检查是否使用Node插件
            var info = g_getInfoFromInfoPlist_func();
            if(info.useNodePlugin){
                console.log('use node plugin....');
                var nodePluginPath = g_cur_task_linux_isX64 
                ? assReleasePackage + '/plugins/node/linux/x64/node'
                : assReleasePackage + '/plugins/node/linux/ia32/node';
                
                gulp.src(nodePluginPath)
                    .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/PlugIns/'));
            } 
            
            deferred.resolve();
        });
        
    return deferred.promise;           
});

gulp.task('package_linux_copy_publish', function () {
    return g_package_copy_publish(g_getOSTempDestDir());
});

gulp.task('package_linux_npm_public_server', function(){
    return g_npm_public_server(g_getOSTempDestDir());
});

gulp.task('package_linux_zip_public_server', function(cb){
    g_common_zip_public_server(g_getOSTempDestDir(), cb);
});

gulp.task('package_linux_copy_romanysoft', function () {
    return g_copy_romanysoft_func(g_getOSTempDestDir());
});

gulp.task('package_linux_npm', function () {
    return g_npm_romanysoftSDK(g_getOSTempDestDir());
});

gulp.task('package-linux-git-version', function (cb) {
    g_write_git_version(g_getOSTempDestDir(), cb);
});

gulp.task('package-linux-makeDEBDir', function(){
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    var tmp_debName = g_cur_task_linux_isX64 ? tmp_linux64DirName : tmp_linux32DirName;
    
    var info = g_getInfoFromInfoPlist_func();
    var validAppName = info.appName.replace(/\s/g, "-");
    var replace = require('gulp-replace');
    
    // 存放执行文件
    var app_run_path = release_linux_dir + '/' + tmp_debName + '_deb/usr/lib/';
    gulp.src(tmp_destDir + "/**")
        .pipe(gulp.dest(app_run_path));
    
    // 存放图标  
    var app_run_icon_path = release_linux_dir + '/' + tmp_debName + '_deb/usr/share/icons/' + validAppName + "-romanysoft.png";
    gulp.src('./electron/bundle.app/Contents/Resources/app.png')
        .pipe(rename(validAppName + "-romanysoft.png"))
        .pipe(gulp.dest(release_linux_dir + '/' + tmp_debName + '_deb/usr/share/icons/'));
        
    // 修改.desktop文件特性，然后保存
    var app_run_desktop_path = release_linux_dir + '/' + tmp_debName + '_deb/usr/share/applications/' + validAppName + "-romanysoft.desktop";
    gulp.src('./electron/deb.desktop')
        .pipe(replace(/AAppNameA/g, info.appName))  
        .pipe(replace(/AAppDescriptionA/g, info.appDescription))
        .pipe(replace(/AAppExecPathA/g, '/usr/lib/' + info.appName.replace(/\s/g, "")))
        .pipe(replace(/AAppIconA/g, '/usr/share/icons/' + validAppName + "-romanysoft.png"))
        .pipe(rename(validAppName + "-romanysoft.desktop"))
        .pipe(gulp.dest(release_linux_dir + '/' + tmp_debName + '_deb/usr/share/applications/'));
        
    // 修改control文件，然后保存
    var app_run_control_path = release_linux_dir + '/' + tmp_debName + '_deb/DEBIAN/';
    gulp.src('./electron/control')
        .pipe(replace(/AAppNameA/g, info.appName.replace(/\s/g, "")))  
        .pipe(replace(/AAppDescriptionA/g, info.appDescription))
        .pipe(replace(/AAppVersionA/g, info.appVersion))
        .pipe(replace(/AArchitectureA/g, g_cur_task_linux_isX64 ? 'amd64' : 'i386'))
        .pipe(gulp.dest(app_run_control_path));  
        
    var deferred = Q.defer();
    // do async stuff
    setTimeout(function() {
        deferred.resolve();
    }, 15000);      
    return deferred.promise;   
});

gulp.task('package-linux-zip', function(){
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    var tmp_zipName = g_cur_task_linux_isX64 ? tmp_linux64DirName : tmp_linux32DirName;
    var tmp_debName = g_cur_task_linux_isX64 ? tmp_linux64DirName : tmp_linux32DirName;
    
    var deferred = Q.defer();   
     
    var zip = require("gulp-zip");    
    gulp.src(tmp_destDir + "/**")
        .pipe(zip(tmp_zipName + ".zip"))
        .pipe(gulp.dest(release_linux_dir))
        .on('finish', function(){
            console.log('zip over...');
            deferred.resolve();
        })
        
       
    /**    
    var app_run_deb_path = release_linux_dir + '/' + tmp_debName + '_deb/**';
    var debZipFile = tmp_debName + "_deb.zip";
    console.log('deb_path =' + app_run_deb_path + "; tmp_debName = " + debZipFile);
    gulp.src(app_run_deb_path)
        .pipe(zip(debZipFile))
        .pipe(gulp.dest(release_linux_dir));
    **/    

    return deferred.promise;        
});


gulp.task('release_linux_32', gulpSequence(
    'set_linux32', 
    'package_linux_copy_bin', 
    'package_linux_rename_bin',
    'package_linux_copy_bundle.app', 
    'package_linux_copy_publish', 
    //'package_linux_npm_public_server', // linux 包需要在linux平台上执行npm install
    //'package_linux_zip_public_server',    
    'package_linux_copy_romanysoft', 
    'package_linux_npm', 
    'package-linux-git-version',
    //'package-linux-makeDEBDir',
    'package-linux-zip'
    ));
    
gulp.task('release_linux_64', gulpSequence(
    'set_linux64', 
    'package_linux_copy_bin', 
    'package_linux_rename_bin',
    'package_linux_copy_bundle.app', 
    'package_linux_copy_publish', 
    //'package_linux_npm_public_server', // linux 包需要在linux平台上执行npm install
    //'package_linux_zip_public_server',       
    'package_linux_copy_romanysoft', 
    'package_linux_npm', 
    'package-linux-git-version',
    //'package-linux-makeDEBDir',
    'package-linux-zip'
    ));
    
gulp.task('release_linux', gulpSequence(
    'package_linux_del', 
    'release_linux_64', 
    'release_linux_32'));


gulp.task('release', gulpSequence('default','release_win', 'release_linux'));
