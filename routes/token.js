var express = require('express');
var request = require('request');
var nodecache = require('node-cache');
var router = express.Router();
var cors = require('cors');

/* GET Authentication Token */
router.get('/', cors(), function (req, res, next) {

    let token = req.cookies.authToken; //Fetch the authentication Token from cookies
    
    if (token == undefined || token == null) {
        data = { 'email': 'moses.wabwile@impact-rdo.org', 'password': 's8p1ql4fkeyrzJwK' };
        request.post({ url: 'https://api.nascop.org/auth/ver2.0/login', form: data }, function (err, httpResponse, body) {
            body = JSON.parse(body);
            if (body.status == 'ok' && (err == null || body.data.error == undefined)) {
                res.cookie('authToken', body.token, {expire: 43200 + Date.now()}); // Set Authentication Token cookie cookie to expire after 12 hours
                res.send({status: 'ok', token: body.token});
            } else {
                res.send({status: 'fail', message: body.data.error.message});
            }
        });
    } else {
        res.send({'status': 'ok', 'token': token});
    }

});

module.exports = router;
