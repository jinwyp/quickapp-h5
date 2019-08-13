var path = require('path');

var cdkit = require('cdkit');


var fromName1 = 'jslib-base';
var toName1 = 'quickapp-h5';

var fromName2 = 'yanhaijing';
var toName2 = 'jinwyp';


function getFullPath (filename) {
    return path.join(__dirname, filename)
}

var map = [
    getFullPath('package.json'),
    getFullPath('README.md'),
    getFullPath('README.zh-CN.md'),
    getFullPath('config/rollup.js'),
    getFullPath('test/browser/index.html'),
    getFullPath('demo/demo-global.html'),
];

const config = [
    {
        root: '.',
        rules: [
            {
                test: function (pathname) {
                    return map.some(function (u) {
                        return pathname.indexOf(u) > -1;
                    });
                },
                replace: [
                    {
                        from: fromName1,
                        to: toName1,
                    },
                    {
                        from: fromName2,
                        to: toName2,
                    }
                ]
            }
        ]
    },
];

cdkit.run('replace', config);
