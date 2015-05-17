/**
 * Created by Ian on 2015/5/14.
 */
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    var DocumentUnit = (function () {
        function DocumentUnit() {
            this.maxDocumentCount = 2; // 默认最大的文档的数量
        }
        return DocumentUnit;
    })();
    RomanySoftPlugins.DocumentUnit = DocumentUnit;
    var EditorUnit = (function () {
        function EditorUnit() {
            this.lineNumbers = false; // 是否显示行号
            this.readOnly = false; // 是否开启只读模式
            this.matchWordHighlight = true; // 是否匹配文件高亮
            this.styleActiveLine = true; // 是否高亮当前行
        }
        return EditorUnit;
    })();
    RomanySoftPlugins.EditorUnit = EditorUnit;
    var UserSetting = (function () {
        function UserSetting() {
            this.documentSetting = new DocumentUnit();
            this.editorSetting = new EditorUnit();
        }
        return UserSetting;
    })();
    RomanySoftPlugins.UserSetting = UserSetting;
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.user-settings.js.map