module.exports = {
    dep: {
        http: require('http'),
        conf: require('../config'),
        crypto: require('crypto')
    },
    
    sign: function(method) {
        var conf = this.dep.conf.wykop
        return this.dep.crypto.createHash('md5')
                .update(conf.appSecret + 'http://' + conf.host + method + 'appkey,' + conf.appKey)
                .digest("hex");
    },
    
    read: function(data, clb){
        var conf = this.dep.conf.wykop,
            method = data.method;
        
        var req = this.dep.http.request({
            method: 'GET',
            hostname: conf.host,
            path: method + 'appkey,' + conf.appKey,
            port: 80,
            headers: {
                apisign: this.sign(method),
                json: true, 
                body: {}
            }
        }, function(res) {
            if(res.statusCode === 200) {
                console.log('Status 200 ... [' + 'ok'.green + ']');
                var resData = '';                
                res.on('data', function(data) {
                    resData += data;
                });
                res.on('end', function() {
                    var data = JSON.parse(resData);
                    if(!data.error && typeof clb === 'function') clb(data);
                })                
            } else {
                console.log('Status ' + res.statusCode + ' ... [' + 'fail'.red + ']');
                console.log(data);
            }
        });
        
        req.on('error', function(err) {
            console.log('Read ' + method + 'failed ... [' + 'fail'.red + ']');            
            console.log(err);
        });
        req.end();
    },
    
    displayMirko: function(entries) {
        var entry;
        for(var i = 0; i < entries.length; i++) {
            entry = entries[i];
            if(entry.author_group === 2) {
                console.log('#' + entry.id + ' ' + entry.author.red.bold + ' | ' + entry.date);
            } else if(entry.author_group === 1) {
                console.log('#' + entry.id + ' ' + entry.author.yellow.bold + ' | ' + entry.date); 
            } else {
                console.log('#' + entry.id + ' ' + entry.author.green.bold + ' | ' + entry.date);
            }
            console.log(entry.body);
            console.log('-----------------------------');
        }
    }
}