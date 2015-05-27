/**
 * Created by Ian on 2015/5/14.
 */

module RomanySoftPlugins {
    export module Settings {
        // 文档控制部分
        class DocumentUnit{
            maxDocumentCount:number = 2;    // 默认最大的文档的数量

            enableTabMode:boolean = false;  // 默认不使用Tab页签模式

            autoSave:boolean = false;       // 是否默认自动保存
            autoSaveSecs:number = 0;        // 自动保存的间隔时间(秒数)，默认是立即保存，

            autoRestore: boolean = true;    // 是否自动恢复之前使用的文档
        }

        // 编辑器部分
        class EditorUnit{

            //[商品关联]
            enable_TaskList:boolean = false;       // 是否开启TaskList
            enable_Emoji:boolean = false;          // 是否开启Emoji
            enable_AtLink:boolean = false;         // 是否开启AtLink
            enable_EmailLink:boolean = false;      // 是否开启EmailLink
            enable_FlowChart:boolean = false;      // 是否开启FlowChart
            enable_SequenceDiagram:boolean = false;// 是否开启SequenceDiagram
            enable_Tex:boolean = false;            // 是否开启Tex
            enable_Toc:boolean = false;            // 是否开启Toc
            enable_CodeFold:boolean = false;       // 是否开启CodeFold
            enable_HtmlDecode:boolean = false;     // 是否开启HTMLDecode
            enable_StyleActiveLine:boolean = false;// 是否开启StyleActiveLine
            enable_LineNumbers:boolean = false;    // 是否开启LineNumbers
            enable_ReadOnly:boolean = false;       // 是否开启ReadOnly
            enable_SearchReplace:boolean = false;  // 是否开启SearchReplace
            enable_Tocm:boolean = false;           // 是否开启Tocm

            //[内置]
            enable_matchWordHighlight:boolean = true; // 是否开启匹配文件高亮


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
            private restoreCoreDataWithInfo(info:any){
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

            // 获取核心的数据的json系列化
            public coreDataToJSON():string{
                var obj = {};
                for(var key in this){
                    obj[key] = this[key];
                }

                return JSON.stringify(obj);
            }

            // 核心数据的反序列化
            public coreDataFromJSON(str:string){
                try{
                    var obj:any = JSON.parse(str);
                    this.restoreCoreDataWithInfo(obj);
                }catch(e){}
            }
        }
    }

}