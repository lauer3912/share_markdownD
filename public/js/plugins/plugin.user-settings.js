/**
 * Created by Ian on 2015/5/14.
 */
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    var Settings;
    (function (Settings) {
        // 文档控制部分
        var DocumentUnit = (function () {
            function DocumentUnit() {
                this.maxDocumentCount = 2; // 默认最大的文档的数量
                this.pl$maxDocumentCount = ""; // 默认关联的插件，以pl$为前缀
                this.enableTabMode = false; // 默认不使用Tab页签模式
                this.autoSave = false; // 是否默认自动保存
                this.autoSaveSecs = 0; // 自动保存的间隔时间(秒数)，默认是立即保存，
                this.autoRestore = false; // 是否自动恢复之前使用的文档
            }
            return DocumentUnit;
        })();
        // 编辑器部分
        var EditorUnit = (function () {
            function EditorUnit() {
                this.lineNumbers = false; // 是否显示行号
                this.readOnly = false; // 是否开启只读模式
                this.matchWordHighlight = true; // 是否匹配文件高亮
                this.styleActiveLine = true; // 是否高亮当前行
            }
            return EditorUnit;
        })();
        // 云端存储
        var CloudStorageUnit = (function () {
            function CloudStorageUnit() {
            }
            return CloudStorageUnit;
        })();
        // 云端帮助
        var CloudHelpUnit = (function () {
            function CloudHelpUnit() {
            }
            return CloudHelpUnit;
        })();
        var UserSetting = (function () {
            function UserSetting() {
                this.documentSetting = new DocumentUnit();
                this.editorSetting = new EditorUnit();
            }
            // 恢复数据，根据传入的Info
            UserSetting.prototype.restoreCoreDataWithInfo = function (info) {
                var t = this;
                // 公共处理函数
                function fn(field, obj, t) {
                    if (field in obj) {
                        for (var key in obj[field]) {
                            if (key in t[field]) {
                                if (typeof t[field][key] == typeof obj[field][key]) {
                                    t[field][key] = obj[field][key];
                                }
                            }
                        }
                    }
                }
                // document
                fn("documentSetting", info, this);
                // editor
                fn("editorSetting", info, this);
            };
            // 获取核心数据
            UserSetting.prototype.getCoreData = function () {
                return JSON.stringify(this);
            };
            return UserSetting;
        })();
        Settings.UserSetting = UserSetting;
    })(Settings = RomanySoftPlugins.Settings || (RomanySoftPlugins.Settings = {}));
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.user-settings.js.map