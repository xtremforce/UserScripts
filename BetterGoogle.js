// ==UserScript==
// @name          Better Google by X-Force
// @version       0.11.3
// @namespace     http://www.iplaysoft.com/
// @description   Keep Google Search Box on Top
// @include       *://*.google.*/search*
// @include       *://*.google.*/*q=*
// @include       *://*.google.*/webhp*
// @exclude       *://mail.google.com/*
// @require       //upcdn.b0.upaiyun.com/libs/jquery/jquery-2.0.3.min.js
// @downloadURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/BetterGoogle.js
// @updateURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/BetterGoogle.js
// @grant         none
// ==/UserScript==


//============================
// float Google Search box
//============================
var webSearchBoxId = "#tsf";
var imageSearchBoxId="#gb";//"#tphdr";
var myWindow = $(window);

$(document).keypress(function(e){
    if (e.shiftKey && e.which==63) { //Shift+?(问号)
        if(document.activeElement.id!="lst-ib" && document.activeElement.id!="gbqfq"){
            $("#lst-ib,#gbqfq").focus(function(){e.preventDefault();}).select();
        }
    }          
});
           
if($(webSearchBoxId).length>0){
    var webSearchBoxTop = $(webSearchBoxId).position().top;
    myWindow.scroll(function(event) {
            scrollTop = myWindow.scrollTop();
            if(scrollTop > webSearchBoxTop){
                if($(webSearchBoxId).css("position")!="fixed"){
                    $(webSearchBoxId).css({
                            "position": "fixed",
                            "top": "0",
                            "z-index":99999,
                            "height":"40px",
                            "width":"100%",
                            "padding-top":"10px",
                            "background-color": "#f5f5f5",
                            "border-bottom": "1px solid #ddd"
                    });
                }
            }else{
                $(webSearchBoxId).removeAttr("style");
            }
            
    });
}


if($(imageSearchBoxId).length>0){
    var imageSearchBoxTop = $(imageSearchBoxId).position().top;
    myWindow.scroll(function(event) {
        scrollTop = myWindow.scrollTop();
        if(scrollTop > imageSearchBoxTop){
            if($(imageSearchBoxId).css("position")!="fixed"){
                $(imageSearchBoxId).css({
                        "position": "fixed",
                        "top": "0",
                        "z-index":99999,
                        "border-bottom": "1px solid #ddd"
                });
            }
        }else{
            $(imageSearchBoxId).removeAttr("style");
        }
    });
}


//==========================
//   Remove Google redirect
//==========================
//source: https://chrome.google.com/webstore/detail/%E6%90%9C%E7%B4%A2%E7%9B%B4%E8%BE%BE/mkpejojlockjoldbdbbgbibeogmemjfk

var timerLoopTimes = 10

var timerForGoogleSearch;
var timerForGoogleSearchLoopTimes = 0
var timerForGoogleSearchInterval = 2000

CURRENT_URL = window.location.href;

setTimeout(rmGoogleRedirect,800)
setTimeout(rmGoogleRedirect,1200)
setTimeout(rmGoogleRedirect,1600)
timerForGoogleSearch = self.setInterval("rmGoogleRedirect()",timerForGoogleSearchInterval)

function rmGoogleRedirect() {
    links_web =         document.querySelectorAll('h3.r a[href][onmousedown]')
    links_news_in_web = document.querySelectorAll("#rso a[href][onmousedown]")
    links_img_title =   document.querySelectorAll("._LAd a[href^='http']")
    links_img_btns  =   document.querySelectorAll(".irc_butc a")
    links = []

    $.each(links_news_in_web, function(index, item){
        links.push(item);
    })
    $.each(links_web, function(index, item){
        links.push(item);
    })
    $.each(links_img_title, function(index, item){
        links.push(item);
    })
    $.each(links_img_btns, function(index, item){
        links.push(item);
    })


    if(links.length > 0) {
        for(var i = 0; i < links.length; i++) {
            var tmpLink = links[i]
            tmpLink.target = "_blank"
            if(tmpLink.removeAttribute){
                tmpLink.removeAttribute("onmousedown")
                // tmpLink.style.color = "red";
                newLink = tmpLink.cloneNode(true)
                if(tmpLink.parentNode != null) {
                    tmpLink.parentNode.replaceChild(newLink, tmpLink)   
                }
                
            }
        }
    } 

    //web+news
    tipsDiv = document.querySelector("#resultStats")
    
    if(tipsDiv != null && $(".tipsLabel").length == 0) {
        var tipsLabel = document.createElement('label'); 
        tipsLabel.setAttribute("style", "color:green")
        tipsLabel.setAttribute("class", "tipsLabel")
        tipsLabel.textContent = "转向已去除"
        tipsDiv.appendChild(tipsLabel);
    } 
    

    // img
    if(links_img_title.length > 0) {
        tipsTr = document.querySelectorAll(".irc_butc tr")
        for(i =0; i < tipsTr.length; i++) {
            if ($(tipsTr[i]).find(".tipsLabel").length > 0) {continue};
            var tipsLabel = document.createElement('td'); 
            tipsLabel.setAttribute("style", "color:#6E6E6E")
            tipsLabel.setAttribute("class", "tipsLabel")
            tipsLabel.textContent = "转向已去除"
            tipsTr[i].appendChild(tipsLabel);   
        }
    } 
}






//以前的方法
//==========================
//   Remove Google redirect
//==========================
//source: http://userscripts.org/scripts/source/183690.user.js
//name: Fuck Google

function RemoveRedirect() {
    var results;

    //for google web results
    results = document.getElementsByClassName("r");
    for (var i = 0; i < results.length; ++i) {
        var link = results[i].getElementsByTagName("a")[0];
        if (link == undefined) {
            continue;
        }
        link.removeAttribute("onmousedown");
        link.target = "_blank";
        link.rel = "external";
        console.log("remove One!");
        var reg = new RegExp('/url\\?q=(.*)&sa=U');
        var real = reg.exec(link.href);
        if (real != null) {
            link.href = real[1];
            link.target = "_blank";
            link.rel = "external";
            //console.log("find:", link.href);
        }
    }
    //for google image
    
    /*
    results = document.getElementsByClassName("rg_l");
    for (var i = 0; i < results.length; ++i) {
        var link = results[i];
        var reg = new RegExp("imgrefurl=(.*)&docid");
        var real = reg.exec(link.href);
        if (real != null) {
            link.href = real[1];
            //console.log("img:", link.href);
        }
    }
    */
    results = document.getElementsByClassName("irc_ifr");
    var mo = new MutationObserver(setImagesRealLinkMulti);
    for (var i = 0; i < results.length; ++i) {
        //results[i].addEventListener('DOMAttrModified', setImagesRealLink, false);
        mo.observe(results[i], {'attributes': true,'attributeOldValue': true});
    }
    
}

function setImagesRealLink(a){
    var reg=new RegExp('&url=(.*)&ei=');
    var match=reg.exec(a.href);
    if(match){
        var real=match[1];
        if(real){
            a.href=decodeURIComponent(real);
        }
    }
}

function setImagesRealLinkMulti() {
    var ifms = document.getElementsByClassName("irc_ifr");
    for (var i = 0; i < ifms.length; ++i) {
        var ifm = ifms[i].contentWindow;
        var a = ifm.document.getElementById("irc_mil");
        if (a) {
            setImagesRealLink(a);
            //这里试试 Wrap 个透明的A覆盖它！！！！！ 
            a.setAttribute("onclick",
                "(function(){\
alert('这里试试 Wrap 个透明的A覆盖它！！！！！ ');\
                var reg=new RegExp('&url=(.*)&ei=');\
                var match=reg.exec(this.href);\
                if(match){\
                    var real=match[1];\
                    if(real){\
                        this.href=decodeURIComponent(real);\
                    }\
                }\
                })();"
            );
            
        }
        
    }
    
    var fsl = document.getElementsByClassName("irc_fsl");
    for (var i = 0; i < fsl.length; ++i) {
        if (fsl[i]) {
            setImagesRealLink(fsl[i]);
           fsl[i].setAttribute("onclick",
                "(function(){\
                var reg=new RegExp('&url=(.*)&ei=');\
                var match=reg.exec(this.href);\
                if(match){\
                    var real=match[1];\
                    if(real){\
                        this.href=decodeURIComponent(real);\
                    }\
                }\
                })();"
            );
        }
    }
    
}

//by xforce
//已经有插件使用了
//waitForKeyElements("#ires", RemoveRedirect);


/*--- waitForKeyElements():  A handy, utility function that
 *    does what it says.
 */
function waitForKeyElements(
    selectorTxt,
    /* Required: The jQuery selector string that
    specifies the desired element(s).
*/
    actionFunction,
    /* Required: The code to run when elements are
found. It is passed a jNode to the matched
element.
*/
    bWaitOnce,
    /* Optional: If false, will continue to scan for
new elements even after the first match is
found.
*/
    iframeSelector
    /* Optional: If set, identifies the iframe to
search.
*/
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        /*--- Found target node(s).  Go through each and act if they
         *            are new.
         */
        targetNodes.each(function() {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                actionFunction(jThis);
                jThis.data('alreadyFound', true);
            }
        });
        btargetsFound = true;
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey]
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function() {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                500
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}