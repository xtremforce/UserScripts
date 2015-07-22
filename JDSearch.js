// ==UserScript==
// @name       Better JD Search by X-Force
// @namespace  http://www.iplaysoft.com
// @version    0.1.1
// @description  Better JD Search
// @author X-Force
// @downloadURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/JDSearch.js
// @updateURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/JDSearch.js
// @match      *://*.jd.com/*
// ==/UserScript==


//from http://misc.360buyimg.com/lib/js/2012/base-2011.js
new_search = function(a) {
    var b = "http://search.jd.com/Search?keyword={keyword}&enc={enc}{additional}&wtype=1&stock=1",
        c = search.additinal || "",
        d = document.getElementById(a),
        e = d.value;
    if (e = e.replace(/^\s*(.*?)\s*$/, "$1"), e.length > 100 && (e = e.substring(0, 100)), "" == e) return window.location.href = window.location.href, void 0;
    var f = 0;
    "undefined" != typeof window.pageConfig && "undefined" != typeof window.pageConfig.searchType && (f = window.pageConfig.searchType);
    var g = "&cid{level}={cid}",
        h = "string" == typeof search.cid ? search.cid : "",
        i = "string" == typeof search.cLevel ? search.cLevel : "",
        j = "string" == typeof search.ev_val ? search.ev_val : "";
    switch (f) {
        case 0:
            break;
        case 1:
            i = "-1", c += "&book=y";
            break;
        case 2:
            i = "-1", c += "&mvd=music";
            break;
        case 3:
            i = "-1", c += "&mvd=movie";
            break;
        case 4:
            i = "-1", c += "&mvd=education";
            break;
        case 5:
            var k = "&other_filters=%3Bcid1%2CL{cid1}M{cid1}[cid2]";
            switch (i) {
                case "51":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5272");
                    break;
                case "52":
                    g = k.replace(/\{cid1}/g, "5272"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}");
                    break;
                case "61":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5273");
                    break;
                case "62":
                    g = k.replace(/\{cid1}/g, "5273"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}");
                    break;
                case "71":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5274");
                    break;
                case "72":
                    g = k.replace(/\{cid1}/g, "5274"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}");
                    break;
                case "81":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5275");
                    break;
                case "82":
                    g = k.replace(/\{cid1}/g, "5275"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}")
            }
            b = "http://search.e.jd.com/searchDigitalBook?ajaxSearch=0&enc=utf-8&key={keyword}&page=1{additional}";
            break;
        case 6:
            i = "-1", b = "http://music.jd.com/8_0_desc_0_0_1_15.html?key={keyword}";
            break;
        case 7:
            b = "http://s.e.jd.com/Search?key={keyword}&enc=utf-8"
    }
    if ("string" == typeof h && "" != h && "string" == typeof i) {
        var l = /^(?:[1-8])?([1-3])$/;
        i = "-1" == i ? "" : l.test(i) ? RegExp.$1 : "";
        var m = g.replace(/\{level}/, i);
        m = m.replace(/\{cid}/g, h), c += m
    }
    "string" == typeof j && "" != j && (c += "&ev=" + j), e = encodeURIComponent(e), sUrl = b.replace(/\{keyword}/, e), sUrl = sUrl.replace(/\{enc}/, "utf-8"), sUrl = sUrl.replace(/\{additional}/, c), "undefined" != typeof $o && "undefined" != typeof $o.lastKeyword && !1 !== $o.lastKeyword && "undefined" != typeof $o.pvid && (sUrl += "&wq=" + encodeURIComponent($o.lastKeyword) + "&pvid=" + $o.pvid), ("undefined" == typeof search.isSubmitted || 0 == search.isSubmitted) && (setTimeout(function() {
        window.location.href = sUrl
    }, 10), search.isSubmitted = !0)
};



$(function(){    
    $('#key, #search-2013 .form .text').attr('onkeydown',"javascript:if(event.keyCode==13) new_search('key');");
    $('#search-2014 .form .button, #search-2013 .form .button').attr('onclick',"new_search('key');return false;");
}); 
