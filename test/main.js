'use strict';
var gutil = require('gulp-util'),
    should = require('should'),
    fs = require('fs'),
    path = require('path'),
    teddy = require('../');

function createVinyl(htmlFileName, contents) {
    var base = path.join(__dirname, 'fixtures');
    var filePath = path.join(base, htmlFileName);

    return new gutil.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: contents || fs.readFileSync(filePath)
    });
}

it('should compile teddy templates', function(cb) {
    var htmlFile = createVinyl('index.html'),
        stream = teddy({
            templateRoot: 'test/fixtures/'
        });

    stream.on('data', function(compiledFile) {
        should.exist(compiledFile);
        should.exist(compiledFile.path);
        should.exist(compiledFile.relative);
        should.exist(compiledFile.contents);
        compiledFile.path.should.equal(path.join(__dirname, 'fixtures', 'index.html'));
        String(compiledFile.contents).should.equal(
          fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'));
        cb();
    });
    stream.write(htmlFile);
});
