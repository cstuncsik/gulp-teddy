const path = require('path');
const gulp = require('gulp');
const data = require('gulp-data');
const teddy = require('../').settings({
  setTemplateRoot: path.join(__dirname, 'fixtures/html')
});

gulp.task('compileTeddy', () => gulp.src(path.join(__dirname, 'fixtures/html/index.html'))
  .pipe(data(() => require(path.join(__dirname, 'fixtures/data/index.json'))))
  .pipe(teddy.compile({
    letters: ['a', 'b', 'c']
  }))
  .pipe(gulp.dest(path.join(__dirname, 'result')))
);
