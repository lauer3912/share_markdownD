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
        //{Object}
    ];

    fc.getAllFiles = function(){
        "use strict";
        var t = this;
        return t.data;
    };

    /**
     * 获得一个新的文件对象
     * @returns {{id: (number|*), name: string, is_tmp: boolean, path: string, ext: string, editing: boolean, changed: boolean, inWorkSpace: boolean, lastModify: (number|*)}}
     */
    fc.getNewFileObj = function(){
        "use strict";
        var fileObj = {
            id: $.now(),                    // 唯一标识
            name: 'untitled',               // 别名
            is_tmp : false,                 // 是否是临时文件
            path: "",                       // 路径
            ext: "md",                      // 扩展名
            editing:false,                  // 是否正在编辑, reload, 或者进入到workspace
            changed:false,                  // 是否已经发生变化, 与编辑前的内容对比
            inWorkSpace:false,              // 是否在工作空间内，是否在workspace内已经处于打开编辑状态
            lastModify:$.now()              // 最后修改时间戳
            ,assEditorParamsObj:{}          // 关联的Editor的对象的信息
        };

        return fileObj;
    };

    /**
     * 获取最后修改的文件对象
     * @returns {Array.<T>}
     */
    fc.getLastModifyFileObj = function(){
        "use strict";
        var t = this;

        if(t.data.length > 0){
            var sortDataList =  t.data.sort(function(a, b){
                if(a.lastModify < b.lastModify) return -1;
                if(a.lastModify > b.lastModify) return 1;
                return 0;
            });

            return sortDataList[0];
        }

        return null;
    };


    /**
     * 添加文件到缓存
     * @param params 文件对象
     * @param cb 回调处理
     */
    fc.addFile = function(fileObj, cb){
        "use strict";
        var t = this;

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