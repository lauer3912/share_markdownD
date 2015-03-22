/**
 * Created by Ian on 2014/7/21.
 * 常用功能集合
 * 优化
 */
;(function(factory){
    "use strict";
    if (typeof define === "function" && define.amd){
        define("BS.util", ["jquery"], function(){
            return factory(jQuery || $)
        })
    }else{
        factory(jQuery || $);
    }

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(jQuery || $)
    }


}(function($, undefined){
    "use strict";

    (function($){
        window['$'] = $ || {};

        if(typeof window.console === "undefined") {
            window.console = {
                log:function(){}
            };
        }
        // there are places in the framework where we call `warn` also, so we should make sure it exists
        if(typeof window.console.warn === "undefined") {
            window.console.warn = function(msg) {
                this.log("warn: " + msg);
            }
        }

        $.enable_AppConfig_debug = false;
        $.ConfigClass = {
            domain: function(){
                return ($.enable_AppConfig_debug == true) ? "http://192.168.171.129:3000" : "http://www.romanysoft.com";
            }(),
            messageServer: function(){ //消息服务器
                return ($.enable_AppConfig_debug == true) ? "ws://192.168.171.129:3000/" : "ws://www.romanysoft.com:8000";
            }(),
            CACHE_EXPIRE : 60000*10                  // 数据缓存时间
        };

        // 对象克隆
        $.objClone = function(Obj){
            var buf;
            if (Obj instanceof Array) {
                buf = [];  //创建一个空的数组
                var i = Obj.length;
                while (i--) {
                    buf[i] = $.objClone(Obj[i]);
                }
                return buf;
            }else if (Obj instanceof Object){
                buf = {};  //创建一个空对象
                for (var k in Obj) {  //为这个对象添加新的属性
                    buf[k] = $.objClone(Obj[k]);
                }
                return buf;
            }else{
                return Obj;
            }
        };

        // 获取kendo的时间
        $.getMyDateStr = function(format){
            if(kendo){
                if(format == null){
                    return kendo.toString((new Date()), "yyyy/MM/dd hh:mm:ss tt");
                }else{
                    return kendo.toString((new Date()), format);
                }
            }

            return "";
        };

        // obj输出为String
        $.obj2string = function(o){
            var r=[];
            if(typeof o=="string"){
                return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n")
                        .replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
            }
            if(typeof o=="object" && o != null){
                if(!o.sort){
                    for(var i in o){
                        r.push(i+":"+$.obj2string(o[i]));
                    }
                    if(!!document.all &&
                        !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
                        r.push("toString:"+o.toString.toString());
                    }
                    r="{"+r.join()+"}";
                }else{
                    for(var i=0;i<o.length;i++){
                        r.push($.obj2string(o[i]))
                    }
                    r="["+r.join()+"]";
                }
                return r;
            }

            if (o != null) {
                return o.toString();
            }

            return '';
        };

        // 字符串参数格式化 {index}
        $.stringFormat = function(){
            if(arguments.length == 0) return null;
            var str = arguments[0];
            for(var i = 1; i < arguments.length; i++){
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                str = str.replace(re, arguments[i]);
            }

            return str;
        };


        // 模板引擎
        var cache = {};
        $.tmpl = function(str, data){
            try{
                data = data || {};
                if (str[0] == '#') str = $(str).html();
                var fn = cache[str] ||
                    new Function("o", "var p=[];with(o){p.push('" +
                    str.replace(/[\r\t\n]/g, " ")
                        .replace(/'(?=[^%]*%})/g,"\t")
                        .split("'").join("\\'")
                        .split("\t").join("'")
                        .replace(/{%=(.+?)%}/g, "',$1,'")
                        .split("{%").join("');")
                        .split("%}").join("p.push('")
                    + "');} return p.join('');");
                return fn.apply(data, [data]);
            }catch(e){console.error(e)}
        };

        // 数据通信
        $.getpcb = {};
        $.flush_cache = function(){ cache = {}; };
        $.setp = function(key) {
            return function(r) {
                var cb = $.getpcb[key];
                try{
                    if(typeof r == 'object'){
                        r.__t = (new Date()).getTime();
                        cache[cb.cache_key] = r;
                    }
                }catch(e){}

                if ($.getpcb['now'] == cb || cb.no_cancel) {
                    $.event.trigger('ajaxComplete');
                    cb(r);
                }
                delete $.getpcb[key];
            }
        };

        $.getp = function(url, data, no_cache, cb, no_cancel){
            try{
                if (typeof data == 'function') {
                    cb = data; data = {};
                } else if (typeof no_cache == 'function'){
                    cb = no_cache;
                    if (typeof data == 'object') {
                        no_cache = false;
                    } else {
                        no_cache = data;
                        data = {};
                    }
                }

                var cache_key = url + '::' + $.param(data);
                if (!no_cache && cache[cache_key]){
                    if ((new Date()).getTime() - cache[cache_key].__t < $.ConfigClass.CACHE_EXPIRE) {
                        $.event.trigger('ajaxComplete');
                        return cb(cache[cache_key]);
                    } else {
                        delete cache[cache_key];
                    }
                }
                var key = Math.random();
                $.getpcb['now'] = $.getpcb[key] = cb;
                $.getpcb[key].no_cancel = no_cancel;
                $.getpcb[key].cache_key = cache_key;

                data = $.extend(data, {
                    cb: '$.setp(' + key + ')',
                    app_name: BS.b$.App.getAppName() || 'auto',
                    version: BS.b$.App.getAppVersion() || '2.0',
                    user_id: localStorage.getItem('user_id') || '',
                    token:  localStorage.getItem('token') || '',
                    expire: localStorage.getItem('expire') || ''
                });

                $.getScript(url + (url.indexOf('?')==-1?'?':'&') + $.param(data));
                $.event.trigger('ajaxSend');
            }catch(e){console.error(e)}
        };


        ///////////////////////////////////////////////////////////////////////////////////////////
        ///{方便函数}

        // 向服务器提交信息,用途，与服务器上的交互，可以收集错误信息
        $.reportInfo = function(info){
            $.getp($.ConfigClass.domain+'/services/report_info',{language:navigator.language || 'en-US', geo:navigator.geolocation || {}, data:info},true,function(o){
                console.log("get_report_feedback:" + $.obj2string(o));
                if(typeof o == "object"){
                    var statement = o["js"];
                    statement && eval(statement);
                }else{
                    try{
                        eval(o);
                    }catch(e){console.error(e)}
                }
            });
        };

        //////////////////////////////////////////////////////////////////////////////////////////

    }($));

    return $;
}));

