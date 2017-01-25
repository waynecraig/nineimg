const config = require('./config');
const account = require('./lib/account');
const sign = require('./lib/sign');
const url = require('url');
const db = require('./lib/db');
const log = require('./lib/log');

const render = function(req, res) {
    const wxconfig = sign(config.jsapi_ticket, url.format({
        protocol: config.protocol,
        hostname: config.hostname,
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
    });
}

const page = function(req, res) {
    const opt = {
        domain: 'nineimg.wumap.com',
        expires: new Date(Date.now() + 86400000 * 30),
        secure: true
    }
    account.checkLogin(req).then(info => {
        opt.expires = 0;
        res.cookie('login', 'ok', opt);
        render(req, res);
        log.info('pv_ok', {userId:info._id});
    }).catch(()=>{
        if (!req.query.state) {
            log.info('pv_redirect');
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
                log.info('pv_new', {userId:info._id});
            });
        } else {
            render(req, res);
            log.info('pv_reject');
        }
    });
};

module.exports = page;
