'use strict'
const gulp = require('gulp'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');

gulp.task('sass', () => {
    let compileSass = sass();
    compileSass.on('error', console.error.bind(console));
    gulp.src('src/scss/main.scss')
        .pipe(compileSass)
        .pipe(rename('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'));
})

gulp.task('buildJSDev', () => {
    gulp.src('src/js/*.es6.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('shutthebox.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('buildJSProd', () => {
    gulp.src('src/js/*.es6.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('shutthebox.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('default', () => {
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/*.es6.js', ['buildJSDev']);
});

