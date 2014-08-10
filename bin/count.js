#!/usr/bin/env node

var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
var count = require('../src/count.js')(argv);

// provide clean output on exceptions rather than dumping a stack trace
process.on('uncaughtException', function(err){
  console.log(chalk.red(err));
  process.exit(1);
});
