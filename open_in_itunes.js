// ==UserScript==
// @name         找回「在 iTunes 中查看」按钮
// @namespace    https://www.iplaysoft.com
// @version      0.3
// @description  帮你找回「在 iTunes 中查看」按钮
// @author       X-Force
// @match        https://itunes.apple.com/*
// @grant        none
// ==/UserScript==

(function() {
    var url = location.href.split('#')[0];
    var regex = /\/id([0-9]+)/;
    var match = url.match(regex);
    var id = null;
    if(match!==null){
        id = match[1];
    }
    if(id!==null){
        var xurl = "itmss://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id="+id+"&mt=8&at=10laHZ";
        var mydiv = document.createElement("div");
        var html = '<style>#xf_itunes_link{display: inline-block;padding: 8px 22px;background: #228fff;color: #fff;font-size: 16px;border-radius: 6px;}#xf_itunes_link:hover{text-decoration:none}</style>';
        html = html + '<a id="xf_itunes_link" href="'+xurl+'">在 iTunes 中查看</a>';
        mydiv.innerHTML = html;
        document.getElementsByClassName("product-header")[0].appendChild(mydiv);
    }
})();
