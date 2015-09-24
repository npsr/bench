module.exports = {
    dep: {
        http:           require('http'),
        conf:           require('../config'),
        crypto:         require('crypto'),
        rl:             require('readline-sync'),
        toMarkdown:     require('to-markdown')
    },
    
    sign: function(method) {
        var conf = this.dep.conf.wykop
        return this.dep.crypto.createHash('md5')
                .update(conf.appSecret + 'http://' + conf.host + method + 'appkey,' + conf.appKey)
                .digest("hex");
    },
    
    parseLinks: function(body) {
        var patt = new RegExp('<a href="(.*?)">(.*?)<\/a>', 'g');
        
        while(patt.test(body)) {              
            body = body.replace(patt, '[$2]($1)');
        }
        
        return body;
    },
    
    parseBr: function(body) {
        var patt = new RegExp('(<br\ ?\/?>)+');
        
        while(patt.test(body)) {
            body = body.replace(patt, '\n');
        }
        
        return body;
    },
    
    parseCite: function(body) {
        var patt = new RegExp('<cite\s*(.*)\>(.*)</cite>');  
        
        while(patt.test(body)) {
            body = body.replace(patt, '" $2 "'.italic);    
        }
        
        return body;
    },
    
    parseSpoiler: function(body) {  
        var patt = new RegExp('<\s*\/?\s*code\s*.*?>');  
        
        while(patt.test(body)) {        
            body = body.replace(patt, '[SPOILER]\n');    
        }
        
        return body;
    },
    
    formatContent: function(body) {        
        var content;
        content = this.parseCite(body); 
        content = this.parseSpoiler(content);
        content = this.dep.toMarkdown(content);
        
        truncated = '';
        parts = content.split(' ');
        
        for(var i = 0; i < parts.length; i++) {
            truncated += i%10 === 0 && i > 0 ? parts[i] + '\n' : parts[i] + ' ';
        }
        content = truncated;
        
        return content;
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
                    if(!data.error && typeof clb === 'function') {                        
                        clb(data.meta ? data.items : data);
                    } else if(data.error) {
                        console.log('Error: '.red + data.error.message)                        
                    }                    
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
    
    renderEntry: function(entry) {        
        var sex = entry.author_sex === 'male' ? ' * '.blue : ' * '.magenta,
            author;        
        if(entry.author_group === 2) {
            author = entry.author.red.bold;
        } else if (entry.author_group === 1) {
            author = entry.author.yellow.bold;
        } else {
            author = entry.author.green.bold;
        }
        
        console.log('#' + entry.id + ' ' + author + sex + entry.date + (' +' + entry.vote_count).green); 
        console.log(this.formatContent(entry.body));
        console.log('                                                   '.strikethrough.grey);
    },
    
    displayMirko: function(entries) {        
        for(var i = 0; i < entries.length; i++) {
            this.renderEntry(entries[i]); 
        }        
    },
    
    displayEntry: function(entry) {
        this.renderEntry(entry);
        for(var i = 0; i < entry.comments.length; i++) {
            this.renderEntry(entry.comments[i]);    
        }        
    },
    
//    auth: function() {
//        var rl = this.dep.rl;
//        
//        var req = this.dep.http.request({
//            method: 'POST',
//            hostname: this.dep.conf.wykop.host,
//            path: '/user/login/' + 'appkey,' + this.dep.conf.appKey,
//            port: 80,
//            body: {
//                accountkey: this.dep.conf.wykop.accountkey
//            },
//            headers: {
//                apisign: this.sign('/user/login/'),
//                accountkey: this.dep.conf.wykop.accountkey               
//            }
//        }, function(res) {
//            console.log(req)    
//        })
//        console.log(req)
//        console.log(this.sign('/user/login/'))
//    },
    
    addPost: function() {
        console.log('Nope. You can\'t do that yet');    
    }
}