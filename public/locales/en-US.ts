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
            "Files": "Files"
            ,"Workspace": "Workspace"
            ,"Plugins": "Plugins"
            ,"Settings": "Settings"
            ,"Help": "Help"
            ,"About": "About"
        };

        static filePage:any = {
            "Title": "Files"
            ,"Btn-Load": "Load"
            ,"Btn-Save": "Save"
            ,"Btn-Remove": "Remove"
            ,"Btn-New": "New File"
            ,"Btn-ImportFiles": "Import Files"
            ,"em-label": "Note:"
            ,"note-label": "Your changes and your files only get stored in cache. If you want save files changes, please click save button."
            ,"SaveDialog-Title": "Save as"
            ,"SaveDialog-BtnSave": "Save"
            ,"ImportDialog-Title": "Open .md files"
            ,"ImportDialog-BtnImport": "Open"

            ,createNewDocTip:{
                "Title":"Message",
                "Content": "Already have the largest number of the current document [{docCount}], you could increase the maximum number of documents to meet your requirements.Every purchase, increased 5 documents.",
                "btnBuy": "Buy",
                "btnCancel": "Cancel"
            }

            // 统一消息
            ,Message:{
                "existOnImport_message": "The file '{path}' is already in workspace..",
                "existOnImport_title":"Warning",
                "fileChangeByOther_message":"The file '{path}' contents has changed ",
                "fileChangeByOther_title":"Information",
                "fileRenamedByOther_message":"The file '{path}' has renamed ",
                "fileRenamedByOther_title":"Information",
                "fileDeletedByOther_message":"The file '{path}' has deleted ",
                "fileDeletedByOther_title":"Information",
                "fileReloadConfirm_title":"Warning",
                "fileReloadConfirm_message":"The local file '{path}' content has changed, whether to reload?",
                "fileReloadConfirm_btnOK":"Reload",
                "fileReloadConfirm_btnCancel":"Don't Reload"

            }
        };

        static workspacePage:any = {
            "Title": "Workspace"
        };

        static settingsPage:any = {
            "Title": "Settings",
            btnReset:"Reset",
            btnApply:"Apply",
            document:{
                label:"[Document]",
                maxDocumentCount: "Multi-document editing count",
                enableTabMode: "Switch Tab mode",
                autoSave: "Auto save",
                autoSaveSecs: "Per secs to save",
                autoRestore: "Auto restore",
            },
            editor:{
                label:"[Editor]",
                enable_TaskList:"Show github task lists",
                enable_Emoji:"Show Emoji",
                enable_AtLink:"Show AtLink",
                enable_EmailLink:"Show EmailLink",
                enable_FlowChart:"Show FlowChart",
                enable_SequenceDiagram:"Show SequenceDiagram",
                enable_Tex:"Show Tex",
                enable_Toc:"Show Toc",
                enable_CodeFold:"Show CodeFold",
                enable_HtmlDecode:"Show HTML Decode",
                enable_StyleActiveLine:"Show Active line",
                enable_LineNumbers:"Show Line numbers",
                enable_ReadOnly:"Enable ReadOnly mode",
                enable_SearchReplace:"Enable Search and replace",
                enable_Tocm:"Show Tocm",
                enable_matchWordHighlight:"Enable match word highlight"
            },

            // 购买信息
            Message:{
                Title:"Tip",
                Content:"You need to purchase to activate",
                btnBuy:"Buy",
                btnCancel:"Cancel"
            }
        };

        static pluginMgrPage:any = {
            "Title": "Plugins Manager"
            ,"btnBuy": "Active"
        };

        static helpPage:any = {
            "Title": "Help"
        };

        static aboutPage:any = {
            "Title": "About"
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
                name: "Open File",
                description:"Support importing files"
            };

            o[t.getId("support.dragFile")] = {
                name: "Drag File",
                description:"Support drag files"
            };

            o[t.getId("support.fileSave")] = {
                name: "Save File",
                description:"Support save files"
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
                description:"Editor support github task lists"
            };

            o[t.getId("support.emoji")] = {
                name: "Emoji",
                description:"Editor support Emoji"
            };

            o[t.getId("support.atLink")] = {
                name: "atLink",
                description:"Editor support atLink"
            };

            o[t.getId("support.emailLink")] = {
                name: "emailLink",
                description:"Editor support emailLink"
            };

            o[t.getId("support.flowChart")] = {
                name: "FlowChart",
                description:"Editor support FlowChart"
            };

            o[t.getId("support.sequenceDiagram")] = {
                name: "SequenceDiagram",
                description:"Editor support SequenceDiagram"
            };

            o[t.getId("support.tex")] = {
                name: "Tex",
                description:"Editor support Tex"
            };

            o[t.getId("support.toc")] = {
                name: "Toc",
                description:"Editor support Toc"
            };

            o[t.getId("support.codeFold")] = {
                name: "CodeFold",
                description:"Editor support CodeFold"
            };

            o[t.getId("support.htmlDecode")] = {
                name: "HTMLDecode",
                description:"Editor support HTMLDecode"
            };

            o[t.getId("support.styleActiveLine")] = {
                name: "Style Active Line",
                description:"Editor support Style Active Line"
            };

            o[t.getId("support.lineNumbers")] = {
                name: "Line Numbers",
                description:"Editor support Line Numbers"
            };

            o[t.getId("support.readOnly")] = {
                name: "ReadOnly",
                description:"Editor support ReadOnly"
            };

            o[t.getId("support.searchReplace")] = {
                name: "Search Replace",
                description:"Editor support Search Replace"
            };



            return o;
        }
    }

    export class Message{

    }
}