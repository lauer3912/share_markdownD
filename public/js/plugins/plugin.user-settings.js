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
                this.enableTabMode = false; // 默认不使用Tab页签模式
                this.autoSave = false; // 是否默认保存
                this.autoRestore = false; // 是否自动恢复之前使用的文档
            }
            return DocumentUnit;
        })();
        Settings.DocumentUnit = DocumentUnit;
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
        Settings.EditorUnit = EditorUnit;
        // 云端存储
        var CloudStorageUnit = (function () {
            function CloudStorageUnit() {
            }
            return CloudStorageUnit;
        })();
        Settings.CloudStorageUnit = CloudStorageUnit;
        // 云端帮助
        var CloudHelpUnit = (function () {
            function CloudHelpUnit() {
            }
            return CloudHelpUnit;
        })();
        Settings.CloudHelpUnit = CloudHelpUnit;
        var UserSetting = (function () {
            function UserSetting() {
                this.documentSetting = new DocumentUnit();
                this.editorSetting = new EditorUnit();
            }
            return UserSetting;
        })();
        Settings.UserSetting = UserSetting;
    })(Settings = RomanySoftPlugins.Settings || (RomanySoftPlugins.Settings = {}));
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.user-settings.js.map