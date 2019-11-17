var request = require('request');

var auth = {
    getToken: function () {
        return new Promise(function (resolve, reject) {
            var fullUrl = 'http://localhost:50001/token';
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