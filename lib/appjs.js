const config = require('../config');
const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const babel = require('babel-core');
const UglifyJS = require("uglify-js");

const fs = new MemoryFS();
const compiler = webpack({
    entry: './app.js',
    output: {
        path: '/output',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /.vue$/,
            loader: 'vue-loader'
        },{
            test: /.js/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015'
        }]
    }
});
compiler.outputFileSystem = fs;

function handleContent(content) {
    if (config.debug) {
        return content;
    } else {
        //const a = babel.transform(content,{presets:['es2015']}).code;
        //console.log(a);
        //return a;
        return UglifyJS.minify(babel.transform(content,{presets:['es2015']}).code, {fromString: true}).code;
    }
}

exports.init = () => {
    return new Promise((resolve, reject) => {
        compiler.run(function(err, stats) {
            const content = stats.compilation.assets['bundle.js'].source();
            config.appjs = handleContent(content);
            resolve(content);
        });
        compiler.watch({ // watch options:
            aggregateTimeout: 300, // wait so long for more changes
            poll: true // use polling instead of native watchers
        }, function(err, stats) {
            const content = stats.compilation.assets['bundle.js'].source();
            config.appjs = handleContent(content);
        });
    })
}

