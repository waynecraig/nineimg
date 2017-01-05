var wxapi = require('../lib/wxapi');
var path = require('path');

module.exports = function(req, res) {
    var media_id = req.body.serverId;
    var file = path.join(__dirname, '../upload', media_id+'.png');
    wxapi.downloadMedia(media_id, file).then(()=>{
        res.json({code:0});
    }).catch(e=>{
        res.json({code:1, msg:e});
    });;
}
