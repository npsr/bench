#!/usr/bin/env node

var colors =    require('colors'),    
    pjson =     require('./package.json'),
    wykop =     require('./plugins/wykop'),
    route =     require('commander'),
    exec =      require('child_process').exec;

route
    .command('mirko [option] [param]')    
    .alias('m')
    .description('Browse mirko (Without parameters it display recent posts)\n'
                +'- post [post-id] : display specify post\n'
                +'- hot : hot entries')
    .action(function(option, param) {    
        if(option) {
            switch(option) {
                case 'post':
                    wykop.read({
                        method: '/entries/index/' + param + '/'
                    }, function(data) {
                        wykop.displayEntry(data);
                        process.exit(0);
                    }); 
                    break;
                case 'hot':
                    wykop.read({
                        method: '/stream/hot/'
                    }, function(data) {
                        wykop.displayMirko(data);
                        process.exit(0);
                    }); 
                    break;
                case 'add':
                    wykop.addPost({
                    
                    })
            }
            
        } else {
            wykop.read({
                method: '/stream/index/'
            }, function(data) {
                wykop.displayMirko(data);
                process.exit(0);
            });
        }
});

route
    .command('tag [tagname]')
    .alias('t')
    .description('Browse tag (Type it without #]')
    .action(function(tagname) {
        wykop.read({
            method: '/tag/index/' + tagname + '/'    
        }, function(data) {
            wykop.displayMirko(data)    
        })
    });

route.parse(process.argv);

if(!process.argv[2]) {
    console.log('Bench '.bold.magenta + 'v.' + pjson.version);
    console.log('Usage: ./bench.js <command> \n Check -h (or --help) to see more informations');
    process.exit(0);
}

process.on('uncaughtException', function (err) {
    console.log(err);
}); 
