module.exports = (function () {

  'use strict';

  var es = require('event-stream'),
    through2 = require('through2'),
    extend = require('extend'),
    teddy = require('teddy');

  return {

    settings: function (settings) {

      var s = extend(true, {
        setTemplateRoot: './',
        setVerbosity: 0,
        compileAtEveryRender: false
      }, settings);

      teddy.setTemplateRoot(s.setTemplateRoot);
      teddy.setVerbosity(s.setVerbosity);
      teddy.compileAtEveryRender(s.compileAtEveryRender);

      return this;
    },

    compile: function (data) {

      return through2.obj(function (file, enc, cb) {

        if (file.isNull()) {
          return cb(null, file);
        }

        var _data = data || {};

        if (file.data) {
          _data = extend(true, file.data, _data);
        }

        if (file.isBuffer()) {
          file.contents = new Buffer(teddy.render(file.contents.toString(), _data));
        }

        if (file.isStream()) {
          file.contents = file.contents.pipe(es.map(function(template, callback){
            callback(null, teddy.render(template.toString(), _data));
          }));
        }
        cb(null, file);

      });
    }
  };
})();
