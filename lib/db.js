const dburl = require('../config').dburl;
const MongoClient = require('mongodb').MongoClient;

function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(dburl, (err, db) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        })
    })
}

function insert(collection, data) {
    return connect().then(db => {
        return new Promise((resolve, reject) => {
            const c = db.collection(collection);
            const handle = function (err, r) {
                if (err) {
                    reject(err);
                } else {
                    data._id = r.insertedId;
                    resolve(data);
                }
                db.close();
            }
            c.insertOne(data, handle);
        })
    })
}

function update(collection, query, modification) {
    return connect().then(db => {
        return new Promise((resolve, reject) => {
            const c = db.collection(collection);
            const handle = function (err, r) {
                if (err) {
                    reject(err);
                } else {
                    resolve(r);
                }
                db.close();
            }
            c.updateOne(query, modification, handle);
        })
    })
}

function remove(collection, query) {
    return connect().then(db => {
        return new Promise((resolve, reject) => {
            const c = db.collection(collection);
            const handle = function (err, r) {
                if (err) {
                    reject(err);
                } else {
                    resolve(r);
                }
                db.close();
            }
            c.deleteOne(query, handle);
        })
    })
}

function find(collection, query, sort, limit) {
    console.log('db.find', collection, query, sort, limit);
    return connect().then(db => {
        return new Promise((resolve, reject) => {
            const c = db.collection(collection);
            const handle = function (err, r) {
                if (err) {
                    console.error('db.find', err);
                    reject(err);
                } else {
                    console.log('db.find', 'success');
                    resolve(r);
                }
                db.close();
            }
            c.find(query, {limit, sort}).toArray(handle);
        })
    })
}

module.exports = {
    addUser: user => insert('users', user),
    getUser: _id => find('users', {_id}),
    setUser: user => update('users', {_id: user._id}, user),
    checkUser: (_id, token) => find('users', {_id, token}),
    getUsers: ids => find('users', {_id: {$in:ids}}),
    addPost: post => insert('posts', post),
    removePost: id => update('posts', {_id: id}, {'$set':{removed:1}}),
    getPost: id => {
        return find('posts', {
            _id: id, 
            removed: {'$ne':1}
        });
    },
    getList: (startTime, limit) => {
        return find('posts', {
            createTime:{'$lt':startTime||(+new Date)},
            removed: {'$ne':1}
        }, {createTime: -1}, limit||10);
    },
    getAlbum: (userId, startTime, limit) => {
        return find('posts', {
            createTime:{"$lt":startTime||(+new Date)},
            removed: {'$ne':1},
            userId: userId
        }, {createTime: -1}, limit||10);
    }
}
