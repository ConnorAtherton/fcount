#!/usr/bin/env node

var chalk = require('chalk'),
    argv = require('minimist')(process.argv.slice(2)),
    cli = require('../src/count.js')(argv._);

// provide clean output on exceptions rather than dumping a stack trace
process.on('uncaughtException', function(err){
  console.log(chalk.red(err));
  process.exit(1);
});
