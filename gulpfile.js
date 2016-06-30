var gulp = require('gulp'),
    clean = require('gulp-clean'),
    shell = require('gulp-shell'),
    gulpGit = require('gulp-git'),
    gulpSequence = require('gulp-sequence').use(gulp),
    vinylPaths = require('vinyl-paths'),
    gulpFooter = require('gulp-footer'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'), // 重命名
    minify = require('gulp-minify'),
    uglify = require('gulp-uglify'),
    pump = require('pump'), // https://github.com/terinjokes/gulp-uglify/blob/master/docs/why-use-pump/README.md#why-use-pump
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    cleanCSS = require('gulp-clean-css'),
    rcedit = require('rcedit'),
    htmlmin = require('gulp-htmlmin'),
    gulpFilter = require('gulp-filter'), //过滤文件
    revappend = require('gulp-rev-append'), //使用gulp-rev-append给页面的引用添加版本号，清除页面引用缓存。
    Q = require('q');


/// 来源于NodejS系统内置的
var sysUtil = require('util'),
    sysURL = require('url'),
    sysFS = require('fs'),
    sysPath = require('path'),
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


var RTYUtils = {
    // 参照大鹏，DataStorm服务器utils.js 源码
    queue: function(_done) {
        var _next = [];

        function callback(err) {
            if (!err) {
                var next = _next.shift();
                if (next) {
                    var args = arguments;
                    args.length ? (args[0] = callback) : (args = [callback]);
                    return next.apply(null, args);
                }
            }
            return _done.apply(null, arguments);
        }

        var r = {
            next: function(func) {
                _next.push(func);
                return r;
            },
            done: function(func) {
                _done = func;
                r.start();
            },
            start: function() {
                callback(null, callback);
            }
        };
        return r;
    }
};

var destDir = "./build/public"; // 构建临时目录
var releaseDir = "./release"; // 产品发布目录

/**
 * 自动处理助手，引用判断路径是否存在，然后执行的方式
 * @param  {[type]} srcdir     [description]
 * @param  {[type]} fn_whenExist dest存在的情况下，执行
 * @param  {[type]} fn_skip    dest 不存在的情况下直接跳出
 * @return {[type]}            [description]
 */
function g_autohelper_checkpathexist(srcdir, fn_whenExist, fn_skip) {
    // 判断源路径是否存在，然后执行代码
    console.log("========== g_autohelper_checkpathexist" + srcdir);
    if (sysFS.existsSync(srcdir) || sysFS.existsSync(sysPath.join(__dirname, srcdir))) {
        fn_whenExist && fn_whenExist();
    } else {
        console.log("路径不存在,跳过" + srcdir);
        fn_skip && fn_skip();
    }
};

function g_track_dest(destPath, callback) {

    var dest = gulp.dest(destPath).on('finish', function() {
            console.log(destPath + "========== [writer] no error");
            callback && callback();
        })
        .on('drain', function() {
            console.log('something is drain into the writer');
        })
        .on('error', function() {
            console.log('something is error into the writer');
        })
        .on('pipe', function() {
            console.log('something is piping into the writer');
        })
        .on('unpipe', function() {
            console.log('something has stopped piping into the writer');
        });

    return dest;
}

function g_track_src(srcPath, callback) {
    var src = gulp.src(srcPath).on('end', function() {
            console.log(srcPath + "========== [reader] no error");
            callback && callback();
        })
        .on('readable', function() {
            //console.log('something is readable into the reader');
        })
        .on('error', function() {
            console.log(srcPath + ' === is error into the reader');
        })
        .on('close', function() {
            //console.log('something is close into the reader');
        })
        .on('data', function() {
            //console.log('something has data piping into the reader');
        });

    return src;
}



gulp.task('build_public_del', function(cb) {
    return g_common_del(destDir);
});

gulp.task('public_main', function(cb) {
    // 主要Main.js
    pump([
            gulp.src('./public/js/**/*.js'),
            uglify(),
            gulp.dest(destDir + '/js')
        ],
        cb
    );
});

gulp.task('public_lessCSS', function(cb) {
    pump([
            gulp.src(['./public/styles/**/*.less']),
            less(),
            gulp.dest(destDir + '/styles')
        ],
        cb
    );
});


gulp.task('public_copy', function(cb) {
    var deferred = Q.defer();
    try {
        RTYUtils.queue()
            .next(function(nxt) {
                g_autohelper_checkpathexist('./public/3rdparty/', function() {
                    g_track_src('./public/3rdparty/**', nxt)
                        .pipe(g_track_dest(destDir + '/3rdparty', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/common/', function() {
                    g_track_src(['./public/common/**', '!./public/common/**/*.js'], nxt)
                        .pipe(g_track_dest(destDir + '/common', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/common/', function() {
                    pump([
                            g_track_src(['./public/common/**/*.js',
                                    '!./public/common/kendoui/**/*.js'
                                ],
                                nxt),
                            uglify(),
                            g_track_dest(destDir + '/common', nxt)
                        ],
                        nxt
                    );
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/images/', function() {
                    g_track_src('./public/images/**', nxt)
                        .pipe(g_track_dest(destDir + '/images', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/licenses/', function() {
                    g_track_src('./public/licenses/**', nxt)
                        .pipe(g_track_dest(destDir + '/licenses', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/styles/', function() {
                    g_track_src(['./public/styles/**', '!./public/styles/**/*.less'], nxt)
                        .pipe(g_track_dest(destDir + '/styles', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/styles/', function() {
                    g_track_src('./public/styles/**/*.css', nxt)
                        .pipe(cleanCSS({
                            debug: true
                        }, function(details) {
                            console.log(details.name + ': ' + details.stats.originalSize);
                            console.log(details.name + ': ' + details.stats.minifiedSize);
                        }))
                        .pipe(g_track_dest(destDir + '/styles', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/css/', function() {
                    g_track_src('./public/css/*.css', nxt)
                        .pipe(cleanCSS({
                            debug: true
                        }, function(details) {
                            console.log(details.name + ': ' + details.stats.originalSize);
                            console.log(details.name + ': ' + details.stats.minifiedSize);
                        }))
                        .pipe(g_track_dest(destDir + '/css', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/l10n/', function() {
                    g_track_src('./public/l10n/**', nxt)
                        .pipe(g_track_dest(destDir + '/l10n', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/lang/', function() {
                    g_track_src('./public/lang/**', nxt)
                        .pipe(g_track_dest(destDir + '/lang', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/tmpl/', function() {
                    g_track_src('./public/tmpl/**', nxt)
                        .pipe(g_track_dest(destDir + '/tmpl', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/templates/', function() {
                    g_track_src('./public/templates/**', nxt)
                        .pipe(g_track_dest(destDir + '/templates', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/view/', function() {
                    g_track_src('./public/view/**', nxt)
                        .pipe(g_track_dest(destDir + '/view', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/app/', function() {
                    g_track_src('./public/app/**', nxt)
                        .pipe(g_track_dest(destDir + '/app', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/3rdparty/', function() {
                    g_track_src('./public/3rdparty/**', nxt)
                        .pipe(g_track_dest(destDir + '/3rdparty', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/assets/', function() {
                    g_track_src('./public/assets/**', nxt)
                        .pipe(g_track_dest(destDir + '/assets', nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/server/', function() {
                    g_track_src(['./public/server/**/*'], nxt)
                        .pipe(g_track_dest(destDir + '/server', nxt));
                }, nxt);
            }).next(function(nxt) {
                var htmlOptions = {
                    removeComments: true, //清除HTML注释
                    collapseWhitespace: true, //压缩HTML
                    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
                    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
                    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
                    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
                    minifyJS: true, //压缩页面JS
                    minifyCSS: true //压缩页面CSS
                };

                g_autohelper_checkpathexist('./public/', function() {
                    g_track_src('./public/index.html', nxt)
                        .pipe(revappend())
                        .pipe(htmlmin(htmlOptions))
                        .pipe(g_track_dest(destDir, nxt));
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/project.json', function() {
                    g_track_src('./public/project.json', nxt)
                        .pipe(g_track_dest(destDir, nxt));
                }, nxt);
            }).done(function(err) {
                err ? deferred.reject(err) : deferred.resolve();
            });
    } catch (e) {
        console.trace(e);
        deferred.reject(e);
    }

    return deferred.promise;
});


gulp.task('node-server', function() {

    var deferred = Q.defer();
    try {
        RTYUtils.queue()
            .next(function(nxt) {
                g_autohelper_checkpathexist('./server', function() {
                    pump([
                            g_track_src(['./server/**/*', '!./server/node_modules/**/*',
                                '!./server/node_modules/'
                            ], nxt),
                            g_track_dest(destDir + '/server', nxt)
                        ],
                        nxt
                    );
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./server', function() {
                    pump([
                            g_track_src(['./server/*.js'], nxt),
                            uglify(),
                            g_track_dest(destDir + '/server', nxt)
                        ],
                        nxt
                    );
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/www', function() {
                    pump([
                            g_track_src(['./public/www/**/*.js'], nxt),
                            uglify(),
                            g_track_dest(destDir, nxt)
                        ],
                        nxt
                    );
                }, nxt);
            }).done(function(err) {
                err ? deferred.reject(err) : deferred.resolve();
            });
    } catch (e) {
        console.trace(e);
        deferred.reject(e);
    }

    return deferred.promise;

});

gulp.task('extend_task', function() {

    var deferred = Q.defer();
    try {
        RTYUtils.queue()
            .next(function(nxt) {
                g_autohelper_checkpathexist('./public/locales/', function() {
                    pump([
                            g_track_src(['./public/locales/**/*.js'], nxt),
                            uglify(),
                            g_track_dest(destDir + '/locales', nxt)
                        ],
                        nxt
                    );
                }, nxt);
            }).next(function(nxt) {
                g_autohelper_checkpathexist('./public/locales/extend/editormd/', function() {
                    pump([
                            g_track_src(['./public/locales/extend/editormd/**/*.js'], nxt),
                            uglify(),
                            g_track_dest(destDir + '/locales/extend/editormd', nxt)
                        ],
                        nxt
                    );
                }, nxt);
            }).done(function(err) {
                err ? deferred.reject(err) : deferred.resolve();
            });
    } catch (e) {
        console.trace(e);
        deferred.reject(e);
    }

    return deferred.promise;

});

gulp.task('delayWait', function() {
    var deferred = Q.defer();
    // do async stuff
    setTimeout(function() {
        deferred.resolve();
    }, 1);

    return deferred.promise;
});

// 测试包处理
gulp.task('default', gulpSequence(
    'build_public_del', 'public_main', 'public_lessCSS', 'public_copy', 'extend_task', 'node-server',
    'delayWait'
));


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var forElectronDir = "D:/workspace/testprj/0git_html/MyDicTool/for_electron";
var bootElectronDir = "D:/workspace/testprj/0git_html/MyDicTool/boot_electron";
var assReleasePackage = "D:/workspace/nACommonJS/common/electron/ass-release";
var assBundlePackage = __dirname + "/electron/bundle.app";

/// {}
var g_cur_task_for_os = 1; // 1. windows, 2.linux, 3. MacOS


/// {windows 变量}
var release_win_dir = releaseDir + "/win";
var tmp64Dir = release_win_dir + "/tmp64";
var tmp32Dir = release_win_dir + "/tmp32";
var g_cur_task_win_isX64 = true; // 当前执行

/// {linux变量}
var g_cur_task_linux_isX64 = true;
var release_linux_dir = releaseDir + "/linux";
var tmp_linux64Dir = release_linux_dir + "/tmp64";
var tmp_linux32Dir = release_linux_dir + "/tmp32";
var tmp_linux64DirName = "";
var tmp_linux32DirName = "";

/// {MacOS 变量}
var g_cur_task_macos_isNOMAS = true;
var release_macos_dir = releaseDir + "/mac";
var tmp_macosNoMASDir = release_macos_dir + "/nomas";
var tmp_macosMASDir = release_macos_dir + "/mas";
var tmp_macosNOMASDirName = "";
var tmp_macosMASDirName = "";


/**
 * 获得当前临时目标目录，根据当前任务属性
 */
function g_getOSTempDestDir() {
    if (1 === g_cur_task_for_os) {
        return g_cur_task_win_isX64 ? tmp64Dir : tmp32Dir;
    } else if (2 === g_cur_task_for_os) {
        return g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    } else if (3 === g_cur_task_for_os) {
        return g_cur_task_macos_isNOMAS ? tmp_macosNoMASDir : tmp_macosMASDir;
    }
}


////
var g_AppInfoPlist = "";
try {
    g_AppInfoPlist = nm_plist.parse(sysFS.readFileSync(assBundlePackage + "/Contents/info.plist", 'utf8'));;
} catch (e) {
    console.log(e);
}

var g_getInfoFromInfoPlist_func = function() {
    var info = g_AppInfoPlist;

    return {
        appName: info.CFBundleDisplayName,
        executeName: info.CFBundleExecutable,
        appVersion: info.CFBundleShortVersionString,
        copyright: info.NSHumanReadableCopyright,
        appDescription: info.RomanysoftAppDescription || "",
        useNodePlugin: info.RomanysoftUseNodePlugin || false, /// 是否使用node插件
        usePythonPlugin: info.RomanysoftUsePythonPlugin || false, /// 是否使用python插件
        company: "Romanysoft, LAB."
    };
}

/**
 * 公共处理Copy publish目录
 */
function g_package_copy_publish(tmp_destDir) {
    var deferred = Q.defer();

    var dest = gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/');
    dest.on('finish', function() {
        deferred.resolve();
    });
    gulp.src(destDir + "/**")
        .pipe(dest);

    return deferred.promise;
}

/**
 * 公共的处理npm public下面的server
 */
function g_npm_public_server(tmp_destDir) {
    /// 检查是否使用Node插件
    var info = g_getInfoFromInfoPlist_func();
    if (info.useNodePlugin) {
        var install = require("gulp-install");
        return gulp.src(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/server/package.json')
            .pipe(install());
    }

    return gulp.src('./');
}

/**
 * 公共的压缩zip，public下面的server
 */
function g_common_zip_public_server(tmp_destDir, cb) {
    var deferred = Q.defer();

    /// 检查是否使用Node插件
    var info = g_getInfoFromInfoPlist_func();
    if (info.useNodePlugin) {
        var zip = require("gulp-zip");

        function deleServerDir() {
            var cleanor = clean({
                force: true
            });
            cleanor.on('finish', function() {
                console.log('### always delete server dir for zip ####');
                deferred.resolve();
            })

            // 刪除原先文件
            gulp.src(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/server/', {
                    read: false
                })
                .pipe(cleanor);
        }

        console.log('### start zip file ####');
        gulp.src(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/server/**/**')
            .pipe(zip("server.zip"))
            .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/Resources/public/'))
            .on('finish', function() {
                deleServerDir();
            });

    } else {
        deferred.resolve();
    }

    Q.when(deferred.promise).then(function() {
        cb && cb();
    });
}

/**
 * 公共处理copy Romanysoft部分
 */
function g_copy_romanysoft_func(tmp_destDir) {
    var deferred = Q.defer();

    //###bootElectronDir
    gulp.src(bootElectronDir + '/**/*.min.js')
        .pipe(gulp.dest(tmp_destDir + '/resources/default_app/'));

    //###forElectronDir
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

    gulp.src(forElectronDir + '/romanysoft/UnitTest/**/*.js')
        .pipe(uglify().on('error', gutil.log))
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
function g_npm_romanysoftSDK(tmp_destDir) {
    var install = require("gulp-install");
    var replace = require('gulp-replace');

    var info = g_getInfoFromInfoPlist_func();
    var validAppName = info.appName.replace(/\s/g, "-");
    console.log("validAppName = ", validAppName);

    return gulp.src(forElectronDir + '/package.json')
        .pipe(replace(/for_electronSDK/g, validAppName)) //修改app目录下面的resources\app\package.json 修改name
        .pipe(gulp.dest(tmp_destDir + '/resources/app/'))
        .pipe(install({
            production: true
        }));
}

/**
 * 公共 写入Romanysoft SDK 的版本号
 */
function g_write_git_version(tmp_destDir, cb) {
    gulpGit.revParse({
        args: '--short HEAD',
        cwd: forElectronDir,
        quiet: true
    }, function(err, hash) {
        console.log('current git hash: ' + hash);
        var filePath = tmp_destDir + '/resources/app/version';
        var sysFS = require('fs');

        sysFS.writeFile(filePath, hash, 'utf8', function(err) {
            cb && cb(err);
        });
    });
}

/**
 * 公共 制作zip包
 */

function g_genrate_zip(tmp_destDir, tmp_zipName, cb, password) {
    var deferred = Q.defer();
    var exe_7zip = 'C:\\Program Files\\7-Zip\\7z.exe',
        commandList = [],
        options = {},
        errorBuf = null;

    options.env = process.env;
    options.cwd = __dirname + "/" + tmp_destDir + "/../";
    RTYUtils.queue()
        .next(function(next) {
            commandList = [
                "a",
                "-tzip",
                "-r",
                tmp_zipName + ".zip",
                __dirname + "/" + tmp_destDir + "/*"
            ];

            // 有密码的情况
            if (password) {
                commandList = [
                    "a",
                    "-tzip",
                    '-p' + password,
                    "-r",
                    tmp_zipName + ".zip",
                    __dirname + "/" + tmp_destDir + "/*"
                ];
            }


            console.log(commandList);
            sysChildProcess.execFile(exe_7zip, commandList, options, function(err) {
                next && next(err);
            });

        })
        .done(function(err) {
            if (err) {
                console.log(err.toString("utf8"));
                deferred.reject(err);
            } else {
                cb ? cb(function() {
                    deferred.resolve();
                }) : deferred.resolve();
            }
        });


    return deferred.promise;
}

/**
 * 公共处理解压
 */
function g_unzip(zipFile, destPath, password) {
    var deferred = Q.defer();
    var exe_7zip = 'C:\\Program Files\\7-Zip\\7z.exe',
        commandList = [],
        options = {},
        errorBuf = null;

    options.env = process.env;
    options.cwd = __dirname + "/" + tmp_destDir + "/../";
    RTYUtils.queue()
        .next(function(next) {
            commandList = [
                'x',
                zipFile,
                '-y',
                '-aoa',
                '-o' + destPath,
            ];

            if (password) {
                commandList.push('-p' + password);
            }

            console.log(commandList);
            errorBuf = sysChildProcess.execFileSync(exe_7zip, commandList, options);

            next && next(errorBuf.length > 0 ? errorBuf : null);
        })
        .done(function(errBuf) {
            if (errBuf) {
                console.log(errBuf.toString("utf8"));
            } else {
                cb && cb();
                deferred.resolve();
            }
        });


    return deferred.promise;
}

/**
 * 公共 制作asar包
 */

function g_make_asar(tmp_srcDir, tmp_destDir, tmp_asarName, cb) {
    var deferred = Q.defer();
    var asarTool = 'asar.cmd',
        commandList = [],
        options = {},
        errorBuf = null;

    options.env = process.env;
    options.cwd = __dirname;
    RTYUtils.queue()
        .next(function(next) {
            commandList = [
                "pack",
                tmp_srcDir,
                tmp_destDir + tmp_asarName + ".asar"
            ];

            console.log("g_make_asar:" + commandList);
            sysChildProcess.execFile(asarTool, commandList, options, function(err) {
                next && next(err);
            });
        })
        .done(function(err) {
            if (err) {
                console.log(err.toString("utf8"));
                deferred.reject(err);
            } else {
                cb ? cb(function() {
                    deferred.resolve();
                }) : deferred.resolve();
            }
        });

    return deferred.promise;
}


/**
 * 获得共用的RCEdit信息
 */
function g_common_getRCEDITOptions() {
    var info = g_getInfoFromInfoPlist_func();
    var companyName = info.company;

    console.log('info =', info);

    var options = {
        "icon": assBundlePackage + "/Contents/Resources/app.ico",
        "file-version": info.appVersion,
        "product-version": info.appVersion,
        "version-string": {
            "ProductName": info.appName,
            "InternalName": info.appName,
            "OriginalFilename": info.appName,
            "Comments": info.appDescription,
            "FileDescription": info.appDescription,
            "CompanyName": companyName,
            "LegalCopyright": "Copyright " + (new Date()).getFullYear() + " " + companyName
        }
    }

    return options;
}

/**
 * 公共处理删除的方式
 */
function g_common_del(destPath) {
    var deferred = Q.defer();
    RTYUtils.queue()
        .next(function(next) {
            var err = null;
            try {
                gulp.src(destPath, {
                        read: false
                    })
                    .pipe(clean({
                        force: true
                    }));
            } catch (e) {
                err = e;
            }

            var handler = setInterval(function() {
                if (!sysFS.existsSync(destPath)) {
                    clearInterval(handler);
                    next && next(err);
                }
            }, 500);
        })
        .done(function(errBuf) {
            if (errBuf)
                console.error(eerBuf);

            errBuf ? deferred.reject(errBuf) : deferred.resolve();

        });
    return deferred.promise;
}

/**
 * 公共函数 npm install
 */
function g_npm_install(tmp_destDir, cb) {
    var deferred = Q.defer();
    var exe_npm = 'npm.cmd',
        commandList = [],
        options = {},
        errorBuf = null;

    options.env = process.env;
    options.cwd = tmp_destDir;

    console.log("options.cwd = ", options.cwd)

    RTYUtils.queue()
        .next(function(next) {
            commandList = [
                "install"
            ];

            console.log(commandList);
            sysChildProcess.execFile(exe_npm, commandList, options, function(err) {
                next && next(err);
            });

        })
        .done(function(err) {
            if (err) {
                console.log("Error:", err);
                console.log(err.toString("utf8"));
                deferred.reject(err);
            } else {
                cb ? cb(function() {
                    deferred.resolve();
                }) : deferred.resolve();
            }
        });


    return deferred.promise;
}

// Windows准备打包
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('package_win_del', function(cb) {
    return g_common_del(release_win_dir);
});

gulp.task('package_win_tmp_del_only', function(cb) {
    var tmp_destDir = g_getOSTempDestDir();
    return g_common_del(tmp_destDir);
});


gulp.task('package_win_copy_exe', function() {
    var tmp_destDir = g_getOSTempDestDir();

    if (g_cur_task_win_isX64) {
        return gulp.src(assReleasePackage + '/win/win64/**/*')
            .pipe(gulp.dest(tmp64Dir));
    } else {
        return gulp.src(assReleasePackage + '/win/win32/**/*')
            .pipe(gulp.dest(tmp32Dir));
    }
});

gulp.task('package_win_rcedit', function(cb) {
    var tmp_destDir = g_getOSTempDestDir();


    var info = g_getInfoFromInfoPlist_func();
    var companyName = info.company;

    console.log('info =', info);

    var options = g_common_getRCEDITOptions();

    var destFilePath = tmp_destDir + "/electron.exe";
    var validAppNameForSetup = info.appName.replace(/\s/g, "");

    rcedit(destFilePath, options, function(err) {
        if (!err) {
            function delElectronFile() {
                console.log('2############');
                // 刪除原先文件
                gulp.src(destFilePath, {
                        read: false
                    })
                    .on('end', function() {
                        console.log('3############');
                        cb && cb();
                    })
                    .pipe(clean({
                        force: true
                    }));
            }

            // 重命名，并刪除原先的文件
            gulp.src(destFilePath)
                .pipe(rename(validAppNameForSetup + ".exe"))
                .pipe(gulp.dest(tmp_destDir).on('finish', function() {
                    console.log('1############');
                    delElectronFile();
                }));

        } else {
            console.trace(err);
            cb && 　cb(err);
        }
    });

});

gulp.task('package_win_copy_bundle.app', function() {
    var tmp_destDir = g_getOSTempDestDir();

    gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/'));

    /// 检查是否使用Node插件
    var info = g_getInfoFromInfoPlist_func();
    if (info.useNodePlugin) {
        console.log('use node plugin....');
        var nodePluginPath = g_cur_task_win_isX64 ? assReleasePackage + '/plugins/node/win/win64/node.exe' :
            assReleasePackage + '/plugins/node/win/win32/node.exe';

        gulp.src(nodePluginPath)
            .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/PlugIns/'));
    }
});

gulp.task('package_win_copy_publish', function() {
    return g_package_copy_publish(g_getOSTempDestDir());
});

gulp.task('package_win_npm_public_server', function() {
    return g_npm_public_server(g_getOSTempDestDir());
});

gulp.task('package_win_zip_public_server', function(cb) {
    g_common_zip_public_server(g_getOSTempDestDir(), cb);
});

gulp.task('package_win_copy_romanysoft', function() {
    return g_copy_romanysoft_func(g_getOSTempDestDir());
});

gulp.task('package_win_npm', function() {
    return g_npm_romanysoftSDK(g_getOSTempDestDir());
});

gulp.task('package-win-git-version', function(cb) {
    g_write_git_version(g_getOSTempDestDir(), cb);
});

/**
 * 暂时不能使用，部分参数，没有办法执行
 */
gulp.task('package_win_installer_AdvancedInstaller', function(cb) {
    var tmp_destDir = g_getOSTempDestDir();
    var platform = g_cur_task_win_isX64 ? 'x64' : 'x86'
    console.log("AdvancedInstaller安装包" + platform);

    var aipFileName = 'win_installer_x86.aip';
    if (platform === 'x64')
        aipFileName = 'win_installer_x64.aip';

    console.log("打开" + aipFileName);
    cb && cb();
    return;

    var info = {};
    info = nm_plist.parse(sysFS.readFileSync(__dirname + '/' + tmp_destDir +
        "/resources/app/bundle.app/Contents/info.plist", 'utf8'));

    var appName = info.CFBundleDisplayName,
        appVersion = info.CFBundleShortVersionString,
        copyright = info.NSHumanReadableCopyright,
        appDescription = info.RomanysoftAppDescription || "",
        company = "Romanysoft, LAB.";

    var validAppNameForSetup = appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);


    // 指定AdvancedInstaller 的CLI路径
    var taskAppPath =
        "C:\\Program Files (x86)\\Caphyon\\Advanced Installer 12.7.2\\bin\\x86\\AdvancedInstaller.com";

    var destAIPFilePath = __dirname + "/electron/" + aipFileName;
    // Step2: 修改工程的相关信息
    var taskCommandList = [],
        options = {},
        errorBuf = null;
    options.env = process.env;


    RTYUtils.queue()
        .next(function(next) {
            taskCommandList = ["/edit", destAIPFilePath,
                "/SetVersion", appVersion
            ];
            console.log(taskCommandList);
            errorBuf = sysChildProcess.execFileSync(taskAppPath, taskCommandList, options);

            next && next(errorBuf.length > 0 ? errorBuf : null);
        })
        .done(function(errBuf) {
            if (errBuf) {
                cb && cb(errBuf);
            } else {
                cb();
            }
        });

});

/***
 * Note:
 * 2016年2月24日23:09:55, 原先的处理生成Windows安装包。但发现，安装包在用户客户端上进行安装的时候，需要.net环境，同时在Windows7 非SP1环境，安装不了
 */
gulp.task('package_win_getInstaller_squirrel', function(cb) {
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
    info = nm_plist.parse(sysFS.readFileSync(__dirname + '/' + tmp_destDir +
        "/resources/app/bundle.app/Contents/info.plist", 'utf8'));

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
        setup_filename: validAppNameForSetup + "-v" + appVersion + "-win32" + "-" + platform +
            "-setup.exe",
        setup_icon: __dirname + '/electron/setup.ico',
        loading_gif: __dirname + '/electron/loading.gif',
        iconUrl: __dirname + "/electron/bundle.app/Contents/Resources/app.ico"
    };

    createInstaller(opts, function done(err) {
        cb(err);
    });
});

gulp.task('package_win_process_zipAndOther', function() {
    var tmp_destDir = g_getOSTempDestDir();
    var _refCallback = null;

    var deferred = Q.defer();
    RTYUtils.queue()
        .next(function(next) {
            //1. 7zip copy
            var _7zipToolPath = assReleasePackage + '/plugins/7z/win/x86/**/*'
            gulp.src(_7zipToolPath)
                .pipe(gulp.dest(tmp_destDir + '/resources/tools/7z/').on('finish', function() {
                    next && next();
                }));
        })
        .next(function(next) {
            //2. boot_electron 对package.json进行修改
            var replace = require('gulp-replace');
            var info = g_getInfoFromInfoPlist_func();
            var validAppName = info.appName.replace(/\s/g, "-");
            console.log("validAppName = ", validAppName);
            gulp.src(bootElectronDir + '/package.json')
                .pipe(replace(/BOOTELECTRON/g, validAppName)) //修改app目录下面的resources\default_app\package.json 修改name
                .pipe(gulp.dest(tmp_destDir + '/resources/default_app/').on('finish', function() {

                    //3.0.0 asar default_app
                    var srcDir = tmp_destDir + '/resources/default_app/',
                        destDir = tmp_destDir + '/resources/';

                    g_npm_install(srcDir, function() {
                        g_make_asar(srcDir, destDir, 'default_app', function(_cb) {
                            _refCallback = _cb;
                            //3.0.1 delete "default_app" dir
                            console.log('.... must delete default_app dir....');
                            if (g_common_del(srcDir)) {
                                next && next();
                            }
                        });
                    })

                }))
        })
        .next(function(next) {
            //{3.4} zip the "app" dir, then delete it.
            var appDirPath = tmp_destDir + '/resources/app/',
                password = 'rfoptionsenv',
                zipName = "coreapp";
            //3. zip the "app" dir
            g_genrate_zip(appDirPath, zipName, function(_cb) {
                _refCallback = _cb;
                //4. delete "app" dir
                console.log('.... must delete app dir....')
                if (g_common_del(appDirPath)) {
                    next && next();
                }
            }, password);
        })
        .done(function(err) {
            _refCallback && _refCallback(err);
            deferred.resolve();
        });
    return deferred.promise;
});

gulp.task('set_win32', function() {
    g_cur_task_win_isX64 = false;
    g_cur_task_for_os = 1;

});

gulp.task('set_win64', function() {
    g_cur_task_win_isX64 = true;
    g_cur_task_for_os = 1;
});


gulp.task('release_win_32', gulpSequence(
    'set_win32',
    'package_win_tmp_del_only',
    'package_win_copy_exe',
    'package_win_rcedit',
    'package_win_copy_bundle.app',
    'package_win_copy_publish',
    'package_win_npm_public_server',
    'package_win_zip_public_server',
    'package_win_copy_romanysoft',
    'package_win_npm',
    'package-win-git-version', 'package_win_process_zipAndOther', 'package_win_installer_AdvancedInstaller'

    //,'package_win_getInstaller'
));

gulp.task('release_win_64', gulpSequence(
    'set_win64',
    'package_win_tmp_del_only',
    'package_win_copy_exe',
    'package_win_rcedit',
    'package_win_copy_bundle.app',
    'package_win_copy_publish',
    'package_win_npm_public_server',
    'package_win_zip_public_server',
    'package_win_copy_romanysoft',
    'package_win_npm',
    'package-win-git-version', 'package_win_process_zipAndOther', 'package_win_installer_AdvancedInstaller'
    //,'package_win_getInstaller'
));

gulp.task('release_win', gulpSequence(
    'package_win_del',
    'release_win_64',
    'release_win_32'));


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Linux 处理
gulp.task('set_linux32', function() {
    g_cur_task_linux_isX64 = false;
    g_cur_task_for_os = 2;

    console.log("===========g_cur_task_linux_isX64 = " + g_cur_task_linux_isX64);

    var info = g_getInfoFromInfoPlist_func();
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);

    var platform = g_cur_task_linux_isX64 ? 'x64' : 'ia32';
    tmp_linux32DirName = validAppNameForSetup + "-v" + info.appVersion + "-linux" + "-" + platform +
        "-install";
    tmp_linux32Dir = release_linux_dir + "/" + tmp_linux32DirName;
});

gulp.task('set_linux64', function() {
    g_cur_task_linux_isX64 = true;
    g_cur_task_for_os = 2;

    console.log("===========g_cur_task_linux_isX64 = " + g_cur_task_linux_isX64);

    var info = g_getInfoFromInfoPlist_func();
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);

    var platform = g_cur_task_linux_isX64 ? 'x64' : 'ia32';
    tmp_linux64DirName = validAppNameForSetup + "-v" + info.appVersion + "-linux" + "-" + platform +
        "-install";
    tmp_linux64Dir = release_linux_dir + "/" + tmp_linux64DirName;
});

gulp.task('package_linux_del', function(cb) {
    var deferred = Q.defer();

    var cleanor = clean({
        force: true
    });
    cleanor.on('finish', function() {
        deferred.resolve();
    });
    return gulp.src(release_linux_dir, {
            read: false
        })
        .pipe(cleanor);

    Q.when(deferred.promise).then(function() {
        cb && cb();
    });
});

gulp.task('package_linux_copy_bin', function() {
    var tmp_destDir = g_getOSTempDestDir();

    var deferred = Q.defer();

    var dest = gulp.dest(tmp_destDir);
    dest.on('finish', function() {
        deferred.resolve();
    });


    console.log("===========g_cur_task_linux_isX64 = " + g_cur_task_linux_isX64);
    if (g_cur_task_linux_isX64) {
        console.log("=========== copy linux64");
        gulp.src(assReleasePackage + '/linux/x64/**/*')
            .pipe(dest);
    } else {
        console.log("=========== copy linux32");
        gulp.src(assReleasePackage + '/linux/ia32/**/*')
            .pipe(dest);
    }

    return deferred.promise;
});

gulp.task('package_linux_rename_bin', function(cb) {
    var tmp_destDir = g_getOSTempDestDir();

    var info = g_getInfoFromInfoPlist_func();
    var companyName = info.company;

    console.log('info =', info);

    var destFilePath = tmp_destDir + "/electron";
    var validAppNameForSetup = info.appName.replace(/\s/g, "");

    // 重命名，并刪除原先的文件
    gulp.src(destFilePath)
        .pipe(rename(validAppNameForSetup))
        .pipe(gulp.dest(tmp_destDir));

    // 刪除原先文件
    gulp.src(destFilePath, {
            read: false
        })
        .pipe(clean({
            force: true
        }))
        .on('finish', function() {
            cb && cb();
        });
});

gulp.task('package_linux_copy_bundle.app', function() {
    var tmp_destDir = g_getOSTempDestDir();
    var deferred = Q.defer();

    gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/'))
        .on('finish', function() {
            /// 检查是否使用Node插件
            var info = g_getInfoFromInfoPlist_func();
            if (info.useNodePlugin) {
                console.log('use node plugin....');
                var nodePluginPath = g_cur_task_linux_isX64 ? assReleasePackage +
                    '/plugins/node/linux/x64/node' : assReleasePackage +
                    '/plugins/node/linux/ia32/node';

                gulp.src(nodePluginPath)
                    .pipe(gulp.dest(tmp_destDir + '/resources/app/bundle.app/Contents/PlugIns/'));
            }

            deferred.resolve();
        });

    return deferred.promise;
});

gulp.task('package_linux_copy_publish', function() {
    return g_package_copy_publish(g_getOSTempDestDir());
});

gulp.task('package_linux_npm_public_server', function() {
    return g_npm_public_server(g_getOSTempDestDir());
});

gulp.task('package_linux_zip_public_server', function(cb) {
    g_common_zip_public_server(g_getOSTempDestDir(), cb);
});

gulp.task('package_linux_copy_romanysoft', function() {
    return g_copy_romanysoft_func(g_getOSTempDestDir());
});

gulp.task('package_linux_npm', function() {
    return g_npm_romanysoftSDK(g_getOSTempDestDir());
});

gulp.task('package-linux-git-version', function(cb) {
    g_write_git_version(g_getOSTempDestDir(), cb);
});

gulp.task('package-linux-makeDEBDir', function() {
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
    var app_run_icon_path = release_linux_dir + '/' + tmp_debName + '_deb/usr/share/icons/' + validAppName +
        "-romanysoft.png";
    gulp.src('./electron/bundle.app/Contents/Resources/app.png')
        .pipe(rename(validAppName + "-romanysoft.png"))
        .pipe(gulp.dest(release_linux_dir + '/' + tmp_debName + '_deb/usr/share/icons/'));

    // 修改.desktop文件特性，然后保存
    var app_run_desktop_path = release_linux_dir + '/' + tmp_debName + '_deb/usr/share/applications/' +
        validAppName + "-romanysoft.desktop";
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

gulp.task('package-linux-zip', function() {
    var tmp_destDir = g_cur_task_linux_isX64 ? tmp_linux64Dir : tmp_linux32Dir;
    var tmp_zipName = g_cur_task_linux_isX64 ? tmp_linux64DirName : tmp_linux32DirName;

    var _refCallback = null;
    var deferred = Q.defer();
    RTYUtils.queue()
        .next(function(next) {
            //2. boot_electron 对package.json进行修改
            var replace = require('gulp-replace');
            var info = g_getInfoFromInfoPlist_func();
            var validAppName = info.appName.replace(/\s/g, "-");
            console.log("validAppName = ", validAppName);
            gulp.src(bootElectronDir + '/package.json')
                .pipe(replace(/BOOTELECTRON/g, validAppName)) //修改app目录下面的resources\default_app\package.json 修改name
                .pipe(gulp.dest(tmp_destDir + '/resources/default_app/').on('finish', function() {
                    //3.0.0 asar default_app
                    var srcDir = tmp_destDir + '/resources/default_app/',
                        destDir = tmp_destDir + '/resources/';

                    g_npm_install(srcDir, function() {
                        g_make_asar(srcDir, destDir, 'default_app', function(_cb) {
                            _refCallback = _cb;
                            //3.0.1 delete "default_app" dir
                            console.log('.... must delete default_app dir....');
                            if (g_common_del(srcDir)) {
                                next && next();
                            }
                        });
                    });
                }))
        })
        .next(function(next) {
            g_genrate_zip(tmp_destDir, tmp_zipName, function(_cb) {
                _refCallback = _cb;
                console.log('.... zip out put zipFile....');
                next && next();
            });
        })
        .done(function(err) {
            _refCallback && _refCallback(err);
            deferred.resolve();
        });


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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MacOS 处理
gulp.task('set_macos_noMAS', function() {
    g_cur_task_macos_isNOMAS = true;
    g_cur_task_for_os = 3;

    var info = g_getInfoFromInfoPlist_func();
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);

    var platform = g_cur_task_macos_isNOMAS ? 'darwin-x64' : 'mas-x64';
    tmp_macosNOMASDirName = validAppNameForSetup + "-v" + info.appVersion + "-" + platform;
    tmp_macosNoMASDir = release_macos_dir + "/" + tmp_macosNOMASDirName;
});

gulp.task('set_macos_MAS', function() {
    g_cur_task_macos_isNOMAS = false;
    g_cur_task_for_os = 3;

    var info = g_getInfoFromInfoPlist_func();
    var validAppNameForSetup = info.appName.replace(/\s/g, "");
    console.log("validAppName = ", validAppNameForSetup);

    var platform = g_cur_task_macos_isNOMAS ? 'darwin-x64' : 'mas-x64';
    tmp_macosMASDirName = validAppNameForSetup + "-v" + info.appVersion + "-" + platform;
    tmp_macosMASDir = release_macos_dir + "/" + tmp_macosMASDirName;
});

gulp.task('package_macos_del', function(cb) {
    var deferred = Q.defer();

    var cleanor = clean({
        force: true
    });
    cleanor.on('finish', function() {
        deferred.resolve();
    });
    return gulp.src(release_macos_dir, {
            read: false
        })
        .pipe(cleanor);

    Q.when(deferred.promise).then(function() {
        cb && cb();
    });
});

gulp.task('package_macos_copy_bin', function() {
    var tmp_destDir = g_getOSTempDestDir();

    if (g_cur_task_macos_isNOMAS) {
        return gulp.src(assReleasePackage + '/mac/nomas/**/*')
            .pipe(gulp.dest(tmp_destDir));
    } else {
        return gulp.src(assReleasePackage + '/mac/mas/**/*')
            .pipe(gulp.dest(tmp_destDir));
    }
});

gulp.task('package_macos_copy_bundle.app', function() {
    var tmp_destDir = g_getOSTempDestDir();
    var deferred = Q.defer();

    var destResouceDir = tmp_destDir + "/Electron.app/Contents/Resources";

    function copyInfoFile() {
        gulp.src('./electron/bundle.app/Contents/Info.plist')
            .pipe(gulp.dest(tmp_destDir + "/Electron.app/Contents/"))
            .on('finish', function() {
                deferred.resolve();
            });
    }

    gulp.src('./electron/bundle.app/**')
        .pipe(gulp.dest(destResouceDir + '/app/bundle.app/'))
        .on('finish', function() {
            /// 检查是否使用Node插件
            var info = g_getInfoFromInfoPlist_func();
            if (info.useNodePlugin) {
                console.log('use node plugin....');
                var nodePluginPath = assReleasePackage + '/plugins/node/mac/node';

                gulp.src(nodePluginPath)
                    .pipe(gulp.dest(destResouceDir + '/app/bundle.app/Contents/PlugIns/'));
            }

            copyInfoFile();
        });

    return deferred.promise;
});

gulp.task('package_macos_rename_bin', function() {
    var tmp_destDir = g_getOSTempDestDir();
    var deferred = Q.defer();

    var info = g_getInfoFromInfoPlist_func();

    console.log('info =', info);

    var destFilePath = tmp_destDir + "/Electron.app/Contents/MacOS/Electron";
    var validAppNameForSetup = info.executeName; //info.executeName.replace(/\s/g, "");


    function renameDir() {
        var srcDir = tmp_destDir + "/Electron.app";
        var cleanor = clean({
            force: true
        });
        cleanor.on('finish', function() {
            deferred.resolve();
        });

        gulp.src(srcDir + "/**/*")
            .pipe(gulp.dest(tmp_destDir + "/" + info.appName + ".app").on('finish', function() {
                gulp.src(srcDir, {
                        read: false
                    })
                    .pipe(cleanor);
            }));
    }

    // 重命名，并刪除原先的文件
    gulp.src(destFilePath)
        .pipe(rename(validAppNameForSetup))
        .pipe(gulp.dest(tmp_destDir + "/Electron.app/Contents/MacOS/").on('finish', function() {
            // 刪除原先文件
            var cleanor = clean({
                force: true
            });
            cleanor.on('finish', function() {
                renameDir();
            });

            gulp.src(destFilePath, {
                    read: false
                })
                .pipe(cleanor);
        }));

    return deferred.promise;
});

gulp.task('package_macos_copy_publish', function() {
    return g_package_copy_publish(g_getOSTempDestDir() + "/Electron.app/Contents");
});

gulp.task('package_macos_npm_public_server', function() {
    return g_npm_public_server(g_getOSTempDestDir() + "/Electron.app/Contents");
});

gulp.task('package_macos_zip_public_server', function(cb) {
    g_common_zip_public_server(g_getOSTempDestDir() + "/Electron.app/Contents", cb);
});

gulp.task('package_macos_copy_romanysoft', function() {
    return g_copy_romanysoft_func(g_getOSTempDestDir() + "/Electron.app/Contents");
});

gulp.task('package_macos_npm', function() {
    return g_npm_romanysoftSDK(g_getOSTempDestDir() + "/Electron.app/Contents");
});

gulp.task('package-macos-git-version', function(cb) {
    g_write_git_version(g_getOSTempDestDir() + "/Electron.app/Contents", cb);
});

gulp.task('package-macos-zip', function() {
    var tmp_destDir = g_cur_task_macos_isNOMAS ? tmp_macosNoMASDir : tmp_macosMASDir;
    var tmp_zipName = g_cur_task_macos_isNOMAS ? tmp_macosNOMASDirName : tmp_macosMASDirName;
    return g_genrate_zip(tmp_destDir, tmp_zipName);
});


gulp.task('release_macos_nomas', gulpSequence(
    'set_macos_noMAS',
    'package_macos_copy_bin',
    'package_macos_copy_bundle.app',
    'package_macos_copy_publish',
    //'package_macos_npm_public_server', // macos 包需要在macos平台上执行npm install
    'package_macos_copy_romanysoft',
    'package_macos_npm',
    'package-macos-git-version',
    'package_macos_rename_bin',
    'package-macos-zip'
));

gulp.task('release_macos_mas', gulpSequence(
    'set_macos_MAS',
    'package_macos_copy_bin',
    'package_macos_copy_bundle.app',
    'package_macos_copy_publish',
    //'package_macos_npm_public_server', // macos 包需要在macos平台上执行npm install
    'package_macos_copy_romanysoft',
    'package_macos_npm',
    'package-macos-git-version',
    'package_macos_rename_bin',
    'package-macos-zip'
));

gulp.task('release_macos', gulpSequence(
    'package_macos_del',
    'release_macos_nomas',
    'release_macos_mas'));

gulp.task('test_asar', function() {
    var srcDir = './release/win/tmp64/resources/default_app/',
        destDir = './release/win/tmp64/resources/';
    g_make_asar(srcDir, destDir, 'default_app', function(_cb) {

    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////



gulp.task('release', gulpSequence('default', 'release_win', 'release_linux'));
