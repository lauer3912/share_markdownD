/**
 * Created by Ian on 2015/5/22.
 */

module I18N{

    export class Native{
        data:any = {

        }
    }

    export class UI {
        static navPage:any = {
            "Files": "文件"
            ,"Workspace": "工作区"
            ,"Plugins": "插件"
            ,"Settings": "设置"
            ,"Help": "帮助"
            ,"About": "关于"
        };

        static filePage:any = {
            "Title": "文件管理"
            ,"Btn-Load": "加载"
            ,"Btn-Save": "保存"
            ,"Btn-Remove": "移除"
            ,"Btn-New": "新建文件"
            ,"Btn-ImportFiles": "导入文件"
            ,"em-label": "备注:"
            ,"note-label": "文件的变化都存在缓存中，如果你想保存文件，需要点击保存按钮"
            ,"SaveDialog-Title": "另存为"
            ,"SaveDialog-BtnSave": "保存"
            ,"ImportDialog-Title": "导入 .md 文件"
            ,"ImportDialog-BtnImport": "导入"

            ,createNewDocTip:{
                "Title":"消息",
                "Content": "已经拥有数量最多的当前文档的 [{docCount}], 你可以增加最大文件数，以满足您的要求。每次购买，增加5个文档数量。",
                "btnBuy": "购买",
                "btnCancel": "取消"
            }

            // 统一消息
            ,Message:{
                "existOnImport_message": "文档 '{path}' 已经存在于工作空间..",
                "existOnImport_title":"警告",
                "fileChangeByOther_message":"文档 '{path}' 内容发生变化 ",
                "fileChangeByOther_title":"信息",
                "fileRenamedByOther_message":"文档 '{path}' 已经被重命名 ",
                "fileRenamedByOther_title":"信息",
                "fileDeletedByOther_message":"文档 '{path}' 被删除",
                "fileDeletedByOther_title":"信息",
                "fileReloadConfirm_title":"警告",
                "fileReloadConfirm_message":"本地文档 '{path}' 内容发生变化, 是否重新加载?",
                "fileReloadConfirm_btnOK":"重新加载",
                "fileReloadConfirm_btnCancel":"不加载"

            }
        };

        static workspacePage:any = {
            "Title": "工作区"
        };

        static settingsPage:any = {
            "Title": "设置",
            btnReset:"重置",
            btnApply:"应用",
            system:{
                label: "[系统]",
                userLanguage: "界面语言",
                languageChangeTip: "需要重启应用"
            },
            document:{
                label:"[文档设置]",
                maxDocumentCount: "最大同时编辑文档数量",
                enableTabMode: "切换到Tab模式",
                autoSave: "自动保存",
                autoSaveSecs: "保存频率(sec)",
                autoRestore: "自动恢复",
            },
            editor:{
                label:"[编辑器设置]",
                enable_TaskList:"激活 github task lists",
                enable_Emoji:"激活 Emoji",
                enable_AtLink:"激活 AtLink",
                enable_EmailLink:"激活 EmailLink",
                enable_FlowChart:"激活 FlowChart",
                enable_SequenceDiagram:"激活 SequenceDiagram",
                enable_Tex:"激活 Tex",
                enable_Toc:"激活 Toc",
                enable_CodeFold:"激活 CodeFold",
                enable_HtmlDecode:"激活 HTML Decode",
                enable_StyleActiveLine:"激活 Active line",
                enable_LineNumbers:"激活 Line numbers",
                enable_ReadOnly:"激活 ReadOnly mode",
                enable_SearchReplace:"激活 Search and replace",
                enable_Tocm:"激活 Tocm",
                enable_matchWordHighlight:"激活 match word highlight"
            },

            // 购买信息
            Message:{
                Title:"提示",
                Content:"你需要购买来激活",
                btnBuy:"购买",
                btnCancel:"取消"
            }
        };

        static pluginMgrPage:any = {
            "Title": "插件管理"
            ,"btnBuy": "激活"
            ,"btnBuyRestore":"恢复购买"
        };

        static aboutPage:any = {
            "Title": "关于",
            App:{
                description:"一款 markdown 编辑器，追求速度、简单及安全",
                copyright:"版权 2016 Romanysoft LAB. 版权所有.",
                creditsTitle:"构建离不开一些开源项目和其他开放源码软件。"
            }
        };
    }

    export class PluginUI{

        static pre:string = "";   // 产品标识前置

        private static getId(id:string):string{
            return this.pre + id;
        }

        static data():{}{
            var t = this;
            var o = {};
            o = t.buildIn(o);
            o = t.editor(o);

            return o;

        }


        private static buildIn(orgObj:{}):{}{
            var t = this;
            var o = orgObj || {};
            o[t.getId("support.importFile")] = {
                name: "打开、导入文件",
                description:"支持打开、导入一个或多个文件"
            };

            o[t.getId("support.dragFile")] = {
                name: "拖拽文件",
                description:"支持拖拽一个或多个文件"
            };

            o[t.getId("support.fileSave")] = {
                name: "保存文件",
                description:"支持保存文件到本地"
            };

            o[t.getId("increase5documentCount")] = {
                name: "增加5个文档数量",
                description:"如果你需要编辑更多的文件，那么你需要增加同步文档编辑以这种方式数的支持。每一次购买，增加编辑5个文档数量"
            };

            o[t.getId("enableAutoSave")] = {
                name: "自动保存",
                description:"支持文档自动保存特性"
            };

            o[t.getId("enableAutoRestore")] = {
                name: "自动恢复",
                description:"支持文档自动恢复特性"
            };

            return o;
        }


        private static editor(orgObj:{}):{}{
            var t = this;
            var o = orgObj || {};

            o[t.getId("support.dirTree")] = {
                name: "DirTree",
                description:"Editor support file directory"
            };

            o[t.getId("support.taskList")] = {
                name: "TaskList",
                description:"编辑器支持 github task lists"
            };

            o[t.getId("support.emoji")] = {
                name: "Emoji",
                description:"编辑器支持 Emoji"
            };

            o[t.getId("support.atLink")] = {
                name: "atLink",
                description:"编辑器支持 atLink"
            };

            o[t.getId("support.emailLink")] = {
                name: "emailLink",
                description:"编辑器支持 emailLink"
            };

            o[t.getId("support.flowChart")] = {
                name: "FlowChart",
                description:"编辑器支持 FlowChart"
            };

            o[t.getId("support.sequenceDiagram")] = {
                name: "SequenceDiagram",
                description:"编辑器支持 SequenceDiagram"
            };

            o[t.getId("support.tex")] = {
                name: "Tex",
                description:"编辑器支持 Tex公式"
            };

            o[t.getId("support.toc")] = {
                name: "Toc",
                description:"编辑器支持 Toc"
            };

            o[t.getId("support.codeFold")] = {
                name: "CodeFold",
                description:"编辑器支持 CodeFold"
            };

            o[t.getId("support.htmlDecode")] = {
                name: "HTMLDecode",
                description:"编辑器支持 HTMLDecode"
            };

            o[t.getId("support.styleActiveLine")] = {
                name: "Style Active Line",
                description:"编辑器支持 Style Active Line"
            };

            o[t.getId("support.lineNumbers")] = {
                name: "Line Numbers",
                description:"编辑器支持 Line Numbers"
            };

            o[t.getId("support.readOnly")] = {
                name: "ReadOnly",
                description:"编辑器支持 ReadOnly"
            };

            o[t.getId("support.searchReplace")] = {
                name: "Search Replace",
                description:"编辑器支持 Search Replace"
            };



            return o;
        }
    }

    export class Message{

    }
}
