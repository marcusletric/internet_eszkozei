// Include gulp
var gulp = require('gulp');

// Include Plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var appPath = "./bb8_control/Webapp/";
var Devutils = require(appPath + 'dev/devutils.js');

var devutils = new Devutils(appPath);

gulp.task('sass', function () {
    gulp.src(appPath + 'app/src/!(_)*.scss')
        .pipe(concat('app.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(appPath + 'app/css'));
});

gulp.task('scripts', function() {
    return gulp.src(appPath + 'app/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('includeLib', function(){
    return gulp.src(appPath + 'app/bower_components/**/*.min.js')
           .pipe(devutils.generateLibIncl());
});

gulp.task('includeSrc', function(){
    return gulp.src(appPath + 'app/src/**/*.js')
    .pipe(devutils.generateIndex(appPath + 'app/'));
});

gulp.task('devscripts', function(cb) {
    runSequence('includeLib',
                'includeSrc',
                cb);
});

gulp.task('devcompile', function(cb) {
    runSequence('sass',
                'devscripts',
                cb);
});
