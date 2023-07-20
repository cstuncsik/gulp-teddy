[![Build Status](https://travis-ci.org/cstuncsik/gulp-teddy.svg?branch=master)](https://travis-ci.org/cstuncsik/gulp-teddy)
[![npm version](https://badge.fury.io/js/gulp-teddy.svg)](http://badge.fury.io/js/gulp-teddy)
[![Dependency Status](https://gemnasium.com/cstuncsik/gulp-teddy.svg)](https://gemnasium.com/cstuncsik/gulp-teddy)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/cstuncsik/gulp-teddy/master/LICENSE)

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
    teddy = require('gulp-teddy').settings({
        setTemplateRoot: 'src/html/'
    });

gulp.task('default', () => gulp.src(['src/html/**/*.html','!src/html/templates/**/*.html'])
    .pipe(teddy.compile())
    .pipe(gulp.dest('dist'))
);
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

### Passing data as an object

#### `src/html/index.html`

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

```js
var gulp  = require('gulp'),
    teddy = require('gulp-teddy').settings({
        setTemplateRoot: 'src/html/'
    });

gulp.task('default', () => gulp.src(['src/html/**/*.html', '!src/html/templates/**/*.html'])
    .pipe(teddy.compile({
        letters: ['a', 'b', 'c']
    }))
    .pipe(gulp.dest('dist'))
);
```

#### `dist/index.html`

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

### Passing data with [gulp-data](https://github.com/colynb/gulp-data)

For example from a json file, you can use it together the above example, your data will be merged (extended)

#### `src/html/index.html`

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
    <if subTitle>
        <h2>{subTitle}</h2>
    </if>
    <if subData and subData.level1>
        <ul>
            <loop through='subData.level1' key='name' val='text'>
                <li>
                    <strong>{name}</strong>
                    <br />{text}
                </li>
            </loop>
        </ul>
    </if>
</body>

</html>
```

#### `src/data/index.json`

```js
{
    "subTitle": "Sub title",
    "subData": {
        "level1": {
            "sd1": "sub data 1",
            "sd2": "sub data 2",
            "sd3": "sub data 3"
        }
    }
}
```
### `gulpfile.js`

```js
var gulp = require('gulp'),
    data = require('gulp-data'),
    path = require('path'),
    teddy = require('gulp-teddy').settings({
        setTemplateRoot: 'src/html/templates/'
    });


gulp.task('default', function() {
    return gulp.src(['src/html/**/*.html', '!src/html/templates/**/*.html'])
        .pipe(data(function(file) {
            return require('./src/data/' + path.basename(file.path, '.html') + '.json');
        }))
        .pipe(teddy.compile({
            letters: ['a', 'b', 'c']
        }))
        .pipe(gulp.dest('dist'));
});

```

#### `dist/index.html`

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
    <h2>Sub title</h2>
    <ul>
        <li>
            <strong>sd1</strong>
            <br/>sub data 1
        </li>
        <li>
            <strong>sd2</strong>
            <br/>sub data 2
        </li>
        <li>
            <strong>sd3</strong>
            <br/>sub data 3
        </li>
    </ul>
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
