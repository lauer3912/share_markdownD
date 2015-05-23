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
            "ImportDialog-BtnImport": "Open"
        };
        UI.workspacePage = {
            "Title": "Workspace"
        };
        UI.settingsPage = {
            "Title": "Settings"
        };
        UI.pluginMgrPage = {
            "Title": "Plugins Manager",
            "Btn-Buy": "Buy Now"
        };
        UI.helpPage = {
            "Title": "Help"
        };
        UI.aboutPage = {
            "Title": "About"
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