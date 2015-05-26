/**
 * Created by Ian on 2015/5/15.
 */
///<reference path="../../tsd/typings/jquery/jquery.d.ts" />
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    var Cache = (function () {
        function Cache(key) {
            this.key = "default_key";
            this.data = [];
            this.key = key;
        }
        Cache.prototype.save = function () {
            var ls = window.localStorage;
            if (ls) {
                var dataStr = JSON.stringify(this.data);
                ls.setItem(this.key, dataStr);
                return true;
            }
            return false;
        };
        Cache.prototype.restore = function () {
            var ls = window.localStorage;
            if (ls) {
                var dataStr = ls.getItem(this.key);
                if (dataStr) {
                    this.data.length = 0;
                    this.data = JSON.parse(dataStr);
                    return true;
                }
            }
            return false;
        };
        Cache.prototype.findObj = function (key, type) {
            var foundObj = null;
            $.each(this.data, function (index, obj) {
                if (obj) {
                    var _key = obj.key, _value = obj.value, _type = obj.type;
                    if (key === _key && type === _type) {
                        foundObj = obj;
                        return false;
                    }
                }
            });
            return foundObj;
        };
        Cache.prototype.findObjList = function (type) {
            var objList = [];
            $.each(this.data, function (index, obj) {
                if (obj) {
                    var _type = obj.type;
                    if (type === _type) {
                        objList.push(obj);
                    }
                }
            });
            return objList;
        };
        Cache.prototype.find = function (key, type) {
            var obj = this.findObj(key, type);
            if (obj)
                return obj.value;
            return null;
        };
        Cache.prototype.update = function (key, type, value) {
            var obj = this.findObj(key, type);
            if (obj) {
                obj.value = value;
            }
            else {
                this.data.push({ key: key, value: value, type: type });
            }
        };
        Cache.prototype.delete = function (key, type) {
            var obj = this.findObj(key, type);
            if (obj) {
                this.data.splice($.inArray(obj, this.data), 1);
            }
        };
        return Cache;
    })();
    RomanySoftPlugins.Cache = Cache;
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.cache.js.map