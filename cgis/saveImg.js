var image = require('../lib/image');

module.exports = function(req, res) {

    var body = req.body;
    var id = body.id;
    var w = body.w;
    var h = body.h;
    var scale = body.scale;
    var x = body.x;
    var y = body.y;
    var W = body.W;

    image.generateNine(id, w, h, scale, x, y, W).then(buildId=>{
        res.json({code:0, data:buildId});
    }).catch(e=>{
        console.error(e);
        res.json({code:1, msg:e});
    });

}
