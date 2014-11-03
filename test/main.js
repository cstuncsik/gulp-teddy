(function() {

    'use strict';

    var gutil = require('gulp-util'),
        data = require('gulp-data'),
        should = require('should'),
        fs = require('fs'),
        path = require('path'),
        paths = {
            html: path.join(__dirname, 'fixtures', 'html'),
            data: path.join(__dirname, 'fixtures', 'data')
        },
        teddy = require('../').settings({
            setTemplateRoot: paths.html
        });

    function createVinyl(base, file, contents) {
        var filePath = path.join(base, file);

        return new gutil.File({
            cwd: __dirname,
            base: base,
            path: filePath,
            contents: contents || fs.readFileSync(filePath)
        });
    }

    it('should compile teddy template from file with data', function(cb) {

        var htmlFile = createVinyl(paths.html, 'index.html'),
            stream = data(function(file) {
                return require(paths.data + '/' + path.basename(file.path, '.html') + '.json');
            });

        stream.pipe(teddy.compile({
            letters: ['a', 'b', 'c']
        }));

        stream.on('data', function(compiledFile) {
            should.exist(compiledFile);
            should.exist(compiledFile.path);
            should.exist(compiledFile.relative);
            should.exist(compiledFile.contents);
            compiledFile.path.should.equal(path.join(paths.html, 'index.html'));
            String(compiledFile.contents).should.equal(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'));
        });

        stream.on('end', cb);

        stream.write(htmlFile);

        stream.end();
    });

})();
