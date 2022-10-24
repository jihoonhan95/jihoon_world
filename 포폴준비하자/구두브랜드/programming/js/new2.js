// nclk.js, Version 0.7.1
// Log-data 2021.11.09.

(function(nclkExports) {

    /* Global variable */
// Function Name : nclk
// Argument : e - `event` or `element` where event occured object, a - click area,  i - gdID or cid, r - rank in area, opt - forced mode setting, g - extra variable, pid(option) - page id: �녿뒗 寃쎌슦 g_pid �먮뒗 lcs_get_lpid 李몄“
// Description : When users click link, this function is called. It request to the server, then the server log data.
    var nclk = function (e, a, i, r, opt, g, pid) {
        // opt�� spec-out�� 寃껋쑝濡� �뺤씤. 湲곗〈 �명꽣�섏씠�� �좎�瑜� �꾪빐 �④꺼�ъ빞 ��.(#49)
        nclk_v2(e, a, i, r, g, pid);
    };
    var ccsrv = nclkExports.ccsrv || "cc.naver.com"; // collect server
    var nsc = nclkExports.nsc || "decide.me";
    var overwritedGlobal = {};
    var allowedOrigin = nclkExports.g_allowedOrigin || "";
    var parentVar = {};

    nclk.vs = "0.7.1"; // version
    nclk.md = "cc"; // module
    nclk.pt = "https:";
    nclk.ec = encodeURIComponent;
    nclk.st = 1; // 1: SSC mode, 0: NSC mode(deprecated)
    nclk.ua = {}; // userAgentData

// iframe�� 寃쎌슦 parent�먯꽌 湲�濡쒕쾶蹂��� 媛��몄삤湲�
    if(self !== parent && !!allowedOrigin){
        parent.postMessage("getLCSInfo", allowedOrigin);
        window.addEventListener("message", function(event){
            if(event.origin !== allowedOrigin) return;
            parentVar = JSON.parse(event.data);
        }, false);
    }

// 鍮꾨룞湲� 濡쒖쭅(navigator.userAgentData.getHighEntropyValues())�� �덉뼱 nclk() �몄텧 �댁쟾�� �꾨즺�댁빞 ��.
    (function setUserAgentData() {
        try {
            if (typeof navigator === "undefined" || !navigator || !navigator.userAgentData) {
                return false;
            }

            var userAgentData = navigator.userAgentData;
            var brands = userAgentData.uaList || userAgentData.brands;

            nclk.ua["mobile"] = userAgentData.mobile;

            for (var i = 0, brandsLength = brands.length; i < brandsLength; i++) {
                for (var key in brands[i]) {
                    nclk.ua[key + "_" + i] = brands[i][key];
                }
            }

            navigator.userAgentData.getHighEntropyValues([
                "architecture",
                "model",
                "platform",
                "platformVersion",
                "uaFullVersion",
            ]).then(function(info) {
                for (var key in info) {
                    nclk.ua[key] = info[key];
                }
            });
        } catch(e) {
            console.warn(e);
        }
    })();

//Function Name : nclk_proxy
//Argument : o - owner of event occurence object, a - click area,  i - gdID or cid, r - rank in area, opt - forced mode setting, g - extra variable
//Description : Do the same thing with nclk() except for redirecting target URL to proxy server.
    function nclk_proxy(o, a, i, r, opt, g) {
        var g_nclk_proxy = nclkExports.g_nclk_proxy || ""; // proxy server

        if (g_nclk_proxy && o.href){
            o.href = g_nclk_proxy + nclk.ec(o.href);
        }

        return nclk(o, a, i, r, opt, g);
    }

    function nclk_v2_with_obj(obj) {
        var params = obj || {};

        if(!params.e || !params.a) { return; }

        overwritedGlobal.g_ssc = params.g_ssc || "";
        overwritedGlobal.g_query = params.g_query || "";
        overwritedGlobal.g_sid = params.g_sid || "";
        overwritedGlobal.g_pid = params.g_pid || "";
        overwritedGlobal.g_lcsurl = params.g_lcsurl || "";
        overwritedGlobal.g_lcssti = params.g_lcssti || "";

        nclk_v2(params.e, params.a, params.i, params.r, params.g, params.pid);

        overwritedGlobal = {};
    }

// Function Name : nclk_v2
// Argument : e - `event` or `element` where event occured object, a - click area,  i - gdID or cid, r - rank in area, g - extra variable, pid(option) - page id: �녿뒗 寃쎌슦 g_pid �먮뒗 lcs_get_lpid 李몄“
// Description : When users click link, this function is called. It request to the server, then the server log data.
    function nclk_v2(e, a, i, r, g, pid) {
        var m, l, tU, sc;

        // Some browsers like Firefox doesn't support window.event.
        var evt = e;
        var o = e;

        if ('nodeType' in e && e.nodeType >= 1) { // e媛� element �대㈃ (湲곗〈 this)
            evt = window.event || e;
        } else if (e) {
            var target = e.srcElement || e.currentTarget || e.target;

            if (target) {
                o = nclk.findLink(target);
            }
        }

        if (!g) g = "";

        // In here we get and calculates position that click happens.l
        sc = nclk.gcp(o, evt);	// global click position
        tU = nclk.gl(a, i, r, sc, "", 0, nclk.st, g, pid);	// make request url
        l = nclk.l(o, tU);	// append target url

        nclk.sd(l);     // send log

        return true;
    }

    nclk.findLink = function(_el) {
        var el = _el;

        while (el && el.tagName !== "BODY" && el.tagName !== "HTML") {
            if (el.tagName === "A" || !el.parentNode) {
                break;
            }

            el = el.parentNode;
        }

        if (el.tagName !== "A") {
            el = _el;
        }

        return el;
    }

// Function Name : nclk.l
// Argument : o - owner of event occurence object, tU - request URL
// Description : append target url at request URL
    nclk.l = function (o, tU) {
        var l, tN, tH;

        // o.href濡� HTML Spec�� �곕씪 href �띿꽦�� 媛�吏� �섎━癒쇳듃�몄�? �뺤떇�� 留욌뒗 留곹겕�몄�? �먮퀎�� 媛��ν븯��, IE�먯꽌 img�섎━癒쇳듃留� �덉쇅濡� src媛믪쓣 諛섑솚�섍퀬 �덉쓬.
        // IE���묒쓣 �꾪빐 �꾩닚�꾨줈 getAttriute 議곌굔臾� 異붽���.
        if (o && o.href && o.getAttribute("href")) {
            tN = o.tagName.toLowerCase();
            tH = o.href.toLowerCase();
            if (tH && tH.indexOf(nclk.pt+"//"+ccsrv) == 0) {	// href is cc.naver.com ...
                l = o.href;
            } else if (tH && tH.indexOf(nclk.pt+"//"+ccsrv) != 0 && tN && tN != "img") {
                l = tU + "&u="+nclk.ec(o.href);	// append target url
            }
            return l;
        }
        return tU + "&u=about%3Ablank";		// no tareget url - default
    };

    nclk.sendByBeacon = function(l) {
        var parsedUrl = l.split("?");

        navigator.sendBeacon(parsedUrl[0], parsedUrl[1]);
    };

    nclk.sendByImage = function(l) {
        var t = new Date().getTime();  // Aviod image cache

        (new Image()).src = l + "&nt="+ t;
    };

// Function Name : nclk.sd
// Argument : l - request url, func - callback funciton
// Description : send log
    nclk.sd = !!navigator.sendBeacon ? nclk.sendByBeacon : nclk.sendByImage;

// Function Name : nclk.ggv
// Argument : gv - global variables name
// Description : return global variable in priority order
    nclk.ggv = function(gv) {
        return overwritedGlobal[gv] || nclkExports[gv] || "";
    }

// Function Name : nclk.gl
// Argument : a - click area,  i - gdID or cid, r - rank in area, u- target url, m- action mode, s- nsc or nsc, g - extra variable
// Description : make request url
    nclk.gl = function(a, i, r, sc, u, m, s, g, pid) {
        var g_ssc = nclk.ggv("g_ssc");
        var g_query = nclk.ggv("g_query");
        var g_pid = nclk.ggv("g_pid"); // page id
        var g_sid = nclk.ggv("g_sid"); // session id
        var g_lcsurl = nclk.ggv("g_lcsurl") || parentVar.g_lcsurl || window.location.href;
        var g_lcssti = nclk.ggv("g_lcssti") || parentVar.g_lcssti || null;
        var lcs_get_lpid = nclkExports.lcs_get_lpid || parentVar.lcs_get_lpid || null;

        if (m == undefined){
            m = 1;
        }

        if (s == undefined) {
            s = 1;
        }

        var l = nclk.pt+"//" + ccsrv + "/"+ nclk.md + "?a=" + a + "&r=" + r + "&i=" + i + "&m=" + m;

        if (s == 1) {	// SSC 愿��� 媛� 異붽�
            if (g_ssc) {
                l += "&ssc=" + g_ssc;
            }

            if (g_query) {
                l += "&q=" + nclk.ec(g_query);
            }

            if (g_sid) {
                l += "&s=" + g_sid;
            }

            // pid
            if (pid) {
                l += "&p=" + pid;
            } else if(g_pid) {
                l += "&p=" + g_pid;
            } else if (lcs_get_lpid) {	// lcs�먯꽌 李몄“
                // lpid: 媛숈� pageview�먯꽌 lcs 濡쒓렇 �곗씠�곗� nclicks 濡쒓렇 �곗씠�곕� �곌껐�섍린 �꾪븳 怨듯넻 �� 媛�
                // lcs�먯꽌 id瑜� �앹꽦 (lcs_do�� �뚮쭏�� �낅뜲�댄듃)
                // (�섏씠吏� 濡쒕뱶 �� (lcs_do �댁쟾) lpid瑜� 李몄“�섎뒗 寃쎌슦 lpid瑜� �숈쟻�쇰줈 �앹꽦�� �ㅼ쓬, 泥섏쓬 lcs_do�먯꽌�� �앹꽦�� 媛믪쓣 �ъ슜. �댄썑�� 留덉갔媛�吏�濡� �낅뜲�댄듃)
                l += "&p=" + (typeof lcs_get_lpid == "function" ? lcs_get_lpid() : lcs_get_lpid);
            } else {
                console.warn("'g_pid / lcs_get_lpid' is not exist.");
            }
        } else {
            l += "&nsc=" + nsc;
            console.warn("[DEPRECATED] NSC mode");
        }

        if (g) {
            l += "&g=" + g;
        }

        if (u) {
            l += "&u="+nclk.ec(u);
        }

        if (g_lcsurl) {
            l += "&lcsurl=" + nclk.ec(g_lcsurl);
        }

        if (g_lcssti) {
            l += "&lcssti=" + g_lcssti;
        }

        if (sc){
            l += sc
        }

        // Add userAgentData to queryString
        var uaIndex, uaValue;
        for (uaIndex in nclk.ua) {
            uaValue = nclk.ua[uaIndex];

            if (uaValue) {
                l += "&" + "ua_" + uaIndex + "=" + nclk.ec(uaValue);
            }
        }

        return l;
    };

// Function Name : nclk.al
// Argument : sType- event type, fn - callback function
// Description : event listener
    nclk.al = function(sType, fn) {
        var w = window;
        if(w.addEventListener) {
            w.addEventListener(sType, fn, false);
        } else if(w.attachEvent) {	// support to IE
            w.attachEvent("on" + sType, fn);
        }
    };

//Function Name : nclk.gsbw
//Return : scrollbar width
//Description : Get scrollbar width in order to calculate browser size of Opera.
    nclk.gsbw = function() {
        var inner = document.createElement('p');
        inner.style.width = '200px';
        inner.style.height = '200px';

        var outer = document.createElement('div');
        outer.style.position = 'absolute';
        outer.style.top = '0px';
        outer.style.left = '0px';
        outer.style.visibility = 'hidden';
        outer.style.width = '200px';
        outer.style.height = '150px';
        outer.style.overflow = 'hidden';
        outer.appendChild (inner);

        document.body.appendChild (outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;

        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild (outer);

        return (w1 - w2);
    };

//Function Name : nclk.fp
//Parameter : obj - owner of event occurence object
//Return : object position
//Description : Get offsetLeft, offsetTop
    nclk.fp = function(obj) {
        var curleft = curtop = 0;

        try {
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            }
            else if (obj.x || obj.y)			// for safari of old version
            {
                if (obj.x) curleft += obj.x;
                if (obj.y) curtop += obj.y;
            }
        } catch(e) {
        }
        return [curleft, curtop];
    };


//Function Name : nclk.ws
//Paramenter : win -  window object
//Return : window width
//Description : Calculates inner width of browser window.
    nclk.ws = function(win) {
        if (!win) win = window;
        var winWidth = 0;
        if (win.innerWidth) {
            // most non-IE
            winWidth = win.innerWidth;
            // including scroll bar !!
            if ( typeof(win.innerWidth) == 'number') {
                var scrollbarWidth = nclk.gsbw();
                winWidth = win.innerWidth - scrollbarWidth; // Opera includes scrollbar width at innerWidth
            }
        } else if (document.documentElement && document.documentElement.clientWidth) {
            //IE 6+ in 'standards compliant mode'
            winWidth = document.documentElement.clientWidth;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            //IE 4 compatible
            winWidth = document.body.clientWidth;
        }
        return winWidth;
    };

//Function Name : nclk.ci
//Parameter : obj - owner of event occurence object
//Return Value : iframe ID or false
//Description : Check whether it is clicked in iframe or not
    nclk.ci = function(obj) {
        var oriURL = document.URL;
        var p = obj.parentNode;
        var docObj;
        var ifrId;
        var l;

        if (p == null || p == undefined) {
            return false;
        }

        while (1) {
            if (p.nodeName.toLowerCase() == "#document") {
                if (p.parentWindow) {		// IE, Opera
                    docObj = p.parentWindow;
                } else {	// Firefox, Safari
                    docObj = p.defaultView;
                }
                try {
                    if (docObj.frameElement != null && docObj.frameElement != undefined ) {
                        if (docObj.frameElement.nodeName.toLowerCase() == "iframe") {
                            ifrId = docObj.frameElement.id;	// Get iframe id
                            if (!ifrId) return false;
                            return ifrId;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            } else {
                p = p.parentNode;
                if (p == null || p == undefined) return false;
            }
        }
    };

    nclk.gcp = function(obj, e) {
        var sx=-1;
        var sy=-1;
        var px=-1;
        var py=-1;
        var dBody, dElement, ifrId;
        var l=""
        var theEvent = window.event ? window.event : obj;

        if (e) {
            theEvent = e || window.event;
        }

        try {
            bw = nclk.ws(window);	// size of window
            ifrId = nclk.ci(obj);	// check whether it is clicked in iframe or not
            if (ifrId) {	// click object in iframe
                var ifrOffset = nclk.fp(document.getElementById(ifrId));	// Get position of iframe
                if (theEvent.clientX  && theEvent.clientX != undefined) {
                    dBody = document.body;
                    if (dBody.clientLeft && dBody.clientTop) {
                        ifrSx = theEvent.clientX - dBody.clientLeft;		//  relative position in iframe
                        ifrSy = theEvent.clientY - dBody.clientTop;
                    } else { // firefox bug - clientLeft, clientTop don't work in firefox. It is OK in firefox 3.0
                        ifrSx = theEvent.clientX;
                        ifrSy = theEvent.clientY;
                    }
                }
                // postion of iframe + relative position in iframe
                px = ifrOffset[0] + ifrSx;
                py = ifrOffset[1] + ifrSy;

                // relative position in window
                if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
                    dBody = document.body;
                    sx = px - dBody.scrollLeft;
                    sy = py - dBody.scrollTop;
                } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
                    dElement = document.documentElement;
                    sx = px - dElement.scrollLeft;
                    sy = py - dElement.scrollTop;
                } else {
                    sx = px;
                    sy = py;
                }
            } else {	// normal click object
                if (theEvent.clientX  && theEvent.clientX != undefined) {
                    dBody = document.body;
                    if (dBody.clientLeft && dBody.clientTop) {
                        sx = theEvent.clientX - dBody.clientLeft;		// relative position in window
                        sy = theEvent.clientY - dBody.clientTop;
                    } else { // firefox bug - clientLeft, clientTop don't work in firefox. It is OK in firefox 3.0
                        sx = theEvent.clientX;
                        sy = theEvent.clientY;
                    }
                }

                // IE calculates (clientX,clientY) relativ to window, not content.
                if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
                    px = document.body.scrollLeft + (sx < 0 ? 0: sx);
                    py = document.body.scrollTop + (sy < 0 ? 0: sy);
                } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
                    dElement = document.documentElement;
                    if (dElement.scrollLeft !=undefined) px = dElement.scrollLeft + (sx < 0 ? 0: sx);
                    if (dElement.scrollTop !=undefined) py = dElement.scrollTop + (sy < 0 ? 0: sy);
                } else {
                    px = (sx < 0 ? 0: sx);
                    py = (sy < 0 ? 0: sy);
                }

                if (theEvent.pageX) { px = theEvent.pageX; }
                if (theEvent.pageY) { py = theEvent.pageY; }
            }
        } catch (e) {
        }

        if ((px != -1) &&  (py != -1)){
            l+= "&px=" + px + "&py=" + py;
        }

        if ((sx != -1) &&  (sy != -1)){
            l+= "&sx=" + sx + "&sy=" + sy;
        }

        return l;
    }

    nclkExports.nclk_proxy = nclk_proxy;
    nclkExports.nclk = nclk;
    nclkExports.nclk_v2 = nclk_v2;
    nclkExports.nclk_v2_with_obj = nclk_v2_with_obj;

})(window);

// lcslog.js, Version 0.12.1
// Log-data 2022.03.07.
(function(exportTarget) {
    var lcs_options = {
        nnb: true // nnb 荑좏궎 愿��� 泥섎━
    };

    var lcs_version = "v0.12.1";

    var lcs_add = {}; // additional infomation
    var lcs_bc = {}; // browser capacity
    var lcs_perf = {};
    var lcs_ua = {}; // userAgentData

    var lcs_do_count = 0;
    var lcs_do_retry_count = 0;
    var lcs_waiting_pageshow = false;

    // 鍮꾨룞湲� 濡쒖쭅(navigator.userAgentData.getHighEntropyValues())�� �덉뼱 lcs_do() �몄텧 �댁쟾�� �꾨즺�댁빞 ��.
    lcs_setUserAgentData();

    // iframe �� nClicks�먯꽌 諛쒖넚�� postMessage瑜� �섏떊�섍린 �꾪븳 �몃뱾�� �깅줉
    lcs_registMessageHandler();

    // PUBLIC
    function lcs_do(optional_etc) {
        var etc = optional_etc || {};

        if (lcs_waiting_pageshow) {
            return;
        }

        var retry = function(__etc) {
            return function() {
                window.setTimeout(function() {
                    lcs_waiting_pageshow = false;

                    lcs_do(__etc);
                }, 10);
            }
        }(etc);

        if (document.readyState !== "complete") { // not loaded
            var eventName = "onpageshow" in window ? "pageshow" : "load";

            if (document.addEventListener) {
                window.addEventListener(eventName, retry, false);
            } else {
                window.attachEvent("on"+ eventName, retry);
            }

            lcs_do_retry_count++;
            lcs_waiting_pageshow = true;

            return;
        }

        // {pid: }
        // TODO : check lcs server name!!
        if (!window.lcs_SerName) {
            window.lcs_SerName = "lcs.naver.com";
        }

        var rs = "";
        var index;
        var itarVal;
        var doc = document;
        var wlt = window.location;
        var lcsServerAddr;

        // lcs �쒕쾭 二쇱냼 �앹꽦
        try {
            lcsServerAddr = "https://" + window.lcs_SerName + "/m?";
        } catch (e) {
            return;
        }

        // href / referrer �뺣낫 異붽�
        try {
            rs =
                lcsServerAddr +
                "u=" +
                encodeURIComponent(wlt.href) +
                "&e=" +
                (doc.referrer ? encodeURIComponent(doc.referrer) : "");
        } catch (e) {}

        try {
            if (typeof lcs_add.i == "undefined") lcs_add.i = "";

            if (lcs_do_count < 1) {
                // lcs_do媛� 泥섏쓬 遺덈윭吏��� 寃쎌슦
                // �섏씠吏� 濡쒕뱶 �댄썑 蹂��섏� �딅뒗 媛�
                lcs_setBrowserCapa();

                if (lcs_options.nnb) {
                    lcs_setNNB();
                }

                lcs_setConnectionType();
                lcs_setNavigationTiming();

                var loadEventStart = lcs_perf["loadEventStart"] || 0;
                var loadEventEnd = lcs_perf["loadEventEnd"] || 0;

                if (loadEventEnd < loadEventStart && lcs_do_retry_count < 3) {
                    lcs_do_retry_count++;
                    lcs_waiting_pageshow = true;

                    retry();

                    return;
                }

                lcs_setPaintTiming();
                lcs_setNavigationType();
            }

            // URL �앹꽦
            for (index in lcs_bc) {
                if (typeof lcs_bc[index] !== "function")
                    rs += "&" + index + "=" + encodeURIComponent(lcs_bc[index]);
            }

            for (index in lcs_add) {
                itarVal = lcs_add[index];

                if (itarVal !== undefined && typeof itarVal !== "function") {
                    rs += "&" + index + "=" + encodeURIComponent(itarVal);
                }
            }

            if (lcs_do_count < 1) {
                for (index in lcs_perf) {
                    itarVal = lcs_perf[index];

                    if (itarVal) {
                        // except 0 for message size;
                        rs += "&" + index + "=" + encodeURIComponent(itarVal);
                    }
                }
            }

            for (index in lcs_ua) {
                itarVal = lcs_ua[index];

                if (itarVal) {
                    rs += "&" + "ua_" + index + "=" + encodeURIComponent(itarVal);
                }
            }

            // �곗꽑�쒖쐞�� �곕Ⅸ dni媛� �ㅼ젙
            var dni = !!etc.dni ? etc.dni : getCookie("NAPP_DI");

            if (!!dni) { // dni 媛믪씠 �덉쑝硫� etc�� overwrite.
                etc.dni = dni;
            } else { // dni 媛믪씠 �녿뒗 寃쎌슦 url-querystring�먯꽌 �쒖쇅
                delete etc.dni;
            }

            for (index in etc) {
                if (
                    (index.length >= 3 && typeof etc[index] !== "function") ||
                    index === "qy"
                ) {
                    rs += "&" + index + "=" + encodeURIComponent(etc[index]);
                }
            }

            // pid媛� �녿뒗 寃쎌슦 �덉쇅 泥섎━
            if (!!etc === false || !!etc.pid === false) {
                // lcs_do �몄옄濡� pid瑜� �꾨떖 諛쏆� 紐삵븳 寃쎌슦 - �대��먯꽌 �앹꽦
                var pidFallback;

                if (window.g_pid) {
                    pidFallback = g_pid;
                } else {
                    // lpid 愿��� 泥섎━
                    // pid �앹꽦
                    pidFallback = lcs_update_lpid(); // lcs_do �몄텞留덈떎 pid媛� 媛깆떊�섎룄濡� 泥섎━
                }
                // pid
                rs += "&pid=" + encodeURIComponent(pidFallback);
            }

            if(!!etc.sti){
                window.g_lcssti = etc.sti;
            }

            // From 2016.7.20, we decided to put timestamp in every lcs log's request URI.
            // The reason for this is to prevent some browser XHR(XML HTTP Request) request cache.
            // Here is the browser list doing cache like this.
            // 1. Chrome mobile
            var timeStr = new Date().getTime();
            rs += "&ts=" + timeStr;

            rs += "&EOU";

            // SEND
            if (!!navigator.sendBeacon) {
                sendByBeacon(rs);
            } else {
                sendByImage(rs);
            }

            lcs_do_count++;
        } catch (e) {
            return;
        }
    }

    function sendByBeacon(rs) {
        var parsedUrl = rs.split("?");

        navigator.sendBeacon(parsedUrl[0], parsedUrl[1]);
    }

    function sendByImage(rs) {
        (new Image()).src = rs;
    }

    function getCookie(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

        return value? value[2] : "";
    }

    // PUBLIC
    function lcs_do_gdid(gdid, etc) {
        try {
            if (gdid) {
                lcs_add["i"] = gdid;

                if (etc) {
                    lcs_do(etc);
                } else {
                    lcs_do();
                }
            }
        } catch (e) {}
    }

    function getLocalStorage() {
        var localStorage = null;

        try {
            localStorage = window.localStorage;
        } catch (e) {}

        try {
            if (!localStorage) localStorage = window.sessionStorage;
        } catch (e) {}

        return localStorage || null;
    }

    // NNB
    function lcs_setNNB() {
        try {
            var lsg = getLocalStorage();
            if (lsg) {
                if (lsg.ls) {
                    // localStorage �곗꽑�쇰줈 cookie媛� 媛깆떊�섎뒗 寃쎌슦 媛믪씠 �쇱튂�섏� �딆쓣 �� �덉쓬.
                    var lc = lsg.ls;
                    if (lc.length == 13) {
                        lcs_add["ls"] = lc;
                        return;
                    }
                }

                var nnb = lcs_getNNBfromCookie();
                if (nnb != null && nnb != "") {
                    lsg.ls = nnb;
                    lcs_add["ls"] = nnb;
                }
            }
        } catch (e) {}
    }

    // pageView 愿��� �뺣낫 �섏쭛
    function lcs_setBrowserCapa() {
        lcs_bc["os"] = lcs_getOS();

        lcs_bc["ln"] = lcs_getlanguage();

        lcs_bc["sr"] = lcs_getScreen();
        lcs_bc["pr"] = window.devicePixelRatio || 1;

        var windowSize = lcs_getWindowSize();
        lcs_bc["bw"] = windowSize["bw"];
        lcs_bc["bh"] = windowSize["bh"];

        lcs_bc["c"] = lcs_getColorDepth();

        lcs_bc["j"] = lcs_getJavaEnabled();

        lcs_bc["k"] = lcs_getCookieEnabled();
    }

    function lcs_getOS() {
        var lcs_os = "";
        try {
            navigator.platform ? (lcs_os = navigator.platform) : "";
        } catch (e) {}
        return lcs_os;
    }

    function lcs_getlanguage() {
        var lcs_ln = "";
        try {
            navigator.userLanguage
                ? (lcs_ln = navigator.userLanguage)
                : navigator.language
                    ? (lcs_ln = navigator.language)
                    : "";
        } catch (e) {}

        return lcs_ln;
    }

    function lcs_getScreen() {
        var lcs_sr = "";

        try {
            if (window.screen && screen.width && screen.height) {
                lcs_sr = screen.width + "x" + screen.height;
            } else if (window.java || self.java) {
                var sr = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
                lcs_sr = sr.width + "x" + sr.height;
            }
        } catch (e) {
            lcs_sr = "";
        }

        return lcs_sr;
    }

    function lcs_getWindowSize() {
        var doc = document;

        var size = {
            bw: "",
            bh: ""
        };

        try {
            size["bw"] = doc.documentElement.clientWidth
                ? doc.documentElement.clientWidth
                : doc.body.clientWidth;
            size["bh"] = doc.documentElement.clientHeight
                ? doc.documentElement.clientHeight
                : doc.body.clientHeight;
        } catch (e) {}

        return size;
    }

    function lcs_getColorDepth() {
        var colorDepth = "";
        try {
            if (window.screen) {
                colorDepth = screen.colorDepth ? screen.colorDepth : screen.pixelDepth;
            } else if (window.java || self.java) {
                var c = java.awt.Toolkit.getDefaultToolkit()
                    .getColorModel()
                    .getPixelSize();
                colorDepth = c;
            }
        } catch (e) {
            colorDepth = "";
        }

        return colorDepth;
    }

    function lcs_getJavaEnabled() {
        var jsEnable = "";
        try {
            jsEnable = navigator.javaEnabled() ? "Y" : "N";
        } catch (e) {}

        return jsEnable;
    }

    function lcs_getCookieEnabled() {
        var cookieEnable = "";
        try {
            cookieEnable = navigator.cookieEnabled ? "Y" : "N";
        } catch (e) {}

        return cookieEnable;
    }

    function lcs_getNNBfromCookie() {
        try {
            var ck = document.cookie;
            var k,
                v,
                i,
                ArrCookies = ck.split(";");
            for (i = 0; i < ArrCookies.length; i++) {
                k = ArrCookies[i].substr(0, ArrCookies[i].indexOf("="));
                v = ArrCookies[i].substr(ArrCookies[i].indexOf("=") + 1);
                k = k.replace(/^\s+|\s+$/g, "");
                if (k == "NNB") {
                    return unescape(v);
                }
            }
        } catch (e) {}
    }

    // NetworkInformationAPI > Connection types
    // http://wicg.github.io/netinfo/#connection-types
    function lcs_setConnectionType() {
        var connection = navigator.connection;

        if (connection) {
            // android 2.2-4.3�먯꽌 �ъ슜以묒씤 spec�� 嫄몃윭�닿린 �꾪빐 type.length 泥댄겕
            // https://www.davidbcalhoun.com/2010/optimizing-based-on-connection-speed-using-navigator.connection-on-android-2.2-/
            if (connection.type && connection.type.length > 1) {
                lcs_add["ct"] = connection.type;
            }

            if (connection.effectiveType) {
                lcs_add["ect"] = connection.effectiveType;
            }
        }
    }

    // PerformanceNavigationTiming
    // MDN: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
    function lcs_setNavigationTiming() {
        var performance = window.performance || {};

        if (performance.timing) {
            var pt = performance.timing;

            for (var key in pt) {
                var value = pt[key];

                if (typeof value === "number") {
                    // toJSON �⑥닔�� �ы븿 �섎뒗 臾몄젣 + �ㅻⅨ ��寃� �붿냼媛� hasOwnProperty === false
                    lcs_perf[key] = value;
                }
            }
        }
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming
    function lcs_setPaintTiming() {
        var performance = window.performance || {};

        try {
            if (performance.getEntriesByType) {
                var performanceEntries = performance.getEntriesByType("paint");

                performanceEntries.forEach(function(performanceEntry, i, entries) {
                    var name = performanceEntry.name;

                    switch (name) {
                        case "first-paint":
                        case "first-contentful-paint":
                            lcs_perf[name] = performanceEntry.startTime;
                            break;
                        default:
                            break;
                    }
                });
            } else {
                // console.log('Performance timing isn\'t supported.');
            }
        } catch (e) {
            console.warn(e);
        }
    }

    function lcs_setNavigationType() {
        var ngt = getNavigationType();

        if (ngt !== undefined) {
            lcs_perf["ngt"] = ngt;
        }
    }

    function getNavigationType() {
        var performance = window.performance || {};

        if (performance.navigation) {
            return performance.navigation.type;
        }

        return;
    }

    // 媛숈� �섏씠吏��먯꽌 nclicks�� lcs 濡쒓렇瑜� �⑹궛�섏뿬 遺꾩꽍�� �� �덈룄濡� pageView蹂꾨줈 怨듯넻 ID瑜� 異붽��섏뿬 �쒓났
    // lcs �꾩넚怨쇱젙�먯꽌 lpid �뚮씪硫뷀꽣濡� �� 媛믪씠 �낅뜲�댄듃 �섏뼱 �꾨떖 �쒕떎.
    var lpid = null; // lcs pid (pageview 愿���)

    function lcs_create_lpid() {
        // �좎� 媛� 援щ퀎
        var uaID;
        var lsg = getLocalStorage();
        var nnb = lsg ? lsg.ls : null;

        if (nnb) {
            uaID = nnb;
        } else {
            var nnbFallback; // UA + random

            nnbFallback = navigator.userAgent + Math.random();
            uaID = nnbFallback;
        }

        // �섏씠吏� 媛� 援щ퀎
        var performance = window.performance || {};
        var pageURL = location.href;
        var currentTime;
        if (performance.now) {
            currentTime = performance.now();
        } else {
            currentTime = new Date().getTime();
        }

        lpid = hashFunction.md5(uaID + pageURL + currentTime);

        return lpid;
    }

    function lcs_get_lpid() {
        if (lpid === null) {
            lpid = lcs_create_lpid();
        }

        return lpid;
    }

    function lcs_update_lpid() {
        lpid = lcs_create_lpid();

        return lpid;
    }

    function lcs_setUserAgentData() {
        try {
            if (typeof navigator === "undefined" || !navigator || !navigator.userAgentData) {
                return false;
            }

            var userAgentData = navigator.userAgentData;
            var brands = userAgentData.uaList || userAgentData.brands;
            var highEntropyValues = [
                "architecture",
                "model",
                "platform",
                "platformVersion",
                "uaFullVersion",
            ];

            lcs_ua["mobile"] = userAgentData.mobile;

            for (var i = 0, brandsLength = brands.length; i < brandsLength; i++) {
                for (var key in brands[i]) {
                    lcs_ua[key + "_" + i] = brands[i][key];
                }
            }

            navigator.userAgentData.getHighEntropyValues(highEntropyValues).then(function(info) {
                for (var key in highEntropyValues) {
                    var val = highEntropyValues[key];
                    lcs_ua[val] = info[val] || "";
                }
            });
        } catch(e) {
            console.warn(e);
        }
    }

    // cross-origin媛� message �섏떊 泥섎━
    function lcs_registMessageHandler() {
        var allowedOrigins = window.lcs_allowedOrigin; //�섏떊�� �덉슜�� origin

        if (Object.prototype.toString.call(allowedOrigins) !== "[object Array]") return;

        function isAllowedOrigin(origin) {
            var isAllowed = false;

            for (var i = 0, len = allowedOrigins.length; i < len; i++) {
                if (origin === allowedOrigins[i]) {
                    isAllowed = true;
                    break;
                }
            }

            return isAllowed;
        }

        window.addEventListener("message", function(event) {
            if (isAllowedOrigin(event.origin) && event.data == "getLCSInfo") {
                event.source.postMessage(JSON.stringify({
                    "g_lcsurl" : window.g_lcsurl || "",
                    "g_lcssti" : window.g_lcssti || "",
                    "lcs_get_lpid" : window.lcs_get_lpid() || ""
                }), event.origin);
            }
        }, false);
    }

    // �몃� �쇱씠釉뚮윭由� (TODO: bundle 媛쒕컻 �섍꼍 援ъ텞 �꾩슂)
    // MD5 hashfunction
    var hashFunction = {};

    (function(exportTarget) {
        /*
             * JavaScript MD5
             * https://github.com/blueimp/JavaScript-MD5
             *
             * Copyright 2011, Sebastian Tschan
             * https://blueimp.net
             *
             * Licensed under the MIT license:
             * https://opensource.org/licenses/MIT
             *
             * Based on
             * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
             * Digest Algorithm, as defined in RFC 1321.
             * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
             * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
             * Distributed under the BSD License
             * See http://pajhome.org.uk/crypt/md5 for more info.
             */
        /*
             * Add integers, wrapping at 2^32. This uses 16-bit operations internally
             * to work around bugs in some JS interpreters.
             */
        function safeAdd(x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        }

        /*
             * Bitwise rotate a 32-bit number to the left.
             */
        function bitRotateLeft(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
             * These functions implement the four basic operations the algorithm uses.
             */
        function md5cmn(q, a, b, x, s, t) {
            return safeAdd(
                bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s),
                b
            );
        }

        function md5ff(a, b, c, d, x, s, t) {
            return md5cmn((b & c) | (~b & d), a, b, x, s, t);
        }

        function md5gg(a, b, c, d, x, s, t) {
            return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
        }

        function md5hh(a, b, c, d, x, s, t) {
            return md5cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5ii(a, b, c, d, x, s, t) {
            return md5cmn(c ^ (b | ~d), a, b, x, s, t);
        }

        /*
             * Calculate the MD5 of an array of little-endian words, and a bit length.
             */
        function binlMD5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << len % 32;
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var i;
            var olda;
            var oldb;
            var oldc;
            var oldd;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (i = 0; i < x.length; i += 16) {
                olda = a;
                oldb = b;
                oldc = c;
                oldd = d;

                a = md5ff(a, b, c, d, x[i], 7, -680876936);
                d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5gg(b, c, d, a, x[i], 20, -373897302);
                a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5hh(d, a, b, c, x[i], 11, -358537222);
                c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = md5ii(a, b, c, d, x[i], 6, -198630844);
                d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = safeAdd(a, olda);
                b = safeAdd(b, oldb);
                c = safeAdd(c, oldc);
                d = safeAdd(d, oldd);
            }
            return [a, b, c, d];
        }

        /*
             * Convert an array of little-endian words to a string
             */
        function binl2rstr(input) {
            var i;
            var output = "";
            var length32 = input.length * 32;
            for (i = 0; i < length32; i += 8) {
                output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
            }
            return output;
        }

        /*
             * Convert a raw string to an array of little-endian words
             * Characters >255 have their high-byte silently ignored.
             */
        function rstr2binl(input) {
            var i;
            var output = [];
            output[(input.length >> 2) - 1] = undefined;
            for (i = 0; i < output.length; i += 1) {
                output[i] = 0;
            }
            var length8 = input.length * 8;
            for (i = 0; i < length8; i += 8) {
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
            }
            return output;
        }

        /*
             * Calculate the MD5 of a raw string
             */
        function rstrMD5(s) {
            return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
        }

        /*
             * Calculate the HMAC-MD5, of a key and some data (raw strings)
             */
        function rstrHMACMD5(key, data) {
            var i;
            var bkey = rstr2binl(key);
            var ipad = [];
            var opad = [];
            var hash;
            ipad[15] = opad[15] = undefined;
            if (bkey.length > 16) {
                bkey = binlMD5(bkey, key.length * 8);
            }
            for (i = 0; i < 16; i += 1) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5c5c5c5c;
            }
            hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
            return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
        }

        /*
             * Convert a raw string to a hex string
             */
        function rstr2hex(input) {
            var hexTab = "0123456789abcdef";
            var output = "";
            var x;
            var i;
            for (i = 0; i < input.length; i += 1) {
                x = input.charCodeAt(i);
                output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
            }
            return output;
        }

        /*
             * Encode a string as utf-8
             */
        function str2rstrUTF8(input) {
            return unescape(encodeURIComponent(input));
        }

        /*
             * Take string arguments and return either raw or hex encoded strings
             */
        function rawMD5(s) {
            return rstrMD5(str2rstrUTF8(s));
        }

        function hexMD5(s) {
            return rstr2hex(rawMD5(s));
        }

        function rawHMACMD5(k, d) {
            return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
        }

        function hexHMACMD5(k, d) {
            return rstr2hex(rawHMACMD5(k, d));
        }

        function md5(string, key, raw) {
            if (!key) {
                if (!raw) {
                    return hexMD5(string);
                }
                return rawMD5(string);
            }
            if (!raw) {
                return hexHMACMD5(key, string);
            }
            return rawHMACMD5(key, string);
        }

        exportTarget.md5 = md5;
    })(hashFunction);

    // PUBLIC: global export
    exportTarget.lcs_do = lcs_do;
    exportTarget.lcs_do_gdid = lcs_do_gdid;
    exportTarget.lcs_get_lpid = lcs_get_lpid; // nclick�먯꽌 李몄“
    exportTarget.lcs_update_lpid = lcs_update_lpid;
    exportTarget.lcs_version = lcs_version;
})(window);