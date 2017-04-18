(function () {

  'use strict';

  var es = require('event-stream'),
    gutil = require('gulp-util'),
    data = require('gulp-data'),
    should = require('should'),
    minify = require('html-minifier').minify,
    minifySettings = {
      collapseWhitespace: true
    },
    fs = require('fs'),
    path = require('path'),
    paths = {
      html: path.join(__dirname, 'fixtures', 'html'),
      data: path.join(__dirname, 'fixtures', 'data')
    },
    teddy = require('../').settings({
      setTemplateRoot: paths.html
    });

  function createFile(base, file, type) {
    var filePath = path.join(base, file);

    return new gutil.File({
      cwd: __dirname,
      base: base,
      path: filePath,
      contents: (type === 'buffer') ? fs.readFileSync(filePath) : fs.createReadStream(filePath)
    });
  }

  it('should compile teddy template from file with data', function (cb) {

    var htmlFile = createFile(paths.html, 'index.html', 'buffer'),
      stream = data(function (file) {
        return require(paths.data + '/' + path.basename(file.path, '.html') + '.json');
      });

    stream.pipe(teddy.compile({
      letters: ['a', 'b', 'c']
    }));

    stream.once('data', function (compiledFile) {
      compiledFile.isBuffer().should.be.true();
      minify(String(compiledFile.contents), minifySettings).should.equal(minify(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'), minifySettings));
      cb();
    });

    stream.write(htmlFile);
  });

  it('should compile teddy template from stream with data', function (cb) {

    var htmlFile = createFile(paths.html, 'index.html', 'stream'),
      stream = data(function (file) {
        return require(paths.data + '/' + path.basename(file.path, '.html') + '.json');
      });

    stream.pipe(teddy.compile({
      letters: ['a', 'b', 'c']
    }));

    stream.once('data', function (compiledFile) {
      compiledFile.isStream().should.be.true();
      compiledFile.contents.pipe(es.wait(function(err, data) {
        minify(String(data), minifySettings).should.equal(minify(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'), minifySettings));
        cb();
      }));
    });

    stream.write(htmlFile);
  });

})();
