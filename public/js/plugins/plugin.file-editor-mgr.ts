/**
 * Created by Ian on 2015/5/14.
 */
/// <reference path="plugin.files-cache.ts" />
module RomanySoftPlugins{

    export class FileEditorManger{
        fileCache: FilesCache;

        constructor(){
            this.fileCache = new FilesCache();
        }

        // 添加新的文件对象到管理器
        addNewFileObj(fileObj: FileObj){
            var key = "FileObj" + fileObj.id;
            this[key] = fileObj;
        }

        // 根据ID获取文件对象
        findFileObjById(fileId:number){
            var key = "FileObj" + fileId;
            if (key in this) return this[key];

            return null;
        }

        // 移除文件对象，通过ID
        removeFileObjById(fileId:number){
            var key = "FileObj" + fileId;
            if (key in this) this[key] = null;
        }

        // 创建文件对象与编辑器的关联
        createNewEditor(fileId: number, editor: any){
            var t = this;
            var find = t.fileCache.findFile(fileId, function(fileObj){
                fileObj.assEditor = editor;
            });

            if (false == find){
                alert("no file");
            }

        }

        // 查找Editor对象，通过文件ID
        findEditorByFileId(fileId: number, cb: Function){
            var key = "FileObj" + fileId;
            if (key in this) {
                var fileObj = this[key];
                return fileObj.assEditor;
            }

            return null;
        }

    }
}