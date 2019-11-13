var url = require('url');
var request = require('request');

var auth = {
    getToken: function () {
        return new Promise(function (resolve, reject) {
            var fullUrl = url.resolve('http://localhost:3000', '/token');
            request.get({ url: fullUrl}, function (err, httpResponse, body) {
                let b = JSON.parse(body);
                if (b.status == 'ok') {
                    resolve (b);                    
                } else {
                    reject(b);                    
                }
            });
        });
    }
};

module.exports = auth;