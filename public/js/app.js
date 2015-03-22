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
    c$ = $.extend(window.UI.c$, {});

    // 初始化标题及版本
    c$.initTitleAndVersion = function(){
        document.title = b$.App.getAppName();
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
                alert('crateItem')
            }
            ,importFiles:function(){
                alert('importFiles')
            }
        };


        // 配置编辑器
        function config_editor(){
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

            //配置@link 的base url前缀
            editormd.urls.atLinkBase = "https://github.com/";

            //配置
            var default_toolbarIcons = function () {
                return ["undo", "redo", "|",
                    "bold","del", "italic", "quote", "|",
                    "h1", "h2", "h4", "h4", "h5", "h6", "|",
                    "list-ul", "list-ol", "hr", "|",
                    "link", "anchor", "image", "code", "|",
                    "preview", "watch", "|",
                    "clear"]
            };

            //插件
            c$.ui_ele_editor = editormd("test-editormd", {
                width: "100%",
                height: "720",
                path: 'common/editor.md/1.3/editor.md/lib/'
                //toolbarIcons: default_toolbarIcons()
            });

            //工具栏自动固定定位的开启与禁用
            c$.ui_ele_editor.config("toolbarAutoFixed", true);

            //设置自动高度处理
            c$.ui_ele_editor.config("autoHeight", true);

            //激活Github Flavored Markdown task lists
            c$.ui_ele_editor.config("taskList", true);

            //激活emoji表情功能
            c$.ui_ele_editor.config("emoji", true);

            //激活atLink
            c$.ui_ele_editor.config("atLink", true);

            //激活emailLink
            c$.ui_ele_editor.config("emailLink", true);

            //激活flowChart
            c$.ui_ele_editor.config("flowChart", true);

            //激活sequenceDiagram
            c$.ui_ele_editor.config("sequenceDiagram", true);

            //激活科学公式 Tex
            c$.ui_ele_editor.config("tex", true);

            //激活Toc(目录功能)
            c$.ui_ele_editor.config("toc", true);

            //激活代码折叠功能
            c$.ui_ele_editor.config("codeFold", true);

            //激活htmlDecode.开启HTML标签解析，为了安全性，默认不开启
            c$.ui_ele_editor.config("htmlDecode", true);

            //高亮显示当前行
            c$.ui_ele_editor.config("styleActiveLine", true);

            //显示行号
            c$.ui_ele_editor.config("lineNumbers", true);

            //激活只读模式
            c$.ui_ele_editor.config("readOnly", true);

            //激活实时预览
            c$.ui_ele_editor.config("watch", true);

            //激活搜索替换功能
            c$.ui_ele_editor.config("searchReplace", true);

            //激活控制键盘快捷键的映射(禁用某些快捷键的功能)
            c$.ui_ele_editor.config("disabledKeyMaps",[]);
        }
    };

    // 配置路由控制
    c$.configRoute = function(){
        "use strict";

        if (typeof Router === "undefined"){console.error('director router not config...');return;}

        var fn_showOrHide = function(eleList, show, auto){
            $.each(eleList, function(index, ele){
                if(show){
                    if($(ele).is(":visible")==false){$(ele).show()}
                }else{
                    if($(ele).is(":visible")==true)$(ele).hide();
                }

            });
        };


        var leftNav = function(){
            console.log("left nav");
            var ele = $('#leftNav');
            if($.trim(ele.html()).length == 0){
                var o = {
                    appName: "MarkdownD",
                    navList: [
                        {name: "Files", href: "#/files", class:" icon-tab"}
                        ,{name: "Workspace", href: "#/workspace", class:" icon-dashboard"}
                        ,{name: "Plugins", href: "#/pluginsMgr", class:" icon-extension"}
                        ,{name: "Settings", href: "#/settings", class:" icon-settings"}
                        ,{name: "Help", href: "#/help", class:" icon-help"}

                    ]
                };

                var html = template('tpl_leftNav', o);
                ele.html(html);

            }

            fn_showOrHide(['#leftNav'], true);
        };

        var files = function(){
            console.log("files");


            var o = {
                files: $fc.getAllFiles()
            };

            var ele = $('#view-files');
            var html = template('tpl_files', o);
            ele.html(html);

            fn_showOrHide(['#leftNav','#view-workspace','#view-plugins', '#view-settings', '#view-help'], false);
            fn_showOrHide(['#view-files'], true);

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

        var workspace = function(){
            console.log("workspace");

            var ele = $('#view-workspace');
            var html = template('tpl_workspace', {});
            ele.html(html);

            fn_showOrHide(['#leftNav','#view-files','#view-plugins', '#view-settings', '#view-help'], false);
            fn_showOrHide(['#view-workspace'], true);
        };

        var settings = function(){
            console.log("settings");

            fn_showOrHide(['#leftNav','#view-files','#view-plugins', '#view-workspace', '#view-help'], false);
            fn_showOrHide(['#view-settings'], true);
        };

        var pluginsMgr = function(){
            console.log("pluginsMgr");
            var ele = $('#view-plugins');


            //从插件系统中，获取并整理
            var $iap = IAPModule;
            var enablePlugins = $iap.getAllEnablePlugins();



            var o = {
                plugins:enablePlugins
            };

            var html = template('tpl_pluginsMgr', o);
            ele.html(html);

            fn_showOrHide(['#leftNav', '#view-files','#view-workspace','#view-settings', '#view-help'], false);
            fn_showOrHide(['#view-plugins'], true);
        };

        var help = function(){
            console.log("help");

            fn_showOrHide(['#leftNav','#view-files', '#view-plugins', '#view-workspace', '#view-settings'], false);
            fn_showOrHide(['#view-help'], true);
        };

        var myRoutes = {
            "/leftNav":leftNav,
            '/files':files,
            '/workspace':workspace,
            '/settings' : settings,
            '/pluginsMgr': pluginsMgr,
            '/help':help

        };

        var router = Router(myRoutes);
        router.init();



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
            ,{enable:true, inAppStore: true, id:prefix + "support.taskList", type:"", quantity:0, price:"2$", name:"Support TaskList", description: "支持Github task lists", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.emoji", type:"", quantity:0, price:"3$", name:"Support Emoji", description: "支持emoji表情功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.atLink", type:"", quantity:0, price:"1$", name:"Support atLink", description: "支持atLink功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.emailLink", type:"", quantity:0, price:"1$", name:"Support emailLink", description: "支持emailLink功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.flowChart", type:"", quantity:0, price:"2$", name:"Support FlowChart", description: "支持flowChart功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.sequenceDiagram", type:"", quantity:0, price:"2$", name:"Support SequenceDiagram", description: "支持sequenceDiagram功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.tex", type:"", quantity:0, price:"2$", name:"Support Tex", description: "支持tex功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.toc", type:"", quantity:0, price:"2$", name:"Support Toc", description: "支持toc功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.codeFold", type:"", quantity:0, price:"1$", name:"Support CodeFold", description: "支持codeFold功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.htmlDecode", type:"", quantity:0, price:"1$", name:"Support HTMLDecode", description: "支持htmlDecode功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.styleActiveLine", type:"", quantity:0, price:"1$", name:"Support Style Active Line", description: "支持styleActiveLine功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.lineNumbers", type:"", quantity:0, price:"1$", name:"Support Line Numbers", description: "支持lineNumbers功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.readOnly", type:"", quantity:0, price:"1$", name:"Support ReadOnly", description: "支持readOnly功能", img:defaultImg}
            ,{enable:true, inAppStore: true, id:prefix + "support.searchReplace", type:"", quantity:0, price:"1$", name:"Support Search Replace", description: "支持searchReplace功能", img:defaultImg}
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