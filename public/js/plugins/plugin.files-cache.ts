/**
 * Created by Ian on 2015/5/14.
 */
///<reference path="../../tsd/typings/jquery/jquery.d.ts" />
module RomanySoftPlugins {

    // 单一的文件对象
    export class FileObj {
        id: number = $.now();               // 唯一标识
        name: string = "New_" + $.now();     // 别名
        is_tmp: boolean = true;             // 是否是临时文件, 默认是临时的
        path:string = "";                   // 路径
        ext:string = "md";                  // 扩展名
        changed: boolean = false;           // 是否正在编辑, reload, 或者进入到workspace
        mustReloadNextTime: boolean = false;// 下次是否必须从文件中加载内容
        lastModify: number = $.now();       // 最后修改时间戳
        assEditor: any = null;              // 关联的Editor的对象的信息
        content_utf8: string = "111wewe";   // 内容
    }

    // 文件缓存对象
    export class FilesCache {
        data: any[] = [];

        // 获取所有文件对象
        getAllFiles(){
            "use strict";
            return this.data;
        }

        // 获取一个新的文件对象
        getNewFileObj():FileObj{
            "use strict";
            return new FileObj();
        }

        // 获取最后一个修改的文件对象
        getLastModifyFileObj(): FileObj{
            "use strict";
            if(this.data.length == 0) return null;

            var sortDataList =  this.data.sort(function(a, b){
                if(a.lastModify < b.lastModify) return -1;
                if(a.lastModify > b.lastModify) return 1;
                return 0;
            });

            return sortDataList[0];
        }

        // 添加文件对象到缓存中
        addFile(file: FileObj, cb?: Function){
            "use strict";
            this.data.push(file);
            cb && cb(file);
        }

        // 重新加载文件
        reLoadFile(id:number, cb:Function){
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
        saveFile(id: number, cb:Function){
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
        removeFile(id: number, cb:Function){
            "use strict";
            var t = this;

            $.each(t.data, function(index, obj){
                if(obj.id == id){
                    cb && cb(obj);
                    t.data.splice($.inArray(obj, t.data), 1);
                    return false;
                }
            })
        }

        // 查找文件对象
        findFile(id: number, cb:Function):boolean{
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

    }
}