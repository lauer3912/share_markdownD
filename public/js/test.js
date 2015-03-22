/**
 * Created by Ian on 2015/3/22.
 */
(function () {
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();

(function () {
    "use strict";

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var c$ = {};
    var b$ = BS.b$;
    c$ = $.extend(window.UI.c$, {});

    c$.Test = {
        sendClickEvent: function(ele){
            var evn = new MouseEvent('click',{
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

            var cb = document.getElementById(ele);
            var canceled = !cb.dispatchEvent(evn);
            if (canceled) {
                alert('canceld');
            }else{
                alert("not canceld");
            }

        }
    };

}());