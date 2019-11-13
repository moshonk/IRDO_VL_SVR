var express = require('express');
var request = require('request');
var nodecache = require('node-cache');
var router = express.Router();
var mycache = new nodecache();
var cors = require('cors');

/* GET Authentication Token */
router.get('/', cors(), function (req, res, next) {

    let token = getCachedAuthenticationToken();
    if (token == undefined) {
        data = { 'email': 'moses.wabwile@impact-rdo.org', 'password': 's8p1ql4fkeyrzJwK' };
        request.post({ url: 'https://api.nascop.org/auth/ver2.0/login', form: data }, function (err, httpResponse, body) {
            if (body.status == 'ok' && body.data.error == undefined) {
                mycache.set('token', body.token, 21500); //ttl of 6 hours
                res.send({status: 'ok', token: body.data});
            } else {
                res.send({status: 'fail', message: body.data.error.message});
            }
        });
    } else {
        res.send({'status': 'ok', 'token': token});
    }

});

function getCachedAuthenticationToken() {
    
    //var token = mycache.get('token');
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkubmFzY29wLm9yZ1wvYXV0aFwvdmVyMi4wXC9sb2dpbiIsImlhdCI6MTU3MzY0MjA2NCwiZXhwIjoxNTczNjQ1NjY0LCJuYmYiOjE1NzM2NDIwNjQsImp0aSI6IkNwZW5Gbkh1UDE0WnQ3R1MiLCJzdWIiOjEwLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.9vfplDLEouyzD1zItiGrE7jDjKOFAlaukXvmRQUb5_0';
    return token;
}

module.exports = router;
