var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var order = require('gulp-order');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var protractor = require('gulp-protractor').protractor;
var webdriverUpdate = require('gulp-protractor').webdriver_update;

var paths = {
  sass: ['./app/styles/**/*.scss'],
  js: ['./app/scripts/**/*.js'],
  html: ['./app/**/*.html'],
  lib: ['./app/lib/**/*'],
  test: {
    e2e: 'tests/e2e/**/*-spec.js'
  }
};

gulp.task('sass', function(done) {
  return gulp.src(paths.sass)
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.js)
    .pipe(order([
      'utility/*.js',
      'vendor/*.js',
      'app.js',
      'factories/*.js',
      'directives/*.js',
      'controllers/*.js'
      ]))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('./www/'));
});

gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(gulp.dest('./www/lib'));
});

gulp.task('clean', function() {
  return gulp.src('./www/*.*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('webdriver:update', webdriverUpdate);

gulp.task('protractor', ['webdriver:update', 'connect:test'], function() {
  return gulp.src(paths.test.e2e)
    .pipe(protractor({
        configFile: 'tests/protractor.config.js',
    }))
    .on('error', function(e) {throw e});
});

gulp.task('connect:test', function() {
  return connect.server({
    root: 'www',
    port: '8300',
    livereload: false
  });
});

gulp.task('test', ['protractor'], function () {
  connect.serverClose();
});

gulp.task('watch',['default'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['scripts']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.lib, ['lib']);
});

gulp.task('default', function(callback) {
  runSequence('clean', ['sass','scripts','html','lib'], callback);
});