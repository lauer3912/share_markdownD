/**
* Created by Ian on 2015/5/22.
*/



class Native{
    data:any = {

    }
}

class UI {
    static navPage:any = {
        "Files": "Datei"
        ,"Workspace": "Arbeitsplatz"
        ,"Settings": "Einrichten"
    };

    static filePage:any = {
        "Title": "Dateiverwaltung"
        ,"Btn-Load": "Last"
        ,"Btn-Save": "Speichern"
        ,"Btn-Remove": "Entfernen"
        ,"Btn-New": "Neue Dateien"
        ,"Btn-ImportFiles": "Datei importieren"
        ,"Btn-Help": "Online-Hilfe"
        ,"SaveDialog-Title": "Speichern als"
        ,"SaveDialog-BtnSave": "Speichern"
        ,"ImportDialog-Title": "Import .md Datei"
        ,"ImportDialog-BtnImport": "Import"

        ,createNewDocTip:{
            "Title":"Nachrichten",
            "Content": "Hat bereits die größte Anzahl des aktuellen Dokuments [{docCount}], Sie können die maximale Anzahl von Dateien zu erhöhen, um Ihren Anforderungen zu entsprechen. Jeder Kauf und erhöhen die Anzahl der Dokumente 5.",
            "btnBuy": "Kauf",
            "btnCancel": "Stornieren"
        }

        // 统一消息
        ,Message:{
            "existOnImport_message": "Datei '{path}' Ist bereits in der Arbeitsbereich..",
            "existOnImport_title":"Vorbehalt",
            "fileChangeByOther_message":"Datei '{path}' Inhaltliche Änderungen ",
            "fileChangeByOther_title":"Information",
            "fileRenamedByOther_message":"Datei '{path}' Wurde umbenannt ",
            "fileRenamedByOther_title":"Information",
            "fileDeletedByOther_message":"Datei '{path}' es wurde gelöscht",
            "fileDeletedByOther_title":"Information",
            "fileReloadConfirm_title":"Vorbehalt",
            "fileReloadConfirm_message":"lokale Dokumente '{path}' Inhalt ändert, ob sie neu zu laden?",
            "fileReloadConfirm_btnOK":"nachladen",
            "fileReloadConfirm_btnCancel":"nicht geladen"

        }
    };

    static workspacePage:any = {
        "Title": "Arbeitsplatz"
        ,"Btn-Help": "Online-Hilfe"
    };

    static settingsPage:any = {
        "Title": "Einrichten"
        ,"Btn-Help": "Online-Hilfe"
        ,"Btn-reset_user_settings": "Zurücksetzen von Benutzereinstellungen"
        ,"Btn-save_user_settings": "Speichern der Benutzereinstellungen"
        ,"Btn-use_default_user_settings": "Verwenden Sie die Standardbenutzereinstellungen"
    };


}


class Message{

}


export class I18N {
    static "de": any = {
        UI: UI,
        Native: Native,
        Message: Message
    }
}

window["I18N"] = $.extend(window["I18N"] || new I18N());
