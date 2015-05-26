/**
 * Created by Ian on 2015/5/14.
 */

module RomanySoftPlugins {
    export module Settings {
        // 文档控制部分
        class DocumentUnit{
            maxDocumentCount:number = 2;    // 默认最大的文档的数量
            pl$maxDocumentCount:string = "";// 默认关联的插件，以pl$为前缀

            enableTabMode:boolean = false;  // 默认不使用Tab页签模式
            autoSave:boolean = false;       // 是否默认自动保存
            autoSaveSecs:number = 0;        // 自动保存的间隔时间(秒数)，默认是立即保存，
            autoRestore: boolean = false;   // 是否自动恢复之前使用的文档
        }

        // 编辑器部分
        class EditorUnit{
            lineNumbers:boolean = false;          // 是否显示行号
            readOnly:boolean = false;             // 是否开启只读模式
            matchWordHighlight:boolean = true;    // 是否匹配文件高亮
            styleActiveLine:boolean = true;       // 是否高亮当前行
        }


        // 云端存储
        class CloudStorageUnit{

        }

        // 云端帮助
        class CloudHelpUnit{

        }



        export class UserSetting{
            documentSetting: DocumentUnit = new DocumentUnit();
            editorSetting: EditorUnit = new EditorUnit();

            // 恢复数据，根据传入的Info
            restoreCoreDataWithInfo(info:any){
                var t = this;

                // 公共处理函数
                function fn(field: string, obj: any, t: any){
                    if(field in obj){
                        for(var key in obj[field]){
                            if(key in t[field]){
                                if(typeof t[field][key] == typeof  obj[field][key]){
                                    t[field][key] = obj[field][key];
                                }
                            }
                        }
                    }
                }

                // document
                fn("documentSetting", info, this);

                // editor
                fn("editorSetting", info, this);


            }

            // 获取核心数据
            getCoreData():string{
                return JSON.stringify(this);
            }
        }
    }

}