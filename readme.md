苹果商店提交说明：

MarkdownD is a Markdown document editor.

Key features:
1. support for Github and Markdown standard style;
2. support live preview







editor.md 版本跟踪
===============================================================================================================
Editor.md v1.3.0 发布，增强快捷键操作等


Editor.md v1.3.0 主要更新：
预设键盘快捷键处理（粗体等），插入Markdown更加方便；
更新CodeMirror版本为5.0；
更新Marked版本为0.3.3；
新增自动高度和工具栏固定定位功能；
改进表格插入对话框；
工具栏新增三个按钮，分别是将所选文本首字母转成大写、转成小写、转成大写；
修改使用帮助文档；
修复多个Bug；
具体更新如下：

新增常用键盘快捷键预设处理；
新增属性editormd.keyMaps，预设一些常用操作，例如插入粗体等；
新增成员方法registerKeyMaps()；
退出HTML全屏预览快捷键更改为Shift + ESC；
新增配置项disabledKeyMaps，用于屏蔽一些快捷键操作；
更新CodeMirror版本为5.0；
修改无法输入/的问题；
更新Marked版本为0.3.3；
新增自动高度和工具栏固定定位（滚动条拖动时）模式；
新增配置项settings.autoHeight；
新增配置项settings.toolbarAutoFixed；
新增方法 setToolbarAutoFixed(true|false)；
新增邮箱地址自动添加链接功能；
新增配置项emailLink，默认为true;
改进表格插入对话框；
工具栏新增三个按钮，分别是将所选文本首字母转成大写、转成小写、转成大写；
新增方法editormd.ucwords()，别名editormd.wordsFirstUpperCase()；
新增方法editormd.ucfirst()，别名editormd.firstUpperCase()；
新增两个成员方法getSelections()和getSelections()；
修复Font awesome 图标 emoji 部分无法解析的Bug，#39
改进@link功能#40；
新增配置项atLink，默认为true;
修复无法输入/的问题 #42；
修改使用帮助说明的错误 #43；
新增配置项pluginPath，默认为空时，等于settings.path + "../plugins/"；

Editor.md v1.2.0 发布，支持Emoji表情等新功能
Editor.md v1.2.0 主要更新：

新增代码折叠、搜索替换、自定义样式主题和自定义快捷键等功能；
新增Emoji表情、@Link、GFM Task Lists支持；
新增表格插入、Emoji表情插入、HTML实体字符插入、使用帮助等对话框；
新增插件扩展机制；
新增手动加载依赖模块方式；
改用Prefixes.css作CSS前缀预处理；
改进和增强工具栏自定义功能，完善事件监听和处理方法；
部分功能改进（更加方便的预格式文本/代码插入、自动闭合标签等）、新增多个方法、改进Require.js支持和修复多个Bug等等；





一. 引用https://github.com/pandao/editor.md  作为控件源头 (参见 D:\e_work\see_git_source\Javascript\editor.md 的更新)
2. 产品规划
   1.产品免费
   2.免费产品提供的基本功能
     工具栏提供的功能：
     撤销、重做、粗体、删除线、斜体、引用、h1、h2、h3、h4、h5、h6、无序列表、有序列表、横线、链接、锚点、图片、
     行内代码、关闭实时预览、全窗口预览HTML、全屏、清空、信息

   收费功能说明：
   工具栏：
         预格式文本(缩进模式)、代码块(多语言风格)、时间日期、获取Markdown源码、获取HTML源码、显示工具栏控制
   支持ToC(Table of Contents)
   支持TeX科学公式（基于KaTeX)
   支持流程图 flowchart 和时序图 sequenceDiagram
   文件打开、保存
   文件目录结构

                   saveHTMLToTextarea: true,
                   htmlDecode: false,
                   toc:false,
                   tex:false,
                   flowChart:false,
                   sequenceDiagram:false,