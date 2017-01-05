"use strict";

var https = require('https');
var http = require('http');
var fs = require('fs');
var config = require('../config');

function getAccessToken() {
    return new Promise((resolve, reject) => {
        https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appID}&secret=${config.appSecret}`, res => {
            res.on('data', d => {
                var r = JSON.parse(d.toString());
                if (r.access_token) {
                    config.access_token = r.access_token;
                    resolve(r.access_token);
                } else {
                    reject('no access_token');
                }
            });
        }).on('error', e => {
            console.error(e);
            reject(e);
        });
    });
}

function getJsapiTicket(access_token) {
    return new Promise((resolve, reject) => {
        https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, res => {
            res.on('data', d => {
                var r = JSON.parse(d.toString());
                if (r.ticket && r.expires_in) {
                    config.jsapi_ticket = r.ticket;
                    setTimeout(init, (r.expires_in - 30) * 1000);
                    resolve();
                } else {
                    reject('no jsapi_ticket');
                }
            });
        }).on('error', e => {
            console.error(e);
            reject(e);
        });
    });
}

function downloadMedia(media_id, file) {
    return new Promise((resolve, reject) => {
        http.get(`http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=${config.access_token}&media_id=${media_id}`, res => {
            var s = fs.createWriteStream(file);
            res.pipe(s);
            s.on('finish', () => {
                resolve();
            }).on('error', e => {
                console.error(e);
                reject(e);
            });
        }).on('error', e => {
            console.error(e);
            reject(e);
        });
    });
}

var init = () => getAccessToken().then(getJsapiTicket)

exports.init = init;
exports.downloadMedia = downloadMedia;

