/**
 * Created by Ian on 2015/5/14.
 */

module RomanySoftPlugins {

    export class DocumentUnit{
        maxDocumentCount:number = 2;    // 默认最大的文档的数量
    }

    export class EditorUnit{
        lineNumbers:boolean = false;          // 是否显示行号
        readOnly:boolean = false;             // 是否开启只读模式
        matchWordHighlight:boolean = true;    // 是否匹配文件高亮
        styleActiveLine:boolean = true;       // 是否高亮当前行

    }

    export class UserSetting{

        documentSetting: DocumentUnit = new DocumentUnit();
        editorSetting: EditorUnit = new EditorUnit();

    }
}