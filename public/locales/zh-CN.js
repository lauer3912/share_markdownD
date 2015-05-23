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
            "Workspace": "工作区",
            "Plugins": "插件",
            "Settings": "设置",
            "Help": "帮助",
            "About": "关于"
        };
        UI.filePage = {
            "Title": "文件管理",
            "Btn-Load": "加载",
            "Btn-Save": "保存",
            "Btn-Remove": "移除",
            "Btn-New": "新建文件",
            "Btn-ImportFiles": "导入文件",
            "em-label": "备注:",
            "note-label": "Your changes and your files only get stored in cache. If you want save files changes, please click save button."
        };
        UI.workspacePage = {
            "Title": "工作区"
        };
        UI.settingsPage = {
            "Title": "设置"
        };
        UI.pluginMgrPage = {
            "Title": "插件管理"
        };
        UI.helpPage = {
            "Title": "帮助"
        };
        UI.aboutPage = {
            "Title": "关于"
        };
        return UI;
    })();
    I18N.UI = UI;
    var Message = (function () {
        function Message() {
        }
        return Message;
    })();
    I18N.Message = Message;
})(I18N || (I18N = {}));
//# sourceMappingURL=zh-CN.js.map