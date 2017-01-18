const wxapi = require('../lib/wxapi');
const path = require('path');
const account = require('../lib/account');

module.exports = function(req, res) {

    account.checkLogin(req).then(info => {

        const media_id = req.body.serverId;
        const file = path.join(__dirname, '../upload', media_id+'.png');

        wxapi.downloadMedia(media_id, file).then(()=>{
            res.json({code:0});
        }).catch(e=>{
            res.json({code:1, msg:e});
        });;

    }).catch(e=> {

        if (e === 100) {
            res.json({code: 100, msg: 'no login'});
        } else {
            console.error(e);
            res.json({code: 2, msg: e});
        }

    });
}
