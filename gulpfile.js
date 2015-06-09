// Include gulp
var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  karma = require('karma').server;

gulp.task('test', function () {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: false
  });
});

// Form the gulp-eslint docs
gulp.task('lint', function () {
  return gulp.src(['dest/parserinator.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});

gulp.task('es6-inator', function () {
  return gulp.src('src/parserinator.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

// Minify JS
gulp.task('min', function() {
  return gulp.src('dist/parserinator.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', ['es6-inator', 'min']);
