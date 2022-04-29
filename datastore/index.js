const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var uniqueIdCb = (err, id) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  };
  counter.getNextUniqueId(uniqueIdCb);
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      var data = _.map(files, (id) => {
        return new Promise((resolve, reject) => {
          fs.readFile(`${exports.dataDir}/${id}`, (err, content) => {
            if (!err) {
              id = id.slice(0, 5);
              var text = content.toString();
              resolve({id, text});
            } else {
              reject(err);
            }
          });
        });
      });
      Promise.all(data).then((value) => {
        callback(null, value);
      });
    }
  });

};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, text) => {
    if (err) {
      callback(err);
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
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, item) => {
    if (err) {
      callback(err);
    } else {
      if (!item) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
          if (err) {
            callback(err);
          } else {
            callback(null, { id, text });
          }
        });
      }
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, item) => {
    if (err) {
      callback(err);
    } else {
      if (!item) {
        // report an error if item not found
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
          if (err) {
            callback(err);
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
