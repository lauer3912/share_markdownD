/**
* Created by Ian on 2015/5/22.
*/
(function ($) {
    var Native = (function () {
        function Native() {
            this.data = {};
        }
        return Native;
    }());
    var UI = (function () {
        function UI() {
            this.navPage = {
                "Files": "Datei",
                "Workspace": "Arbeitsplatz",
                "Settings": "Einrichten"
            };
            this.filePage = {
                "Title": "Dateiverwaltung",
                "Btn-Load": "Last",
                "Btn-Save": "Speichern",
                "Btn-Remove": "Entfernen",
                "Btn-New": "Neue Dateien",
                "Btn-ImportFiles": "Datei importieren",
                "Btn-Help": "Online-Hilfe",
                "SaveDialog-Title": "Speichern als",
                "SaveDialog-BtnSave": "Speichern",
                "ImportDialog-Title": "Import .md Datei",
                "ImportDialog-BtnImport": "Import",
                createNewDocTip: {
                    "Title": "Nachrichten",
                    "Content": "Hat bereits die größte Anzahl des aktuellen Dokuments [{docCount}], Sie können die maximale Anzahl von Dateien zu erhöhen, um Ihren Anforderungen zu entsprechen. Jeder Kauf und erhöhen die Anzahl der Dokumente 5.",
                    "btnBuy": "Kauf",
                    "btnCancel": "Stornieren"
                },
                Message: {
                    "existOnImport_message": "Datei '{path}' Ist bereits in der Arbeitsbereich..",
                    "existOnImport_title": "Vorbehalt",
                    "fileChangeByOther_message": "Datei '{path}' Inhaltliche Änderungen ",
                    "fileChangeByOther_title": "Information",
                    "fileRenamedByOther_message": "Datei '{path}' Wurde umbenannt ",
                    "fileRenamedByOther_title": "Information",
                    "fileDeletedByOther_message": "Datei '{path}' es wurde gelöscht",
                    "fileDeletedByOther_title": "Information",
                    "fileReloadConfirm_title": "Vorbehalt",
                    "fileReloadConfirm_message": "lokale Dokumente '{path}' Inhalt ändert, ob sie neu zu laden?",
                    "fileReloadConfirm_btnOK": "nachladen",
                    "fileReloadConfirm_btnCancel": "nicht geladen"
                }
            };
            this.workspacePage = {
                "Title": "Arbeitsplatz",
                "Btn-Help": "Online-Hilfe"
            };
            this.settingsPage = {
                "Title": "Einrichten",
                "Btn-Help": "Online-Hilfe",
                "Btn-reset_user_settings": "Zurücksetzen von Benutzereinstellungen",
                "Btn-save_user_settings": "Speichern der Benutzereinstellungen",
                "Btn-use_default_user_settings": "Verwenden Sie die Standardbenutzereinstellungen"
            };
        }
        return UI;
    }());
    var Message = (function () {
        function Message() {
        }
        return Message;
    }());
    var I18N = (function () {
        function I18N() {
            this["de"] = {
                UI: new UI(),
                Native: new Native(),
                Message: new Message()
            };
        }
        return I18N;
    }());
    window["I18N"] = window["I18N"] || {};
    window["I18N"] = $.extend(window["I18N"], new I18N());
})(jQuery);
//# sourceMappingURL=de.js.map