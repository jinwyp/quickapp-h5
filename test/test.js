
const expect = require('expect.js');
require('jsdom-global')();

// js 测试源文件
import QuickApp from '../src/index.js'


// ts 测试编译后文件
// var base = require('../src/index.ts');



describe('单元测试 开始测试快应用库', function() {
    this.timeout(1000);

    const quickApp1 = new QuickApp();

    describe('打开跳转页', function() {
        it('传入options为空', function() {
            expect(quickApp1.open()).to.be(undefined);
        });

        it('传入options.path为空', function() {
            expect(quickApp1.open( {path: ''} )).to.be(undefined);
        });

        it('传入options.path 缺少 / 开头', function() {
            expect(quickApp1.open( {path: 'index'} )).to.be(undefined);
        });

        it('传入options.params 不是对象', function() {
            expect(quickApp1.open( {path: '/index', params: 'aaa'} )).to.be(undefined);
        });

        it('传入options.openType 为 url 不带有 confirm', function() {
            expect(quickApp1.open( {path: '/index', openType: 'url'} )).to.be(true);
        });

        it('传入options.openType 为 url 带有 confirm', function() {
            expect(quickApp1.open( {path: '/index', openType: 'url', confirm: '提示信息'} )).to.be(true);
        });

        it('传入options.openType 为 deeplink', function() {
            expect(quickApp1.open( {path: '/index', openType: 'deeplink'} )).to.be(true);
        });

        it('传入options.openType 为 空', function() {
            expect(quickApp1.open( {path: '/index'} )).to.be(true);
        });
    });


});
