const config = require('./config');
const account = require('./lib/account');
const sign = require('./lib/sign');
const url = require('url');
const db = require('./lib/db');

const render = function(req, res) {
    const wxconfig = sign(config.jsapi_ticket, url.format({
        protocol: req.protocol,
        hostname: req.hostname,
        pathname: req.path,
        query: req.query
    }));
    res.render('index', {
        debug: config.debug,
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
}

const page = function(req, res) {
    const opt = {
        domain: 'nineimg.wumap.com',
        expires: new Date(Date.now() + 86400000 * 30),
        //secure: true
    }
    account.checkLogin(req).then(info => {
        opt.expires = 0;
        res.cookie('login', 'ok', opt);
        render(req, res);
    }).catch(()=>{
        if (!req.query.state) {
            return res.redirect('/login');
        }
        const code = req.query.code;
        if (code) {
            account.login(code).then(info => {
                res.cookie('id', info._id, opt);
                res.cookie('token', info.token, opt);
                opt.expires = 0;
                res.cookie('login', 'ok', opt);
                render(req, res);
            });
        } else {
            render(req, res);
        }
    });
};

module.exports = page;
