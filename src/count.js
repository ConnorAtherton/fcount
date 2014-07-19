var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    Table = require('cli-table');

//
// Storage hash. Used for keeping track of multiple
// file types and their respective counts.
//
var file_counts = {};

var table = new Table({
  head: ['File type', 'Count'],
  //colWidths: [100, 200]
});

function count(extensions) {
  copy_to_obj(extensions);
  
  walk(process.cwd(), function(err) {
    if (err) throw err;

    for (file in file_counts) {
      if (file_counts.hasOwnProperty(file)) {
        table.push( [file, file_counts[file] ]);
      }
    }

    console.log(table.toString());
  });
}

//
// Copy extensions from arg array into hash.
//
function copy_to_obj(extensions) {
  var key;
  for (var i = 0, len = extensions.length; i < len; i++) {
    key = extensions[i];
    file_counts[key] = 0;
  };
}

function walk(dir, cb) {
  var file, abs_path, i = 0;

  fs.readdir(dir, function(err, list) {
    if (err) return cb(err);

    (function next () {
      file = list[i++];
      if (!file) return cb(null);

      abs_path = path.resolve(dir, file);

      fs.stat(file, function (err, stat) {

        if (stat && stat.isDirectory()) {
          walk(file, function (err) {
            next();
          });
        } else {
          slice_extension(abs_path);
          // console.log(chalk.blue('file'), chalk.red(file), chalk.green(abs_path));
          next();
        }
      });
    })();
  });
}

function slice_extension(abs_path) {
  var ext = path.extname(abs_path),
      sliced = ext.slice(1, ext.length);

  if (sliced in file_counts) {
    file_counts[sliced]++;
  }

}

module.exports = count;
