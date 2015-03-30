/**
 * Created by Ian on 2015/3/5.
 */

(function () {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function () {
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var c$ = {};
    var b$ = BS.b$;
    var $fc = FilesCacheModule;
    var $Router = c$.RouterMethods = {};

    c$ = $.extend(window.UI.c$, {});

    // 初始化标题及版本
    c$.initTitleAndVersion = function(){
        document.title = b$.App.getAppName();
    };


    // 设置UI部分与逻辑交互
    c$.setupUI = function(){
        "use strict";

        // UI 的配置部分
        c$.UIConfigs = {
            MarkdownEditor:{
                default_toolbarIcons:function(){
                    if(editormd.version == "1.4.0"){
                        return ["undo", "redo", "|",
                            "bold","del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|",
                            "h1", "h2", "h4", "h4", "h5", "h6", "|",
                            "list-ul", "list-ol", "hr", "|",
                            "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "pagebreak", "|",
                            "goto-line", "watch", "preview", "watch", "fullscreen","|",
                            "search", "clear"]
                    }

                },
                configEmoji:function(){
                    //配置emoji的. 配置 You can custom Emoji's graphics files url path
                    editormd.emoji = {
                        path  : "http://www.emoji-cheat-sheet.com/graphics/emojis/",
                        ext   : ".png"
                    };

                    //配置Twemoji的. Twitter Emoji (Twemoji)  graphics files url path
                    editormd.twemoji = {
                        path : "http://twemoji.maxcdn.com/72x72/",
                        ext  : ".png"
                    };

                }
            }


        };

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

            ,loadFile:function(id){
                $fc.reLoadFile(id, function(obj){
                    var filePath = obj.path;
                    var cbName = b$._get_callback(function(obj){

                    }, true);

                    b$.Binary.getUTF8TextContentFromFile({callback:cbName, filePath:filePath});
                })
            }
            ,saveFile:function(id){
                alert('saveFile')
            }
            ,removeFilesItem:function(id){
                $fc.removeFile(id, function(obj){
                    var ele = '#view-files li[data-id="fileId_' + obj.id + '"]';
                    $(ele).remove();
                });
            }
            ,createNew:function(){
                $fc.createNewFile('untitled', true, function(fileObj){
                    $Router.go_files();
                });
            }
            ,importFiles:function(){
                alert('importFiles')
            }
            ,configEditor:function(ui_ele, in_config){

                var _config = in_config || {};

                //插件
                var ui_ele_editor = editormd(ui_ele, {
                    width: _config.width || "100%",
                    height: _config.height || $(document).height,
                    path: 'common/editor.md/1.4/editor.md/lib/'
                    ,toolbarIcons: c$.UIConfigs.MarkdownEditor.default_toolbarIcons()
                    ,appendMarkdown: _config.content || ""   // 附加的md内容


                    //其他配置项
                    //,pluginPath: ''           //插件路径
                    //,delay: 300               //启动延时处理
                    //,watch: true              //开启实时预览
                    //,placeholder: ""          //默认替换文字
                    //,gotoLine: true           //是否开启gotoLine的功能
                    //,codeFold: false          //是否开启代码折叠功能
                    //,autoHeight: false        //是否开启自动高度
                    //,autoCloseTags: true      //是否自动补全标签
                    //,searchReplace: true      //是否开启查找替换功能
                    //,readOnly: false          //是否开启只读模式
                    //,lineNumbers: true        //是否显示行号
                    //,matchWordHighlight: true //是否匹配文件高亮
                    //,styleActiveLine: true    //是否高亮当前行
                    //,dialogLockScreen: true   //是否对话框锁住屏幕
                    //,dialogShowMask: true     //是否对话框显示Mask
                    //,dialogDraggable: true    //是否对话框可以拖拽
                    //,dialogMaskBgColor: "#fff" //设置对话框的Mask背景颜色
                    //,dialogMaskOpacity: 0.1   //设置对话框的透明度
                    //,fontSize: "13px"         //设置编辑器的字体大小
                    //,saveHTMLToTextarea: false //开启是否保存HTML到文本区域
                    //,disabledKeyMaps: []      //屏蔽哪些快捷键

                    //,imageUpload: false       //图片是否上传
                    //,imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"] //至此的图片格式
                    //,imageUploadURL: ""       //图片上传的URL地址
                    //,crossDomainUpload: false //是否跨域上传
                    //,uploadCallbackURL: ""    //图片上传的回调URL

                    //,toc: true                //是否开启Table of contents 功能
                    //,tocm: false              //是否Using [TOCM] auto create Toc dropdown menu
                    //,tocTitle: ""             //是否指定Toc dropdown menu btn
                    //,tocStartLevel：1         //指定 Said from H1 to create Toc
                    //,tocContainer: ""         //指定toc的容器
                    //,htmlDecode: false        //是否开启Open the HTML tag identification
                    //,pageBreak: true          //是否开启解析 page break [======]
                    //,atLink: true             //是否开启@link功能
                    //,emailLink: true          //是否开启Email地址自动link功能
                    //,taskList: false          //是否开启Github Flavored Markdown task lists
                    //,emoji: false             //是否开启emoji
                    //,tex: false               //是否开启Tex(Latex)，based on KaTex功能
                    //,flowChart: false         //是否开启FlowChart 功能
                    //,sequenceDiagram: false   //是否开启SequenceDiagram 功能
                    //,previewCodeHighlight: true //是否开启预览代码高亮功能
                    //,toolbar: true            //是否显示工具栏
                    ,toolbarAutoFixed: _config.toolbarAutoFixed || true   //工具栏是否自动填充位置


                    ////////////加载Handler的处理方式
                    ,onload: _config.onload || function(){}     //加载成功后的处理
                    ,onresize: _config.onresize || function(){}   //大小发生变化的时候
                    ,onchange: _config.onchange || function(){}   //内容发生变化的时候
                    ,onwatch: _config.onwatch || function(){}    //实时预览的时候
                    ,onunwatch: _config.onunwatch || function(){}  //实时预览关闭的时候
                    ,onpreviewing: _config.onpreviewing || function(){} //当预览的时候
                    ,onpreviewed:_config.onpreviewed ||  function(){}  //当已经预览过的时候
                    ,onfullscreen:_config.onfullscreen || function(){}  //当全屏的时候
                    ,onfullscreenExit:_config.onfullscreenExit || function(){} //当全屏退出的时候
                    ,onscroll:_config.onscroll || function(){}     //当滚动的时候
                    ,onpreviewscroll:_config.onpreviewscroll || function(){} //当预览滚动的时候

                });

                return ui_ele_editor;

            }
        };

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

            }

        };

        $Router.go_files = function(){
            console.log("files");
            $('#nav-title').html('Files');


            var thisPage = '#view-files';
            var o = {
                files: $fc.getAllFiles()
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
                    $fc.findFile(id, function(obj){
                        obj.name = newName;
                    });
                }
            })

        };

        $Router.go_workspace = function(){
            console.log("workspace");
            $('#nav-title').html('Workspace');

            var thisPage = '#view-workspace';

            var ele = $(thisPage);
            if($.trim(ele.html()).length == 0){
                var html = template('tpl_workspace', {id:"uic-editormd"});
                ele.html(html);

                $.getScript("common/editor.md/1.4/editor.md/editormd.min.js", function(){
                    c$.UIConfigs.MarkdownEditor.configEmoji();
                    var editormdObj = c$.UIActions.configEditor("uic-editormd",
                        {
                            height:$(document).height()
                            ,toolbarAutoFixed: false
                            ,onchange: function(){}
                            ,onscroll: function(){
                            }
                        }
                    );

                    editormdObj.setToolbarAutoFixed(false);

                    var alreayFixed = false;
                    var customAutoFixedHandler = function(){
                        if(! alreayFixed) return;
                        
                        var toolbar = editormdObj.toolbar;
                        var editor = editormdObj.editor;
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

                    $(window).bind("scroll", customAutoFixedHandler);
                });
            }


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
        c$.setupUI();
    };



}());