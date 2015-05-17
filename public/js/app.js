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

    var $Router = c$.RouterMethods = {};
    var $Cache = null; // 此单元的缓存部分
    var $EditorProvider = c$.EditorProvider = new RomanySoftPlugins.EditorMdServices();

    // 初始化标题及版本
    c$.initTitleAndVersion = function(){
        document.title = b$.App.getAppName();
    };


    // 配置Cache
    c$.setupCache = function(){
        "use strict";
        $Cache = c$.Cache = new RomanySoftPlugins.Cache("UI.c$.cache");
    };


    // 设置UI部分与逻辑交互
    c$.setupUI = function(){
        "use strict";

        // UI 的Actions
        c$.UIActions = {
            buyPlugin:function(id){
                alert(id);
                var $iap = IAPModule;
                $iap.buyProduct({
                    productIdentifier:id,
                    quantity:1
                })
            }

            ,getEditorDivEle:function(id){
                var div_id = "div_editor" + id;
                return div_id;
            }
            ,loadFile:function(id){
                window.$fc.reLoadFile(id, function(fileObj){
                    if(fileObj.is_tmp && $.trim(fileObj.path) === ""){ // 临时文件
                        $Router.go_workspace(fileObj);
                    }else{ // 本地文件
                        if(fileObj.mustReloadNextTime){
                            b$.Binary.getUTF8TextContentFromFile({
                                callback:b$._get_callback(function(obj){
                                    //TODO: 实现获取文件内容，然后处理内容
                                    fileObj.content_utf8 = "";
                                    $Router.go_workspace(fileObj);
                                }, true),
                                filePath:fileObj.path
                            });
                        }else{
                            $Router.go_workspace(fileObj);
                        }
                    }
                });
            }
            ,saveFile:function(id){
                window.$fc.saveFile(id, function(fileObj){

                });
                alert('saveFile')
            }
            ,removeFilesItem:function(id){
                window.$fc.removeFile(id, function(obj){
                    var ele = '#view-files li[data-id="fileId_' + obj.id + '"]';
                    $(ele).remove();

                    // 发送代理事件
                    var div_id = c$.UIActions.getEditorDivEle(obj.id);
                    $('#'+div_id).trigger("onFileRemove",obj);
                });
            }
            ,createNew:function(){
                var newFileObj = window.$fc.getNewFileObj();
                window.$fc.addFile(newFileObj, function(){});
                window.$fem.addNewFileObj(newFileObj);
                $Router.go_files();
            }
            ,importFiles:function(){
                //TODO: 实现加载文件
                alert('importFiles')
            }

        };

        (function (){
            // 先恢复缓存数据
            $Cache.restore();

            // 查找是否有缓存的数据文件
            var cacheList = $Cache.findObjList("file-markdown-cache");

            // 恢复处理
            if(cacheList.length > 0){
                $.each(cacheList, function(index, obj){
                    var _id = obj.key, _value = obj.value;
                    var dataObj = JSON.parse(_value);

                    // _id === fileObj.id === editorObj.fileId 这是前提条件
                    var fileObj = dataObj.fileObj; // editorObj = dataObj.editorObj; // 文件数据单元及编辑器内容单元
                    window.$fc.addFile(fileObj, function(){});
                    window.$fem.addNewFileObj(fileObj);

                });

            }else{
                var newFileObj = window.$fc.getNewFileObj();
                window.$fc.addFile(newFileObj, function(){});
                window.$fem.addNewFileObj(newFileObj);

            }

            $Router.go_workspace(window.$fc.getLastModifyFileObj());
        })();

    };

    // 配置路由控制
    c$.configRoute = function(){
        "use strict";

        if (typeof Router === "undefined"){console.error('director router not config...');return;}

        // 所有的页面配置
        var allPageList = ['#leftNav','#view-files','#view-workspace','#view-plugins', '#view-settings', '#view-help', "#view-about"];

        $Router.fn_showOrHide = function(eleList, show, auto){
            $.each(eleList, function(index, ele) {
                if(auto == true){
                    $(ele).is(":visible")==false ? $(ele).show(): $(ele).hide();
                } else if(show){
                    if($(ele).is(":visible")==false){$(ele).show()}
                }else{
                    if($(ele).is(":visible")==true)$(ele).hide();
                }

            });
        };


        $Router.go_leftNav = function(){
            console.log("left nav");

            var thisPage = '#leftNav';

            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){
                var o = {
                    appName: "MarkdownD",
                    navList: [
                        {name: "Files", href: "#/files", class:" icon-tab"}
                        ,{name: "Workspace", href: "#/workspace", class:" icon-dashboard"}
                        ,{name: "Plugins", href: "#/pluginsMgr", class:" icon-extension"}
                        ,{name: "Settings", href: "#/settings", class:" icon-settings"}
                        ,{name: "Help", href: "#/help", class:" icon-help"}
                        ,{name: "About", href: "#/about", class:" icon-info"}

                    ]
                };

                var html = template('tpl_leftNav', o);
                ele.html(html);

                $Router.fn_showOrHide([thisPage], true);

                $('#appbar-sidenav-toggle').on('click', function(){
                    $Router.fn_showOrHide([thisPage], false, true);
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
            $('#nav-title').html('Files');


            var thisPage = '#view-files';
            var o = {
                files: window.$fc.getAllFiles()
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
            var _curFileObj = fileObj || window.$fc.getLastModifyFileObj();

            if(false == fileObj.changed){
                $('#nav-title').html('Workspace - ' + _curFileObj.name);
            }else{
                $('#nav-title').html('Workspace - ' + _curFileObj.name + ' [*]');
            }


            // 初始化内容
            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){
                var html = template('tpl_workspace', {});
                ele.html(html);
            }

            // 查找对应的Editor是否存在
            var div_id = c$.UIActions.getEditorDivEle(_curFileObj.id);
            if(window.$fem.findEditorByFileId(_curFileObj.id)){
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
                var newEditorMd = _curFileObj.assEditor = $EditorProvider.createEditor(div_id, {
                    height:$(window).height()
                    ,toolbarAutoFixed: false
                    ,onload:function(){
                        $EditorProvider.setContent(_curFileObj.content_utf8, this);
                    }
                    ,onchange:function(){
                        var oldContent = _curFileObj.content_utf8;
                        var curContent = $EditorProvider.getContent(this);
                        _curFileObj.changed = (oldContent != curContent);

                        if(false == _curFileObj.changed){
                            $('#nav-title').html('Workspace - ' + _curFileObj.name);
                        }else{
                            $('#nav-title').html('Workspace - ' + _curFileObj.name + ' [*]');
                        }
                    }
                    ,onscroll:function(){

                    }
                });


                newEditorMd.setToolbarAutoFixed(false);

                var alreayFixed = false;
                var customAutoFixedHandler = function(force){
                    if(! alreayFixed && !force) return;

                    var toolbar = newEditorMd.toolbar;
                    var editor = newEditorMd.editor;
                    var $window = $(window);

                    toolbar.css({
                        position: "fixed",
                        "overflow-y": "auto",
                        width: editor.width() + "px",
                        top: $('#app-header').height() + "px",
                        left: ($window.width() - editor.width()) / 2 + "px"
                    });

                    alreayFixed = true;
                };

                var handle_onResize= function(e){
                    var w = newEditorMd.width(), h = $(window).height();
                    $EditorProvider.resize(w, h, newEditorMd);
                    customAutoFixedHandler(true);
                };

                $(window).on("scroll", customAutoFixedHandler);
                $(window).on('resize', handle_onResize);

            }




            //if($.trim(ele.html()).length == 0){
            //    var html = template('tpl_workspace', {id:"uic-editormd"});
            //    ele.html(html);
            //
            //    //c$.UIConfigs.MarkdownEditor.configEmoji();
            //    var editormdObj = c$.g_editor = c$.UIActions.configEditor("uic-editormd",
            //        {
            //            height:$(window).height()
            //            ,toolbarAutoFixed: false
            //            ,onload:function(){
            //                var t = c$.UIActions.FileObjAndMarkdownEditor;
            //                var fo = _g_getCurFileObj();
            //                this.curFileObjId = fo.id;
            //                $.proxy(t.fn_updateMarkdownEditorWithFileObj, t)(this, fo);
            //            }
            //            ,onchange: function(){
            //                var t = c$.UIActions.FileObjAndMarkdownEditor;
            //                var fo = _g_getCurFileObj();
            //                this.curFileObjId = fo.id;
            //                $.proxy(t.fn_updateFileObjWithMarkdownEditor, t)(fo, this);
            //            }
            //            ,onscroll: function(){
            //        }
            //        }
            //    );
            //
            //    editormdObj.setToolbarAutoFixed(false);
            //
            //    var alreayFixed = false;
            //    var customAutoFixedHandler = function(force){
            //        if(! alreayFixed && !force) return;
            //
            //        var toolbar = editormdObj.toolbar;
            //        var editor = editormdObj.editor;
            //        var $window = $(window);
            //
            //        toolbar.css({
            //            position: "fixed",
            //            "overflow-y": "auto",
            //            width: editor.width() + "px",
            //            top: $('#app-header').height() + "px",
            //            left: ($window.width() - editor.width()) / 2 + "px"
            //        });
            //
            //        alreayFixed = true;
            //    };
            //
            //    $(window).on("scroll", customAutoFixedHandler);
            //    $(window).on('resize', function(e){
            //        var w = c$.g_editor.width(), h = $(window).height();
            //        c$.UIActions.MarkdownEditor.fn_resize(w, h, c$.g_editor);
            //        customAutoFixedHandler(true);
            //    });
            //
            //}else{
            //    var t = c$.UIActions.FileObjAndMarkdownEditor;
            //    $.proxy(t.fn_updateMarkdownEditorWithFileObj, t)(UI.c$.g_editor, _g_getCurFileObj());
            //}

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);


        };

        $Router.go_settings = function(){
            console.log("settings");
            $('#nav-title').html('Settings');

            var thisPage = '#view-settings';

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);
        };

        $Router.go_pluginsMgr = function(){
            console.log("pluginsMgr");
            $('#nav-title').html('Plugins');

            var thisPage = '#view-plugins';

            //从插件系统中，获取并整理
            var $iap = IAPModule;
            var enablePlugins = $iap.getAllEnablePlugins();

            var o = {
                plugins:enablePlugins
            };

            var html = template('tpl_pluginsMgr', o);
            var ele = $(thisPage);
            ele.html(html);

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);
        };

        $Router.go_help = function(){
            console.log("help");
            $('#nav-title').html('Help');

            var thisPage = '#view-help';

            $Router.fn_showOrHide(allPageList, false);
            $Router.fn_showOrHide([thisPage], true);
        };

        $Router.go_about$license = function(){
            console.log("about$license");
            $('#nav-title').html('About');

            var thisPage = '#view-about';


            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){

                //动态创建Div来加载
                $('<div id="tmp-load-div"style="display: none"></div>').appendTo('#g-wrapper');

                var o = {
                    appName: b$.App.getAppName(),
                    version: b$.App.getAppVersion(),
                    logoUrl: 'images/logo_64.png',
                    description: 'A markdown editor built for speed,simplicity,and security.',
                    copyright:"Copyright 2015 Romanysoft LAB. All rights reserved.",
                    creditsTitle:" is mad possible by some open source project and other open source software.",
                    credits:[
                        {id:"credit-arTemplate", title:"artTemplate, high performance js template engine.", licenseUrl:"licenses/artTemplate/LICENSE", homepageUrl:"github.com/aui/artTemplate"}
                        ,{id:"credit-director.js", title:"director.js, routing is the process of determining what code to run when a URL is requested.", licenseUrl:"licenses/director.js/LICENSE", homepageUrl:"github.com/flatiron/director"}
                        ,{id:"credit-editor.md", title:"editor.md, a simple online markdown editor", licenseUrl:"licenses/editor.md/LICENSE", homepageUrl:"github.com/pandao/editor.md"}
                        ,{id:"credit-es6-shim", title:"es6-shim, provides compatibility shims so that legacy JavaScript engines behave as closely as possible to ECMAScript 6 (Harmony)", licenseUrl:"licenses/es6-shim/LICENSE", homepageUrl:"github.com/paulmillr/es6-shim"}
                        ,{id:"credit-jquery", title:"jquery, a fast, small, and feature-rich JavaScript library.", licenseUrl:"licenses/jquery/LICENSE", homepageUrl:"jquery.com"}
                        ,{id:"credit-mui", title:"mui, is a lightweight HTML, CSS and JS framework for sites that follow Google's Material Design guidelines.", licenseUrl:"licenses/mui/LICENSE", homepageUrl:"github.com/amorey/mui"}

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
            '/help':$Router.go_help,
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
            var obj = JSON.stringify({menuTag:903, action:cbName});
            b$.SystemMenus.setMenuProperty(obj);
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

    // 处理IAP
    c$.configIAP = function(cb){
        "use strict";

        if(typeof IAPModule == 'undefined'){return console.error('IAPModule is undefined.')}

        var prefix = b$.App.getAppId() + ".plugin.", defaultImg = "images/linearicons.png";
        var pluginsData = [
            {enable:true, inAppStore: false, id:prefix + "support.importFile", type:"", quantity:1, price:"1$", name:"Open File", description: "支持导入文件", img:"images/linearicons.png"}
            ,{enable:true, inAppStore: false, id:prefix + "support.dragFile", type:"", quantity:1, price:"1$", name:"Drag File", description: "支持拖拽文件", img:defaultImg}
            ,{enable:true, inAppStore: false, id:prefix + "support.fileSave", type:"", quantity:1, price:"2$", name:"File Save", description: "支持保存文件功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.dirTree", type:"", quantity:0, price:"3$", name:"File Directory", description: "支持目录树功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.taskList", type:"", quantity:0, price:"2$", name:"TaskList", description: "支持Github task lists", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.emoji", type:"", quantity:0, price:"3$", name:"Emoji", description: "支持emoji表情功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.atLink", type:"", quantity:0, price:"1$", name:"atLink", description: "支持atLink功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.emailLink", type:"", quantity:0, price:"1$", name:"emailLink", description: "支持emailLink功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.flowChart", type:"", quantity:0, price:"2$", name:"FlowChart", description: "支持flowChart功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.sequenceDiagram", type:"", quantity:0, price:"2$", name:"SequenceDiagram", description: "支持sequenceDiagram功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.tex", type:"", quantity:0, price:"2$", name:"Tex", description: "支持tex功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.toc", type:"", quantity:0, price:"2$", name:"Toc", description: "支持toc功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.codeFold", type:"", quantity:0, price:"1$", name:"CodeFold", description: "支持codeFold功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.htmlDecode", type:"", quantity:0, price:"1$", name:"HTMLDecode", description: "支持htmlDecode功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.styleActiveLine", type:"", quantity:0, price:"1$", name:"Style Active Line", description: "支持styleActiveLine功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.lineNumbers", type:"", quantity:0, price:"1$", name:"Line Numbers", description: "支持lineNumbers功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.readOnly", type:"", quantity:0, price:"1$", name:"ReadOnly", description: "支持readOnly功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.searchReplace", type:"", quantity:0, price:"1$", name:"Search Replace", description: "支持searchReplace功能", img:defaultImg}
        ];

        var $iap = IAPModule;

        $iap.init(pluginsData);

        // IAP的回调函数
        var fnName = b$._get_callback(function(obj){
            try{
                var info = obj.info, notifyType = obj.notifyType;

                if(notifyType == "ProductBuyFailed"){
                    //@"{'productIdentifier':'%@', 'message':'No products found in apple store'}"
                    var pluginId = info.productIdentifier;
                    var message = info.message;

                    var log = $.stringFormat("{0} order plugin failed! {1}", pluginId, message);
                    console.warn(log);
                }else if(notifyType == "ProductPurchased"){
                    //@"{'productIdentifier':'%@', 'quantity':'%@'}"
                    var pluginId = info.productIdentifier;
                    $iap.syncDataWithAppStore(pluginId);

                    var log = $.stringFormat("{0} order plugin success!", pluginId);
                    console.log(log);
                }else if(notifyType == "ProductPurchaseFailed"){
                    //@"{‘transactionId':'%@',‘transactionDate’:'%@', 'payment':{'productIdentifier':'%@','quantity':'%@'}}"
                    var pluginId = info.payment.productIdentifier;
                    var orderDate = info.transactionDate;

                    var log = $.stringFormat("{0} order plugin failed! orderDate {1}", pluginId, orderDate);
                    console.log(log);
                }else if(notifyType == "ProductPurchaseFailedDetail"){
                    //@"{'failBy':'cancel', 'transactionId':'%@', 'message':'%@', ‘transactionDate’:'%@', 'payment':{'productIdentifier':'%@','quantity':'%@'}}"
                    var pluginId = info.payment.productIdentifier;

                    var log = $.stringFormat("error: {0} failed by {1} ({2}) order date: {3}", pluginId, info.failBy, info.message, info.transactionDate);
                    console.log(log);
                }else if(notifyType == "ProductRequested"){
                    var productInfoList = info;
                    if(typeof info == "string"){
                        productInfoList = JSON.parse(info);
                    }

                    var log = $.stringFormat("Request product info from app store.");
                    console.log(log);

                    $iap.updatePluginsDataWithList(productInfoList);
                }else if(notifyType == "ProductCompletePurchased"){
                    //@"{'productIdentifier':'%@', 'transactionId':'%@', 'receipt':'%@'}"
                    var pluginId = info.productIdentifier;
                    var log = $.stringFormat("pluginId: {0}, transactionId: {1}, receipt: {2}", pluginId, info.transactionId, info.receipt);
                    console.log(log);
                }


            }catch(e){console.error(e)}
        }, true);

        // 开启IAP
        b$.IAP.enableIAP({cb_IAP_js: fnName, productIds: $iap.getEnableInAppStorePluginIDs()});
    };

    // 启动
    c$.launch = function(){
        "use strict";
        c$.initTitleAndVersion();
        c$.configIAP();
        c$.configRoute();
        c$.setupCache();
        c$.setupUI();
    };



}());