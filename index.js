const config = require('./config');
const wxapi = require('./lib/wxapi');
const appjs = require('./lib/appjs');
const cgis = require('./cgis');
const page = require('./page');
const url = require('url');
const log = require('./lib/log');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const http = require('http');
const https = require('https');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

//app.use('/img', express.static('./img'));
//app.use('/data', express.static('./data'));
//app.use('/thumb', express.static('./thumb'));

app.use('/cgi-bin/', cgis);

app.set('view engine', 'pug')

app.get('/list', page);
app.get('/album/:id', page);
app.get('/detail/:id', page);
app.get('/design', page);

app.get('/login', function(req, res){
    const u = url.format({
        protocol: 'https:',
        hostname: 'open.weixin.qq.com',
        pathname: '/connect/oauth2/authorize', 
        query: {
            appid: config.appID,
            redirect_uri: 'https://nineimg.wumap.com/design',
            response_type: 'code',
            scope: 'snsapi_userinfo',
            state: 'STATE'
        },
        hash: 'wechat_redirect'
    });
    res.redirect(u);
});

const json = app.response.json;
app.response.json = function(obj) {
    const url = this.req.url;
    const userId = this.req.cookies && this.req.cookies.id;
    if (obj.code === 0) {
        log.info('cgi_success', {url, userId})
    } else {
        log.error('cgi_error', {
            obj, url, userId,
            stack: obj&&obj.msg&&obj.msg.stack
        })
    }
    return json.call(this, obj);
};

process.on('uncaughtException', function (e) {
    log.error("uncaughtException", {stack: e.stack});
});

Promise.all([
    wxapi.init(),
    appjs.init()
]).then(() => {
    http.createServer(app).listen(config.port, () => {
        console.log('listening on port ' + config.port);
    })
}).catch(e=>console.error(e));
