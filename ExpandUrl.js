// ==UserScript==
// @name       ExpandUrl
// @description  Expand URLs
// @namespace  http://www.iplaysoft.com
// @version    0.2.1
// @downloadURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/ExpandUrl.js
// @updateURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/ExpandUrl.js
// @match       *://*.iapps.im/*
// @match       *://sspai.com/*
// @match       *://*.smzdm.com/*
// @match       *://*.mgpyh.com/*
// @author X-Force
// ==/UserScript==


(function() {

    this.link_cache = [];
    this.ajax_queue = [];
    this.tooltip_node;
    this.tooltip_timout;
    this.modlinks_timeout;
    this.current_link;
    
    modifyShortLinks = function() {
        var links = document.evaluate("//a[@href]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var x = 0; x < links.snapshotLength; x++) {
            var a = links.snapshotItem(x);
            var href = a.href;
            
            if (href.indexOf("iapps.im/itunes/") > 0) {
                a.addEventListener('mouseover', function(e) {
                    showTooltip();
                    var url = e.target.href;
                    if(url == null)return;
                    if (url.indexOf("iapps.im/itunes/") != -1) {
                        expandLink(e.target, e);
                        //expandHeaderLocation(e.target, e);
                    }
                }, true);
                a.addEventListener('mouseout', function(e) {
                    hideTooltip();
                }, true);
            }

            //www.mgpyh.com
            if (href.indexOf("www.mgpyh.com/goods/") != -1) {
                a.addEventListener('mouseover', function(e) {
                    
                    showTooltip();
                    var url = e.target.href;
                    var obj = e.target;
                    //mgpyh 文章里的链接有点特殊，之前的方法获取不成功，需要特殊处理一下
                    if(url == null){
                        obj = e.target.parentElement;
                        url = obj.href;
                    }
                    if(url==null) return;
                    if (url.indexOf("www.mgpyh.com/goods/") != -1) {
                        expandLink(obj, e);
                    }
                }, true);
                a.addEventListener('mouseout', function(e) {
                    hideTooltip();
                }, true);
            }
            
            if (href.indexOf("sspai.com/dl/") != -1) {
                var sspai_url = a.getAttribute('data-orgurl');
                if (null != sspai_url) {
                    a.href = processUrl(sspai_url);
                }else{
                    a.addEventListener('mouseover', function(e) {
                        showTooltip();
                        var url = e.target.href;
                        if(url == null)return;
                        if (url.indexOf("sspai.com/dl/") != -1) {
                            expandLink(e.target, e);
                        }
                    }, true);
                    a.addEventListener('mouseout', function(e) {
                        hideTooltip();
                    }, true);
                }
            }

            if (href.indexOf("www.smzdm.com/URL/") != -1) {
                a.addEventListener('mouseover', function(e) {
                    showTooltip();
                    var url = e.target.href;
                    if(url == null)return;
                    if (url.indexOf("www.smzdm.com/URL/") != -1) {
                        expandSMZDM(e.target,e);
                    }
                }, true);
                a.addEventListener('mouseout', function(e) {
                    hideTooltip();
                }, true);
            }
        }
    };
    
    expandLink = function(anchor, e) {
        // URL for the API
        var api = 'http://xforce.sinaapp.com/expandurl.php';

        if (typeof(anchor.href) === 'undefined') return;
        this.current_link = anchor.href;
        // Check cache
        if (getCache(anchor.href) !== false) {
            tooltip(getCache(anchor.href), e);
            anchor.href = getCache(anchor.href);
            return;
        }
        tooltip('链接解析中...', e);
        if (enqueue(anchor.href)) {
            ajaxRequest({
                method: "POST",
                url: api,
                data:'url='+anchor.href,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    
                    var data = jsonToObject(response);
                    
                    if(data!=null && data['redirect']!=null ){

                        data['redirect'] = processUrl(data['redirect']);

                        var result = data['redirect'];
                        setCache(anchor.href, result);
                    }
                    
                    //Remove from queue
                    dequeue(anchor.href);
                    // Make sure user is still hovering over this link before updating tooltip
                    if (getCurrent() === anchor.href) {
                        tooltip(getCache(anchor.href));
                    }
                    anchor.href = data['redirect'];
                }
            });
        }
    };

    
    expandHeaderLocation = function(anchor,e){
        if (typeof(anchor.href) === 'undefined') return;
        this.current_link = anchor.href;
        // Check cache
        if (getCache(anchor.href) !== false) {
            tooltip(getCache(anchor.href), e);
            anchor.href = getCache(anchor.href);
            return;
        }
        tooltip('链接解析中...', e);
        
        var url = (anchor.href);
        var response = xhr({
            url: url,
            type:'get_redirect_url',
            async: false,
            method: 'GET',
            success: function(redirect_url) {
                if(redirect_url!=null){
                    setCache(anchor.href, redirect_url);
                    //Remove from queue
                    dequeue(anchor.href);
                    // Make sure user is still hovering over this link before updating tooltip
                    if (getCurrent() === anchor.href) {
                        tooltip(getCache(anchor.href));
                    }
                    console.debug(redirect_url);
                    anchor.href = redirect_url;
                }else{
                    console.debug("redirect_url = null");
                }
            }
        });
    }
    
    expandSMZDM = function(anchor,e){
        if (typeof(anchor.href) === 'undefined') return;
        this.current_link = anchor.href;
        // Check cache
        if (getCache(anchor.href) !== false) {
            tooltip(getCache(anchor.href), e);
            anchor.href = getCache(anchor.href);
            return;
        }
        tooltip('链接解析中...', e);
        
        var url = (anchor.href);
        var response = xhr({
            url: url,
            async: false,
            method: 'GET',
            success: function(data) {
               // console.debug(data);
                if(data =='undefined' || data == null){
                    console.debug("data = null");
                }else{
                   
                    var packer = data.match(/eval\(function\(p,a,c,k,e,d\)\{(.+)\)/g);
                    //多行匹配要用 ([\s\S])，在stackoverflow看到的
                    //match(/eval\(function\(p,a,c,k,e,d\)\{([\s\S]+)<\/script>/gm
                    
                    if(packer != null){
                        var packerString = packer[0];
                        //解密 packer
                        eval("var decodedString=String" + packerString.slice(4));
                        
                        //获取真实 URL
                        var regExp = new RegExp("smzdmhref='(.+)';","g");
                        var matches = regExp.exec(decodedString);
                        if(matches!=null){
                            targetUrl = matches[1];
                            targetUrl = processUrl(targetUrl);
                            
                            setCache(anchor.href, targetUrl);
                            //Remove from queue
                            dequeue(anchor.href);
                            // Make sure user is still hovering over this link before updating tooltip
                            if (getCurrent() === anchor.href) {
                                tooltip(getCache(anchor.href));
                            }
                            console.debug(targetUrl);
                            anchor.href = targetUrl;
                        }
  
                    }
                }
            }
        });
    }
    
    expand_via_longurl = function(anchor, e) {
        // URL for the LongURL API
        var api_endpoint = 'http://api.longurl.org/v2/';
        var script_version = '2.0';

        if (typeof(anchor.href) === 'undefined') return;
        this.current_link = anchor.href;
        // Check cache
        if (getCache(anchor.href) !== false) {
            tooltip(getCache(anchor.href), e);
            anchor.href = getCache(anchor.href);
            return;
        }
        tooltip('Expanding...', e);
        if (enqueue(anchor.href)) {
            ajaxRequest({
                method: "GET",
                url: api_endpoint + 'expand?format=json&title=1&url=' + encodeURIComponent(anchor.href),
                headers: {
                    'User-Agent': 'LongURL Mobile Expander/' + script_version + ' (Greasemonkey)'
                },
                onload: function(response) {
                    var data = jsonToObject(response);
                    // cache response
                    if (typeof(data.messages) !== 'undefined') { // There was an error
                        setCache(anchor.href, 'LongURL Error: ' + data.messages[0].message);
                    } else {
                        var result = data['long-url'];
                        /*
                        if (typeof(data['title']) !== 'undefined') {
                            result = '<strong style="font-weight: bold;">'+data['title']+'</strong><br />'+result;
                        }
                        result += ' <a href="http://longurl.org/expand?url='+encodeURIComponent(anchor.href)+'&amp;src=lme_gm" title="Get more information about this link" style="color:#00f;">[more]</a>';

                        */
                        setCache(anchor.href, result);
                    }
                    //Remove from queue
                    dequeue(anchor.href);
                    // Make sure user is still hovering over this link before updating tooltip
                    if (getCurrent() === anchor.href) {
                        tooltip(getCache(anchor.href));
                    }
                    anchor.href = data['long-url'];
                }
            });
        }
    };

    getCurrent = function() {
        return this.current_link;
    };

    setCache = function(key, value) {
        this.link_cache[escape(key)] = value;
    };

    getCache = function(key) {
        if (typeof(this.link_cache[escape(key)]) !== 'undefined') {
            return this.link_cache[escape(key)];
        }
        return false;
    };

    enqueue = function(short_url) {
        if (typeof(this.ajax_queue[escape(short_url)]) === 'undefined') {
            this.ajax_queue[escape(short_url)] = true;
            return true;
        }
        return false;
    };

    dequeue = function(short_url) {
        this.ajax_queue.splice(this.ajax_queue.indexOf(escape(short_url)), 1);
    };

    tooltip = function(text, e) {
        if (typeof(this.tooltip_node) === 'undefined') {
            // Create the tooltip element
            this.tooltip_node = document.createElement('span');
            this.tooltip_node.id = 'longurlme_tooltip';
            this.tooltip_node.style.display = 'none';
            this.tooltip_node.style.position = 'absolute';
            this.tooltip_node.style.overflow = 'hidden';
            this.tooltip_node.style.maxWidth = '300px';
            this.tooltip_node.style.backgroundColor = '#ffffc9';
            this.tooltip_node.style.border = '1px solid #c9c9c9';
            this.tooltip_node.style.padding = '3px';
            this.tooltip_node.style.fontSize = '10px';
            this.tooltip_node.style.letterSpacing = '0px';
            this.tooltip_node.style.color = '#000';
            this.tooltip_node.style.zIndex = '5000';
            this.tooltip_node.style.textAlign = 'left';
            document.body.appendChild(this.tooltip_node);
            this.tooltip_node.addEventListener('mouseover', function(e) {
                showTooltip();
            }, true);
            this.tooltip_node.addEventListener('mouseout', function(e) {
                hideTooltip();
            }, true);
        }
        if (text === false) {
            this.tooltip_node.style.display = 'none';
        } else {
            this.tooltip_node.innerHTML = text;
        }
        if (typeof(e) !== 'undefined') {
            showTooltip();
            this.tooltip_node.style.display = 'inline';
            var pos = (e) ? cursorPosition(e) : cursorPosition();
            this.tooltip_node.style.top = (pos.y + 15) + 'px';
            this.tooltip_node.style.left = (pos.x) + 'px';
        }
    };

    showTooltip = function() {
        clearTimeout(this.tooltip_timeout);
    };

    hideTooltip = function() {
        clearTimeout(this.tooltip_timeout);
        this.tooltip_timeout = setTimeout(function() {
            tooltip(false);
        }, 1000);
    };

    // cursorPosition written by Beau Hartshorne
    cursorPosition = function(e) {
            e = e || window.event;
            var position = {
                x: 0,
                y: 0
            };
            if (e.pageX || e.pageY) {
                position.x = e.pageX;
                position.y = e.pageY;
            } else {
                position.x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
                position.y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
            }
            return position;
        }

    // Greasekit did away with the GM_* functions, so for
    // compatability I have to use wrapper functions and
    // implement alternative functionality.
    setValue = function(key, value) {
        if (typeof(GM_setValue) !== 'undefined') {
            return GM_setValue(key, value);
        } else {
            document.cookie = key + '=' + encodeURIComponent(value);
        }
    };

    getValue = function(key, default_val) {
        if (typeof(GM_getValue) !== 'undefined') {
            return GM_getValue(key, default_val);
        } else {
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var x = 0; x < cookies.length; x++) {
                    var cookie = new String(cookies[x]).strip();
                    if (cookie.substring(0, key.length + 1) == (key + '=')) {
                        return decodeURIComponent(cookie.substring(key.length + 1));
                    }
                }
            }
            return default_val;
        }
    };

    ajaxRequest = function(details) {
        if (typeof(GM_xmlhttpRequest) !== 'undefined') {
            return GM_xmlhttpRequest(details);
        } else {
            json_callback = details.onload;
            var script = document.createElement('script');
            script.src = details.url + '&callback=json_callback';
            document.body.appendChild(script);
        }
    };

    jsonToObject = function(response) {
        if (typeof(response.responseText) === 'undefined') {
            return response;
        } else {
            return eval('(' + response.responseText + ')');
        }
    };

    modifiedDOMCallback = function(e) {

        if(typeof(e.relatedNode) !== 'undefined'){
           if (e.relatedNode.id === 'longurlme_tooltip') return;
        }
        clearTimeout(this.tooltip_timeout);
        this.tooltip_timeout = setTimeout(function() {
            modifyShortLinks();
        }, 500);
    };

    /*
     * Name: xhr,XmlHttpRequest AJAX封装函数
     * Description: 一个ajax调用封装类,仿jquery的ajax调用方式
     * Author:十年灯
     * Url: http://jo2.org
     */
    xhr = function() {
        var ajax = function() {
                return ('XMLHttpRequest' in window) ? function() {
                    return new XMLHttpRequest();
                } : function() {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
            }(),
            formatData = function(fd) {
                var res = '';
                for (var f in fd) {
                    res += f + '=' + fd[f] + '&';
                }
                return res.slice(0, -1);
            },
            AJAX = function(ops) {
                var root = this,
                    req = ajax();
                root.url = ops.url;
                root.type = ops.type || 'responseText';
                root.method = ops.method || 'GET';
                root.async = ops.async || true;
                root.data = ops.data || {};
                root.complete = ops.complete || function() {};
                root.success = ops.success || function() {};
                root.error = ops.error || function(s) {
                    alert(root.url + '->status:' + s + 'error!')
                };
                root.abort = req.abort;
                root.setData = function(data) {
                    for (var d in data) {
                        root.data[d] = data[d];
                    }
                }
                root.send = function() {
                    var datastring = formatData(root.data),
                        sendstring, get = false,
                        async = root.async,
                        complete = root.complete,
                        method = root.method,
                        type = root.type;
                    if (method === 'GET') {
                        if(datastring !=null){
                            root.url += '?' + datastring;
                        }
                        get = true;
                    }
                    req.open(method, root.url, async);
                    if (!get) {
                        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        sendstring = datastring;
                    }
                    //在send之前重置onreadystatechange方法,否则会出现新的同步请求会执行两次成功回调(chrome等在同步请求时也会执行onreadystatechange)
                    req.onreadystatechange = async ? function() {
                        if (req.readyState == 4) {
                            complete();
                            if (req.status == 200) {
                                if(root.type=='get_redirect_url'){
                                    root.success(req.responseURL);
                                }else{
                                    root.success(req[type]);
                                }
                            } else {
                                root.error(req.status);
                            }
                        }
                    } : null;
                    req.send(sendstring);
                    if (!async) {
                        complete();
                        root.success(req[type]);
                    }
                }
                root.url && root.send();
            };
        return function(ops) {
            return new AJAX(ops);
        }
    }();

    UrlManager=function(a){var b=this;return b.state={},b.baseurl="",b.readUrl=function(a){var c={},d=a.split("?");b.baseurl=d[0];var e=d[1];if(void 0!=e&&e.length){e=e.replace(/#$/,""),e=e.split("&");for(var f=0;f<e.length;f++){pair=e[f].split("=");var g=pair[0],h=decodeURIComponent(pair[1]);"undefined"!=typeof g&&"undefined"!=typeof h&&(g.match(/\[\]$/)?(c[g]||(c[g]={}),c[g][h]=1):c[g]=h)}b.state=c}},b.setParam=function(a,c){return a.match(/\[\]$/)?(b.state[a]||(b.state[a]={}),b.state[a][c]=1):b.state[a]=c,b.getUrl()},b.removeParam=function(a,c){return a.match(/\[\]$/)?b.state[a]&&b.state[a][c]&&delete b.state[a][c]:delete b.state[a],b.getUrl()},b.clearParam=function(a){return delete b.state[a],b.getUrl()},b.getParams=function(){return b.state},b.getParam=function(a){if(!a.match(/\[\]$/))return b.state[a];var c=[];if(b.state[a]){for(key in b.state[a])c.push(key);return c}},b.getQueryString=function(){var a=[];for(var c in b.state)if("[object Object]"==Object.prototype.toString.call(b.state[c]))for(var d in b.state[c])a.push(c+"="+encodeURIComponent(d));else a.push(c+"="+encodeURIComponent(b.state[c]));return a.join("&")},b.getUrl=function(){var a=b.getQueryString();return b.baseurl+(null==a?"":"?")+a},b.getBaseUrl=function(){return b.baseurl},null!=a&&b.readUrl(a),b};
    
    processUrl = function (url){
        
        var urlObj = UrlManager(url);
        
        if( url.indexOf('://itunes.apple.com/')>1){
            return urlObj.setParam('at','10laHZ');
        }
        if( url.indexOf('://www.amazon.cn/')>1){
            urlObj.setParam('tag','xforce');
            urlObj.removeParam('t');
            return urlObj.getUrl();
        }
        if( url.indexOf('://www.amazon.com/')>1){
            urlObj.setParam('tag','ipla-20');
            urlObj.removeParam('t');
            return urlObj.getUrl();
        }
        return url;
    }

    //该函数是用 CSS Hack 代替 DOMNodeInserted 事件失效的问题
    //详见：http://opengg.me/784/high-performance-domnodeinserted-hack/
    //http://userscripts-mirror.org/scripts/review/119622
    //
    addAnimations = function() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = 'body{\
            -webkit-animation-duration:.001s;-webkit-animation-name:playerInserted;\
            -ms-animation-duration:.001s;-ms-animation-name:playerInserted;\
            -o-animation-duration:.001s;-o-animation-name:playerInserted;\
            animation-duration:.001s;animation-name:playerInserted;}\
            @-webkit-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
            @-ms-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
            @-o-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
            @keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}';
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    init = function() {
        window.addEventListener('load', function(e) {
            if (typeof(document.body) === 'undefined') return;

            modifiedDOMCallback(e);
            document.body.addEventListener('DOMNodeInserted', modifiedDOMCallback, false);

        /*
            //为不支持 DOMNodeInserted 的网站使用 animationstart 事件
            if(window.location.href.indexOf('mgpyh.com')>0){
                document.body.addEventListener('animationstart',function(e) {
                    if(document.getElementById('longurlme_tooltip')!=null)return;
                    clearTimeout(this.tooltip_timeout);
                    this.tooltip_timeout = setTimeout(function() {
                        modifyShortLinks();
                    }, 500);
                }, false);

                addAnimations();

            }else{

                document.body.addEventListener('DOMNodeInserted', function(e) {
                    if (e.relatedNode.id === 'longurlme_tooltip') return;
                    clearTimeout(this.tooltip_timeout);
                    this.tooltip_timeout = setTimeout(function() {
                        modifyShortLinks();
                    }, 500);
                }, false);
            }

            */

        }, true);
    };

    init();
})();