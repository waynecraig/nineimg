const config = require('../config');
const MemoryFS = require("memory-fs");
const webpack = require("webpack");

const fs = new MemoryFS();
const compiler = webpack({
    entry: './js/main',
    output: {
        path: '/output',
        filename: 'bundle.js'
    }
});
compiler.outputFileSystem = fs;

exports.init = () => {
    return new Promise((resolve, reject) => {
        compiler.run(function(err, stats) {
            const content = stats.compilation.assets['bundle.js'].source();
            config.appjs = content;
            resolve(content);
        });
        compiler.watch({ // watch options:
            aggregateTimeout: 300, // wait so long for more changes
            poll: true // use polling instead of native watchers
        }, function(err, stats) {
            const content = stats.compilation.assets['bundle.js'].source();
            config.appjs = content;
        });
    })
}

