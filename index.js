var fs = require('fs');
var path = require('path');
var parse = require('polymer-context-free-parser/context-free-parser').parse;

var list = {};

/**
 * Generates an object where each element's name is the key, and
 * the value is the element's docs after they've been run through
 * context-free parser.
 *
 * ex:
 * 
 * {
 *   "core-ajax": { "name": "core-ajax", "description": "..." },
 *   "core-icon": { "name": "core-icon", "description": "..." },
 * }
 *
 * @param  {string} dirpath A full path to a directory containing subfolders
 * with elements. Typically this would be the path to your bower_components
 * or components dir.
 *
 * @param  {string} merge If true, elements with @extends and @mixins pragmas
 * will have that content merged into their JSON output.
 * 
 */
function buildList(dirpath, merge) {
  var dirs = fs.readdirSync(dirpath)
    .map(function(dir) {
      return path.join(dirpath, dir)
    })
    .filter(function(dir) {
      return fs.statSync(dir).isDirectory();
    });

  dirs.forEach(function(dir) {
    var filepath = path.join(dir, path.basename(dir) + '.html');
    var html = fs.readFileSync(filepath, 'utf-8');
    var entities = parse(html);
    entities.forEach(function(entity) {
      if (merge) {
        entity = merge(entity);
      }

      list[entity.name] = entity;
    });
  });
}

function merge() {
  
}

/**
 * Writes a JSON file for each element to the specified output dir
 *
 * @param  {string} output A full path to an output directory
 */
function writeFiles(output) {
  Object.keys(list).forEach(function(key) {
    var entity = list[key];
    fs.writeFileSync(path.join(output, entity.name + '.json'), JSON.stringify(entity, null, 2));
  });
}

function generate(dirpath, output, options) {
  options.merge = options.merge || false;

  buildList(dirpath, options.merge);
  writeFiles(output);
}

module.exports = generate;
