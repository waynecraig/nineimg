const image = require('../lib/image');
const db = require('../lib/db'); 
const uuid = require('uuid');
const account = require('../lib/account');
const path = require('path');

module.exports = function(req, res) {

    account.checkLogin(req).then(info => {

        const body = req.body;
        const id = body.id;
        const w = body.w;
        const h = body.h;
        const scale = body.scale;
        const x = body.x;
        const y = body.y;
        const W = body.W;
        const userId = info._id;
        const tpl = body.tpl ? path.join(__dirname, '../', body.tpl) : null;

        image.generateNine(id, w, h, scale, x, y, W, tpl).then(buildId=>{
            return db.addPost({
                _id: uuid.v4(),
                createTime: +new Date,
                serverId: id,
                buildId,
                userId
            }).then(data => {
                res.json({code:0, data});
            });
        }).catch(e=>{
            res.json({code:1, msg:e});
        });

    }).catch(e=> {

        if (e === 100) {
            res.json({code: 100, msg: 'no login'});
        } else {
            res.json({code: 2, msg: e});
        }

    });

}
