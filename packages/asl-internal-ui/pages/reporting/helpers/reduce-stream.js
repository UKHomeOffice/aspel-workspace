const { pipeline } = require('stream');
const through = require('through2');

module.exports = (iterator, initial) => stream => {
  return new Promise((resolve, reject) => {
    pipeline(
      stream,
      through.obj((data, enc, callback) => {
        initial = iterator(initial, data);
        callback();
      }),
      err => {
        if (err) {
          return reject(err);
        }
        resolve(initial);
      }
    );
  });
};
