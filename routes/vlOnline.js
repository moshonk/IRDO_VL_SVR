var express = require('express');
var request = require('request');
var nodecache = require('node-cache');
var router = express.Router();
var mycache = new nodecache();
var cors = require('cors');
var authUtil = require('../utils-module/lib/auth');

/* GET Authentication Token */
router.get('/', cors(), function (req, res, next) {

    let facility = req.query.mflcode;
    let cccNumber = req.query.cccNumber;

    if (facility == undefined || cccNumber == undefined) {
        res.send({status: 'fail', data: 'Missing facility code or CCC Number'});
        return;
    }

    let uri = `http://api.nascop.org/vl/ver2.0/patient/results/${facility}/${cccNumber}`; //Example 'http://api.nascop.org/vl/ver2.0/patient/results/18109/1810900028'

    //Get Authorization Token then use it to request for VL results
    authUtil.getToken().then(function (r) {
        let token = r.token;
        request.get(uri, {auth: {bearer: token}}, function (err, httpResponse, body) {

            if ( err == null && body.error == undefined) {
                res.send({status: 'ok', data: body});
            } else {
                res.send({status: 'fail', data: body});
                console.log(err);
                console.log(body);
            }
        });    
    });
});

module.exports = router;