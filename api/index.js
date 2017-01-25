var fetch = require('isomorphic-fetch');

exports.updateTpls = function() {
}

exports.chooseImg = function() {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                resolve(res.localIds[0]);
            }
        })
    })
}

exports.wxUploadImg = function(localId) {
    return new Promise((resolve, reject) => {
        wx.uploadImage({
            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                resolve(res.serverId);
            }
        })
    })
}

function postRequest(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    .then(json => {
        if (json.code) {
            return Promise.reject(json.msg);
        } else {
            return json.data;
        }
    });
}

exports.uploadImg = function(serverId) {
    return postRequest('/cgi-bin/uploadImg', {serverId: serverId});
}

exports.saveImg = function(options) {
    return postRequest('/cgi-bin/saveImg', options);
}

exports.queryPost = function(options) {
    return postRequest('/cgi-bin/queryPosts', options);
}

exports.deletePost = function(id) {
    return postRequest('/cgi-bin/deletePost', {id});
}
