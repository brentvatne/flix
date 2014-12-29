#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var rootdir = process.argv[2];

var exec = require('child_process').exec;
exec(rootdir + '/cordova-icon/bin/cordova-icon', function (error, stdout, stderr) {
  console.log(stdout);
});
