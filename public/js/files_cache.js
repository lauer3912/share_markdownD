/**
 * Created by Ian on 2015/3/22.
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
        window.FilesCacheModule = factory();
    }


}(function () {
    var check$ = true;
    if(check$){
        if (typeof ($) === "undefined") {
            console.error("no jquery is loaded...");
            return ;
        }
    }

    var fc = {};

    fc.data = [
        {
            id:'id001',        // 唯一标识
            name:'welcome.md', // 别名
            is_tmp:false,      // 是否是临时文件
            path:'/usr/local/1.md', // 路径
            ext:'md',          // 扩展名
            editing:false,     // 是否正在编辑, reload, 或者进入到workspace
            changed:false,     // 是否已经发生变化, 与编辑前的内容对比
            inWorkSpace:false, // 是否在工作空间内，是否在workspace内已经处于打开编辑状态
            content:''         // 内容。base64编码
        }
    ];

    fc.getAllFiles = function(){
        "use strict";
        var t = this;
        return t.data;
    };

    /**
     * 创建新文件
     * @param name 新文件的名称
     * @param useTmpFile 是否使用tmp文件
     * @param cb 回调函数
     */
    fc.createNewFile = function(name, useTmpFile, cb){
        "use strict";
        var t = this;

        var fileObj = {
            id: Date.now().toString(),
            name: name || 'untitled',
            is_tmp : useTmpFile || false,
            path: "",
            ext: "md",
            editing:false,
            changed:false,
            inWorkSpace:false,
            content:"push code..."
        };

        t.data.push(fileObj);
        cb && cb(fileObj);

        return fileObj;
    };

    /**
     * 添加文件到缓存
     * @param params 文件对象
     * @param cb 回调处理
     */
    fc.addFile = function(params, cb){
        "use strict";
        var t = this;

        $.each(t.data, function(index, obj){
            try{
                if(obj.path == params.path){
                    cb && cb(false);
                    return false;
                }
            }catch(e){console.error(e)}
        });


        var fileObj = {
            id: Date.now().toString(),
            name: params.name || 'untitled',
            is_tmp:false,
            path:params.path,
            ext:params.ext || 'md',
            content:params.content
        };

        t.data.push(fileObj);
        cb && cb(fileObj);

    };

    /**
     * 重新加载文件
     * @param id 文件id
     * @param cb 回调处理
     */
    fc.reLoadFile = function(id, cb){
        "use strict";
        var t = this;

        $.each(t.data, function(index, obj){
            if(obj.id == id){
                cb && cb(obj);
                return false;
            }
        })

    };

    /**
     * 保存文件
     * @param id 文件id
     * @param cb 回调处理
     */
    fc.saveFile = function(id, cb){
        "use strict";
        var t = this;

        $.each(t.data, function(index, obj){
            if(obj.id == id){
                cb && cb(obj);
                return false;
            }
        })
    };

    /**
     * 删除文件缓存项
     * @param id
     * @param cb
     */
    fc.removeFile = function(id, cb){
        "use strict";
        var t = this;

        $.each(t.data, function(index, obj){
            if(obj.id == id){
                cb && cb(obj);
                t.data.splice($.inArray(obj, t.data), 1);
                return false;
            }
        })
    };

    /**
     * 查找文件
     * @param id id
     * @param cb
     * @returns {boolean}
     */
    fc.findFile = function(id, cb){
        "use strict";
        var t = this;

        var find = false;
        $.each(t.data, function(index, obj){
            if(obj.id == id){
                cb && cb(obj);
                find = true;
                return false;
            }
        });

        return find;
    };




    return fc;
}));