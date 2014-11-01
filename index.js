(function() {

    'use strict';

    var gutil = require('gulp-util'),
        through = require('through2'),
        extend = require('extend'),
        teddy = require('teddy'),
        PLUGIN_NAME = 'gulp-teddy';

    return module.exports = function(options) {

    	var defaults = extend(true, {}, options);

    	teddy.setTemplateRoot(defaults.templateRoot);

        return through.obj(function(file, enc, cb) {

            if (file.isNull()) {
                cb(null, file);
                return;
            }

            if (file.isStream()) {
                cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
                return;
            }

            var filePath = file.path;

            try {
                file.contents = new Buffer(teddy.render(filePath));
                cb(null, file);
            } catch (err) {
                cb(new gutil.PluginError(PLUGIN_NAME, err, {
                    fileName: filePath
                }));
            }
        });
    };
})();
