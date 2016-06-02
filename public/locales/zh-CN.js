/**
 * Created by Ian on 2015/5/22.
 */
(function ($) {
    var Native = (function () {
        function Native() {
            this.data = {};
        }
        return Native;
    }());
    var UI = (function () {
        function UI() {
            this.navPage = {
                "Files": "文件管理",
                "Workspace": "工作区",
                "Settings": "设置"
            };
            this.filePage = {
                "Title": "文件管理",
                "Btn-Load": "加载",
                "Btn-Save": "保存",
                "Btn-Remove": "移除",
                "Btn-New": "新建文件",
                "Btn-ImportFiles": "导入文件",
                "Btn-Help": "在线帮助",
                "SaveDialog-Title": "另存为",
                "SaveDialog-BtnSave": "保存",
                "ImportDialog-Title": "导入 markdown 文件",
                "ImportDialog-BtnImport": "导入",
                createNewDocTip: {
                    "Title": "消息",
                    "Content": "已经拥有数量最多的当前文档的 [{docCount}], 你可以增加最大文件数，以满足您的要求。每次购买，增加5个文档数量。",
                    "btnBuy": "购买",
                    "btnCancel": "取消"
                },
                Message: {
                    "existOnImport_message": "文档 '{path}' 已经存在于工作空间..",
                    "existOnImport_title": "警告",
                    "fileChangeByOther_message": "文档 '{path}' 内容发生变化 ",
                    "fileChangeByOther_title": "信息",
                    "fileRenamedByOther_message": "文档 '{path}' 已经被重命名 ",
                    "fileRenamedByOther_title": "信息",
                    "fileDeletedByOther_message": "文档 '{path}' 被删除",
                    "fileDeletedByOther_title": "信息",
                    "fileReloadConfirm_title": "警告",
                    "fileReloadConfirm_message": "本地文档 '{path}' 内容发生变化, 是否重新加载?",
                    "fileReloadConfirm_btnOK": "重新加载",
                    "fileReloadConfirm_btnCancel": "不加载"
                }
            };
            this.workspacePage = {
                "Title": "工作区",
                "Btn-Help": "在线帮助"
            };
            this.settingsPage = {
                "Title": "设置",
                "Btn-reset_user_settings": "重置用户设置",
                "Btn-save_user_settings": "保存用户设置",
                "Btn-use_default_user_settings": "使用默认用户设置",
                "Btn-Help": "在线帮助"
            };
        }
        return UI;
    }());
    var Message = (function () {
        function Message() {
        }
        return Message;
    }());
    var I18N = (function () {
        function I18N() {
            this["zh-CN"] = {
                UI: new UI(),
                Native: new Native(),
                Message: new Message()
            };
        }
        return I18N;
    }());
    window["I18N"] = window["I18N"] || {};
    window["I18N"] = $.extend(window["I18N"], new I18N());
})(jQuery);
//# sourceMappingURL=zh-CN.js.map