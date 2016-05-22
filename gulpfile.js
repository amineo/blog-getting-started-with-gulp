// Include gulp & plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    cache = require('gulp-cached'),
    changed = require('gulp-changed');
    
// Browsersync
var browserSync = require('browser-sync').create(),
    reload = browserSync.reload;
    
// sass
var sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');
    
// less
var less = require('gulp-less'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    lessCleanCSS = new LessPluginCleanCSS({ advanced: false, compatibility:'ie8,+selectors.ie7Hack'}),
    lessAutoPrefix = new LessPluginAutoPrefix({ browsers: ["last 4 versions"], remove:false });
    
    
// Projects path for src & dist
var projectPath = {
    dist: 'assets/dist/',
    src: 'assets/src/'
}; 
     
    
/** 
 * Compile JS 
**/
gulp.task('scripts', function(file) {
  return gulp.src([projectPath.src + 'js/*.js', '!gulpfile.js', '!**/*.min.js'])
    .pipe(cache('uglifing'))
    .pipe(uglify())
    .pipe(rename(function(path){
        path.extname = '.min.js';
     }))
    .pipe(changed(projectPath.dist + 'js'))
    .pipe(gulp.dest(projectPath.dist + 'js'));
});


/** 
 * Compile CSS 
**/
// LESS
gulp.task('less', function() {
  return gulp.src(projectPath.src + 'less/main.less')
    .pipe(less({
    plugins: [lessAutoPrefix, lessCleanCSS]
  }))
  .pipe(rename(function(path){
    path.extname = '.less.css';
  }))
  .pipe(gulp.dest(projectPath.dist + '/css'))
});

// SASS
gulp.task('sass', function() {
  return gulp.src(projectPath.src + 'sass/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer('last 4 versions'))
    .pipe(rename(function(path){
      path.extname = '.sass.css';
    }))
    .pipe(gulp.dest(projectPath.dist + '/css'))
});



/** 
 * Watch Files
**/
gulp.task('watch', function() {
  
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

  	gulp.task('less:watch', ['less'], reload);
    gulp.watch( projectPath.src + 'less/*.less', ['less:watch']);
    
    
  	gulp.task('sass:watch', ['sass'], reload);
    gulp.watch( projectPath.src + 'sass/*.scss', ['sass:watch']);
    
    
    gulp.task('scripts:watch', ['scripts'], reload);
    gulp.watch( projectPath.src + 'js/*.js', ['scripts:watch']);    
});

/** 
 * Default Task
**/

gulp.task('default', ['less', 'sass', 'scripts', 'watch']);