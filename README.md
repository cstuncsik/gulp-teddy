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

gulp.task('default', function() {
    return gulp.src(['src/html/**/*.html','!src/html/templates/**/*.html'])
    .pipe(teddy({
        templateRoot: 'src/html/'
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
    <header>
        <h1>Main title</h1>
    </header>
</body>

</html>
```

## API

See the [Teddy docs](https://github.com/kethinov/teddy#api-documentation).

### teddy(options)

#### options

Type: `Object`

The only option is now `templateRoot`

## Notes

Tested only with html files, the plugin is under development

## License

[WTFPL](http://www.wtfpl.net)
