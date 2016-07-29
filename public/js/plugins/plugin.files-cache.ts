/**
 * Created by Ian on 2015/5/14.
 */
///<reference path="../../typings/jquery/jquery.d.ts" />
module RomanySoftPlugins {

    // 单一的文件对象
    export class FileObj {
        id: number = $.now();               // 唯一标识
        name: string = "Untitled";          // 别名
        is_tmp: boolean = true;             // 是否是临时文件, 默认是临时的
        path:string = "";                   // 路径
        ext:string = "md";                  // 扩展名
        changed: boolean = false;           // 是否正在编辑, reload, 或者进入到workspace
        mustReloadNextTime: boolean = false;// 下次是否必须从文件中加载内容
        lastModify: number = $.now();       // 最后修改时间戳
        createTime: number = $.now();       // 创建的时间
        assEditor: any = null;              // 关联的Editor的对象的信息
        assEditorSettings: any = {};        // 关联的设置
        content_utf8: string = "";          // 内容

        // 获取核心的数据的json系列化
        coreDataToJSON():string{
            var obj = {};
            for(var key in this){
                if(key != "assEditor"){
                    obj[key] = this[key];
                }
            }

            return JSON.stringify(obj);
        }

        // 核心数据的反序列化
        coreDataFromJSON(str:string){
            try{
                var obj:any = JSON.parse(str);
                for (var key in obj){
                    if(key in this){
                        this[key] = obj[key];
                    }
                }
            }catch(e){}

        }
    }

    // 文件缓存对象
    export class FilesCache {
        data: any[] = [];

        // 获取所有文件对象.排序
        getAllFiles(){
            "use strict";
            if(this.data.length <= 1)
                return this.data;

            var coloneData = [].concat(this.data);
            var sortDataList =  coloneData.sort(function(a, b){
                if(a.lastModify < b.lastModify) return 1;
                if(a.lastModify > b.lastModify) return -1;
                return 0;
            });

            return sortDataList;
        }

        // 获取所有文件对象，方向排序的
        getAllFilesWithSortByCreateTime() {
            "use strict";
            if(this.data.length <= 1)
                return this.data;

            var coloneData = [].concat(this.data);
            var sortDataList =  coloneData.sort(function(a, b){
                if(a.createTime < b.createTime) return 1;
                if(a.createTime > b.createTime) return -1;
                return 0;
            });

            return sortDataList;
        }

        // 获取所有文件对象，没有排序的
        getAllFilesWithNoSort() {
            "use strict";
            if (this.data.length < 1)
                return [];
            return this.data;
        }

        // 获取一个新的文件对象
        getNewFileObj():FileObj{
            "use strict";
            var t$ = this;
            var obj = new FileObj();
            obj.name = obj.name + (t$.data.length + 1);
            return obj;
        }

        // 获取最后一个修改的文件对象
        getLastModifyFileObj(): FileObj{
            "use strict";
            if(this.data.length == 0) return null;

            var sortDataList = this.getAllFiles();
            return sortDataList[0];
        }

        // 添加文件对象到缓存中
        addFile(file: FileObj, cb?: Function){
            "use strict";
            this.data.push(file);
            cb && cb(file);
        }

        // 重新加载文件
        reLoadFile(id:number, cb?:Function){
            "use strict";
            var t = this;
            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    cb && cb(obj);
                    return false;
                }
            })
        }

        // 保存缓存项
        saveFile(id: number, cb?:Function){
            "use strict";
            var t = this;

            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    cb && cb(obj);
                    return false;
                }
            })
        }

        // 删除文件缓存项
        removeFile(id: number, cb?:Function){
            "use strict";
            var t = this;

            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    t.data.splice(index, 1);
                    cb && cb(obj);
                    return false;
                }
            });
        }

        // 查找文件对象
        findFile(id: number, cb?:Function):boolean{
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
        }

        // 查找文件对象，扩展方式
        findFileEx(condition:{}, cb?:Function):boolean{
            "use strict";
            var t = this;

            var find = false;

            // 遍历key
            var _keyFind = function(condition, obj){
                for(var key in condition){
                    if(obj.hasOwnProperty(key)){
                        if(condition[key] != obj[key]){
                            return false;
                        }
                    }
                }

                return true;
            };

            $.each(t.data, function(index, obj){
                if (_keyFind(condition, obj)){
                    cb && cb(obj);
                    find = true;
                    return false;
                }
            });

            return find;
        }

    }
}
