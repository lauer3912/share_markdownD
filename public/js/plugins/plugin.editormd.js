/**
 * Created by Ian on 2015/5/14.
 */
///<reference path="../../tsd/typings/jquery/jquery.d.ts" />
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    var EditorMdServices = (function () {
        function EditorMdServices() {
            this.version = "1.4.4";
            this.default_lib_path = "common/editor.md/" + this.version + "/editor.md/lib/"; // 默认版本哭路径
        }
        EditorMdServices.prototype.getDefault_toolbarIcons = function () {
            if (editormd.version >= "1.4.0") {
                return ["undo", "redo", "|", "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|", "h1", "h2", "h4", "h4", "h5", "h6", "|", "list-ul", "list-ol", "hr", "|", "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "pagebreak", "|", "goto-line", "watch", "preview", "watch", "fullscreen", "|", "search", "clear"];
            }
        };
        EditorMdServices.prototype.configEmoji = function () {
            //配置emoji的. 配置 You can custom Emoji's graphics files url path
            editormd.emoji = {
                path: "http://www.emoji-cheat-sheet.com/graphics/emojis/",
                ext: ".png"
            };
            //配置Twemoji的. Twitter Emoji (Twemoji)  graphics files url path
            editormd.twemoji = {
                path: "http://twemoji.maxcdn.com/72x72/",
                ext: ".png"
            };
        };
        EditorMdServices.prototype.createEditor = function (ui_ele, in_config) {
            var _config = in_config || {};
            // 插件部分
            var ui_ele_editor = editormd(ui_ele, {
                width: _config.width || "100%",
                height: _config.height || $(document).height,
                path: this.default_lib_path,
                toolbarIcons: this.getDefault_toolbarIcons(),
                appendMarkdown: _config.content || "" // 附加的md内容
                ,
                toolbarAutoFixed: _config.toolbarAutoFixed || true //工具栏是否自动填充位置
                ,
                onload: _config.onload || function () {
                } //加载成功后的处理
                ,
                onresize: _config.onresize || function () {
                } //大小发生变化的时候
                ,
                onchange: _config.onchange || function () {
                } //内容发生变化的时候
                ,
                onwatch: _config.onwatch || function () {
                } //实时预览的时候
                ,
                onunwatch: _config.onunwatch || function () {
                } //实时预览关闭的时候
                ,
                onpreviewing: _config.onpreviewing || function () {
                } //当预览的时候
                ,
                onpreviewed: _config.onpreviewed || function () {
                } //当已经预览过的时候
                ,
                onfullscreen: _config.onfullscreen || function () {
                } //当全屏的时候
                ,
                onfullscreenExit: _config.onfullscreenExit || function () {
                } //当全屏退出的时候
                ,
                onscroll: _config.onscroll || function () {
                } //当滚动的时候
                ,
                onpreviewscroll: _config.onpreviewscroll || function () {
                } //当预览滚动的时候
            });
            return ui_ele_editor;
        };
        // 获取编辑器区域的内容
        EditorMdServices.prototype.getContent = function (editor) {
            return editor.getMarkdown();
        };
        // 设置编辑器区域的内容
        EditorMdServices.prototype.setContent = function (content, editor) {
            editor.setMarkdown(content);
        };
        EditorMdServices.prototype.appendContent = function (content, editor) {
            editor.appendMarkdown(content);
        };
        /**
         * 获得当前的光标位置
         * @param editor    editormd的实例对象
         * @returns {Object}     pos 位置键值对象，例:{line:1, ch:0, xRel:1}
         */
        EditorMdServices.prototype.getCursorPosition = function (editor) {
            return editor.getCursor();
        };
        /**
         * 设置光标位置
         * @param pos {Object} pos 位置键值对象，例:{line:1, ch:0, xRel:1}
         * @param editor    editormd的实例对象
         */
        EditorMdServices.prototype.setCursorPosition = function (pos, editor) {
        };
        // 聚焦光标位
        EditorMdServices.prototype.focusCursorPosition = function (editor) {
            editor.focus();
        };
        /**
         * 获取光标选中的文本范围
         * @param editor
         * @returns {Array}
         */
        EditorMdServices.prototype.getSelections = function (editor) {
            return editor.getSelections();
        };
        /**
         * 设置光标选中的文本范围
         * @param ranges {Array}
         * @param editor    编辑器实例
         */
        EditorMdServices.prototype.setSelections = function (ranges, editor) {
            editor.setSelections(ranges);
        };
        /**
         * 调整编辑器的尺寸和布局
         * @param width     宽度
         * @param height    高度
         * @param editor    编辑器实例
         */
        EditorMdServices.prototype.resize = function (width, height, editor) {
            editor.resize(width, height);
        };
        /**
         * 重置编辑器的历史记录
         * @param history 历史记录对象
         * @param editor  编辑器实例
         */
        EditorMdServices.prototype.resetHistory = function (history, editor) {
            editor.cm.history = history;
        };
        /**
         * 获取编辑器的历史
         * @param editor
         * @returns {*}
         */
        EditorMdServices.prototype.getHistory = function (editor) {
            return editor.cm.history;
        };
        return EditorMdServices;
    })();
    RomanySoftPlugins.EditorMdServices = EditorMdServices;
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.editormd.js.map