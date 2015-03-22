/**
 * Created by Ian on 2015/3/10.
 */

;(function(factory){
    "use strict";

    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
    else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
        if (define.amd) // for Require.js
        {
            /* Require.js define replace */
        }
        else
        {
            define(["jquery"], factory);  // for Sea.js
        }
    }
    else
    {
        window.IAPModule = factory();
    }


}(function(){
    "use strict";

    var check$ = true;
    if(check$){
        if (typeof ($) === "undefined") {
            console.error("no jquery is loaded...");
            return ;
        }
    }

    var IAPModule = {};

    IAPModule.pluginsData = [
        //{enable:true, inAppStore: false, id:"", type:"", quantity:0, price:"1$", name:"Open File", description: "支持导入文件", url: "images/iap/importFile_64.png", uiShow:true}
    ];

    // 创建及初始化插件信息表
    IAPModule.isInited = false; // 是否已经初始化过
    IAPModule.init = function(pluginsData){
        var t = this;
        t.pluginsData = pluginsData;
        t.isInited = true;
    };

    IAPModule.noInitMessage = function(){
        console.error("IAPModule.pluginsData not init..")
    };


    // 获取插件对象
    IAPModule.getPluginObj = function(id){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}

        var obj = null;
        $.each(t.pluginsData, function(index, plugin){
            if(plugin.id == id){
                obj = plugin; return false;
            }
        });

        return obj;
    };

    // 获取可用的，在应用商店注册的插件
    IAPModule.getEnableInAppStorePlugins = function(){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}

        var pluginList = [];
        $.each(t.pluginsData, function(index, plugin){
            if(plugin.enable && plugin.inAppStore){
                pluginList.push(plugin);
            }
        });

        return pluginList;
    };

    // 获取可用的，在应用商店中注册的插件ID数组
    IAPModule.getEnableInAppStorePluginIDs = function(){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}

        var pluginIDs = [];
        var _plugins = t.getEnableInAppStorePlugins();
        $.each(_plugins, function(index, plugin){
            pluginIDs.push(plugin.id);
        });

        return pluginIDs;
    };

    // 获取所有内置可用插件
    IAPModule.getAllEnablePlugins = function(){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}

        var plugins = [];
        $.each(t.pluginsData, function(index, plugin){
            if(plugin.enable){
                plugins.push(plugin);
            }
        });

        return plugins;
    };

    // 获取所有内置可用插件的名称(英文)
    IAPModule.getAllEnablePluginNames = function(){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}

        var pluginNames = [];
        $.each(t.pluginsData, function(index, plugin){
            if(plugin.enable){
                pluginNames.push(plugin.name);
            }
        });

        return pluginNames;
    };

    // 获取指定插件是否已经购买
    /**
     *
     * @param plugin_id 插件ID
     * @param cb_delegate 委托回调处理
     * @returns {*} 返回true或false
     */
    IAPModule.getPluginPurchased = function(plugin_id, cb_delegate){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}

        var pluginIDs = t.getEnableInAppStorePluginIDs();
        if($.inArray(plugin_id, pluginIDs) > -1){

            var default_fun = function(id){
                var b$ = BS.b$;
                try{
                    return (b$.IAP.getUseableProductCount(id) > 0)
                }catch(e){console.error(e)}

                return false;
            };

            var fnc = cb_delegate || default_fun;
            return fnc(plugin_id);
        }else{
            console.warn(plugin_id + " no found.")
        }

        return false;
    };

    // 与应用商店同步插件的信息
    /**
     *
     * @param plugin_id 插件的ID
     * @param cb_delegate 委托回调
     */
    IAPModule.syncDataWithAppStore = function(plugin_id, cb_delegate){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}


        var default_func = function(id){
            try{
                var IAP = BS.b$.IAP;
                if(id){
                    $.each(t.pluginsData, function(index, plugin){
                        if(plugin.enable && plugin.id == id){
                            var quantity = IAP.getUseableProductCount(id);
                            var price = IAP.getPrice(id);
                            plugin.quantity = quantity;
                            plugin.price = price;
                        }
                    });
                }else{
                    $.each(t.pluginsData, function(index, plugin){
                        if(plugin.enable && plugin.inAppStore){
                            var quantity = IAP.getUseableProductCount(id);
                            var price = IAP.getPrice(id);
                            plugin.quantity = quantity;
                            plugin.price = price;
                        }
                    });
                }
            }catch(e){console.error(e)}

        };

        var fnc = cb_delegate || default_func;
        fnc(plugin_id);
    };

    // 更新本地的插件的价格及描述信息，通过产品列表 [SDK从应用商店中心推送回来的数据]
    /**
     *
     * @param productInfoList 从应用商店中心获取的产品信息列表
     * @param cb_delegate     委托回调处理
     */
    IAPModule.updatePluginsDataWithList = function(productInfoList, cb_delegate){
        var t = this;
        if(!t.isInited){return t.noInitMessage()}

        $.each(productInfoList, function(index, productInfo){
            var id = productInfo.productIdentifier;
            var description = productInfo.description;
            var price = productInfo.price;

            var pluginObj = t.getPluginObj(id);
            pluginObj.price = price;
            pluginObj.description = description;

        });

        cb_delegate && cb_delegate();
    };



    return IAPModule;
}));
