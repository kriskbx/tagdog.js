'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sourcemaps = require("gulp-sourcemaps");
var del = require('del');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task('default', ['build']);
gulp.task('serve', ['browser-sync']);

// Since we're deleting/copying many files, just make everything run in sequence, which is much less error prone.
gulp.task('build', function(callback) {
  runSequence('clean', 'css', 'minify-css', 'linting', 'copy-tagdog', 'minify-js', 'copy-example-assets', 'copy-example-html', callback);
});

gulp.task('browser-sync', ['build'], function() {
	browserSync.init({
		ghostMode: false,
		notify: false,
		logPrefix: 'Tagdog',
		server: {
			baseDir: ['./bundle'],
			index: 'example.html'
		}
	});

	gulp.watch('./src/**/*.css', ['css', 'minify-css', 'copy-example-assets']);
	gulp.watch('./src/**/*.js', ['copy-tagdog']);
	gulp.watch('./src/**/*.html', ['copy-example-html']);
});

gulp.task('css', function() {
  return gulp.src('./src/tagdog/css/tagdog.css')
	.pipe(autoprefixer({
		'browsers': ['last 2 versions'],
		'cascade': true
	}))
	.pipe(gulp.dest('./bundle/tagdog/css'))
	.pipe(browserSync.stream());
});

gulp.task('minify-css', function() {
	return gulp.src('./bundle/tagdog/css/tagdog.css')
	.pipe(sourcemaps.init())
	.pipe(minifyCSS())
	.pipe(rename('tagdog.min.css'))
	.pipe(sourcemaps.write('./source-maps'))
	.pipe(gulp.dest('./bundle/tagdog/css'));
});

gulp.task('linting', function() {
  return gulp.src('./src/tagdog/js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});

gulp.task('minify-js', function() {
  return gulp.src('./src/tagdog/js/tagdog.js')
	.pipe(sourcemaps.init())
	.pipe(uglify({outSourceMap: true}))
	.pipe(rename('tagdog.min.js'))
	.pipe(sourcemaps.write('./source-maps'))
	.pipe(gulp.dest('./bundle/tagdog/js'))
});

gulp.task('copy-tagdog', function() {
  return gulp.src('./src/tagdog/js/tagdog.js')
	.pipe(gulp.dest('./bundle/tagdog/js'))
	.pipe(browserSync.stream());
});

gulp.task('copy-example-assets', function() {
  return gulp.src('./src/example/css/**/*.css')
	.pipe(gulp.dest('./bundle/example-assets/css'))
	.pipe(browserSync.stream());
});

gulp.task('copy-example-html', function() {
  return gulp.src('./src/example/html/*.html')
	.pipe(gulp.dest('./bundle'))
	.pipe(browserSync.stream());
});

gulp.task('clean', function () {
  return del(['example']);
});

