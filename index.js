var fs = require('fs');
var path = require('path');
var parse = require('polymer-context-free-parser/context-free-parser').parse;

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
function buildList(dirpath) {
  var list = {};

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
      list[entity.name] = entity;
    });
  });

  return list;
}

function mergeList(list) {
  var mergedList = {};
  for (key in list) {
    var entity = list[key];
    entity = merge(entity);
    mergedList[key] = entity;
  }
  return mergedList;
}

/**
 * Check to see if entity has @extends or @mixins pragmas
 * and merge that content into the JSON representation.
 * @param  {object} entity Element definition in JSON format
 */
function merge(entity) {
  if (entity.extends && entity.extends.length) {
    entity.extendsEntities = getExtends(entity);
  }
  // if (entity.mixins && entity.mixins.length) {
  //   var mixinEntities = getMixins(entity);
  // }
}

function getExtends(entity) {
  var parents = [];
  while (entity.extends && entity.extends.length) {
    // An element can only extend one other element
    entity = list[entity.extends[0]];
    parents.push(entity);
  }
  return parents;
}

// function getMixins(entity) {
//   var mixins = [];
//   entity.mixins.forEach(function(mixin) {
//     while (entity.mixins && entity.mixins.length) {

//     }
//   });
//   return mixins;
// }

/**
 * Writes a JSON file for each element to the specified output dir
 *
 * @param  {string} output A full path to an output directory
 */
function writeFiles(output, list) {
  Object.keys(list).forEach(function(key) {
    var entity = list[key];
    fs.writeFileSync(path.join(output, entity.name + '.json'), JSON.stringify(entity, null, 2));
  });
}

function generate(dirpath, output, options) {
  options.merge = options.merge || false;

  var list = buildList(dirpath);
  if (options.merge) {
    list = mergeList(list);
  }
  debugger;
  writeFiles(output, list);
}

module.exports = generate;
