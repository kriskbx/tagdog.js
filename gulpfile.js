'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var path = require('path');


gulp.task('default', ['serve']);

gulp.task('build', ['minify-css', 'linting', 'minify-js', 'copy-assets', 'copy-html']);

gulp.task('serve', ['build'], function() {
	browserSync.init({
		ghostMode: false,
		notify: false,
		logPrefix: 'Tagdog',
		server: {
			baseDir: ['./bundle'],
			index: 'example.html'
		}
	});

	gulp.watch('./src/**/*.css', ['css', 'minify-css', 'copy-assets']);
	gulp.watch('./src/**/*.js', ['copy-tagdog']);
	gulp.watch('./src/**/*.html', ['copy-html']);
});


gulp.task('clean', function () {
  return del(['example']);
});

gulp.task('css', ['clean'], function() {
  return gulp.src('./src/css/tagdog.css')
	.pipe(autoprefixer({
		'browsers': ['last 2 versions'],
		'cascade': true
	}))
	.pipe(gulp.dest('./bundle/tagdog/css'))
	.pipe(browserSync.stream());
});

gulp.task('minify-css', ['css'], function() {
	return gulp.src('./bundle/tagdog/css/tagdog.css')
	.pipe(sourcemaps.init())
	.pipe(minifyCSS())
	.pipe(rename('tagdog.min.css'))
	.pipe(sourcemaps.write('./source-maps'))
	.pipe(gulp.dest('./bundle/tagdog/css'))
	.pipe(browserSync.stream());
});

gulp.task('linting', function() {
  return gulp.src('./src/js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));
});

gulp.task('copy-tagdog', ['clean'], function() {
  return gulp.src('./src/js/tagdog.js')
	.pipe(gulp.dest('./bundle/tagdog/js'))
	.pipe(browserSync.stream());
});

gulp.task('minify-js', ['copy-tagdog'], function() {
  return gulp.src('./src/js/tagdog.js')
	.pipe(sourcemaps.init())
	.pipe(uglify({outSourceMap: true}))
	.pipe(rename('tagdog.min.js'))
	.pipe(sourcemaps.write('./source-maps'))
	.pipe(gulp.dest('./bundle/tagdog/js'))
	.pipe(browserSync.stream());
});

gulp.task('copy-assets', ['clean'], function() {
  return gulp.src([
		'./src/css/*.css',
		'!./src/css/tagdog.css'
	])
	.pipe(gulp.dest('./bundle/assets/css'))
	.pipe(browserSync.stream());
});

gulp.task('copy-html', ['clean'], function() {
  return gulp.src('./src/html/*.html')
	.pipe(gulp.dest('./bundle'))
	.pipe(browserSync.stream());
});
