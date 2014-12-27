var fs = require('fs');
var path = require('path');
var hw = require('headway');
var Table = require('cli-table');

//
// Storage hash. Used for keeping track of multiple
// file types and their respective counts.
//
var file_counts;

var table = new Table({
  head: ['File type', 'Count']
});

function count(args, cb, dir) {
  dir = dir || null;
  file_counts = {};

  if (!(args._.length > 0)) {
    var message = hw.parse('{red}Error: {/}{yellow}fcount expects at least one extension to be passed in.');
    return cb ? cb(message, null) : console.log(message);
  }

  copy_to_obj(args._);

  walk(dir, function(err) {
    if (err) return console.log(err);

    for (file in file_counts) {
      if (file_counts.hasOwnProperty(file)) {
        table.push([file, file_counts[file]]);
      }
    }

    if (args.d) {
      return cb ? cb(file_counts) : file_counts;
    } else {
      return cb ? cb(table.toString()) : console.log(table.toString());
    }
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

//
// Walks a path recursively calling the callback on each file.
// @param {string} dir The directory path to start traversing from.
// @param {Function} cb The function to call when fully traversed or an error occurred.
// @returns {void}
// @private
//
function walk(dir, cb) {

  var remaining = 1;

  (function traverse(dir) {

    fs.readdir(dir, function(err, list) {
      if (err) return cb(err);
      remaining--;

      list.forEach(function(file) {
        remaining++;

        var abs_path = path.resolve(dir, file);
        fs.lstat(abs_path, function (err, stat) {
          if (err) {
            remaining--;
            return cb(err);
          }

          if (stat) {
            if (stat.isDirectory()){
              // Don't traverse hidden dirs like .git or symlinks
             return isHidden(file) || stat.isSymbolicLink() ? --remaining : traverse(abs_path);
            } else {
              if (!isHidden(file)) slice_extension(abs_path);
              remaining--;
              // if this is the last file we are done
              if (!remaining) return cb(null);
            }
          }
        });
      });

      // if we finish on an empty file we
      // have to escape here
      if (!remaining) cb(null);

    });
  })(process.cwd() + (dir || ''));
}

//
// Checks to see whether a directory or file is hidden.
// @param {string} filename The directory/file.
// @returns {boolean}
// @private
//
function isHidden(filename) {
  return filename.substring(0, 1) === '.';
}

function slice_extension(abs_path) {
  var ext = path.extname(abs_path);
  var sliced = ext.slice(1, ext.length);

  if (sliced in file_counts) {
    file_counts[sliced]++;
  }

}

module.exports = count;
