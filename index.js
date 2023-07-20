const through2 = require('through2');
const extend = require('extend');
const teddy = require('teddy');

module.exports = {

  settings: function (settings) {

    const s = extend(true, {
      setTemplateRoot: './',
      setVerbosity: 0
    }, settings);

    teddy.setTemplateRoot(s.setTemplateRoot);
    teddy.setVerbosity(s.setVerbosity);

    return this;
  },

  compile: function (data) {

    return through2.obj((file, enc, cb) => {

      if (file.isNull()) {
        return cb(null, file);
      }

      let _data = data || {};

      if (file.data) {
        _data = extend(true, file.data, _data);
      }

      if (file.isBuffer()) {
        file.contents = Buffer.from(teddy.render(file.contents.toString(), _data));
      }

      if (file.isStream()) {
        file.contents = file.contents.pipe(through2.obj((template, enc, callback) => {
          callback(null, teddy.render(template.toString(), _data));
        }));
      }
      cb(null, file);

    });
  }
};
