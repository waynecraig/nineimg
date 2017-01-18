const db = require('../lib/db'); 

module.exports = function(req, res) {

    const body = req.body;
    const id = body.id;
    const startTime = body.startTime;
    const userId = body.userId;
    const limit = body.limit;
    const userIds = body.userIds || [];

    const success = posts => {
        const ids = Array.from(new Set(posts.map(d=>d.userId))).filter(d=>!~userIds.indexOf(d));
        return db.getUsers(ids).then(users => {
            res.json({
                code: 0, 
                data:{
                    posts, 
                    users: users.map(u=>({
                        _id: u._id,
                        nickname: u.nickname,
                        headimgurl: u.headimgurl
                    }))
                }
            });
        }).catch(error);
    }

    const error = e => {
        res.json({code:1, msg:e});
    }

    if (id) {
        db.getPost(id).then(success).catch(error);
    } else if (userId) {
        db.getAlbum(userId, startTime, limit).then(success).catch(error);
    } else {
        db.getList(startTime, limit).then(success).catch(error);
    }

}
