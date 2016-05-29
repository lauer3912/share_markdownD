/**
 * Created by Ian on 2015/5/22.
 */

 class Native{
         data:any = {

         }
     }

 class UI {
         static navPage:any = {
             "Files": "Files"
             ,"Workspace": "Workspace"
             ,"Settings": "Settings"
         }

         static filePage:any = {
             "Title": "Files"
             ,"Btn-Load": "Edit"
             ,"Btn-Save": "Save"
             ,"Btn-SaveAs": "Save as"
             ,"Btn-Remove": "Remove"
             ,"Btn-Export": "Export"
             ,"Btn-New": "New File"
             ,"Btn-ImportFiles": "Import Files"
             ,"Btn-Help": "Online help"
             ,"SaveDialog-Title": "Save as"
             ,"SaveDialog-BtnSave": "Save"
             ,"ImportDialog-Title": "Open markdown files"
             ,"ImportDialog-BtnImport": "Open"

             ,createNewDocTip:{
                 "Title":"Message",
                 "Content": "Already have the largest number of the current document [{docCount}], you could increase the maximum number of documents to meet your requirements.Every purchase, increased 5 documents.",
                 "btnBuy": "Buy",
                 "btnCancel": "Cancel"
             }

             // 统一消息
             ,Message:{
                 "existOnImport_message": "The file '{path}' is already in workspace..",
                 "existOnImport_title":"Warning",
                 "fileChangeByOther_message":"The file '{path}' contents has changed ",
                 "fileChangeByOther_title":"Information",
                 "fileRenamedByOther_message":"The file '{path}' has renamed ",
                 "fileRenamedByOther_title":"Information",
                 "fileDeletedByOther_message":"The file '{path}' has deleted ",
                 "fileDeletedByOther_title":"Information",
                 "fileReloadConfirm_title":"Warning",
                 "fileReloadConfirm_message":"The local file '{path}' content has changed, whether to reload?",
                 "fileReloadConfirm_btnOK":"Reload",
                 "fileReloadConfirm_btnCancel":"Don't Reload"

             }
         };

         static workspacePage:any = {
             "Title": "Workspace",
             "Btn-Help": "Online help"
         };

         static settingsPage:any = {
             "Title": "Settings",
             "Btn-reset_user_settings": "Reset user settings",
             "Btn-save_user_settings": "Save user Settings",
             "Btn-use_default_user_settings": "Use the default user settings",
             "Btn-Help": "Online help"
         };

     }

 class Message{
     constructor(){

     }
 }

export class I18N {
    static "en": any = {
        UI: UI,
        Native: Native,
        Message: Message
    }
}

window["I18N"] = $.extend(window["I18N"] || new I18N());
