const config = require('../config');
const fetch = require('isomorphic-fetch');
const db = require('./db');
const url = require('url');
const uuid = require('uuid');

const getJson = (protocol, hostname, pathname, query) => (
    fetch(url.format({protocol, hostname, pathname, query}))
        .then(r => r.json())
        .then(json => json.errcode ? Promise.reject(json.errmsg) : json)
)

const getAccessToken = code => (
    getJson('https:', 'api.weixin.qq.com', '/sns/oauth2/access_token', {
        appid: config.appID,
        secret: config.appSecret,
        code: code,
        grant_type: 'authorization_code'
    })
)

const getUserInfo = (options) => (
    getJson('https:', 'api.weixin.qq.com', '/sns/userinfo', {
        access_token: options.access_token, 
        openid: options.openid, 
        lang: 'zh_CN'
    })
)

exports.login = code => {

    return getAccessToken(code).then(getUserInfo).then(info => {
        info._id = info.openid;
        delete info.openid;
        info.token = uuid.v4();
        return db.getUser(info._id).then(res=>{
            if (res[0]) {
                return db.setUser(info);
            } else {
                return db.addUser(info);
            }
        }).then(()=>info);
    });

}

exports.checkLogin = req => {

    const id = req.cookies.id;
    const token = req.cookies.token;
    if (id && token) {
        return db.checkUser(id, token).then(res => {
            if (res[0]) {
                return res[0];
            } else {
                return Promise.reject(100);
            }
        });
    } else {
        return Promise.reject(100);
    }

}
