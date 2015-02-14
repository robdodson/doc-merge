var fs = require('fs');
var assign = require('object-assign');
var path = require('path');
var parse = require('polymer-context-free-parser/context-free-parser').parse;

function loadList(pathToConfig) {
  var list = {};
  var config;

  try {
    config = JSON.parse(fs.readFileSync(pathToConfig, 'utf-8'));
  } catch(e) {
    console.log('Unable to load config', e);
  }

  Object.keys(config).forEach(function(key) {
    var filepath = config[key];
    if (fs.existsSync(filepath)) {
      var file = fs.readFileSync(filepath, 'utf-8');
      var entities = parse(file);
      entities.forEach(function(entity) {
        list[entity.name] = entity;
        // Sneak in the location on disk as well
        list[entity.name].location = filepath;
      });
    } else {
      console.log('Unable to load file', filepath);
    }
  });

  return list;
}

function mergeList(list) {
  for (key in list) {
    merge(list[key], list);
  }
  return list;
}

// For each element, find anything that it extends or is mixed into it
// and append methods/attrs/events to the original element's documentation
function merge(entity, list) {

  function getParents(entity, memo) {
    // Remember the starting object
    if (!memo) {
      memo = entity;
      memo.inherited = {};
      memo.inherited.methods = [];
      memo.inherited.attributes = [];
      memo.inherited.events = [];
      memo.inherited.properties = [];
    }

    // Check if the entity extends another one,
    // if so, recurse
    if (entity.extends) {
      if (list[entity.extends[0].name]) {
        getParents(list[entity.extends[0].name], memo);
      } else {
        console.log(
          'Unable to find @extends',
          entity.extends[0].name,
          'from', entity.name
        );
      }
    }

    // Check if the entity mixes-in another one,
    // if so, recurse
    if (entity.mixins) {
      entity.mixins.forEach(function(mixin) {
        // Mixins are documented as Polymer.CoreResizable
        // ...for whatever reason
        var mixinName = mixin.name.replace('Polymer.', '');
        if (list[mixinName]) {
          getParents(list[mixinName], memo);
        } else {
          console.log(
            'Unable to find @mixins',
            mixinName,
            'from', entity.name
          );
        }
      });
    }

    // Check if the memo is the current object, if so,
    // we're back at the beginning and can skip to the return.
    // Otherwise, add to the original entity's methods/attrs/events
    // to the memo object
    if (memo !== entity) {
      if (entity.methods) {
        memo.inherited.methods.push({
          name: entity.name,
          methods: entity.methods
        });
      }
      if (entity.attributes) {
        memo.inherited.attributes.push({
          name: entity.name,
          attributes: entity.attributes
        });
      }
      if (entity.events) {
        memo.inherited.events.push({
          name: entity.name,
          events: entity.events
        });
      }
      if (entity.properties) {
        memo.inherited.properties.push({
          name: entity.name,
          properties: entity.properties
        });
      }
    }

    return memo;
  }

  getParents(entity);

}

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
  var settings = assign({
    // These are the defaults.
    config: null,
    merge: false
  }, options);

  var list;
  if (!settings.config) {
    throw new Error('Missing config.json file');
  } else {
    list = loadList(settings.config);
  }
  
  if (settings.merge) {
    list = mergeList(list);
  }

  writeFiles(output, list);
}

module.exports = generate;
