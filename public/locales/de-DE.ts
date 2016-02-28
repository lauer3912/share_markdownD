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
            "Files": "Datei"
            ,"Workspace": "Arbeitsplatz"
            ,"Plugins": "Widget"
            ,"Settings": "Einrichten"
            ,"Help": "Hilfe"
            ,"About": "über"
        };

        static filePage:any = {
            "Title": "Dateiverwaltung"
            ,"Btn-Load": "Last"
            ,"Btn-Save": "Speichern"
            ,"Btn-Remove": "Entfernen"
            ,"Btn-New": "Neue Dateien"
            ,"Btn-ImportFiles": "Datei importieren"
            ,"em-label": "Bemerkung:"
            ,"note-label": "Dateiänderungen vorhanden sind in dem Cache, wenn Sie die Datei speichern möchten, müssen Sie auf die Schaltfläche Speichern"
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
        };

        static settingsPage:any = {
            "Title": "Einrichten",
            btnReset:"Rücksetzen",
            btnApply:"Anwendung",
            document:{
                label:"[Dokumenteinstellungen]",
                maxDocumentCount: "Die maximale Anzahl der gleichzeitigen Bearbeitung des Dokuments",
                enableTabMode: "Tab-Modus zu wechseln",
                autoSave: "Automatisches Speichern",
                autoSaveSecs: "Frequenz speichern(sec)",
                autoRestore: "Automatische Wiederherstellung",
            },
            editor:{
                label:"[Editor Einstellungen]",
                enable_TaskList:"Aktivierung github task lists",
                enable_Emoji:"Aktivierung Emoji",
                enable_AtLink:"Aktivierung AtLink",
                enable_EmailLink:"Aktivierung EmailLink",
                enable_FlowChart:"Aktivierung FlowChart",
                enable_SequenceDiagram:"Aktivierung SequenceDiagram",
                enable_Tex:"Aktivierung Tex",
                enable_Toc:"Aktivierung Toc",
                enable_CodeFold:"Aktivierung CodeFold",
                enable_HtmlDecode:"Aktivierung HTML Decode",
                enable_StyleActiveLine:"Aktivierung Active line",
                enable_LineNumbers:"Aktivierung Line numbers",
                enable_ReadOnly:"Aktivierung ReadOnly mode",
                enable_SearchReplace:"Aktivierung Search and replace",
                enable_Tocm:"Aktivierung Tocm",
                enable_matchWordHighlight:"Aktivierung match word highlight"
            },

            // 购买信息
            Message:{
                Title:"Prompt",
                Content:"Sie müssen, um zu kaufen Aktivierung",
                btnBuy:"Kauf",
                btnCancel:"Stornieren"
            }
        };

        static pluginMgrPage:any = {
            "Title": "Plug-in Manager"
            ,"btnBuy": "Aktivierung"
            ,"btnBuyRestore":"Recovery Buy"
        };

        static aboutPage:any = {
            "Title": "über",
            App:{
                description:"Ein Markdown-Editor, das Streben nach Schnelligkeit, Einfachheit und Sicherheit",
                copyright:"Copyright 2016 Romanysoft LAB. Alle Rechte vorbehalten.",
                creditsTitle:"Construction ist untrennbar mit einigen Open-Source-Projekte und andere Open-Source-Software."
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
                name: "Öffnen Sie die Importdatei",
                description:"Support zu öffnen, importieren Sie eine oder mehrere Dateien"
            };

            o[t.getId("support.dragFile")] = {
                name: "Drag & Drop Dateien",
                description:"Es unterstützt Drag & Drop eine oder mehrere Dateien"
            };

            o[t.getId("support.fileSave")] = {
                name: "Speichern Sie die Datei",
                description:"Speichern Sie die Datei auf einen lokalen Support"
            };

            o[t.getId("increase5documentCount")] = {
                name: "Erhöhen Sie die Anzahl der Dokumente 5",
                description:"Wenn Sie zusätzliche Dateien bearbeiten müssen, dann müssen Sie die Unterstützung für die Synchronisierung Bearbeitung von Dokumenten auf diese Weise die Zahl hinzuzufügen. Jeder Kauf, erhöhen Sie die Anzahl der Dokumente bearbeiten 5"
            };

            o[t.getId("enableAutoSave")] = {
                name: "Automatisches Speichern",
                description:"Support-Dokument wird automatisch gespeichert Eigenschaften"
            };

            o[t.getId("enableAutoRestore")] = {
                name: "Automatische Wiederherstellung",
                description:"Support Dokumentation automatische Wiederherstellungsfunktion"
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
                description:"Editor-Unterstützung github task lists"
            };

            o[t.getId("support.emoji")] = {
                name: "Emoji",
                description:"Editor-Unterstützung Emoji"
            };

            o[t.getId("support.atLink")] = {
                name: "atLink",
                description:"Editor-Unterstützung atLink"
            };

            o[t.getId("support.emailLink")] = {
                name: "emailLink",
                description:"Editor-Unterstützung emailLink"
            };

            o[t.getId("support.flowChart")] = {
                name: "FlowChart",
                description:"Editor-Unterstützung FlowChart"
            };

            o[t.getId("support.sequenceDiagram")] = {
                name: "SequenceDiagram",
                description:"Editor-Unterstützung SequenceDiagram"
            };

            o[t.getId("support.tex")] = {
                name: "Tex",
                description:"Editor-Unterstützung Tex公式"
            };

            o[t.getId("support.toc")] = {
                name: "Toc",
                description:"Editor-Unterstützung Toc"
            };

            o[t.getId("support.codeFold")] = {
                name: "CodeFold",
                description:"Editor-Unterstützung CodeFold"
            };

            o[t.getId("support.htmlDecode")] = {
                name: "HTMLDecode",
                description:"Editor-Unterstützung HTMLDecode"
            };

            o[t.getId("support.styleActiveLine")] = {
                name: "Style Active Line",
                description:"Editor-Unterstützung Style Active Line"
            };

            o[t.getId("support.lineNumbers")] = {
                name: "Line Numbers",
                description:"Editor-Unterstützung Line Numbers"
            };

            o[t.getId("support.readOnly")] = {
                name: "ReadOnly",
                description:"Editor-Unterstützung ReadOnly"
            };

            o[t.getId("support.searchReplace")] = {
                name: "Search Replace",
                description:"Editor-Unterstützung Search Replace"
            };



            return o;
        }
    }

    export class Message{

    }
}
