const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var uniqueIdCb = (err, id) => {
    if (err) {
      throw ('err');
    } else {
      fs.writeFile(`./datastore/data/${id}.txt`, text, (err) => {
        if (err) {
          throw ('err');
        } else {
          // items[countString] = text;
          callback(null, { id, text });
        }
      });
    }
  };
  counter.getNextUniqueId(uniqueIdCb);
  // counter.getNextUniqueId(uniqueIdCb)
  // fs.writeFile(directory, text, CBafterWritingTheFile)
};

exports.readAll = (callback) => {
  fs.readdir('./datastore/data', (err, files) => {
    if (err) {
      throw ('err');
    } else {
      var data = _.map(files, (id) => {
        id = id.slice(0, 5);
        var text = id;
        return { id, text };
      });
      callback(null, data);
    }
  });

};

exports.readOne = (id, callback) => {
  fs.readFile(`./datastore/data/${id}.txt`, (err, text) => {
    if (err) {
      throw ('err');
    } else {
      if (!text) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        // console.log('id', id);
        // console.log('text', text.toString());
        text = text.toString();
        callback(null, { id, text });
      }
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`./datastore/data/${id}.txt`, (err, item) => {
    if (err) {
      throw ('err');
    } else {
      if (!item) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.writeFile(`./datastore/data/${id}.txt`, text, (err) => {
          if (err) {
            throw ('err');
          } else {
            callback(null, { id, text });
          }
        });
      }
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`./datastore/data/${id}.txt`, (err, item) => {
    if (err) {
      throw ('err');
    } else {
      if (!item) {
        // report an error if item not found
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.unlink(`./datastore/data/${id}.txt`, (err) => {
          if (err) {
            throw ('err');
          } else {
            callback();
          }
        });
      }
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
