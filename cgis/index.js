"use strict";
const router = require('express').Router({caseSensitive: true});

router.use(function(req, res){

    const action = req.url.substr(1).replace(/\?.*/, '');

    if (action && !~action.indexOf('/')) {

        try {
            const fn = require('./' + action);

            if (typeof fn === 'function') {
                return fn(req, res);
            }

        } catch (e) { 
            console.error(e);
            return res.json({code: 1, msg: 'action error'});
        }

    }

    res.json({code:-1, msg:"invalid action"});

});

module.exports = router;
