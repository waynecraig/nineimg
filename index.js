const config = require('./config');
const wxapi = require('./lib/wxapi');
const url = require('url');
const sign = require('./lib/sign');
const appjs = require('./lib/appjs');
const cgis = require('./cgis');

const express = require('express');
const app = express();
const minifyHTML = require('express-minify-html');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/img', express.static('./img'));
app.use('/data', express.static('./data'));
app.use('/cgi-bin/', cgis);

app.set('view engine', 'pug')

/*app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));*/


app.get('/test2', function(req, res) {
    const wxconfig = sign(config.jsapi_ticket, url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        pathname: req.originalUrl
    }));
    res.render('index', {
        debug: false,
        appID: config.appID,
        timestamp: wxconfig.timestamp,
        nonceStr: wxconfig.nonceStr,
        signature: wxconfig.signature,
        jsApiList: JSON.stringify(['chooseImage', 'uploadImage', 'downloadImage']),
        appjs: config.appjs
    }, (err, html) => {
        res.send(html);
        //res.send('<html><head></head><body><div id="test"><my v-bind:text="a"></my></div><script>' + config.appjs + '</script></body></html>');
    });
});

Promise.all([
    wxapi.init(),
    appjs.init()
]).then(() => app.listen(config.port, () => console.log('listening on port ' + config.port)))
.catch(e=>console.error(e));
