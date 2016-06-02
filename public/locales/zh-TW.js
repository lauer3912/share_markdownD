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
                "Workspace": "工作區",
                "Settings": "設置"
            };
            this.filePage = {
                "Title": "文件管理",
                "Btn-Load": "加載",
                "Btn-Save": "保存",
                "Btn-Remove": "移除",
                "Btn-New": "新建文件",
                "Btn-ImportFiles": "導入文件",
                "Btn-Help": "在線幫助",
                "SaveDialog-Title": "另存為",
                "SaveDialog-BtnSave": "保存",
                "ImportDialog-Title": "導入 Markdown 文件",
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
            this.workspacePage = {
                "Title": "工作區",
                "Btn-Help": "在線幫助"
            };
            this.settingsPage = {
                "Title": "設置",
                "Btn-reset_user_settings": "重置用戶設置",
                "Btn-save_user_settings": "保存用戶設置",
                "Btn-use_default_user_settings": "使用默認用戶設置",
                "Btn-Help": "在線幫助"
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
            this["zh-TW"] = {
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
//# sourceMappingURL=zh-TW.js.map