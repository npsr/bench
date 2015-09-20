#!/usr/bin/env node

var colors =    require('colors'),
    rl =        require('readline'),
    pjson =     require('./package.json'),
    wykop =     require('./plugins/wykop');

var read = rl.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Bench '.bold.magenta + 'v.' + pjson.version);

read.question('@noname: ', function(ans){
    switch(ans) {
        case 'mirko':
            wykop.read({
                method: '/stream/index/'
            }, function(data) {
                wykop.displayMirko(data);   
            });
            break;
        default:
            console.log('Tylko mirko!'.bold.red);
            read.close();
            break;
    }
});