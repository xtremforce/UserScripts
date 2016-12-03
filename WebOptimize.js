// ==UserScript==
// @name       WebOptimize by X-Force
// @namespace   http://www.iplaysoft.com/
// @version    0.2
// @description WebOptimize
// @match      https://mail.google.com/mail/*
// @match      http://weibo.com/*
// @match      http://www.cnbeta.com/*
// @match      https://pixabay.com/*
// @match      http://www.ithome.com/*
// @match      http://*.youku.com/*
// @match      http://www.miaopai.com/*
// @match      http://www.tudou.com/*
// @downloadURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/WebOptimize.js
// @updateURL https://raw.githubusercontent.com/xtremforce/UserScripts/master/WebOptimize.js
// @grant GM_addStyle
// @copyright  X-Force
// ==/UserScript==


(function() {
    if (window.top != window.self)  //don't run on frames or iframes
        return;
    
    if(window.location.href.indexOf('//v.youku.com')>2 || window.location.href.indexOf('//v-wb.youku.com')>2){
        GM_addStyle("#playBox,#playerBox,#player{width:1186px;height:770px;padding-bottom:100px;}#player_sidebar{top:820px}");
        GM_addStyle(".vpactionv5_iframe_wrap{margin-top:350px}");
        GM_addStyle("html iframe{display:none}");
        return;
    }
    
    if(window.location.href.indexOf('//www.miaopai.com/')>2){
        GM_addStyle(".header_big{margin-bottom:710px;}.D_video{position:relative;}");
        GM_addStyle(".D_video,.video_flash,.video_img,.video,.video-player{width:1000px !important;height:700px !important;}");
        GM_addStyle(".video_flash,.video_img{position:absolute;top:-740px}");
        return;
    }
    
    if(window.location.href.indexOf('//www.tudou.com/')>2){
        GM_addStyle("#player,.player_box,.player_main{width:1120px !important;height:724px !important;}");
        GM_addStyle("html iframe{display:none}");
        return;
    }
    
    

    if(window.location.href.indexOf('//mail.google.com/mail/')>2){
        //右侧和底部
        GM_addStyle(".oM { display:none; }");
        GM_addStyle(".Zs { display:none; }");
        //邮件列表顶部
        GM_addStyle(".a2q { display:none; }");
        GM_addStyle(".a4T .cf { display:none; }");
        return;
    }


    if(window.location.href.indexOf('//weibo.com/')>2){
        
        //秒拍视频
        if(window.location.href.indexOf('//weibo.com/p/')>2){
            GM_addStyle(".WB_main{margin-top:620px}.WB_innerwrap{position:relative} ");
            GM_addStyle(".video_box{width:918px;height:600px;position:absolute;top:-620px;left:0} .video_box embed{height:600px}");
        }
        
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
    
    if(window.location.href.indexOf('//pixabay.com/')>2){
        GM_addStyle(".open_preview_img { visibility:hidden; }");
        return;
    }
    
    if(window.location.href.indexOf('www.ithome.com/')>2){
        GM_addStyle("li.cate_top,#hd_float,#side_func,#crf1,div.bx {display:none;}");
        GM_addStyle("#wrapper .content .block h2{padding: 10px 0 20px 0;font-size: 19px;}");
        if(window.location.href.indexOf('www.ithome.com/html/')>2){
            GM_addStyle("div.con-recom,div.related_buy,.shareto {display:none;}");
        }
        return;
    }
})();
