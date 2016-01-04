/**
 * Created by Ian on 2015/3/5.
 */

(function () {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function () {
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    window.$fem = new RomanySoftPlugins.FileEditorManger();
    window.$fc = window.$fem.fileCache;

    var c$ = {};
    c$ = $.extend(window.UI.c$, {});

    var b$ = BS.b$;

    var $Cache = null;                                                                  // 此单元的缓存部分
    var $NoticeCenter = c$.NoticeCenter = $.Callbacks();                                // 消息中心
    var $Router = c$.RouterMethods = {};                                                // 路由控制器
    var $EditorProvider = c$.EditorProvider = new RomanySoftPlugins.EditorMdServices(); // 编辑器服务
    var $IAPProvider = c$.IAPProvider = new RomanySoftPlugins.IAP.IAP$Helper();         // IAP服务
    var $UserSettings = c$.UserSettings = new RomanySoftPlugins.Settings.UserSetting(); // 用户设置
    var $Util = c$.Util = {};                                                           // 常用工具类
    var g_enableIAP = false;
    c$.g_curWorkFileObj = null;                                                         // 全局当前工作的文件对象

    // 默认的本地化语言
    c$.language = 'en-US';


    // 配置常用的工具类函数
    c$.configUtil = function(){
        "use strict";

        /**
         * 统一国际化翻译处理
         * @param ele
         * @param parm
         * @returns {*}
         */
        $Util.fn_tri18n = function(ele, parm){
            try{
                return (new IntlMessageFormat(ele, c$.language)).format(parm);
            }catch(e){
                console.error(e);
                return "";
            }
        }
    };

    // 初始化标题及版本
    c$.initTitleAndVersion = function(){
        document.title = b$.App.getAppName();
    };

    // 配置消息中心统一标识
    c$.configNoticeCenter = function(){
        "use strict";
        var pre = "Message_";
        c$.NCMessage = {
            UNKnown: pre + "UNKnown"
            ,fileChange: pre + "fileChange"                       // 文件对象发生变化
            ,userSettingsChange: pre + "userSettingsChange"       // 用户设置发生变化
            ,productPurchased: pre + "productPurchased"           // 商品已经被购买
            ,productRequested: pre + "productRequested"           // 商品发送到服务器，进行验证
            ,productSyncNoAppStore:pre + "productSyncNoAppStore"  // 在非AppStore产品状态下，同步插件信息
        };
    };

    // 配置国际化
    c$.configInternationalization = function(deferred){
        "use strict";

        // 获取当前浏览器的语言
        c$.language = window.navigator.language || window.navigator.browserLanguage;
        function autoSetup(lang, success_cb, fail_cb) {
            $.ajax({
                url: "locales/" + lang + ".js",
                dataType: "script",
                success: function (data, status) {
                    console.log(status);
                    eval(data);
                    deferred.resolve();
                    success_cb && success_cb(data, status);
                },
                error: function (req, status, err) {
                    console.log(status);
                    fail_cb && fail_cb(req, status, err);
                }
            })
        }

        autoSetup(c$.language, function(data, staus){
            autoSetup(c$.language);
        }, function(req, status, err){
            c$.language = "en-US"; // 上线删除
            autoSetup(c$.language);
        });
    };


    // 配置Cache
    c$.configCache = function(){
        "use strict";
        $Cache = c$.Cache = new RomanySoftPlugins.Cache("UI.c$.cache");

        c$.CacheType = {
            UNKnown: "UNKnown",
            FileMarkDownCache:"file-markdown-cache"    // markdown 文件缓存
        };

        //尝试恢复缓存数据
        $Cache.restore();
    };

    c$.checkUpdate = function(){
        "use strict";

        function checkUpdate(data){
            try{
                var lastVersion = data.checkUpdate.lastVersion || "";
                var updateURL = data.checkUpdate.updateURL || "";

                // 比较
                if(1 === $.compareVersion(lastVersion, ntv.getAppVersion())) {
                    var foundNewVersion = jet.tr('text.checkUpdate_foundNewVersion');
                    alert(foundNewVersion);
                    updateURL !== "" && ntv.openUrl(updateURL);
                }

            }catch(e){
                console.error(e);
            }
        }

        // 尝试读取服务器配置
        var serverUrl = "http://romanysoft.github.io/assert-config/configs/com.romanysoft.app.macos.MarkdownD.json";
        $.getJSON(serverUrl, function(data){
            data = typeof data === "object" ? data : {};
            data = data instanceof Array ? {"data": data} : data;

            checkUpdate(data);
        });
    };

    // 设置UI部分与逻辑交互
    c$.setupUI = function(){
        "use strict";

        // UI 的Actions
        c$.UIActions = {
            buyPlugin:function(id){
                b$.IAP.buyProduct({
                    productIdentifier:id,
                    quantity:1
                })
            }

            ,buyRestore:function(){ // 恢复购买
                b$.IAP.restore();
            }
            ,getEditorDivEle:function(id){
                var div_id = "div_editor" + id;
                return div_id;
            }
            ,loadFile:function(id){
                window.$fc.reLoadFile(id || window.$fc.getLastModifyFileObj().id, function(fileObj){
                    if(fileObj.is_tmp && $.trim(fileObj.path) === ""){ // 临时文件
                        $Router.go_workspace(fileObj);
                    }else{ // 本地文件
                        if(fileObj.mustReloadNextTime){
                            b$.Binary.getUTF8TextContentFromFile({
                                callback:b$._get_callback(function(obj){
                                    if(obj.success){

                                        var setEditorContent = function (){
                                            fileObj.content_utf8 = obj.content;
                                            try{
                                                if(fileObj.assEditor){
                                                    // 更新内容
                                                    $EditorProvider.setContent(fileObj.content_utf8, fileObj.assEditor);
                                                }
                                            }catch(e){
                                                console.error(e);
                                            }
                                        };

                                        // 检查内容是否一致
                                        if(fileObj.content_utf8 != obj.content && !fileObj.mustReloadNextTime){

                                            // 需要询问用户是否更新
                                            var alertRet = b$.Notice.alert({
                                                message:$Util.fn_tri18n(I18N.UI.filePage.Message["fileReloadConfirm_message"], {path:fileObj.path}),
                                                title:$Util.fn_tri18n(I18N.UI.filePage.Message["fileReloadConfirm_title"]),
                                                buttons:[
                                                    $Util.fn_tri18n(I18N.UI.filePage.Message["fileReloadConfirm_btnOK"]),
                                                    $Util.fn_tri18n(I18N.UI.filePage.Message["fileReloadConfirm_btnCancel"])
                                                ]
                                            });

                                            if(alertRet == 0){
                                                setEditorContent();
                                            }
                                        }else if(fileObj.content_utf8 != obj.content){
                                            setEditorContent();
                                        }

                                        fileObj.mustReloadNextTime = false;

                                        // 发送消息通知
                                        $NoticeCenter.fire(c$.NCMessage.fileChange);
                                        $Router.go_workspace(fileObj);
                                    }

                                }, true),
                                filePath:fileObj.path
                            });
                        }else{
                            $Router.go_workspace(fileObj);
                        }
                    }
                });
            }
            ,common_save_file:function(fileObj){
                b$.Binary.createTextFile({
                    filePath:fileObj.path,
                    text:fileObj.content_utf8
                });

                fileObj.changed = false;

                // 发送消息通知
                $NoticeCenter.fire(c$.NCMessage.fileChange, fileObj.id);
            }
            ,saveFile:function(id, wantSaveAs){
                var t$ = this;
                wantSaveAs = wantSaveAs || false;
                window.$fc.saveFile(id || window.$fc.getLastModifyFileObj().id, function(fileObj){
                    if(fileObj.assEditor){
                        fileObj.content_utf8 = $EditorProvider.getContent(fileObj.assEditor);
                    }else{
                        fileObj.content_utf8 = "";
                    }

                    var checkCanWritable = b$.App.checkPathIsExist(fileObj.path) && b$.App.checkPathIsWritable(fileObj.path);
                    if(checkCanWritable && !wantSaveAs){
                        t$.common_save_file(fileObj);
                    }else{
                        // 保存到本地
                        b$.selectOutFile({
                            callback: b$._get_callback(function(info){
                                if(info.success){
                                    fileObj.name = info.fileName;
                                    fileObj.is_tmp = false;
                                    fileObj.path = info.filePath;

                                    t$.common_save_file(fileObj);
                                }
                            }, true),
                            title : $Util.fn_tri18n(I18N.UI.filePage["SaveDialog-Title"]),
                            prompt: $Util.fn_tri18n(I18N.UI.filePage["SaveDialog-BtnSave"]),
                            fileName : fileObj.name,
                            types : ['md']

                        });
                    }

                });
            }
            ,saveAsFile:function(id){
                var t$ = this;
                t$.saveFile(id, true);
            }
            ,exportFile:function(id){

            }
            ,exportAsPDF:function(id){
                // 保存到本地
                b$.selectOutFile({
                    callback: b$._get_callback(function(info){
                        if(info.success){
                            var pdfPath = info.filePath;
                            b$.App.printToPDF({filePath:pdfPath});
                        }
                    }, true),
                    title : $Util.fn_tri18n(I18N.UI.filePage["SaveDialog-Title"]),
                    prompt: $Util.fn_tri18n(I18N.UI.filePage["SaveDialog-BtnSave"]),
                    fileName : "export",
                    types : ['pdf']

                });
            }
            ,removeFilesItem:function(id){
                window.$fc.removeFile(id, function(obj){
                    var ele = '#view-files li[data-id="fileId_' + obj.id + '"]';
                    $(ele).remove();

                    // 发送代理事件
                    var div_id = c$.UIActions.getEditorDivEle(obj.id);
                    $('#'+div_id).trigger("onFileRemove",obj);


                    // 发送消息通知
                    $NoticeCenter.fire(c$.NCMessage.fileChange, obj.id);

                });

            }
            ,crateNewFileObj:function(){
                var newFileObj = window.$fc.getNewFileObj();
                window.$fc.addFile(newFileObj, function(){});
                window.$fem.addNewFileObj(newFileObj);

                // 发送消息通知
                $NoticeCenter.fire(c$.NCMessage.fileChange);
                return newFileObj;
            }
            ,createNew:function(){
                c$.UIActions.crateNewFileObj();
                $Router.go_files();
            }
            ,addFileToWatcher:function(in_path){
                // 添加到系统变化监视器中
                b$.App.addFilePathToChangeWatcher({
                    callback:b$._get_callback(function(obj){
                        var flag = obj.flag;
                        window.$fc.findFileEx({path:obj.path}, function(fileObj){
                            if(flag === "FileWritten"){
                                fileObj.mustReloadNextTime = true;
                                b$.Notice.dockMessage({
                                    message:$Util.fn_tri18n(I18N.UI.filePage.Message["fileChangeByOther_message"], {path:fileObj.path}),
                                    title:$Util.fn_tri18n(I18N.UI.filePage.Message["fileChangeByOther_title"])
                                });
                            }else if(flag === "FileRenamed"){
                                b$.Notice.dockMessage({
                                    message:$Util.fn_tri18n(I18N.UI.filePage.Message["fileRenamedByOther_message"], {path:fileObj.path}),
                                    title:$Util.fn_tri18n(I18N.UI.filePage.Message["fileRenamedByOther_title"])
                                });
                            }else if(flag === "FileDeleted"){
                                b$.Notice.dockMessage({
                                    message:$Util.fn_tri18n(I18N.UI.filePage.Message["fileDeletedByOther_message"], {path:fileObj.path}),
                                    title:$Util.fn_tri18n(I18N.UI.filePage.Message["fileDeletedByOther_title"])
                                });
                            }

                        });


                    },true),
                    path:in_path
                });
            }
            ,importFiles:function(){
                b$.importFiles({
                    callback: b$._get_callback(function(info){
                        if(info.success){
                            $.each(info.filesArray, function(index, obj){

                                //检测是否已经存在
                                if(window.$fc.findFileEx({path:obj.filePath})){
                                    console.log('import file exist....');
                                    b$.Notice.dockMessage({
                                        message:$Util.fn_tri18n(I18N.UI.filePage.Message["existOnImport_message"], {path:obj.filePath}),
                                        title:$Util.fn_tri18n(I18N.UI.filePage.Message["existOnImport_title"])
                                    });
                                }else{
                                    var newFileObj = window.$fc.getNewFileObj();
                                    newFileObj.name = obj.fileName;
                                    newFileObj.path = obj.filePath;
                                    newFileObj.ext = obj.extension;
                                    newFileObj.is_tmp = false;
                                    newFileObj.mustReloadNextTime = true;
                                    window.$fc.addFile(newFileObj, function(){});
                                    window.$fem.addNewFileObj(newFileObj);

                                    // 添加到监视器中
                                    c$.UIActions.addFileToWatcher(newFileObj.path);

                                    // 发送消息通知
                                    $NoticeCenter.fire(c$.NCMessage.fileChange);
                                }

                            });

                            $Router.go_files();
                        }
                    }, true),
                    title: $Util.fn_tri18n(I18N.UI.filePage["ImportDialog-Title"]),
                    prompt: $Util.fn_tri18n(I18N.UI.filePage["ImportDialog-BtnImport"]),
                    allowOtherFileTypes: true,
                    allowMulSelection: true,
                    types:["*","md"]
                });
            }

        };

        (function (){

            // 激活内置的$EditorProvider配置
            $EditorProvider.configEmoji();
            $EditorProvider.configKatexURL("common/katex/katex.min", "common/katex/katex.min", function(){});
            $EditorProvider.configLanguage(c$.language, function(){
                //$EditorProvider.resetToolbarHandler("emoji",function(){
                //    if(false == $UserSettings.editorSetting.enable_Emoji){
                //        //弹出购买对话框
                //        if(_.has(c$.Map_Settings2Product,"editorSetting.enable_Emoji")){
                //            var productId = _.property("editorSetting.enable_Emoji")(c$.Map_Settings2Product);
                //            var btnBuy = $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["btnBuy"]);
                //            var btnCancel = $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["btnCancel"]);
                //            //
                //            layer.open({
                //                icon:0
                //                ,title: $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["Title"])
                //                ,content: $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["Content"])
                //                ,btn:[btnBuy, btnCancel]
                //                ,yes: function(index){
                //                    layer.close(index);
                //                    c$.UIActions.buyPlugin(productId);
                //                }
                //                ,cancel:function(index){
                //
                //                }
                //            });
                //        }
                //
                //        return true;
                //    }
                //
                //    return false;
                //}, true);

                // 开启支持拖拽功能
                b$.enableDragDropFeature({
                    callback:b$._get_callback(function(info){
                        if(info.success){
                            try{
                                $.type(info.filesArray) === "array" && $.each(info.filesArray, function(index, obj){

                                    //检测是否已经存在
                                    if(window.$fc.findFileEx({path:obj.filePath})){
                                        b$.Notice.dockMessage({
                                            message:$Util.fn_tri18n(I18N.UI.filePage.Message["existOnImport_message"], {path:obj.filePath}),
                                            title:$Util.fn_tri18n(I18N.UI.filePage.Message["existOnImport_title"])
                                        });
                                    }else{
                                        var newFileObj = window.$fc.getNewFileObj();
                                        newFileObj.name = obj.fileName;
                                        newFileObj.path = obj.filePath;
                                        newFileObj.ext = obj.extension;
                                        newFileObj.is_tmp = false;
                                        newFileObj.mustReloadNextTime = true;
                                        window.$fc.addFile(newFileObj, function(){});
                                        window.$fem.addNewFileObj(newFileObj);

                                        // 添加到监视器中
                                        c$.UIActions.addFileToWatcher(newFileObj.path);

                                        // 发送消息通知
                                        $NoticeCenter.fire(c$.NCMessage.fileChange);
                                    }

                                });
                            }catch(e){

                            }
                        }
                    }, true),
                    fileTypes:['md']
                });

                // 注册缓存数据变更的消息处理函数(来自消息中心)
                $NoticeCenter.add(function(message, fileId){
                    if(message === c$.NCMessage.fileChange){

                        // 缓存 "file-markdown-cache" 类型的内容
                        var fileList = window.$fc.getAllFiles();

                        // 检查是否有对应的fileId传送过来
                        if(typeof fileId == "number"){
                            if(false == window.$fc.findFile(fileId)){ // 没有找到传过来的file id, 那么需要删除对应缓存的内容
                                $Cache.delete(fileId, c$.CacheType.FileMarkDownCache);
                            }
                        }

                        $.each(fileList, function(index, obj){
                            $Cache.update(obj.id, c$.CacheType.FileMarkDownCache, obj.coreDataToJSON())
                        });

                        $Cache.save();
                    }
                });

                // 检查用户设置，是否设置了自动恢复功能
                var mustCreateNew = true; // 是否必须创建一个新的文件对象
                if(c$.UserSettings.documentSetting.autoRestore){
                    // 查找是否有缓存的数据文件
                    var cacheList = $Cache.findObjList(c$.CacheType.FileMarkDownCache); // 查找缓存 "file-markdown-cache" 类型的内容
                    // 恢复处理
                    if(cacheList.length > 0){
                        $.each(cacheList, function(index, cacheObj){
                            var newFileObj = window.$fc.getNewFileObj();
                            newFileObj.coreDataFromJSON(cacheObj.value); // 数据还原
                            window.$fc.addFile(newFileObj, function(){});
                            window.$fem.addNewFileObj(newFileObj);

                            // 添加到监视器中
                            if(!newFileObj.is_tmp && newFileObj.path.length > 0){
                                c$.UIActions.addFileToWatcher(newFileObj.path);
                            }
                            mustCreateNew = false;
                        });
                    }
                }

                if(mustCreateNew){
                    c$.UIActions.crateNewFileObj();
                }else{
                    //发送消息通知
                    $NoticeCenter.fire(c$.NCMessage.fileChange);
                }

                // 默认启动，开启新的编辑对象
                $Router.go_workspace(c$.UIActions.crateNewFileObj());
            });

        })();

    };

    // 配置路由控制
    c$.configRoute = function(){
        "use strict";

        if (typeof Router === "undefined"){console.error('director router not config...');return;}

        // 所有的页面配置
        var allPageList = ['#leftNav','#view-files','#view-workspace','#view-plugins', '#view-settings', "#view-about"];

        c$.g_navTitle = ""; // 全局的导航标题

        $Router.fn_showOrHide = function(eleList, show, auto, cb){
            $.each(eleList, function(index, ele) {
                if(auto == true){
                    $(ele).is(":visible")==false ? $(ele).show(): $(ele).hide();
                } else if(show){
                    if($(ele).is(":visible")==false){$(ele).show()}
                }else{
                    if($(ele).is(":visible")==true)$(ele).hide();
                }

            });

            cb && cb();
        };


        $Router.go_leftNav = function(){
            console.log("left nav");

            var thisPage = '#leftNav';

            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){
                var o = {
                    appName: "MarkdownD",
                    navList: [
                        {name: $Util.fn_tri18n(I18N.UI.navPage["Files"]), href: "#/files", class:" icon-tab"}
                        ,{name: $Util.fn_tri18n(I18N.UI.navPage["Workspace"]), href: "#/workspace", class:" icon-dashboard"}
                        ,{name: $Util.fn_tri18n(I18N.UI.navPage["Plugins"]), href: "#/pluginsMgr", class:" icon-extension"}
                        ,{name: $Util.fn_tri18n(I18N.UI.navPage["Settings"]), href: "#/settings", class:" icon-settings"}
                        ,{name: $Util.fn_tri18n(I18N.UI.navPage["About"]), href: "#/about", class:" icon-info"}

                    ]
                };

                var html = template('tpl_leftNav', o);
                ele.html(html);

                $Router.fn_showOrHide([thisPage], true);

                $('#appbar-sidenav-toggle').on('click', function(){
                    $Router.fn_showOrHide([thisPage], false, true);
                });

                $('#appbar-help').on('click', function(){
                    //help的链接地址
                    var url = "http://romanysoft.github.io/MarkdownD";
                    b$.App.open(url);
                });

                // 当点击DIV以外的地方，隐藏该DIV
                $('body').on('click', function(evt){
                    if($(evt.target).parents(thisPage).length == 0
                    && $(evt.target).parents('#appbar-sidenav-toggle').length == 0){
                        $(thisPage).hide();
                    }
                });

            }

        };

        $Router.go_files = function(){
            console.log("files");

            c$.g_navTitle = $Util.fn_tri18n(I18N.UI.filePage["Title"]);
            $('#nav-title').html(c$.g_navTitle);

            var thisPage = '#view-files';
            var o = {
                files: window.$fc.getAllFiles(),
                promptRenameFileTag: $Util.fn_tri18n(I18N.UI.filePage["PromptRenameFileTag"]),
                btnLoadTitle: $Util.fn_tri18n(I18N.UI.filePage["Btn-Load"]),
                btnSaveTitle: $Util.fn_tri18n(I18N.UI.filePage["Btn-Save"]),
                btnRemoveTitle: $Util.fn_tri18n(I18N.UI.filePage["Btn-Remove"]),
                btnNewFileTitle: $Util.fn_tri18n(I18N.UI.filePage["Btn-New"]),
                btnImportTitle: $Util.fn_tri18n(I18N.UI.filePage["Btn-ImportFiles"]),
                emLabel:$Util.fn_tri18n(I18N.UI.filePage["em-label"]),
                noteLabel:$Util.fn_tri18n(I18N.UI.filePage["note-label"])
            };

            var ele = $(thisPage);
            var html = template('tpl_files', o);
            ele.html(html);

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);

            $('#view-files input').on("blur", function(){
                if ( $(this).data('field') == 'name'){
                    var id = $(this).data('id');
                    var newName = this.value;
                    window.$fc.findFile(id, function(obj){
                        obj.name = newName;
                    });
                }
            })

        };

        /**
         * 打开编辑器工作空间
         * @param fileObj 传入文件对象 参见window.$fc.getNewFileObj()
         */
        $Router.go_workspace = function(fileObj){
            console.log("workspace");
            var thisPage = '#view-workspace';

            // 处理标题
            if(null === window.$fc.getLastModifyFileObj()){
                fileObj = c$.UIActions.crateNewFileObj();
            }

            c$.g_curWorkFileObj = fileObj || window.$fc.getLastModifyFileObj();
            c$.g_curWorkFileObj.lastModify = $.now(); // 修改最后编辑的时间


            // 注册缓存数据变更的消息处理函数(来自消息中心)
            $NoticeCenter.add(function(message, fileId){
                if(message === c$.NCMessage.fileChange){
                    if(fileId === c$.g_curWorkFileObj.id){
                        var wk = $Util.fn_tri18n(I18N.UI.workspacePage["Title"]);

                        var baseName = wk + ' - ' + c$.g_curWorkFileObj.name;
                        c$.g_navTitle = (true === c$.g_curWorkFileObj.changed) ?  baseName + ' [*]' : baseName;
                        $('#nav-title').html(c$.g_navTitle);
                    }
                }
            });

            //发送消息通知
            $NoticeCenter.fire(c$.NCMessage.fileChange, c$.g_curWorkFileObj.id);


            // 初始化内容
            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){
                var html = template('tpl_workspace', {});
                ele.html(html);

                // 注册与window.$fem 的处理变更方式
                $NoticeCenter.add(function(message, info){
                    if(c$.NCMessage.userSettingsChange === message){
                        // 获取所有激活状态的下载的file 和 editor对象，然后对editor进行变化
                        var editor_list = window.$fem.getAllEditor();

                        // 循环处理配置
                        $.each(editor_list, function(index, editor){
                            if(typeof editor.config === "function"){
                                editor.config("taskList", $UserSettings.editorSetting.enable_TaskList);
                                editor.config("emoji", $UserSettings.editorSetting.enable_Emoji);
                                editor.config("atLink", $UserSettings.editorSetting.enable_AtLink);
                                editor.config("emailLink", $UserSettings.editorSetting.enable_EmailLink);
                                editor.config("flowChart", $UserSettings.editorSetting.enable_FlowChart);
                                editor.config("sequenceDiagram", $UserSettings.editorSetting.enable_SequenceDiagram);
                                editor.config("tex", $UserSettings.editorSetting.enable_Tex);
                                editor.config("toc", $UserSettings.editorSetting.enable_Toc);
                                editor.config("codeFold", $UserSettings.editorSetting.enable_CodeFold);
                                editor.config("htmlDecode", $UserSettings.editorSetting.enable_HtmlDecode);
                                editor.config("styleActiveLine", $UserSettings.editorSetting.enable_StyleActiveLine);
                                editor.config("lineNumbers", $UserSettings.editorSetting.enable_LineNumbers);
                                editor.config("searchReplace", $UserSettings.editorSetting.enable_SearchReplace);
                                editor.config("tocm", $UserSettings.editorSetting.enable_Tocm);
                            }
                        });
                    }
                });
            }

            // 查找对应的Editor是否存在
            var div_id = c$.UIActions.getEditorDivEle(c$.g_curWorkFileObj.id);

            if(window.$fem.findEditorByFileId(c$.g_curWorkFileObj.id)){
                // 使用CSS来控制显示
                $(thisPage + " > div").addClass("mui-hide").removeClass("mui-show");
                $('#' + div_id).addClass("mui-show").removeClass("mui-hide");
            }else{
                $(thisPage + " > div").removeClass("mui-show").addClass("mui-hide");

                // 先创建Div
                var html_ele = '<div id="' + div_id + '"' +' class="mui-panel"></div>';
                ele.append(html_ele);

                // 绑定Div的事件
                $('#'+div_id).bind("onFileRemove", function(event, fileObj){
                    var editor = fileObj.assEditor;
                    editor.length = 0;
                    $(this).remove();
                });


                // 然后创建编辑器, 并做关联
                var newEditorMd = c$.g_curWorkFileObj.assEditor = $EditorProvider.createEditor(div_id, {
                    height:$(window).height()
                    ,toolbarAutoFixed: false

                    // 与用户设置有关的(不关联商品)
                    ,matchWordHighlight:$UserSettings.editorSetting.enable_matchWordHighlight

                    // 与用户设置有关的(关联商品)
                    ,taskList:$UserSettings.editorSetting.enable_TaskList
                    ,emoji:$UserSettings.editorSetting.enable_Emoji
                    ,atLink:$UserSettings.editorSetting.enable_AtLink
                    ,emailLink:$UserSettings.editorSetting.enable_EmailLink
                    ,flowChart:$UserSettings.editorSetting.enable_FlowChart
                    ,sequenceDiagram:$UserSettings.editorSetting.enable_SequenceDiagram
                    ,tex:$UserSettings.editorSetting.enable_Tex
                    ,toc:$UserSettings.editorSetting.enable_Toc
                    ,codeFold:$UserSettings.editorSetting.enable_CodeFold
                    ,htmlDecode:$UserSettings.editorSetting.enable_HtmlDecode
                    ,styleActiveLine:$UserSettings.editorSetting.enable_StyleActiveLine
                    ,lineNumbers:$UserSettings.editorSetting.enable_LineNumbers
                    ,searchReplace:$UserSettings.editorSetting.enable_SearchReplace
                    ,tocm:$UserSettings.editorSetting.enable_Tocm


                    // 函数
                    ,onload:function(){
                        $EditorProvider.setContent(c$.g_curWorkFileObj.content_utf8, this);
                        this['toolBar_offset'] = this.editor.offset();
                        c$.g_curWorkFileObj.lastModify = $.now(); // 修改最后编辑的时间
                        c$.g_curWorkFileObj.changed = false;
                    }
                    ,onchange:function(){
                        var oldContent = c$.g_curWorkFileObj.content_utf8;
                        var curContent = $EditorProvider.getContent(this);
                        c$.g_curWorkFileObj.changed = (oldContent !== curContent);
                        c$.g_curWorkFileObj.lastModify = $.now(); // 修改最后编辑的时间

                        if(c$.g_curWorkFileObj.changed){
                            //自动保存时间，是否立即保存
                            var settings = c$.UserSettings.documentSetting;
                            if(settings.autoSave){
                                // 检查间隔
                                if(($.now() - c$.g_curWorkFileObj.lastModify) >= settings.autoSaveSecs*1000){
                                    c$.g_curWorkFileObj.content_utf8 = curContent;
                                    c$.g_curWorkFileObj.changed = false;

                                    if(false == c$.g_curWorkFileObj.is_tmp){ // 非临时文件
                                        try{
                                            b$.Binary.createTextFile({
                                                filePath:c$.g_curWorkFileObj.path,
                                                text:c$.g_curWorkFileObj.content_utf8
                                            });
                                        }catch(e){}
                                    }
                                }
                            }
                        }

                        //发送消息通知
                        $NoticeCenter.fire(c$.NCMessage.fileChange, c$.g_curWorkFileObj.id);

                    }
                    ,onscroll:function(){

                    }
                });

                newEditorMd.setToolbarAutoFixed(false);
                newEditorMd["alreadyFixed"] = false;

                var customAutoFixedHandler = function(force){
                    // 获取所有激活状态的下载的file 和 editor对象，然后对editor进行变化
                    var editor_list = window.$fem.getAllEditor();
                    $.each(editor_list, function(index, editorObj){
                        try{
                            if(_.has(editorObj, "alreadyFixed")){
                                if((editorObj["alreadyFixed"] == false) && !force){}
                                else{
                                    var toolbar = editorObj.toolbar;
                                    var editor = editorObj.editor;

                                    toolbar.css({
                                        position: "fixed",
                                        "overflow-y": "auto",
                                        //width: editor.width() + "px",
                                        top: $('#app-header').height() + "px",
                                        left: editorObj["toolBar_offset"].left + "px"
                                    });

                                    editorObj["alreadyFixed"] = true;
                                }
                            }
                            //console.log('customAutoFixedHandler');

                        }catch(e){console.log(e)}
                    });
                };


                $(window).on("scroll", customAutoFixedHandler);
                $(window).on('resize', function(e){
                    customAutoFixedHandler(true);
                });

            }


            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true, false, function(){
                // 修正编辑器的尺寸
                try{
                    window.$fem.findEditorByFileId(_curFileObj.id).resize();
                }catch(e){}

            });

        };

        $Router.go_settings = function(){
            console.log("settings");

            c$.g_navTitle = $Util.fn_tri18n(I18N.UI.settingsPage["Title"]);
            $('#nav-title').html(c$.g_navTitle);

            var thisPage = '#view-settings';

            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){

                var map_settings2Product = c$.Map_Settings2Product;

                // 直接使用Backbone.js 的view视图进行处理
                var pageView = Backbone.View.extend({
                    el: ele,

                    events:{
                        "keypress input[type='text']" : "updateOnEnter",
                        "blur input[type='text']" : "closeEdit",
                        "click input[type=checkbox]" : "selectEdit"
                    },

                    initialize: function(){
                        var t = this;
                        $NoticeCenter.add(function(message){
                            if(c$.NCMessage.userSettingsChange === message) {
                                t.render();
                            }
                        });
                    },

                    render: function(){
                        var m = c$.UserSettings;
                        var o = {
                            btnReset:$Util.fn_tri18n(I18N.UI.settingsPage["btnReset"]),
                            btnApply:$Util.fn_tri18n(I18N.UI.settingsPage["btnApply"]),
                            document:{
                                label:$Util.fn_tri18n(I18N.UI.settingsPage.document["label"]),
                                keys: Object.keys(m.documentSetting),
                                key2I18NMap:(function(){
                                    var map = {};
                                    var keys = Object.keys(m.documentSetting);
                                    $.each(keys, function(index, key){
                                        var i18 = $Util.fn_tri18n(I18N.UI.settingsPage.document[key]);
                                        map[key] = i18;
                                    });
                                    return map;
                                })(),
                                data:m.documentSetting,
                                dataKey:"documentSetting"
                            },

                            editor:{
                                label:$Util.fn_tri18n(I18N.UI.settingsPage.editor["label"]),
                                keys:Object.keys(m.editorSetting),
                                key2I18NMap:(function(){
                                    var map = {};
                                    var keys = Object.keys(m.editorSetting);
                                    $.each(keys, function(index, key){
                                        var i18 = $Util.fn_tri18n(I18N.UI.settingsPage.editor[key]);
                                        map[key] = i18;
                                    });
                                    return map;
                                })(),
                                data:m.editorSetting,
                                dataKey:"editorSetting"
                            }
                        };

                        var html = template('tpl_settings', o);
                        this.$el.html(html);

                        $('#nav-title').html(c$.g_navTitle);
                        return this;
                    },


                    edit:function(e){
                        var curEle = this.$(e.currentTarget);

                    },

                    updateOnEnter:function(e){
                        var curEle = this.$(e.currentTarget);
                        if (e.keyCode == 13) this.closeEdit(e);
                    },

                    closeEdit:function(e){
                        var curEle = this.$(e.currentTarget);
                        var value = curEle.val();

                        $NoticeCenter.fire(c$.NCMessage.userSettingsChange);
                    },


                    selectEdit:function(e){
                        var curEle = this.$(e.currentTarget);


                        var field = this.$(e.currentTarget).data('field');

                        /**
                         * 统一处理
                         * @param productId
                         * @param settingItem
                         * @param $ele
                         */
                        var fn_process = function(productId, settingItem, $ele){
                            var checked = $ele.prop('checked');
                            if(checked){
                                if(false == $IAPProvider.getProductIsPurchased(productId)){
                                    $ele.prop('checked', false);

                                    var btnBuy = $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["btnBuy"]);
                                    var btnCancel = $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["btnCancel"]);
                                    //
                                    layer.open({
                                        icon:0
                                        ,title: $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["Title"])
                                        ,content: $Util.fn_tri18n(I18N.UI.settingsPage["Message"]["Content"])
                                        ,btn:[btnBuy, btnCancel]
                                        ,yes: function(index){
                                            layer.close(index);
                                            c$.UIActions.buyPlugin(productId);
                                        }
                                        ,cancel:function(index){

                                        }
                                    });


                                }else{
                                    var str = 'UI.c$.UserSettings.' + settingItem + ' = true;';
                                    eval(str);
                                    $NoticeCenter.fire(c$.NCMessage.userSettingsChange);
                                }
                            }else{
                                var str = 'UI.c$.UserSettings.' + settingItem + ' = false;';
                                eval(str);
                                $NoticeCenter.fire(c$.NCMessage.userSettingsChange);
                            }
                        };

                        // 查找映射表中存在key
                        if(_.has(map_settings2Product,field)){
                            var mapProductID = _.property(field)(map_settings2Product);

                            // 如果当前的状态是触发选中，需要检查是否已经购买相关插件
                            fn_process(mapProductID, field, curEle);
                        }else{
                            var str = 'UI.c$.UserSettings.' + field + (curEle.prop('checked') == true ? ' = true;' : ' = false;' );
                            eval(str);
                            $NoticeCenter.fire(c$.NCMessage.userSettingsChange);
                        }

                    }

                });

                var sv = new pageView();
                sv.render();
            }


            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);
        };

        $Router.go_pluginsMgr = function(){
            console.log("pluginsMgr");

            c$.g_navTitle = $Util.fn_tri18n(I18N.UI.pluginMgrPage["Title"]);
            $('#nav-title').html(c$.g_navTitle);

            var thisPage = '#view-plugins';
            var ele = $(thisPage);

            if($.trim(ele.html()).length == 0){
                var pageView = Backbone.View.extend({
                    el: ele,

                    initialize:function(){
                        var t = this;
                        $NoticeCenter.add(function(message){
                            if(c$.NCMessage.userSettingsChange === message) {
                                t.render();
                            }
                        });
                    },

                    render: function(){
                        //从插件系统中，获取并整理
                        var enablePlugins =[];

                        //国际化整理
                        I18N.PluginUI.pre = b$.App.getAppId() + ".plugin.";
                        $.each($IAPProvider.getAllEnableProducts(), function(index, product){
                            try{
                                product.name = $Util.fn_tri18n(I18N.PluginUI.data()[product.id].name);
                                product.description = $Util.fn_tri18n(I18N.PluginUI.data()[product.id].description);
                            }catch(e){}

                            enablePlugins.push(product);
                        });

                        // 设置传递参数
                        var o = {
                            plugins:enablePlugins,
                            btnBuyTitle:$Util.fn_tri18n(I18N.UI.pluginMgrPage["btnBuy"]),
                            btnBuyRestoreTitle:$Util.fn_tri18n(I18N.UI.pluginMgrPage["btnBuyRestore"]),
                            enableBuyRestoreBtn:b$.App.getSandboxEnable() && g_enableIAP
                        };

                        var html = template('tpl_pluginsMgr', o);
                        this.$el.html(html);

                        $('#nav-title').html(c$.g_navTitle);

                        return this;
                    }
                });

                var sv = new pageView();
                sv.render();
            }


            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);
        };


        $Router.go_about$license = function(){
            console.log("about$license");

            c$.g_navTitle = $Util.fn_tri18n(I18N.UI.aboutPage["Title"]);
            $('#nav-title').html(c$.g_navTitle);

            var thisPage = '#view-about';


            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){

                //动态创建Div来加载
                $('<div id="tmp-load-div"style="display: none"></div>').appendTo('#g-wrapper');

                var o = {
                    appName: b$.App.getAppName(),
                    version: b$.App.getAppVersion(),
                    logoUrl: 'images/logo_64.png',
                    description: $Util.fn_tri18n(I18N.UI.aboutPage.App.description),
                    copyright:$Util.fn_tri18n(I18N.UI.aboutPage.App.copyright),
                    creditsTitle:$Util.fn_tri18n(I18N.UI.aboutPage.App.creditsTitle),
                    credits:[
                        {id:"credit-arTemplate", title:"artTemplate, high performance js template engine.", licenseUrl:"licenses/artTemplate/LICENSE", homepageUrl:"https://github.com/aui/artTemplate"}
                        ,{id:"credit-director.js", title:"director.js, routing is the process of determining what code to run when a URL is requested.", licenseUrl:"licenses/director.js/LICENSE", homepageUrl:"https://github.com/flatiron/director"}
                        ,{id:"credit-editor.md", title:"editor.md, a simple online markdown editor", licenseUrl:"licenses/editor.md/LICENSE", homepageUrl:"https://github.com/pandao/editor.md"}
                        //,{id:"credit-es6-shim", title:"es6-shim, provides compatibility shims so that legacy JavaScript engines behave as closely as possible to ECMAScript 6 (Harmony)", licenseUrl:"licenses/es6-shim/LICENSE", homepageUrl:"github.com/paulmillr/es6-shim"}
                        ,{id:"credit-jquery", title:"jquery, a fast, small, and feature-rich JavaScript library.", licenseUrl:"licenses/jquery/LICENSE", homepageUrl:"http://jquery.com/"}
                        ,{id:"credit-mui", title:"mui, is a lightweight HTML, CSS and JS framework for sites that follow Google's Material Design guidelines.", licenseUrl:"licenses/mui/LICENSE", homepageUrl:"https://github.com/amorey/mui"}
                        ,{id:"credit-underscore",
                            title:"Underscore is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects. It’s the answer to the question: “If I sit down in front of a blank HTML page, and want to start being productive immediately, what do I need?” … and the tie to go along with jQuery's tux and Backbone's suspenders.",
                            licenseUrl:"licenses/underscore/LICENSE", homepageUrl:"https://github.com/jashkenas/underscore"}

                    ]
                };

                var html = template('tpl_about', o);
                ele.html(html);

                //配置点击showlicense的动作
                $('#view-about a.third-show').on("click", function(){
                    if (typeof  $(this).data('creditid') != "undefined"){
                        var creditId = $(this).data('creditid');
                        var licenseUrl = $(this).data('url');
                        var ele = "#view-about div.third-licence[data-creditid='" + creditId + "']";

                        if($(ele + ":has(pre)").length > 0){
                            $(ele).html("");
                        }else{
                            if($.trim(licenseUrl).length > 0){
                                $('#tmp-load-div').load(licenseUrl, function(data){
                                    $(ele).html("<pre class='mui-panel'>" + data + "</pre>");
                                });
                            }
                        }

                    }
                });

                //配置打开HomePage的事件
                $('#view-about a.third-homepage').on("click", function(){
                    var url = $(this).data('url');
                    //alert(url);
                    b$.App.open(url)
                });

            }

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);
        };

        var myRoutes = {
            "/leftNav":$Router.go_leftNav,
            '/files':$Router.go_files,
            '/workspace':$Router.go_workspace,
            '/settings' : $Router.go_settings,
            '/pluginsMgr': $Router.go_pluginsMgr,
            '/about':$Router.go_about$license
        };

        // 全局路由
        c$.g_router = Router(myRoutes);
        c$.g_router.init();

    };

    // 绑定系统Preferences菜单
    c$.bindSystemPreferencesMenu = function(cb){
        "use strict";
        var cbName = b$._get_callback(function(info){
            cb && cb(info)
        }, true);

        if(b$.pN){
            var obj = {menuTag:903, action:cbName};
            b$.SystemMenus.setMenuProperty(obj);
        }
    };

    // 配置系统菜单
    c$.configSystemMenu = function(cb){
        "use strict";

         // File部分
        if(b$.pN){

            //New
            b$.SystemMenus.setMenuProperty({menuTag:101, action:b$._get_callback(function(info){
                window.UI.c$.UIActions.createNew();
            }, true)});

            //Open
            b$.SystemMenus.setMenuProperty({menuTag:102, action:b$._get_callback(function(info){
                window.UI.c$.UIActions.importFiles();
            }, true)});

            //Save
            b$.SystemMenus.setMenuProperty({menuTag:106, action:b$._get_callback(function(info){
                window.UI.c$.UIActions.saveFile();
            }, true)});

            //Save As
            b$.SystemMenus.setMenuProperty({menuTag:107, action:b$._get_callback(function(info){
                window.UI.c$.UIActions.saveAsFile();
            }, true)});

            //ExportAsPdF
            b$.SystemMenus.setMenuProperty({menuTag:194, action:b$._get_callback(function(info){
                //TODO: 创建选择对话框
                window.UI.c$.UIActions.exportAsPDF();
            }, true)});


            //Print
            b$.SystemMenus.setMenuProperty({menuTag:111, action:b$._get_callback(function(info){
                //TODO: 创建选择对话框
                b$.App.print();
            }, true)});

            //Exit
            b$.SystemMenus.setMenuProperty({menuTag:999, action:b$._get_callback(function(info){
                b$.App.terminate();
            }, true)});

        }


    };

    // 绑定插件引导及相关的插件
    c$.startPluginEngine = function(cb){
        "use strict";

        c$.plugin_callbacks = $.Callbacks(); // 注册业务逻辑回调(使用Jquery的Callbacks())
        c$.plugin_callbacks.add(cb || function(obj){

        });

        var cbName = b$._get_callback(function(obj){
            console.log($.obj2string(obj));
            // 声明处理插件初始化的方法
            function process_init(obj){
                var c$ = UI.c$;
                var b$ = BS.b$;
                try{
                    if (obj.type == "type_initcoresuccess") {

                    }else if(obj.type == "type_initcorefailed") {
                        console.error('init core plugin failed!');
                    }
                }catch(e){
                    console.error(e);
                }

            }

            // 声明处理CLI的回调处理
            function process_dylibCLI(obj){
                var c$ = UI.c$;
                var b$ = BS.b$;

                try{
                    var infoType = obj.type;
                    if (infoType == 'type_clicall_start'){

                    }else if(infoType == 'type_clicall_reportprogress'){

                    }else if(infoType == 'type_clicall_end'){

                    }

                }catch(e){
                    console.error(e);
                }
            }

            // 声明处理ExecCommand的方法
            function process_execCommand(obj){
                var c$ = UI.c$;
                var b$ = BS.b$;

                try{
                    var infoType = obj.type;
                    if(infoType == 'type_addexeccommandqueue_success'){
                        var queueID = obj.queueInfo.id;
                        b$.sendQueueEvent(queueID, "execcommand", "start");
                    } else if(infoType == 'type_execcommandstart'){

                    } else if(infoType == 'type_reportexeccommandprogress'){

                    } else if(infoType == 'type_execcommandsuccess'){

                    } else if(infoType == 'type_canceledexeccommand'){

                    } else if(infoType == 'type_execcommanderror'){

                    }
                }catch(e){
                    console.error(e);
                }

            }

            // 声明处理Task的方法
            function process_task(obj){

                var c$ = UI.c$;
                var b$ = BS.b$;
                try{
                    var infoType = obj.type;
                    if(infoType == "type_addcalltaskqueue_success"){
                        var queueID = obj.queueInfo.id;
                        b$.sendQueueEvent(queueID, "calltask", "start");

                        c$.plugin_callbacks.fire({type:'_native_task_added', data:obj});
                    }else if(infoType == "type_calltask_start"){
                        var queueID = obj.queueInfo.id;
                        c$.plugin_callbacks.fire({type:'_native_task_started', data:obj});

                    }else if(infoType == "type_calltask_error"){
                        console.error($.obj2string(obj));
                        c$.plugin_callbacks.fire({type:'_native_task_error', data:obj});

                    }else if(infoType == "type_calltask_success"){
                        console.log($.obj2string(obj));
                        c$.plugin_callbacks.fire({type:'_native_task_finished', data:obj});

                    }else if(infoType == "type_type_calltask_cancel"){
                        console.log($.obj2string(obj));
                        c$.plugin_callbacks.fire({type:'_native_task_canceled', data:obj});
                    }
                }catch(e){
                    console.error(e);
                }

            }

            // 以下是调用顺序
            process_init(obj);
            process_dylibCLI(obj);
            process_execCommand(obj);
            process_task(obj);

        }, true);

        if(b$.pN){
            b$.enablePluginCore([], cbName);
        }

    };

    // 配置UserSettings
    c$.configUserSettings = function(cb){
        "use strict";

        // 注册缓存数据变更的消息处理函数(来自消息中心)
        $NoticeCenter.add(function(message){
            if(c$.NCMessage.userSettingsChange === message){
                // 缓存 "user-settings-cache" 类型的内容
                // 备注: 当前，默认仅支持一个，使用default 作为key

                var us_json = $UserSettings.coreDataToJSON();
                $Cache.update("default", "user-settings-cache", us_json);
                $Cache.save();
            }
        });

        // 查找是否有缓存的数据文件
        var cacheList = $Cache.findObjList("user-settings-cache");

        // 恢复处理
        if(cacheList.length > 0){
            $.each(cacheList, function(index, cacheObj){
                var us_json = cacheObj.value;
                $UserSettings.coreDataFromJSON(us_json);
                return false; // 默认使用一个，后期，升级的时候，可以加入导入settings的设计
            });
        }

    };

    // 处理IAP
    c$.configIAP = function(cb){
        "use strict";

        var prefix = b$.App.getAppId() + ".plugin.", defaultImg = "images/logo_64.png", imgPre = "images/iap/";
        var ProductC = RomanySoftPlugins.IAP.Product;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var b_inAppStore = b$.App.getSandboxEnable() && g_enableIAP; // 是否在沙盒内
        var default_quantity = b_inAppStore ? 0 : 1;  //


        // 内置的功能
        $IAPProvider.addProduct(ProductC.create({inAppStore: false, id:prefix + "support.importFile", quantity:1,  name:"Open File", description: "支持导入文件", imageUrl:imgPre + "importFile_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: false, id:prefix + "support.dragFile", quantity:1,  name:"Drag File", description: "支持拖拽文件", imageUrl:imgPre + "dragFile_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: false, id:prefix + "support.fileSave", quantity:1,  name:"File Save", description: "支持保存文件功能", imageUrl:imgPre + "fileSave_64.png"}));

        // [商品]文档控制部分
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "enableAutoSave", price:"1$", name:"开启自动保存", description: "此项，可以开启自动保存功能", imageUrl:imgPre + "autosave_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "enableAutoRestore", price:"1$", name:"开启自动恢复", description: "此项，可以开启自动恢复功能", imageUrl:imgPre + "autoRecover_64.png"}));


        // [商品]编辑器功能
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.taskList", price:"2$", name:"TaskList", description: "支持Github task lists", imageUrl:imgPre + "taskList_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.emoji", price:"3$", name:"Emoji", description: "支持emoji表情功能", imageUrl:imgPre + "emoji_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.atLink", price:"1$", name:"atLink", description: "支持atLink功能", imageUrl:imgPre + "atLink_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.emailLink", price:"1$", name:"emailLink", description: "支持emailLink功能", imageUrl:imgPre+ "emailLink_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.flowChart", price:"1$", name:"FlowChart", description: "支持flowChart功能", imageUrl:imgPre + "flowChart_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.sequenceDiagram", price:"1$", name:"SequenceDiagram", description: "支持sequenceDiagram功能", imageUrl:imgPre + "sequenceDiagram_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.tex", price:"2$", name:"Tex", description: "支持tex功能", imageUrl:imgPre + "tex_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.toc", price:"2$", name:"Toc", description: "支持toc功能", imageUrl:imgPre + "toc_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.codeFold",  price:"1$", name:"CodeFold", description: "支持codeFold功能", imageUrl:imgPre + "codeFold_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.htmlDecode", price:"1$", name:"HTMLDecode", description: "支持htmlDecode功能", imageUrl:imgPre + "htmlDecode_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.styleActiveLine", price:"1$", name:"StyleActiveLine", description: "支持styleActiveLine功能", imageUrl:imgPre + "styleActiveLine_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.lineNumbers", price:"1$", name:"LineNumbers", description: "支持lineNumbers功能", imageUrl:imgPre + "lineNumbers_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.searchReplace", price:"1$", name:"Search Replace", description: "支持searchReplace功能", imageUrl:imgPre + "searchReplace_64.png"}));
        $IAPProvider.addProduct(ProductC.create({inAppStore: b_inAppStore, quantity:default_quantity, id:prefix + "support.tocm", price:"1$", name:"TOCM", description: "Using [TOCM], auto create ToC dropdown menu", imageUrl:imgPre + "tocm_64.png"}));


        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // 注册数据变更的消息处理函数(来自消息中心)
        $NoticeCenter.add(function(message, info){

            c$.Map_Settings2Product = {
                // [商品]文档控制部分
                "documentSetting.autoSave":prefix + "enableAutoSave",
                "documentSetting.autoRestore":prefix + "enableAutoRestore",

                // [商品]编辑器功能
                "editorSetting.enable_TaskList":prefix + "support.taskList",
                "editorSetting.enable_Emoji":prefix + "support.emoji",
                "editorSetting.enable_AtLink":prefix + "support.atLink",
                "editorSetting.enable_EmailLink":prefix + "support.emailLink",
                "editorSetting.enable_FlowChart":prefix + "support.flowChart",
                "editorSetting.enable_SequenceDiagram":prefix + "support.sequenceDiagram",
                "editorSetting.enable_Tex":prefix + "support.tex",
                "editorSetting.enable_Toc":prefix + "support.toc",
                "editorSetting.enable_CodeFold":prefix + "support.codeFold",
                "editorSetting.enable_HtmlDecode":prefix + "support.htmlDecode",
                "editorSetting.enable_StyleActiveLine":prefix + "support.styleActiveLine",
                "editorSetting.enable_LineNumbers":prefix + "support.lineNumbers",
                "editorSetting.enable_SearchReplace":prefix + "support.searchReplace",
                "editorSetting.enable_Tocm":prefix + "support.tocm"
            };

            // 根据插件的情况来同步用户设置的同步
            function syncAndCheckUserSettings(product) {

                var isBuy = $IAPProvider.getProductIsPurchased(product.id);
                if (isBuy) {

                    // [商品]文档控制部分
                    var _us_d = $UserSettings.documentSetting;

                    if (product.id == (prefix + "enableAutoSave")) _us_d.autoSave = true;
                    if (product.id == (prefix + "enableAutoRestore")) _us_d.autoRestore = true;
                    // [商品]编辑器功能
                    var _us_e = $UserSettings.editorSetting;
                    if (product.id == (prefix + "support.taskList")) _us_e.enable_TaskList = true;
                    if (product.id == (prefix + "support.emoji")) _us_e.enable_Emoji = true;
                    if (product.id == (prefix + "support.atLink")) _us_e.enable_AtLink = true;
                    if (product.id == (prefix + "support.emailLink")) _us_e.enable_EmailLink = true;
                    if (product.id == (prefix + "support.flowChart")) _us_e.enable_FlowChart = true;
                    if (product.id == (prefix + "support.sequenceDiagram")) _us_e.enable_SequenceDiagram = true;
                    if (product.id == (prefix + "support.tex")) _us_e.enable_Tex = true;
                    if (product.id == (prefix + "support.toc")) _us_e.enable_Toc = true;
                    if (product.id == (prefix + "support.codeFold")) _us_e.enable_CodeFold = true;
                    if (product.id == (prefix + "support.htmlDecode")) _us_e.enable_HtmlDecode = true;
                    if (product.id == (prefix + "support.styleActiveLine")) _us_e.enable_StyleActiveLine = true;
                    if (product.id == (prefix + "support.lineNumbers")) _us_e.enable_LineNumbers = true;
                    if (product.id == (prefix + "support.searchReplace")) _us_e.enable_SearchReplace = true;
                    if (product.id == (prefix + "support.tocm")) _us_e.enable_Tocm = true;

                    $NoticeCenter.fire(c$.NCMessage.userSettingsChange);
                }
            }

            // 产品同步
            if(c$.NCMessage.productRequested === message){
                // 检查与用户设置的匹配程度
                //说明：productInfoList = [{productIdentifier, description, price}]

                //TODO: 查看信息同步部分的内容
                var productInfoList = info;
                $.each(productInfoList, function(index, productInfo){

                    var id = productInfo.productIdentifier;
                    // 插件的数量的影响
                    var product_quantity = b$.IAP.getUseableProductCount(id);
                    var product = $IAPProvider.getProduct(id);
                    product.quantity = product_quantity;

                    syncAndCheckUserSettings(product);
                });

            }

            // 产品购买
            if(c$.NCMessage.productPurchased === message){
                // 产品购买，对相关内的内容的影响
                // 说明：info 为 product.id
                var id = info;
                // 插件的数量的影响
                var product_quantity = b$.IAP.getUseableProductCount(id);
                var product = $IAPProvider.getProduct(id);
                product.quantity = product_quantity;
                syncAndCheckUserSettings(product);
            }

            // 非AppStore产品状态下，同步产品信息
            if(c$.NCMessage.productSyncNoAppStore === message){
                var productInfoList = $IAPProvider.getAllEnableProducts();
                $.each(productInfoList, function(index, product){
                    syncAndCheckUserSettings(product);
                });
            }
        });


        if(b_inAppStore == true){
            // 开启IAP的功能
            b$.IAP.enableIAP({
                cb_IAP_js: b$._get_callback(function(obj){
                    try{
                        //console.log($.obj2string(obj));
                        var info = obj.info, notifyType = obj.notifyType;

                        // 修正兼容键值对
                        if(typeof info === "string") info = JSON.parse(info);

                        // 获得兼容的键值, 也就说原先的IAP系统返回值有了变动
                        var _getCompatibleKey = function(infoObj, key){
                            //NOTE:使用标准的函数来处理
                            if(typeof infoObj[key] !== "undefined") return infoObj[key];
                            if(typeof infoObj["payment"] !== "undefined"){
                                if(typeof infoObj["payment"][key] !== "undefined")
                                    return infoObj["payment"][key];
                            }
                            return "[ '" + key + "' no found.]" ;
                        };

                        if(notifyType == "ProductBuyFailed"){
                            console.log('[section] ProductBuyFailed');
                            //@"{'productIdentifier':'%@', 'message':'No products found in apple store'}"
                            var pluginId = _getCompatibleKey(info, "productIdentifier");
                            var message = _getCompatibleKey(info, "message");

                            var log = $.stringFormat("{0} order plugin failed! {1}", pluginId, message);
                            console.warn(log);
                        }else if(notifyType == "ProductPurchased"){
                            console.log('[section] ProductPurchased');
                            //@"{'productIdentifier':'%@', 'quantity':'%@'}"

                            var pluginId = _getCompatibleKey(info, "productIdentifier");
                            $IAPProvider.syncProductWithAppStore(pluginId, function(product){
                                //说明：product{enable, inAppStore, quantity, price}

                                //使用消息中心发送商品已经购买的消息
                                $NoticeCenter.fire(c$.NCMessage.productPurchased, pluginId);
                            });

                            var log = $.stringFormat("{0} order plugin success!", pluginId);
                            console.log(log);
                        }else if(notifyType == "ProductPurchaseFailed"){
                            console.log('[section] ProductPurchaseFailed');
                            //@"{‘transactionId':'%@',‘transactionDate’:'%@', 'payment':{'productIdentifier':'%@','quantity':'%@'}}"

                            // 使用兼容模式
                            var pluginId = _getCompatibleKey(info, "productIdentifier");
                            var orderDate = _getCompatibleKey(info, "transactionDate");

                            var log = $.stringFormat("{0} order plugin failed! orderDate {1}", pluginId, orderDate);
                            console.log(log);
                        }else if(notifyType == "ProductPurchaseFailedDetail"){
                            console.log('[section] ProductPurchaseFailedDetail');
                            //@"{'failBy':'cancel', 'transactionId':'%@', 'message':'%@', ‘transactionDate’:'%@', 'payment':{'productIdentifier':'%@','quantity':'%@'}}"
                            //_nativeCallback.ncb0({"info":"{\"message\":\"Unknown Error.\",\"payment\":{\"quantity\":1,\"productIdentifier\":\"com.romanysoft.app.macos.MarkdownD.plugin.support.atLink\"},\"failBy\":\"error\",\"transactionDate\":\"2015-06-19 05:31:06\",\"transactionId\":\"E33C0E13-782E-4433-B080-40B416024933\"}","notifyType":"ProductPurchaseFailedDetail"});

                            // 使用兼容模式
                            var pluginId = _getCompatibleKey(info, "productIdentifier");
                            var failBy = _getCompatibleKey(info, "failBy");
                            var transactionDate = _getCompatibleKey(info, "transactionDate");
                            var message = _getCompatibleKey(info, "message");

                            var log = $.stringFormat("error: {0} failed by {1} ({2}) order date: {3}", pluginId, failBy, message, transactionDate);
                            console.log(log);
                        }else if(notifyType == "ProductRequested"){
                            console.log('[section] ProductRequested');
                            var productInfoList = info;
                            if(typeof info == "string"){
                                productInfoList = JSON.parse(info);
                            }

                            var log = $.stringFormat("Request product info from app store.");
                            console.log(log);

                            //说明：productInfoList = [{productIdentifier, description, price}]
                            $.each(productInfoList, function(index, product){
                                var info = {
                                    id: product.productIdentifier,
                                    price:product.price,
                                    description:product.description
                                };

                                $IAPProvider.updateProductByIdWhitAppStore(info.id, info, undefined);
                            });

                            //使用消息中心发送商品信息请求的消息
                            $NoticeCenter.fire(c$.NCMessage.productRequested, productInfoList);

                        }else if(notifyType == "ProductCompletePurchased"){
                            console.log('[section] ProductCompletePurchased');
                            //@"{'productIdentifier':'%@', 'transactionId':'%@', 'receipt':'%@'}"

                            //使用兼容模式
                            var pluginId = _getCompatibleKey(info, "productIdentifier");
                            var transactionId = _getCompatibleKey(info, "transactionId");
                            var receipt = _getCompatibleKey(info, "receipt");

                            var log = $.stringFormat("pluginId: {0}, transactionId: {1}, receipt: {2}", pluginId, transactionId, receipt);
                            console.log(log);
                        }else if(notifyType == "ProductsPaymentRemovedTransactions"){
                            //{"info":"{\"payment\":[{\"quantity\":1,\"productIdentifier\":\"com.romanysoft.app.macos.MarkdownD.plugin.support.atLink\"},{\"quantity\":1,\"productIdentifier\":\"com.romanysoft.app.macos.MarkdownD.plugin.support.atLink\"}],\"removedTransactions\":[{\"quantity\":1,\"productIdentifier\":\"com.romanysoft.app.macos.MarkdownD.plugin.support.atLink\"}]}","notifyType":"ProductsPaymentRemovedTransactions"}
                        }


                    }catch(e){console.error(e)}
                }, true),
                productIds: $IAPProvider.getAllEnableInAppStoreProductIds()
            });
        }else{
            $NoticeCenter.fire(c$.NCMessage.productSyncNoAppStore);
        }

    };

    // 启动
    c$.launch = function(){
        "use strict";

        var deferred = $.Deferred();
        deferred.done(function(){
            c$.configUtil();
            c$.initTitleAndVersion();
            c$.configCache();
            c$.configNoticeCenter();
            c$.configUserSettings();
            c$.configIAP();
            c$.configRoute();
            c$.configSystemMenu();
            c$.setupUI();
            c$.checkUpdate();

        });

        c$.configInternationalization(deferred);


    };



}());