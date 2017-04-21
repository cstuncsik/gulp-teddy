require('should');

const es = require('event-stream');
const gutil = require('gulp-util');
const data = require('gulp-data');
const minify = require('html-minifier').minify;
const minifySettings = {
  collapseWhitespace: true
};
const fs = require('fs');
const path = require('path');
const paths = {
  html: path.join(__dirname, 'fixtures', 'html'),
  data: path.join(__dirname, 'fixtures', 'data')
};
const teddy = require('../').settings({
  setTemplateRoot: paths.html
});


const createFile = (base, file, type) => {
  const filePath = path.join(base, file);

  return new gutil.File({
    cwd: __dirname,
    base: base,
    path: filePath,
    contents: (type === 'buffer') ? fs.readFileSync(filePath) : fs.createReadStream(filePath)
  });
};

describe('gulp-teddy', () => {

  it('should compile teddy template from buffer with data', cb => {

    const htmlFile = createFile(paths.html, 'index.html', 'buffer');
    const stream = data(file => require(paths.data + '/' + path.basename(file.path, '.html') + '.json'));

    stream.pipe(teddy.compile({
      letters: ['a', 'b', 'c']
    }));

    stream.once('data', file => {
      file.isBuffer().should.be.true();
      minify(String(file.contents), minifySettings).should.equal(minify(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'), minifySettings));
      cb();
    });

    stream.write(htmlFile);
  });

  it('should compile teddy template from stream with data', cb => {

    const htmlFile = createFile(paths.html, 'index.html', 'stream');
    const stream = data(file => require(paths.data + '/' + path.basename(file.path, '.html') + '.json'));

    stream.pipe(teddy.compile({
      letters: ['a', 'b', 'c']
    }));

    stream.once('data', file => {
      file.isStream().should.be.true();
      file.contents.pipe(es.wait((err, data) => {
        minify(String(data), minifySettings).should.equal(minify(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'), minifySettings));
        cb();
      }));
    });

    stream.write(htmlFile);
  });

});
