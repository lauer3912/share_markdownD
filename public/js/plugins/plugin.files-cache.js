/**
 * Created by Ian on 2015/5/14.
 */
///<reference path="../../typings/jquery/jquery.d.ts" />
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    // 单一的文件对象
    var FileObj = (function () {
        function FileObj() {
            this.id = $.now(); // 唯一标识
            this.name = "Untitled"; // 别名
            this.is_tmp = true; // 是否是临时文件, 默认是临时的
            this.path = ""; // 路径
            this.ext = "md"; // 扩展名
            this.changed = false; // 是否正在编辑, reload, 或者进入到workspace
            this.mustReloadNextTime = false; // 下次是否必须从文件中加载内容
            this.lastModify = $.now(); // 最后修改时间戳
            this.createTime = $.now(); // 创建的时间
            this.assEditor = null; // 关联的Editor的对象的信息
            this.assEditorSettings = {}; // 关联的设置
            this.content_utf8 = ""; // 内容
        }
        // 获取核心的数据的json系列化
        FileObj.prototype.coreDataToJSON = function () {
            var obj = {};
            for (var key in this) {
                if (key != "assEditor") {
                    obj[key] = this[key];
                }
            }
            return JSON.stringify(obj);
        };
        // 核心数据的反序列化
        FileObj.prototype.coreDataFromJSON = function (str) {
            try {
                var obj = JSON.parse(str);
                for (var key in obj) {
                    if (key in this) {
                        this[key] = obj[key];
                    }
                }
            }
            catch (e) { }
        };
        return FileObj;
    }());
    RomanySoftPlugins.FileObj = FileObj;
    // 文件缓存对象
    var FilesCache = (function () {
        function FilesCache() {
            this.data = [];
        }
        // 获取所有文件对象.排序
        FilesCache.prototype.getAllFiles = function () {
            "use strict";
            if (this.data.length <= 1)
                return this.data;
            var coloneData = [].concat(this.data);
            var sortDataList = coloneData.sort(function (a, b) {
                if (a.lastModify < b.lastModify)
                    return 1;
                if (a.lastModify > b.lastModify)
                    return -1;
                return 0;
            });
            return sortDataList;
        };
        // 获取所有文件对象，方向排序的
        FilesCache.prototype.getAllFilesWithSortByCreateTime = function () {
            "use strict";
            if (this.data.length <= 1)
                return this.data;
            var coloneData = [].concat(this.data);
            var sortDataList = coloneData.sort(function (a, b) {
                if (a.createTime < b.createTime)
                    return 1;
                if (a.createTime > b.createTime)
                    return -1;
                return 0;
            });
            return sortDataList;
        };
        // 获取最新创建的的文件对象
        FilesCache.prototype.getLastCreatedFileObj = function () {
            "use strict";
            var _allFilesWithSortByCreateTime = this.getAllFilesWithSortByCreateTime();
            if (_allFilesWithSortByCreateTime.length > 0)
                return _allFilesWithSortByCreateTime[0];
            return null;
        };
        // 获取所有文件对象，没有排序的
        FilesCache.prototype.getAllFilesWithNoSort = function () {
            "use strict";
            if (this.data.length < 1)
                return [];
            return this.data;
        };
        // 获取一个新的文件对象
        FilesCache.prototype.getNewFileObj = function () {
            "use strict";
            var t$ = this;
            var obj = new FileObj();
            obj.name = obj.name + (t$.data.length + 1);
            return obj;
        };
        // 获取最后一个修改的文件对象
        FilesCache.prototype.getLastModifyFileObj = function () {
            "use strict";
            if (this.data.length == 0)
                return null;
            var sortDataList = this.getAllFiles();
            return sortDataList[0];
        };
        // 添加文件对象到缓存中
        FilesCache.prototype.addFile = function (file, cb) {
            "use strict";
            this.data.push(file);
            cb && cb(file);
        };
        // 重新加载文件
        FilesCache.prototype.reLoadFile = function (id, cb) {
            "use strict";
            var t = this;
            $.each(t.data, function (index, obj) {
                if (obj.id == id) {
                    cb && cb(obj);
                    return false;
                }
            });
        };
        // 保存缓存项
        FilesCache.prototype.saveFile = function (id, cb) {
            "use strict";
            var t = this;
            $.each(t.data, function (index, obj) {
                if (obj.id == id) {
                    cb && cb(obj);
                    return false;
                }
            });
        };
        // 删除文件缓存项
        FilesCache.prototype.removeFile = function (id, cb) {
            "use strict";
            var t = this;
            $.each(t.data, function (index, obj) {
                if (obj.id == id) {
                    t.data.splice(index, 1);
                    cb && cb(obj);
                    return false;
                }
            });
        };
        // 查找文件对象
        FilesCache.prototype.findFile = function (id, cb) {
            "use strict";
            var t = this;
            var find = false;
            $.each(t.data, function (index, obj) {
                if (obj.id == id) {
                    cb && cb(obj);
                    find = true;
                    return false;
                }
            });
            return find;
        };
        // 查找文件对象，扩展方式
        FilesCache.prototype.findFileEx = function (condition, cb) {
            "use strict";
            var t = this;
            var find = false;
            // 遍历key
            var _keyFind = function (condition, obj) {
                for (var key in condition) {
                    if (obj.hasOwnProperty(key)) {
                        if (condition[key] != obj[key]) {
                            return false;
                        }
                    }
                }
                return true;
            };
            $.each(t.data, function (index, obj) {
                if (_keyFind(condition, obj)) {
                    cb && cb(obj);
                    find = true;
                    return false;
                }
            });
            return find;
        };
        return FilesCache;
    }());
    RomanySoftPlugins.FilesCache = FilesCache;
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.files-cache.js.map