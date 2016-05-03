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
            "Files": "文件",
            "Workspace": "工作區",
            "Plugins": "插件",
            "Settings": "設置",
            "Help": "幫助",
            "About": "關於"
        };
        UI.filePage = {
            "Title": "文件管理",
            "Btn-Load": "加載",
            "Btn-Save": "保存",
            "Btn-Remove": "移除",
            "Btn-New": "新建文件",
            "Btn-ImportFiles": "導入文件",
            "em-label": "備註:",
            "note-label": "文件的變化都存在緩存中，如果你想保存文件，需要點擊保存按鈕",
            "SaveDialog-Title": "另存為",
            "SaveDialog-BtnSave": "保存",
            "ImportDialog-Title": "導入 .md 文件",
            "ImportDialog-BtnImport": "導入",
            createNewDocTip: {
                "Title": "消息",
                "Content": "已經擁有數量最多的當前文檔的 [{docCount}], 你可以增加最大文件數，以滿足您的要求。每次購買，增加5個文檔數量。",
                "btnBuy": "購買",
                "btnCancel": "取消"
            },
            Message: {
                "existOnImport_message": "文檔 '{path}' 已經存在於工作空間..",
                "existOnImport_title": "警告",
                "fileChangeByOther_message": "文檔 '{path}' 內容髮生變化 ",
                "fileChangeByOther_title": "信息",
                "fileRenamedByOther_message": "文檔 '{path}' 已經被重命名 ",
                "fileRenamedByOther_title": "信息",
                "fileDeletedByOther_message": "文檔 '{path}' 被删除",
                "fileDeletedByOther_title": "信息",
                "fileReloadConfirm_title": "警告",
                "fileReloadConfirm_message": "本地文檔 '{path}' 內容髮生變化, 是否重新加載?",
                "fileReloadConfirm_btnOK": "重新加載",
                "fileReloadConfirm_btnCancel": "不加載"
            }
        };
        UI.workspacePage = {
            "Title": "工作區"
        };
        UI.settingsPage = {
            "Title": "設置",
            btnReset: "重置",
            btnApply: "應用",
            system:{
                label: "[系統]",
                userLanguage: "界面語言",
                languageChangeTip: "需要重新啟動應用程序"
            },
            document: {
                label: "[文檔設置]",
                maxDocumentCount: "最大同時編輯文檔數量",
                enableTabMode: "切換到Tab模式",
                autoSave: "自動保存",
                autoSaveSecs: "保存頻率(sec)",
                autoRestore: "自動恢復"
            },
            editor: {
                label: "[編輯器設置]",
                enable_TaskList: "激活 github task lists",
                enable_Emoji: "激活 Emoji",
                enable_AtLink: "激活 AtLink",
                enable_EmailLink: "激活 EmailLink",
                enable_FlowChart: "激活 FlowChart",
                enable_SequenceDiagram: "激活 SequenceDiagram",
                enable_Tex: "激活 Tex",
                enable_Toc: "激活 Toc",
                enable_CodeFold: "激活 CodeFold",
                enable_HtmlDecode: "激活 HTML Decode",
                enable_StyleActiveLine: "激活 Active line",
                enable_LineNumbers: "激活 Line numbers",
                enable_ReadOnly: "激活 ReadOnly mode",
                enable_SearchReplace: "激活 Search and replace",
                enable_Tocm: "激活 Tocm",
                enable_matchWordHighlight: "激活 match word highlight"
            },
            // 购买信息
            Message: {
                Title: "提示",
                Content: "你需要購買來激活",
                btnBuy: "購買",
                btnCancel: "取消"
            }
        };
        UI.pluginMgrPage = {
            "Title": "插件管理",
            "btnBuy": "激活",
            "btnBuyRestore": "恢復購買"
        };
        UI.aboutPage = {
            "Title": "關於",
            App: {
                description: "一款markdown 編輯器，追求速度、簡單及安全",
                copyright: "版權 2016 Romanysoft LAB. 版權所有.",
                creditsTitle: "構建離不開一些開源項目和其他開放源碼軟件。"
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
                name: "打開、導入文件",
                description: "支持打開、導入一個或多個文件"
            };
            o[t.getId("support.dragFile")] = {
                name: "拖拽文件",
                description: "支持拖拽一個或多個文件"
            };
            o[t.getId("support.fileSave")] = {
                name: "保存文件",
                description: "支持保存文件到本地"
            };
            o[t.getId("increase5documentCount")] = {
                name: "增加5個文檔數量",
                description: "如果你需要編輯更多的文件，那麼你需要增加同步文檔編輯以這種方式數的支持。每一次購買，增加編輯5個文檔數量"
            };
            o[t.getId("enableAutoSave")] = {
                name: "自動保存",
                description: "支持文档自动保存特性"
            };
            o[t.getId("enableAutoRestore")] = {
                name: "自動恢復",
                description: "支持文檔自動恢復特性"
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
                description: "編輯器支持 github task lists"
            };
            o[t.getId("support.emoji")] = {
                name: "Emoji",
                description: "編輯器支持 Emoji"
            };
            o[t.getId("support.atLink")] = {
                name: "atLink",
                description: "編輯器支持 atLink"
            };
            o[t.getId("support.emailLink")] = {
                name: "emailLink",
                description: "編輯器支持 emailLink"
            };
            o[t.getId("support.flowChart")] = {
                name: "FlowChart",
                description: "編輯器支持 FlowChart"
            };
            o[t.getId("support.sequenceDiagram")] = {
                name: "SequenceDiagram",
                description: "編輯器支持 SequenceDiagram"
            };
            o[t.getId("support.tex")] = {
                name: "Tex",
                description: "編輯器支持 Tex公式"
            };
            o[t.getId("support.toc")] = {
                name: "Toc",
                description: "編輯器支持 Toc"
            };
            o[t.getId("support.codeFold")] = {
                name: "CodeFold",
                description: "編輯器支持 CodeFold"
            };
            o[t.getId("support.htmlDecode")] = {
                name: "HTMLDecode",
                description: "編輯器支持 HTMLDecode"
            };
            o[t.getId("support.styleActiveLine")] = {
                name: "Style Active Line",
                description: "編輯器支持 Style Active Line"
            };
            o[t.getId("support.lineNumbers")] = {
                name: "Line Numbers",
                description: "編輯器支持 Line Numbers"
            };
            o[t.getId("support.readOnly")] = {
                name: "ReadOnly",
                description: "編輯器支持 ReadOnly"
            };
            o[t.getId("support.searchReplace")] = {
                name: "Search Replace",
                description: "編輯器支持 Search Replace"
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
//# sourceMappingURL=zh-TW.js.map
