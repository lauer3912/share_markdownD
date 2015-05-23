/**
 * Created by Ian on 2015/5/14.
 */

module RomanySoftPlugins {
    export module Settings {
        // 文档控制部分
        export class DocumentUnit{
            maxDocumentCount:number = 2;    // 默认最大的文档的数量
            enableTabMode:boolean = false;  // 默认不使用Tab页签模式
            autoSave:boolean = false;       // 是否默认保存
            autoRestore: boolean = false;   // 是否自动恢复之前使用的文档
        }

        // 编辑器部分
        export class EditorUnit{
            lineNumbers:boolean = false;          // 是否显示行号
            readOnly:boolean = false;             // 是否开启只读模式
            matchWordHighlight:boolean = true;    // 是否匹配文件高亮
            styleActiveLine:boolean = true;       // 是否高亮当前行
        }


        // 云端存储
        export class CloudStorageUnit{

        }

        // 云端帮助
        export class CloudHelpUnit{

        }



        export class UserSetting{

            documentSetting: DocumentUnit = new DocumentUnit();
            editorSetting: EditorUnit = new EditorUnit();

        }
    }

}