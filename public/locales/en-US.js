/**
 * Created by Ian on 2015/5/22.
 */
var I18N;
(function (I18N) {
    var Native = (function () {
        function Native() {
            this.data = {};
        }
        return Native;
    })();
    I18N.Native = Native;
    var UI = (function () {
        function UI() {
        }
        UI.navPage = {
            "Files": "Files",
            "Workspace": "Workspace",
            "Plugins": "Plugins",
            "Settings": "Settings",
            "Help": "Help",
            "About": "About"
        };
        UI.filePage = {
            "Title": "Files",
            "Btn-Load": "Load",
            "Btn-Save": "Save",
            "Btn-Remove": "Remove",
            "Btn-New": "New File",
            "Btn-ImportFiles": "Import Files",
            "em-label": "Note:",
            "note-label": "Your changes and your files only get stored in cache. If you want save files changes, please click save button.",
            "SaveDialog-Title": "Save as",
            "SaveDialog-BtnSave": "Save",
            "ImportDialog-Title": "Open .md files",
            "ImportDialog-BtnImport": "Open",
            createNewDocTip: {
                "Title": "Message",
                "Content": "Already have the largest number of the current document [{docCount}], you could increase the maximum number of documents to meet your requirements.Every purchase, increased 5 documents.",
                "btnBuy": "Buy",
                "btnCancel": "Cancel"
            },
            Message: {
                "existOnImport_message": "The file '{path}' is already in workspace..",
                "existOnImport_title": "Warning",
                "fileChangeByOther_message": "The file '{path}' contents has changed ",
                "fileChangeByOther_title": "Information",
                "fileRenamedByOther_message": "The file '{path}' has renamed ",
                "fileRenamedByOther_title": "Information",
                "fileDeletedByOther_message": "The file '{path}' has deleted ",
                "fileDeletedByOther_title": "Information",
                "fileReloadConfirm_title": "Warning",
                "fileReloadConfirm_message": "The local file '{path}' content has changed, whether to reload?",
                "fileReloadConfirm_btnOK": "Reload",
                "fileReloadConfirm_btnCancel": "Don't Reload"
            }
        };
        UI.workspacePage = {
            "Title": "Workspace"
        };
        UI.settingsPage = {
            "Title": "Settings",
            btnReset: "Reset",
            btnApply: "Apply",
            document: {
                label: "[Document]",
                maxDocumentCount: "Multi-document editing count",
                enableTabMode: "Switch Tab mode",
                autoSave: "Auto save",
                autoSaveSecs: "Per secs to save",
                autoRestore: "Auto restore"
            },
            editor: {
                label: "[Editor]",
                enable_TaskList: "Show github task lists",
                enable_Emoji: "Show Emoji",
                enable_AtLink: "Show AtLink",
                enable_EmailLink: "Show EmailLink",
                enable_FlowChart: "Show FlowChart",
                enable_SequenceDiagram: "Show SequenceDiagram",
                enable_Tex: "Show Tex",
                enable_Toc: "Show Toc",
                enable_CodeFold: "Show CodeFold",
                enable_HtmlDecode: "Show HTML Decode",
                enable_StyleActiveLine: "Show Active line",
                enable_LineNumbers: "Show Line numbers",
                enable_ReadOnly: "Enable ReadOnly mode",
                enable_SearchReplace: "Enable Search and replace",
                enable_Tocm: "Show Tocm",
                enable_matchWordHighlight: "Enable match word highlight"
            },
            // 购买信息
            Message: {
                Title: "Tip",
                Content: "You need to purchase to activate",
                btnBuy: "Buy",
                btnCancel: "Cancel"
            }
        };
        UI.pluginMgrPage = {
            "Title": "Plugins Manager",
            "btnBuy": "Active",
            "btnBuyRestore": "Restore"
        };
        UI.aboutPage = {
            "Title": "About",
            App: {
                description: "A markdown editor built for speed,simplicity,and security.",
                copyright: "Copyright 2015 Romanysoft LAB. All rights reserved.",
                creditsTitle: "is mad possible by some open source project and other open source software."
            }
        };
        return UI;
    })();
    I18N.UI = UI;
    var PluginUI = (function () {
        function PluginUI() {
        }
        PluginUI.getId = function (id) {
            return this.pre + id;
        };
        PluginUI.data = function () {
            var t = this;
            var o = {};
            o = t.buildIn(o);
            o = t.editor(o);
            return o;
        };
        PluginUI.buildIn = function (orgObj) {
            var t = this;
            var o = orgObj || {};
            o[t.getId("support.importFile")] = {
                name: "Open File",
                description: "Support importing files"
            };
            o[t.getId("support.dragFile")] = {
                name: "Drag File",
                description: "Support drag files"
            };
            o[t.getId("support.fileSave")] = {
                name: "Save File",
                description: "Support save files"
            };
            o[t.getId("increase5documentCount")] = {
                name: "Increase of 5 documents",
                description: "If you need to edit more documents, then you need to increase the support for the number of simultaneous document editing in this manner. Once per purchase, while editing the document number 5"
            };
            o[t.getId("enableAutoSave")] = {
                name: "Auto save",
                description: "Support auto save feature"
            };
            o[t.getId("enableAutoRestore")] = {
                name: "Auto Restore",
                description: "Support auto restore feature"
            };
            return o;
        };
        PluginUI.editor = function (orgObj) {
            var t = this;
            var o = orgObj || {};
            o[t.getId("support.dirTree")] = {
                name: "DirTree",
                description: "Editor support file directory"
            };
            o[t.getId("support.taskList")] = {
                name: "TaskList",
                description: "Editor support github task lists"
            };
            o[t.getId("support.emoji")] = {
                name: "Emoji",
                description: "Editor support Emoji"
            };
            o[t.getId("support.atLink")] = {
                name: "atLink",
                description: "Editor support atLink"
            };
            o[t.getId("support.emailLink")] = {
                name: "emailLink",
                description: "Editor support emailLink"
            };
            o[t.getId("support.flowChart")] = {
                name: "FlowChart",
                description: "Editor support FlowChart"
            };
            o[t.getId("support.sequenceDiagram")] = {
                name: "SequenceDiagram",
                description: "Editor support SequenceDiagram"
            };
            o[t.getId("support.tex")] = {
                name: "Tex",
                description: "Editor support Tex"
            };
            o[t.getId("support.toc")] = {
                name: "Toc",
                description: "Editor support Toc"
            };
            o[t.getId("support.codeFold")] = {
                name: "CodeFold",
                description: "Editor support CodeFold"
            };
            o[t.getId("support.htmlDecode")] = {
                name: "HTMLDecode",
                description: "Editor support HTMLDecode"
            };
            o[t.getId("support.styleActiveLine")] = {
                name: "Style Active Line",
                description: "Editor support Style Active Line"
            };
            o[t.getId("support.lineNumbers")] = {
                name: "Line Numbers",
                description: "Editor support Line Numbers"
            };
            o[t.getId("support.readOnly")] = {
                name: "ReadOnly",
                description: "Editor support ReadOnly"
            };
            o[t.getId("support.searchReplace")] = {
                name: "Search Replace",
                description: "Editor support Search Replace"
            };
            return o;
        };
        PluginUI.pre = ""; // 产品标识前置
        return PluginUI;
    })();
    I18N.PluginUI = PluginUI;
    var Message = (function () {
        function Message() {
        }
        return Message;
    })();
    I18N.Message = Message;
})(I18N || (I18N = {}));
//# sourceMappingURL=en-US.js.map