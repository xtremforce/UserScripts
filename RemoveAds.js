// ==UserScript==
// @name       Remove Ads by X-Force
// @namespace   http://www.iplaysoft.com/
// @version    0.131
// @description  Remove Gmail Ads
// @match      https://mail.google.com/mail/*
// @match      http://weibo.com/*
// @match      http://www.cnbeta.com/*
// @downloadURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/RemoveAds.js
// @updateURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/RemoveAds.js
// @grant GM_addStyle
// @copyright  X-Force
// ==/UserScript==


(function() {
    if (window.top != window.self)  //don't run on frames or iframes
        return;

    if(window.location.href.indexOf('//mail.google.com/mail/')>2){
        //右侧和底部
        GM_addStyle(".oM { display:none; }");
        GM_addStyle(".Zs { display:none; }");
        //邮件列表顶部
        //GM_addStyle(".aKB { display:none; }");
        GM_addStyle(".a4T .cf { display:none; }");
        return;
    }


    if(window.location.href.indexOf('//weibo.com/')>2){
        //weibo
        //广告
        GM_addStyle("#v6_pl_content_biztips,#pl_content_biztips,#v6_pl_rightmod_ads36,#pl_rightmod_ads36,#v6_pl_rightmod_ads35,#v6_pl_ad_bottomtip,.adver_contB,.footer_adv,#v6_pl_rightmod_noticeboard { display:none; }");
        //移除会员动态 那些侧边栏
        GM_addStyle("#v6_trustPagelet_recom_member,#trustPagelet_recom_memberv5,#v6_pl_rightmod_attfeed { display:none; }");
        //移除时间线中的广告和推荐关注
        GM_addStyle('div[feedtype="ad"],div[node-type="feed_spread"] {display:none;}');
        //优化
        //GM_addStyle("#Box_right,.webim_list{display:none}");
        //GM_addStyle("#Box_center{width:824px;background:#fefefe}");
        //GM_addStyle('.WB_feed .WB_text {font-family:"PingHei";font-size: 15px;line-height: 24px;padding: 6px 0 6px;}');
        return;
    }

    if(window.location.href.indexOf('//www.cnbeta.com/')>2){
        GM_addStyle('div.mt5 div iframe,div.tal,div.cbv,div.navi,#googleAd_afc,#BAIDU_DUP_wrapper_u1240009_0,#job_box,#fixed_area,#tanxssp_con_mm_10007624_104555_13330262,#aswift_2_expand,#BAIDU_DUP_wrapper_945055_0,#BAIDU_DUP_wrapper_u1309802_0 {display:none;}');
        return;
    }
})();
