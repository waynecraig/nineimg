const db = require('../lib/db'); 
const account = require('../lib/account');

module.exports = function(req, res) {

    account.checkLogin(req).then(info => {

        const body = req.body;
        const id = body.id;

        db.getPost(id).then(posts => {
            if (posts[0] && (posts[0].userId === info._id)) {
                return db.removePost(id).then(d=>{
                    res.json({code: 0});
                });
            } else {
                return Promise.reject('permission denied');
            }
        });

    }).catch(e=>{

        if (e === 100) {
            res.json({code: 100, msg: 'no login'});
        } else {
            console.error(e);
            res.json({code: 2, msg: e});
        }

    });

}
