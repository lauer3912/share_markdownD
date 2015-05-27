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
                this.autoSave = false; // 是否默认自动保存
                this.autoSaveSecs = 0; // 自动保存的间隔时间(秒数)，默认是立即保存，
                this.autoRestore = true; // 是否自动恢复之前使用的文档
            }
            return DocumentUnit;
        })();
        // 编辑器部分
        var EditorUnit = (function () {
            function EditorUnit() {
                //[商品关联]
                this.enable_TaskList = false; // 是否开启TaskList
                this.enable_Emoji = false; // 是否开启Emoji
                this.enable_AtLink = false; // 是否开启AtLink
                this.enable_EmailLink = false; // 是否开启EmailLink
                this.enable_FlowChart = false; // 是否开启FlowChart
                this.enable_SequenceDiagram = false; // 是否开启SequenceDiagram
                this.enable_Tex = false; // 是否开启Tex
                this.enable_Toc = false; // 是否开启Toc
                this.enable_CodeFold = false; // 是否开启CodeFold
                this.enable_HtmlDecode = false; // 是否开启HTMLDecode
                this.enable_StyleActiveLine = false; // 是否开启StyleActiveLine
                this.enable_LineNumbers = false; // 是否开启LineNumbers
                this.enable_ReadOnly = false; // 是否开启ReadOnly
                this.enable_SearchReplace = false; // 是否开启SearchReplace
                this.enable_Tocm = false; // 是否开启Tocm
                //[内置]
                this.enable_matchWordHighlight = true; // 是否开启匹配文件高亮
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
            // 获取核心的数据的json系列化
            UserSetting.prototype.coreDataToJSON = function () {
                var obj = {};
                for (var key in this) {
                    obj[key] = this[key];
                }
                return JSON.stringify(obj);
            };
            // 核心数据的反序列化
            UserSetting.prototype.coreDataFromJSON = function (str) {
                try {
                    var obj = JSON.parse(str);
                    this.restoreCoreDataWithInfo(obj);
                }
                catch (e) {
                }
            };
            return UserSetting;
        })();
        Settings.UserSetting = UserSetting;
    })(Settings = RomanySoftPlugins.Settings || (RomanySoftPlugins.Settings = {}));
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.user-settings.js.map