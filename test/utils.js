
const expect = require('expect.js');
require('jsdom-global')()


// js 测试源文件
import { createIframe, isObject, objectToUrlQuery, isInQuickApp, isHuaweiPhone, isAddQuickAppScript, createQuickAppScript } from '../src/utils'


// ts 测试编译后文件
// var base = require('../src/index.ts');

describe('单元测试 开始测试工具函数', function() {
    this.timeout(1000);


    describe('测试是否是对象', function() {
        it('是对象', function() {
            expect(isObject({})).to.be(true);
        });

        it('不是对象', function() {
            expect(isObject('')).to.be(false);
        });
    });

    describe('测试对象转URL参数', function() {
        it('对象转URL参数成功', function() {
            expect(objectToUrlQuery({a:'cool', b:'good'})).to.equal('a=cool&b=good');
        });

        it('对象转URL参数,传入的非对象', function() {
            expect(objectToUrlQuery('')).to.equal('');
        });
    });


    describe('测试是否在快应用中,通过navigator.userAgent 判断', function() {
        it('不在快应用中', function() {
            expect(isInQuickApp()).to.be(false);
        });
    });

    describe('测试是否是华为手机,通过navigator.userAgent 判断', function() {
        it('不是华为手机', function() {
            expect(isHuaweiPhone()).to.be(false);
        });

        it('是华为手机', function() {
            expect(isHuaweiPhone('huawei')).to.be(true);
        });
    });

    describe('测试是否已经往HEAD标签中添加过脚本', function() {
        it('没有添加过脚本', function() {
            expect(isAddQuickAppScript()).to.equal(false);
        });
    });

    describe('测试已经往HEAD标签中添加过脚本', function() {

        it('已添加过非华为脚本', function() {
            createQuickAppScript( () => {});
            expect(isAddQuickAppScript()).to.equal(true);
        });


        it('已添加过华为脚本', function() {
            global.navigator = {
                userAgent: 'mozilla/5.0 (macintosh; intel mac os x 10_13_6) applewebkit/537.36 (khtml, like gecko) chrome/76.0.3809.100 safari/537.36 huawei'
            };
            createQuickAppScript();
            expect(isAddQuickAppScript()).to.equal(true);
        });
    });


    describe('测试动态创建iframe', function() {
        it('创建iframe', function() {
            expect(createIframe('')).to.be(true);
        });
    });
});
