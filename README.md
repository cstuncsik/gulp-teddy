# gulp-teddy

> Compiles [Teddy](https://github.com/kethinov/teddy) templates

## Install

```sh
$ npm install --save-dev gulp-teddy
```

## Usage

### `src/html/index.html`

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <title>Title</title>
</head>

<body>
    <include src='templates/header.html'>
        <arg mainTitle>Main title</arg>
    </include>
</body>

</html>
```

### `src/html/templates/header.html`

```html
<header>
    <if mainTitle>
        <h1>{mainTitle}</h1>
    </if>
    <else>
        <p>No main title</p>
    </else>
</header>
```

### `gulpfile.js`

```js
var gulp  = require('gulp'),
    teddy = require('gulp-teddy');

teddy.settings({
    setTemplateRoot: 'src/html/'
});

gulp.task('default', function() {
    return gulp.src(['src/html/**/*.html','!src/html/templates/**/*.html'])
    .pipe(teddy.compile())
    .pipe(gulp.dest('dist'));
});
```

### `dist/index.html`

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width" />
    <title>Title</title>
</head>

<body>
    <header>
        <h1>Main title</h1>
    </header>
</body>

</html>
```

## Passing data

### `src/html/index.html`

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <title>Title</title>
</head>

<body>
    <loop through='letters' val='letter'>
        <p>{letter}</p>
    </loop>
</body>

</html>
```

### `gulpfile.js`

#### Passing data as an object

```js
var gulp  = require('gulp'),
    teddy = require('gulp-teddy');

teddy.settings({
    setTemplateRoot: 'src/html/'
});

gulp.task('default', function() {
    return gulp.src(['src/html/**/*.html', '!src/html/templates/**/*.html'])
        .pipe(teddy.compile({
            letters: ['a', 'b', 'c']
        }))
        .pipe(gulp.dest('dist'));
});
```
#### Passing data with [gulp-data](https://github.com/colynb/gulp-data)

For example from a json file, you can use it together the above example, your data will be merged (extended)

```js
var gulp = require('gulp'),
    data = require('gulp-data'),
    path = require('path'),
    teddy = require('gulp-teddy');

teddy.settings({
    setTemplateRoot: 'src/html/templates/'
});

gulp.task('default', function() {
    return gulp.src(['src/html/**/*.html', '!src/html/templates/**/*.html'])
        .pipe(data(function(file) {
            return require('data/' + path.basename(file.path) + '.json');
        }))
        .pipe(teddy.compile({
            letters: ['a', 'b', 'c']
        }))
        .pipe(gulp.dest('dist'));
});

```

### `dist/index.html`

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width" />
    <title>Title</title>
</head>

<body>
    <p>a</p>
    <p>b</p>
    <p>c</p>
</body>

</html>
```
## API

### teddy.settings(options)

#### options

Type: `Object`

```js
{
    setTemplateRoot: './',
    setVerbosity: 0,
    strictParser: false,
    enableForeachTag: false,
    compileAtEveryRender: false
}
```
See the [Teddy docs](https://github.com/kethinov/teddy#api-documentation).

### teddy.compile(data)

#### data (optional)

Type: `Object`

## Notes

The compile method executes the original teddy.render() method with a template path and the optional data param.
The original teddy.compile() method is not allowed, this plugin is for generating static html files with the help of the Teddy templating engine functionalities.

## License

[WTFPL](http://www.wtfpl.net)
