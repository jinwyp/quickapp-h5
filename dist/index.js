/*!
 * quickapp-h5 0.1.0 (https://github.com/jinwyp/quickapp-h5)
 * API https://github.com/jinwyp/quickapp-h5/blob/master/doc/api.md
 * Copyright 2017-2019 jinwyp. All Rights Reserved
 * Licensed under MIT (https://github.com/jinwyp/quickapp-h5/blob/master/LICENSE)
 */

'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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
var quickAppScriptId = 'quickAppScript';

function isObject(obj) {
  var type = _typeof(obj);

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

  var queryArray = [];

  for (var key in params) {
    queryArray.push(key + '=' + encodeURIComponent(params[key]));
  }

  return queryArray.join('&');
}

function isHuaweiPhone(userAgentCustom) {
  userAgentCustom = userAgentCustom || ''; // const tempUserAgentPC = 'mozilla/5.0 (macintosh; intel mac os x 10_13_6) applewebkit/537.36 (khtml, like gecko) chrome/76.0.3809.100 safari/537.36';

  var regexHuawei = /huawei|honor/;
  var userAgentLowerCase = userAgentCustom.toLowerCase() || navigator.userAgent.toLowerCase();

  if (regexHuawei.test(userAgentLowerCase)) {
    return true;
  }

  return false;
}

function isAddQuickAppScript() {
  var quickAppScript = document.getElementById(quickAppScriptId);

  if (quickAppScript) {
    return true;
  }

  return false;
}

function createQuickAppScript(callback) {
  callback = callback || function () {};

  var commonScriptUrl = 'https://statres.quickapp.cn/quickapp/js/routerinline.min.js';
  var huaweiScriptUrl = 'https://appimg.dbankcdn.com/hwmarket/files/fastapp/router.fastapp.js';

  if (!isAddQuickAppScript()) {
    var script = document.createElement('script');
    script.setAttribute('id', quickAppScriptId);
    script.type = 'text/javascript';

    if (isHuaweiPhone()) {
      script.src = huaweiScriptUrl;
    } else {
      script.src = commonScriptUrl;
    }

    script.onload = function () {
      callback();
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

function createIframe(url) {
  var div = document.createElement('div');
  div.style.visibility = 'hidden';
  div.style.width = '1px';
  div.style.height = '1px';
  div.innerHTML = '<iframe id="deeplink" src = "' + url + '"  scrolling = "no" width = "1" height = "1"></iframe>';
  document.body.appendChild(div);
  return true;
}

var QuickApp =
/*#__PURE__*/
function () {
  function QuickApp() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      packageName: 'com.linksure.tt.quickapp',
      sourceName: ''
    };

    _classCallCheck(this, QuickApp);

    this.config = config;
    createQuickAppScript();
  }

  _createClass(QuickApp, [{
    key: "showError",
    value: function showError(message) {
      console.warn('QuickApp error: ', message);
    }
  }, {
    key: "showInfo",
    value: function showInfo(message, name) {
      name = name || '';
      console.log('QuickApp debug: ' + name, message);
    }
  }, {
    key: "open",
    value: function open(options) {
      if (!isObject(options)) {
        this.showError('options must be a object!');
        return;
      }

      if (!options.path) {
        this.showError('options.path is required fields!');
        return;
      }

      if (!/^\//.test(options.path)) {
        this.showError('options.path must start with /!');
        return;
      }

      if (options.params && !isObject(options.params)) {
        this.showError('options.params must be a object!');
        return;
      }

      if (!isInQuickApp) {
        this.showError('请在快应用外的网页中使用!');
        return;
      }

      if (!options.packageName) {
        options.packageName = this.config.packageName;
      }

      if (options.openType && options.openType === 'url') {
        this.openAppRouter(options);
      } else if (options.openType && options.openType === 'deeplink') {
        this.openDeepLink(options);
      } else {
        this.openAppRouter(options);
        this.openDeepLink(options);
      }

      return true;
    }
  }, {
    key: "openAppRouter",
    value: function openAppRouter(options) {
      // https://doc.quickapp.cn/tutorial/platform/url-jump-configuration.html
      var isRun = this.openAppRouterOnce(options);
      var stopIntervalId;

      function loopInterval(optionsLoop) {
        var _this = this;

        stopIntervalId = setTimeout(function () {
          if (typeof window.appRouter !== 'undefined') {
            clearTimeout(stopIntervalId);

            _this.openAppRouterOnce(optionsLoop);
          } else {
            loopInterval(optionsLoop);
          }
        }, 600);
      }

      if (!isRun) {
        loopInterval(options);
      }
    }
  }, {
    key: "openAppRouterOnce",
    value: function openAppRouterOnce(options) {
      if (typeof window.appRouter !== 'undefined') {
        this.showInfo(options, 'URL appRouter 方式跳转: ');

        if (options.confirm) {
          window.appRouter(options.packageName, options.path, options.params, options.confirm);
        } else {
          window.appRouter(options.packageName, options.path, options.params);
        }

        return true;
      }

      return false;
    }
  }, {
    key: "openDeepLink",
    value: function openDeepLink(options) {
      // https://doc.quickapp.cn/tutorial/platform/deeplink.html
      var deepLinkUrl = 'hap://app/' + options.packageName + options.path + '?' + objectToUrlQuery(options.params);
      this.showInfo(deepLinkUrl, 'Deeplink hap 方式跳转: ');
      createIframe(deepLinkUrl);
    }
  }]);

  return QuickApp;
}();

module.exports = QuickApp;
