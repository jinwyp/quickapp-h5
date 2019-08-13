import { createIframe, isObject, objectToUrlQuery, isInQuickApp, createQuickAppScript } from './utils';



export default class QuickApp {
    constructor(config = {
        packageName: 'com.linksure.tt.quickapp',
        sourceName: ''
    }) {
        this.config = config;
        createQuickAppScript();
    }

    showError (message) {
        console.warn('QuickApp error: ', message);
    }

    showInfo (message, name) {
        name = name || '';
        console.log('QuickApp debug: ' + name, message);
    }


    open (options) {

        if (!isObject(options)) {
            this.showError('options must be a object!');
            return;
        }

        if (!options.path) {
            this.showError('options.path is required fields!');
            return;
        }

        if (!/^\//.test(options.path) ) {
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


    openAppRouter (options) {

        // https://doc.quickapp.cn/tutorial/platform/url-jump-configuration.html

        const isRun = this.openAppRouterOnce(options);

        let stopIntervalId;

        function loopInterval(optionsLoop) {
            stopIntervalId = setTimeout( () => {
                if ( typeof window.appRouter !== 'undefined' ) {
                    clearTimeout(stopIntervalId);
                    this.openAppRouterOnce(optionsLoop);

                } else {
                    loopInterval(optionsLoop);
                }
            }, 600);
        }

        if (!isRun) {
            loopInterval(options);
        }

    }


    openAppRouterOnce(options) {
        if ( typeof window.appRouter !== 'undefined' ) {
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


    openDeepLink (options) {

        // https://doc.quickapp.cn/tutorial/platform/deeplink.html

        let deepLinkUrl = 'hap://app/' + options.packageName + options.path + '?' +  objectToUrlQuery(options.params);

        this.showInfo(deepLinkUrl, 'Deeplink hap 方式跳转: ');

        createIframe(deepLinkUrl);
    }
}
