var fetch = require('isomorphic-fetch');

exports.updateTpls = function() {
}

exports.uploadImg = function(serverId) {
    return fetch('./cgi-bin/uploadImg', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({serverId: serverId})
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

exports.saveImg = function(options) {
    return fetch('./cgi-bin/saveImg', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(options)
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
