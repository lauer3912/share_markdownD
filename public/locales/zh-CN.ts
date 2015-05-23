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
            ,"note-label": "Your changes and your files only get stored in cache. If you want save files changes, please click save button."
        };

        static workspacePage:any = {
            "Title": "工作区"
        };

        static settingsPage:any = {
            "Title": "设置"
        };

        static pluginMgrPage:any = {
            "Title": "插件管理"
        };

        static helpPage:any = {
            "Title": "帮助"
        };

        static aboutPage:any = {
            "Title": "关于"
        };
    }

    export class Message{

    }
}
