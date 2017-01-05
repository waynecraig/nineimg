var sharp = require('sharp');
var path = require('path');
const exec = require('child_process').exec;

var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var runCommand = function(cwd, cmd, env) {

    return new Promise((resolve, reject) => {

        exec(cmd, {cwd, env}, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });

    })

}

exports.generateNine = function(id, w, h, scale, x, y, W) {

    var tw = Math.round(W / scale);

    var S = tw / W;

    var _scale = scale * S;
    var _x = Math.round(x * S);
    var _y = Math.round(y * S);
    var _w = Math.round(w * _scale);
    var _h = Math.round(h * _scale);

    var buildId = createNonceStr();

    return sharp(path.join(__dirname, '../upload', id+'.png'))
    .resize(_w, _h)
    .background({r:0, g:0, b:0, alpha:0})
    .extend({
        left:Math.max(_x, 0), 
        top:Math.max(_y, 0), 
        right:Math.max(tw-_x-_w, 0), 
        bottom:Math.max(tw-_y-_h, 0)
    })
    .toFile(path.join(__dirname, '../tmp', buildId+'1.png'))
    .then(function(){
        return sharp(path.join(__dirname, '../tmp', buildId+'1.png'))
        .extract({
            left: Math.max(-_x, 0), 
            top: Math.max(-_y, 0), 
            width: tw, 
            height: tw
        })
        //.overlayWith(path.join(__dirname, '../img', tpl+'.png'))
        .toFile(path.join(__dirname, '../tmp', buildId+'2.png'))
    })
    .then(()=>runCommand(null, `mkdir -p ${path.join(__dirname, '../data', id, buildId)}`))
    .then(function(){
        return Promise.all([0,1,2,3,4,5,6,7,8].map(function(i){
            var _i = i % 3;
            var _j = Math.floor(i / 3);
            var _d = Math.floor(tw / 3);
            return sharp(path.join(__dirname, '../tmp', buildId+'2.png'))
            .extract({
                left: _i * _d,
                top: _j * _d,
                width: _d,
                height: _d
            })
            .toFile(path.join(__dirname, '../data', id, buildId, (i+1)+'.png'))
        }));
    })
    .then(function(){
        setTimeout(function(){
            runCommand(null, `rm ${path.join(__dirname, '../tmp', buildId+'1.png')}`);
            runCommand(null, `rm ${path.join(__dirname, '../tmp', buildId+'2.png')}`);
        }, 1000);
    })
    .then(function(){return buildId});

}
