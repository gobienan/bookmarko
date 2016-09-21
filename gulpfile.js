/******************************************************************
Require
******************************************************************/
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var del = require('del');
var ftp = require('gulp-ftp');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var reload = browserSync.reload;
var lodash =require('lodash');

var host = 'server216.web-hosting.com';
var user = 'gob@bookmarko.me';
var password = '2v#8)Xydxi;N';

var srcFolders = {
    boardJS: [
        './src/**/js/jquery.iframe-transport.js',
        './src/**/js/jquery.fileupload.js',
        './js/googleAnalytics.js',
        './src/board/js/marka.min.js',
        './src/board/js/jquery.gridster.js',
        './src/board/js/cookie.js',
        './src/board/js/init.js',
        './src/board/js/styling.js',
        './src/board/js/bookmarks.js',
        './src/board/js/search.js',
        './src/board/js/upload.js',
        './src/board/js/keyEvents.js'
    ],
    landingpageJS: [
        './src/**/googleAnalytics.js',
        './src/**/js/cookie.js',
        './src/landingpage/js/init.js',
        './src/**/js/register.js',
        './src/**/js/login.js'
    ],
    loginRegisterJS: [
        './src/**/js/register.js',
        './src/**/js/login.js'
    ],
    jadeResources: [
        './src/**/*.jade',
        '!./src/**/includes/*.jade',
        '!./src/landingpage/*.jade',
    ],
    jadeLandingpage: [
        './src/**/landing/*.jade',
    ],
    image: [
        './src/img/**',
        '!./src/img/*.psd',
        '!./src/img/*.ai'
    ]
};


/******************************************************************
 Scripts Task
******************************************************************/
gulp.task('scripts', function() {
    gulp.src(srcFolders.landingpageJS, {
            base: './public/'
        })
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(reload({
            stream: true
        }));
    gulp.src(srcFolders.loginRegisterJS, {
            base: './public/'
        })
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('script_loginregister.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(reload({
            stream: true
        }));
    gulp.src(srcFolders.boardJS, {
            base: './public/'
        })
        .pipe(plumber())
        //.pipe(uglify())
        .pipe(concat('scripts_board.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(reload({
            stream: true
        }));

});

/******************************************************************
 Sass Task
******************************************************************/
gulp.task('sass', function() {
    gulp.src(
            [
                './src/**/sass/style*.sass',
                './src/**/sass/style*.scss'
            ])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename(function(file) {
            file.dirname = "";
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(reload({
            stream: true
        }));
});
/******************************************************************
 Jade Task
******************************************************************/
gulp.task('jade', function() {
    gulp.src(srcFolders.jadeResources)
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest('./public/'))
        .pipe(reload({
            stream: true
        }));
    gulp.src(srcFolders.jadeLandingpage)
        .pipe(plumber())
        .pipe(jade())
        .pipe(rename(function(file) {
            file.dirname = "";
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(reload({
            stream: true
        }));
});

/******************************************************************
 PHP Task
******************************************************************/
gulp.task('php', function() {
    gulp.src('./src/php/*.php')
        .pipe(plumber())
        .pipe(gulp.dest('./public/php/'));
});

/******************************************************************
 Image Processing Task
******************************************************************/
gulp.task('imagemin', function() {
    gulp.src(srcFolders.image)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img/'));
});

/******************************************************************
 BrowserSync Task
******************************************************************/
gulp.task('browser-sync', function() {
    browserSync({
        server: ({
            baseDir: "./public/"
        })
    });
});
/******************************************************************
 Watch Task
******************************************************************/
gulp.task('watch', function() {
    gulp.watch('./src/**/js/*.js', ['scripts']);
    gulp.watch('./src/**/sass/**', ['sass']);
    gulp.watch('./src/**/*.jade', ['jade']);
    gulp.watch('./src/**/*.php', ['php']);
});


/******************************************************************
 Upload Task
******************************************************************/
gulp.task('upload', function() {
    return gulp.src([
            './public/**',
            '!./public/img/*'
        ])
        .pipe(ftp({
            host: host,
            user: user,
            pass: password
        }));
});

/******************************************************************
 Tasks
******************************************************************/
gulp.task('default', ['compile', 'watch', 'browser-sync']);
gulp.task('build', ['build:copy', 'build:remove']);
gulp.task('compile', ['scripts', 'sass', 'jade', 'php', 'imagemin']);
