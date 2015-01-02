var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglifyjs');
var wrap = require('gulp-wrap');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/**/*.js'],
  vendor: ['./www/lib/**/*']
};

gulp.task('default', ['sass', 'js']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('vendor', function(done) {
  var paths = [
    './www/lib/underscore/underscore.js',
    './www/lib/ionic/js/ionic.bundle.js',
    "./www/lib/collide/collide.js",
    "./www/lib/ngstorage/ngStorage.min.js",
    "./www/lib/angular-jwt/dist/angular-jwt.js",
    './www/lib/ngCordova/dist/ng-cordova.js'
  ]

  return gulp.src(paths)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./www/dist'))
});

gulp.task('js', function(done) {
  var paths = [
    './www/lib/ionic-contrib-tinder-cards/ionic.tdcards.js',
    "./www/lib/angular-flux-helpers/angular-flux.js",
    './www/js/app.js',
    './www/js/**/*.js'
  ];

  return gulp.src(paths)
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./www/dist'))
});

gulp.task('watch', function() {
  gulp.watch([paths.sass, paths.js, paths.vendor], function() {
    gulp.start('default');
  });
  gulp.start('default');
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
