#!/usr/bin/env node

var colors =    require('colors'),    
    pjson =     require('./package.json'),
    wykop =     require('./plugins/wykop'),
    route =     require('commander'),
    exec = require('child_process').exec;

console.log('Bench '.bold.magenta + 'v.' + pjson.version);

route
    .command('mirko [post]')
    .alias('m')
    .description('Command for mirko usage')
    .action(function(post) {        
        if(typeof post === 'undefined') {        
            wykop.read({
                method: '/stream/index/'
            }, function(data) {
                wykop.displayMirko(data);
                process.exit(0);
            });
        } else {
            wykop.read({
                method: '/entries/index/' + post + '/'
            }, function(data) {
                wykop.displayEntry(data);
                process.exit(0);
            }); 
        }
    });

route.parse(process.argv);

if(!process.argv[2]) {
    console.log('Ale, że co? Podaj jakiś argument.'.green);
    process.exit(0);
}
