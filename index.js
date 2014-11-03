module.exports = (function() {

    'use strict';

    var gutil = require('gulp-util'),
        through2 = require('through2'),
        extend = require('extend'),
        teddy = require('teddy'),
        PLUGIN_NAME = 'gulp-teddy';

    return {

        settings: function(settings) {

            var s = extend(true, {
                setTemplateRoot: './',
                setVerbosity: 0,
                strictParser: false,
                enableForeachTag: false,
                compileAtEveryRender: false
            }, settings);

            teddy.setTemplateRoot(s.setTemplateRoot);
            teddy.setVerbosity(s.setVerbosity);
            teddy.strictParser(s.strictParser);
            teddy.enableForeachTag(s.enableForeachTag);
            teddy.compileAtEveryRender(s.compileAtEveryRender);

            return this;
        },

        compile: function(data) {

            return through2.obj(function(file, enc, cb) {

                var _fp = file.path,
                    _data = data || {};

                if (file.isNull()) {
                    cb(null, file);
                    return;
                }

                if (file.isStream()) {
                    cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
                    return;
                }

                if (file.data) {
                    _data = extend(true, file.data, _data);
                }

                try {
                    file.contents = new Buffer(teddy.render(_fp, _data));
                    cb(null, file);
                } catch (err) {
                    cb(new gutil.PluginError(PLUGIN_NAME, err, {
                        fileName: _fp
                    }));
                }
            });
        }
    };
})();
