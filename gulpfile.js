/* jshint node: true, strict: true */
'use strict';

/*=====================================
 =        Configuration                =
 =====================================*/

var config = {
    dist: 'dist',
    tmp: 'tmp',

    vendor: {
        js: [],

        css: {
            prepend: [],
            append: []
        },

        fonts: []
    }
};

/*-----  End of Configuration  ------*/


/*========================================
 =            Requiring stuffs            =
 ========================================*/

var gulp           = require('gulp'),
    seq            = require('run-sequence'),
    connect        = require('gulp-connect'),
    uglify         = require('gulp-uglify'),
    less           = require('gulp-less'),
    cssmin         = require('gulp-cssmin'),
    concat         = require('gulp-concat'),
    rimraf         = require('gulp-rimraf'),
    templateCache  = require('gulp-angular-templatecache'),
    mobilizer      = require('gulp-mobilizer'),
    ngAnnotate     = require('gulp-ng-annotate'),
    replace        = require('gulp-replace'),
    streamqueue    = require('streamqueue'),
    rename         = require('gulp-rename'),
    path           = require('path'),
    cache          = require('gulp-cache'),
    rev            = require('gulp-rev'),
    util           = require('gulp-util');



/*================================================
 =            Report Errors to Console            =
 ================================================*/

gulp.on('error', function(e) {
    throw(e);
});


/*=========================================
 =            Clean dist folder            =
 =========================================*/

gulp.task('clean', function (cb) {
    return gulp.src([config.dist, config.tmp], {read: false})
        .pipe(rimraf());
});


/*======================================================================
 =            Concat, minify css files                                 =
 ======================================================================*/

gulp.task('css', ["app-css"], function () {
    return true;
});

gulp.task('app-css', ['less'], function () {
    streamqueue({ objectMode: true }, gulp.src(path.join(config.tmp, 'css/*.css')))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist));

    return gulp.src(config.tmp, {read: false})
        .pipe(rimraf());
});

gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest(path.join(config.tmp, 'css')));
});


/*====================================================================
 =            Compile and minify js generating source maps            =
 ====================================================================*/

gulp.task('js', ['app-js', 'templates'],function() {
    return true;
});

gulp.task('app-js', function() {
    streamqueue({ objectMode: true },
        gulp.src(['src/js/*.js']))
        .pipe(concat('business-hours.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(ngAnnotate())
        //.pipe(uglify())
        .pipe(gulp.dest(config.dist));
});

gulp.task('templates', function() {
    var files = ['src/templates/*.html'];

    return gulp
        .src(files)
        .pipe(templateCache('templates.js', {
            module: 'businessHoursControl',
            base: function(file) {
                return file.history[0].replace(path.resolve('.'), '.');
            }
        }))
        .pipe(concat('business-hours-tpl.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(config.dist));
});


/*======================================
 =            Build Sequence            =
 ======================================*/

gulp.task('build', function(done) {
    seq('clean', ['css', 'js'], done);
});


/*====================================
 =            Default Task            =
 ====================================*/

gulp.task('default', function(done) {
    var tasks = [];

    if (typeof config.weinre === 'object') {
        tasks.push('weinre');
    }

    if (typeof config.server === 'object') {
        tasks.push('connect');
    }

    seq('build', tasks, done);
});
