/**
 * Created by Ian on 2015/5/22.
 */

module I18N{

    export class Native{
        data:any = {

        }
    }

    export class UI {
        static navPage:any = {
            "Files": "ファイル"
            ,"Workspace": "ワークスペース"
            ,"Plugins": "ウィジェット"
            ,"Settings": "セットアップ"
            ,"Help": "助けて"
            ,"About": "約"
        };

        static filePage:any = {
            "Title": "ファイル管理"
            ,"Btn-Load": "ロード"
            ,"Btn-Save": "保存"
            ,"Btn-Remove": "削除します"
            ,"Btn-New": "新しいファイル"
            ,"Btn-ImportFiles": "インポートファイル"
            ,"em-label": "発言:"
            ,"note-label": "ファイルの変更は、ファイルを保存したい場合は、[保存]ボタンをクリックする必要があり、キャッシュ内に存在しています"
            ,"SaveDialog-Title": "名前を付けて保存"
            ,"SaveDialog-BtnSave": "保存"
            ,"ImportDialog-Title": "インポート .md ファイル"
            ,"ImportDialog-BtnImport": "インポート"

            ,createNewDocTip:{
                "Title":"ニュース",
                "Content": "すでに現在のドキュメントの数が最も多いです [{docCount}], あなたは、あなたの要件に合わせてファイルの最大数を増やすことができます。それぞれの購入と文書5の数を増やします。",
                "btnBuy": "購入",
                "btnCancel": "キャンセル"
            }

            // 统一消息
            ,Message:{
                "existOnImport_message": "ファイル '{path}' ワークスペースにすでに存在しています..",
                "existOnImport_title":"警告",
                "fileChangeByOther_message":"ファイル '{path}' コンテンツの変更 ",
                "fileChangeByOther_title":"情報",
                "fileRenamedByOther_message":"ファイル '{path}' これは、名前が変更されました ",
                "fileRenamedByOther_title":"情報",
                "fileDeletedByOther_message":"ファイル '{path}' 削除されました",
                "fileDeletedByOther_title":"情報",
                "fileReloadConfirm_title":"警告",
                "fileReloadConfirm_message":"本地ファイル '{path}' コンテンツの変更、かどうかをリロードするには？",
                "fileReloadConfirm_btnOK":"リロード",
                "fileReloadConfirm_btnCancel":"ロードされていません"

            }
        };

        static workspacePage:any = {
            "Title": "ワークスペース"
        };

        static settingsPage:any = {
            "Title": "セットアップ",
            btnReset:"リセット",
            btnApply:"アプリケーション",
            document:{
                label:"[ドキュメント設定]",
                maxDocumentCount: "同時編集、ドキュメントの最大数",
                enableTabMode: "タブモードに切り替え",
                autoSave: "自動的に保存",
                autoSaveSecs: "周波数を保存(sec)",
                autoRestore: "自動復旧",
            },
            editor:{
                label:"[编辑器设置]",
                enable_TaskList:"アクティブ github task lists",
                enable_Emoji:"アクティブ Emoji",
                enable_AtLink:"アクティブ AtLink",
                enable_EmailLink:"アクティブ EmailLink",
                enable_FlowChart:"アクティブ FlowChart",
                enable_SequenceDiagram:"アクティブ SequenceDiagram",
                enable_Tex:"アクティブ Tex",
                enable_Toc:"アクティブ Toc",
                enable_CodeFold:"アクティブ CodeFold",
                enable_HtmlDecode:"アクティブ HTML Decode",
                enable_StyleActiveLine:"アクティブ Active line",
                enable_LineNumbers:"アクティブ Line numbers",
                enable_ReadOnly:"アクティブ ReadOnly mode",
                enable_SearchReplace:"アクティブ Search and replace",
                enable_Tocm:"アクティブ Tocm",
                enable_matchWordHighlight:"アクティブ match word highlight"
            },

            // 购买情報
            Message:{
                Title:"プロンプト",
                Content:"あなたがに購入する必要があります",
                btnBuy:"購入",
                btnCancel:"キャンセル"
            }
        };

        static pluginMgrPage:any = {
            "Title": "プラグインマネージャ"
            ,"btnBuy": "アクティブ"
            ,"btnBuyRestore":"回復購入"
        };

        static aboutPage:any = {
            "Title": "約",
            App:{
                description:"マークダウンエディタ、スピード、シンプルさとセキュリティの追求",
                copyright:"著作権2015 Romanysoft LAB。すべての権利を保有。",
                creditsTitle:"建設は、いくつかのオープンソースプロジェクトやその他のオープンソースソフトウェアと不可分である。"
            }
        };
    }

    export class PluginUI{

        static pre:string = "";   // 产品标识前置

        private static getId(id:string):string{
            return this.pre + id;
        }

        static data():{}{
            var t = this;
            var o = {};
            o = t.buildIn(o);
            o = t.editor(o);

            return o;

        }


        private static buildIn(orgObj:{}):{}{
            var t = this;
            var o = orgObj || {};
            o[t.getId("support.importFile")] = {
                name: "インポートファイルを開きます。",
                description:"1つまたは複数のファイルをインポートし、オープンサポート"
            };

            o[t.getId("support.dragFile")] = {
                name: "ファイルをドラッグ＆ドロップ",
                description:"1つまたは複数のファイルをドラッグ＆ドロップサポートしています"
            };

            o[t.getId("support.fileSave")] = {
                name: "ファイルを保存します",
                description:"ローカルサポートにファイルを保存"
            };

            o[t.getId("increase5documentCount")] = {
                name: "増加した5 fuのASTONテスト適切な量",
                description:"あなたは追加のファイルを編集する必要がある場合は、この方法で番号をサポートして編集するのに適した同期のfuのASTONテストを増やす必要があります。ご購入いただくと、編集を高める5 fuのASTON試験の適切な量"
            };

            o[t.getId("enableAutoSave")] = {
                name: "自動的に保存",
                description:"自動保存機能ASTONに適したサポートfuのテスト"
            };

            o[t.getId("enableAutoRestore")] = {
                name: "自動復旧",
                description:"ASTON fuのテスト適切な支持自動回復機能"
            };

            return o;
        }


        private static editor(orgObj:{}):{}{
            var t = this;
            var o = orgObj || {};

            o[t.getId("support.dirTree")] = {
                name: "DirTree",
                description:"Editor support file directory"
            };

            o[t.getId("support.taskList")] = {
                name: "TaskList",
                description:"エディタのサポート github task lists"
            };

            o[t.getId("support.emoji")] = {
                name: "Emoji",
                description:"エディタのサポート Emoji"
            };

            o[t.getId("support.atLink")] = {
                name: "atLink",
                description:"エディタのサポート atLink"
            };

            o[t.getId("support.emailLink")] = {
                name: "emailLink",
                description:"エディタのサポート emailLink"
            };

            o[t.getId("support.flowChart")] = {
                name: "FlowChart",
                description:"エディタのサポート FlowChart"
            };

            o[t.getId("support.sequenceDiagram")] = {
                name: "SequenceDiagram",
                description:"エディタのサポート SequenceDiagram"
            };

            o[t.getId("support.tex")] = {
                name: "Tex",
                description:"エディタのサポート テックス式"
            };

            o[t.getId("support.toc")] = {
                name: "Toc",
                description:"エディタのサポート Toc"
            };

            o[t.getId("support.codeFold")] = {
                name: "CodeFold",
                description:"エディタのサポート CodeFold"
            };

            o[t.getId("support.htmlDecode")] = {
                name: "HTMLDecode",
                description:"エディタのサポート HTMLDecode"
            };

            o[t.getId("support.styleActiveLine")] = {
                name: "Style Active Line",
                description:"エディタのサポート Style Active Line"
            };

            o[t.getId("support.lineNumbers")] = {
                name: "Line Numbers",
                description:"エディタのサポート Line Numbers"
            };

            o[t.getId("support.readOnly")] = {
                name: "ReadOnly",
                description:"エディタのサポート ReadOnly"
            };

            o[t.getId("support.searchReplace")] = {
                name: "Search Replace",
                description:"エディタのサポート Search Replace"
            };



            return o;
        }
    }

    export class Message{

    }
}
