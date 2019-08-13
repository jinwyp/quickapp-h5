/**
 * URL 跳转配置
 *
 * https://doc.quickapp.cn/tutorial/platform/url-jump-configuration.html
 *
 *
 *
 * 华为 需 EMUI 8.2+； 嵌入的 JS 为 //appimg.dbankcdn.com/hwmarket/files/fastapp/router.fastapp.js； 暂不支持 confirm 参数
 *
 */


const quickAppScriptId = 'quickAppScript';


function isObject(obj) {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}


function isInQuickApp() {
    // console.log('navigator.userAgent: ', navigator.userAgent);
    return /hap\//i.test(navigator.userAgent);
}


function objectToUrlQuery(params) {

    if (!isObject(params)) {
        return '';
    }

    const queryArray = [];

    for (const key in params) {
        queryArray.push(key + '=' + encodeURIComponent(params[key]));
    }
    return queryArray.join('&');
}



function isHuaweiPhone (userAgentCustom) {

    userAgentCustom = userAgentCustom || '';
    // const tempUserAgentPC = 'mozilla/5.0 (macintosh; intel mac os x 10_13_6) applewebkit/537.36 (khtml, like gecko) chrome/76.0.3809.100 safari/537.36';

    const regexHuawei = /huawei|honor/;
    const userAgentLowerCase = userAgentCustom.toLowerCase() || navigator.userAgent.toLowerCase() ;

    if ( regexHuawei.test(userAgentLowerCase)) {
        return true;
    }
    return false;
}



function isAddQuickAppScript () {
    const quickAppScript = document.getElementById(quickAppScriptId);

    if (quickAppScript) {
        return true;
    }
    return false;
}



function createQuickAppScript (callback) {

    const commonScriptUrl = 'https://statres.quickapp.cn/quickapp/js/routerinline.min.js';
    const huaweiScriptUrl = 'https://appimg.dbankcdn.com/hwmarket/files/fastapp/router.fastapp.js';

    if (!isAddQuickAppScript()) {

        const script = document.createElement('script');
        script.setAttribute('id', quickAppScriptId);
        script.type = 'text/javascript';

        if ( isHuaweiPhone() ) {
            script.src = huaweiScriptUrl;
        } else {
            script.src = commonScriptUrl;
        }

        script.onload = function (){
            callback();
        };

        document.getElementsByTagName('head')[0].appendChild(script);

    }

}



function createIframe (url) {
    const div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.style.width = '1px';
    div.style.height = '1px';
    div.innerHTML = '<iframe id="deeplink" src = "' + url + '"  scrolling = "no" width = "1" height = "1"></iframe>';
    document.body.appendChild(div);
    return true;
}



export {
    isObject,
    objectToUrlQuery,
    createIframe,
    isInQuickApp,
    isHuaweiPhone,
    isAddQuickAppScript,
    createQuickAppScript,

};
