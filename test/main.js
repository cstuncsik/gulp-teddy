const gulp = require('gulp');
const chai = require('chai');
const through2 = require('through2');
const Vinyl = require('vinyl');
const data = require('gulp-data');
const minify = require('html-minifier').minify;
const fs = require('fs');
const path = require('path');
const paths = {
  html: path.join(__dirname, 'fixtures', 'html'),
  data: path.join(__dirname, 'fixtures', 'data')
};
const teddy = require('../').settings({
  setTemplateRoot: paths.html
});
require('./gulpfile');

const expect = chai.expect;
const minifySettings = {
  collapseWhitespace: true
};


const createFile = (base, file, type) => {
  const filePath = path.join(base, file);

  return new Vinyl({
    cwd: __dirname,
    base: base,
    path: filePath,
    contents: (type === 'buffer') ? fs.readFileSync(filePath) : fs.createReadStream(filePath)
  });
};

describe('gulp-teddy', () => {

  it('should compile teddy template from buffer with data', done => {

    const htmlFile = createFile(paths.html, 'index.html', 'buffer');
    const stream = data(file => require(paths.data + '/' + path.basename(file.path, '.html') + '.json'));

    stream.pipe(teddy.compile({
      letters: ['a', 'b', 'c']
    }));

    stream.once('data', file => {
      expect(file.isBuffer()).to.be.true;
      expect(minify(String(file.contents), minifySettings)).to.equal(minify(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'), minifySettings));
      done();
    });

    stream.write(htmlFile);
  });

  it('should compile teddy template from stream with data', done => {

    const htmlFile = createFile(paths.html, 'index.html', 'stream');
    const stream = data(file => require(paths.data + '/' + path.basename(file.path, '.html') + '.json'));

    stream.pipe(teddy.compile({
      letters: ['a', 'b', 'c']
    }));

    stream.once('data', file => {
      expect(file.isStream()).to.be.true;
      file.contents.pipe(through2.obj((data, enc, cb) => {
        expect(minify(String(data), minifySettings)).to.equal(minify(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'), minifySettings));
        cb(null, data);
        done();
      }));
    });

    stream.write(htmlFile);
  });

  it('should compile teddy template through a gulp task', done => {
    gulp.task('compileTeddy')()
    .on('end', () => {
      fs.readFile(path.join(__dirname, 'result/index.html'), 'utf8', (err, data) => {
        if (err) return done(err);
        expect(minify(data, minifySettings)).to.equal(minify(fs.readFileSync(path.join(__dirname, 'expect/index.html'), 'utf8'), minifySettings));
        done();
      });
    });
  });

});
