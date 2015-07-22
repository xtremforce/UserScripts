// ==UserScript==
// @name       No Lazy Load
// @namespace  http://www.iplaysoft.com
// @version    0.1.1
// @description  Disable images Lazy Load
// @match    *://*.jd.com/*
// @match    *://*.taobao.com/*
// @match    *://*.tmall.com/*
// @match    *://*.iapps.im/*
// @match    *://*.weixin.qq.com/*
// @match    *://blog.sina.com.cn/*
// @match    *://*.youtube.com/*
// @downloadURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/NoLazyLoad.js
// @updateURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/NoLazyLoad.js
// @run-at     document-end
// @copyright  2012, X-Force
// ==/UserScript==


//removeLazy function from https://gist.github.com/ihsoy-s/

(function() {
    // removeLazy
    //    elm: target element
    //    attr: attribute that contains real url of the image
    function removeLazy(elm, attr) {
        if (elm.getAttribute(attr) && elm.src != elm.getAttribute(attr)) {
            // copy real url
            if (elm.src == "" || elm.src == null) {
                elm.src = elm.getAttribute(attr);
            } else {
                //没有 src 标签的时候要用 setAttribute
                elm.setAttribute("src", elm.getAttribute(attr));
            }
            //
            // remove original attribute
            elm.removeAttribute(attr);
            // debug message
            console.debug("[Remove Lazy-load]: ", elm.src);
        }
    }

    function removeLazyloadProcess(img) {

        var url = window.location.href;

        if (url.indexOf(".jd.com/") != -1) {
            removeLazy(img, "data-lazyload"); //京东
            return;
        }

        if (url.indexOf(".taobao.com/") != -1 || url.indexOf(".tmall.com/") != -1) {
            removeLazy(img, "data-ks-lazyload"); //京东
            return;
        }

        if (url.indexOf(".weixin.qq.com/") != -1) {
            removeLazy(img, "data-src"); //微信
            return;
        }

        //youtube
        if (url.indexOf(".youtube.com/") != -1) {
            removeLazy(img, "data-thumb");
            return;
        }

        //sina_blog
        if (url.indexOf("://blog.sina.com.cn/") != -1) {
            removeLazy(img, "data-thumb");
            return;
        }


        //通用  
        removeLazy(img, "data-lazy-src");
        removeLazy(img, "data-original");
    }
    // replaceLazyload
    //    doc: target
    function replaceLazyload(doc) {
        var img = doc.images;
        var i;
        if (img != undefined) {
            for (i = 0; i < img.length; i++) {
                // execute removeLazy function for each lazyload attributes
                removeLazyloadProcess(img[i]);
            }
        }
    }
    // event
    function getEvent(evt) {
        //
        var st = evt.target.innerHTML;
        if (st != null) {
            evt.target.innerHTML = st.replace('data-lazyload', 'src');
        }
        // console.debug(node.innerHTML);
        //console.debug("[Replace Lazy-load] Get event:", evt.detail);
        //replaceLazyload(node);
    }
    // exec
    replaceLazyload(document);
    // exec if AutoPagerize was called
    document.body.addEventListener('DOMNodeInserted', getEvent, false);
    //document.body.addEventListener('AutoPagerize_DOMNodeInserted', getEvent, false);
}());