var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var size = require('gulp-size');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var cleanCSS = require('gulp-clean-css');
var watch = require('gulp-watch');
var wait = require('gulp-wait');

var handleError = function(err) {
    console.log(err);
    this.emit('end');
}


gulp.task('browseSync', function() {
    browserSync.init({
        server: "./dist",
        notify: false
    });    
});

//============================================
//JS libraries tasks
//============================================    
    gulp.task('libraries_js', function() {
        var s = size();
        return gulp.src('src/js/libraries/*.js')
            .pipe(plumber({ //dodaje obsługę błędów
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init()) //przed operacjami inicjalizujemy sourcemap
            .pipe(concat('libraries.js')) //laczymy wszystkie pliki js
            .pipe(uglify()) //minimalizujemy powyzszy polaczony kod
            .pipe(s) //pobieramy wielkosc tego kodu
            .pipe(rename({ //zmieniamy nazwę tego kodu na scripts.min.js
                suffix: '.min'
            }))
            .pipe(sourcemaps.write('.')) //wpisujemy sourcemap
            .pipe(gulp.dest('dist/js')) //wszystko powyzsze zapisujemy w katalogu
            .pipe(browserSync.stream({match: '**/*.js'})) //wstrzykujemy nowe pliki
            .pipe(browserSync.reload({
              stream: true
            }))
            .pipe(notify({ //i informujemy o tym siebie samych
                onLast: true,
                message: function () {
                    return 'Total JS size ' + s.prettySize;
                }
            }))
    });

//============================================
//JS functions tasks
//============================================    
    gulp.task('functions_js', function() {
        var s = size();
        return gulp.src('src/js/functions/*.js')
            .pipe(plumber({ //dodaje obsługę błędów
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init()) //przed operacjami inicjalizujemy sourcemap
            .pipe(concat('scripts.js')) //laczymy wszystkie pliki js
            .pipe(uglify()) //minimalizujemy powyzszy polaczony kod
            .pipe(s) //pobieramy wielkosc tego kodu
            .pipe(rename({ //zmieniamy nazwę tego kodu na scripts.min.js
                suffix: '.min'
            }))
            .pipe(sourcemaps.write('.')) //wpisujemy sourcemap
            .pipe(gulp.dest('dist/js')) //wszystko powyzsze zapisujemy w katalogu
            .pipe(browserSync.stream({match: '**/*.js'})) //wstrzykujemy nowe pliki
            .pipe(browserSync.reload({
              stream: true
            }))
            .pipe(notify({ //i informujemy o tym siebie samych
                onLast: true,
                message: function () {
                    return 'Total JS size ' + s.prettySize;
                }
            }))
    });

//============================================
//Sass tasks
//============================================
    gulp.task('sass', function() {
        var s = size();
        return gulp.src('src/scss/main.scss')
            .pipe(wait(50))
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle : 'compressed' //styl kodu - extended, nested, copressed, compact - i tak chcemy compressed
                })
            )
            .pipe(autoprefixer({browsers: ["> 1%"]}))
            .pipe(concat('style.css')) //laczymy wszystkie pliki css
            .pipe(cleanCSS())
            .pipe(s)
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream({match: '**/*.css'}))
            .pipe(browserSync.reload({
              stream: true
            }))
            .pipe(notify({
                onLast: true,
                message: function () {
                    return 'Total CSS size: ' + s.prettySize;
                }
            }))
    });


//============================================
//libraries_css tasks
//============================================
    gulp.task('libraries_css', function() {
        var s = size();
        return gulp.src('src/scss/libraries/*.css')
            .pipe(wait(50))
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle : 'compressed' //styl kodu - extended, nested, copressed, compact - i tak chcemy compressed
                })
            )
            .pipe(autoprefixer({browsers: ["> 1%"]}))
            .pipe(concat('libraries.css')) //laczymy wszystkie pliki css
            .pipe(cleanCSS())
            .pipe(s)
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream({match: '**/*.css'}))
            .pipe(browserSync.reload({
              stream: true
            }))
            .pipe(notify({
                onLast: true,
                message: function () {
                    return 'Total CSS size: ' + s.prettySize;
                }
            }))
    });

//============================================
//Watch tasks
//============================================
    gulp.task('watch', function() {
        gulp.watch('src/js/functions/*.js', ['functions_js']); //obserwuj wszystkie pliki .js w katalogu src/js i w razie czego odpal task js
        gulp.watch('src/js/libraries/*.js', ['libraries_js']);
        gulp.watch('src/scss/style/**/*.*', ['sass']); //obserwuj wszystkie pliki .scss w katalogu src/scss i podkatalogach i w razie czego odpal task sass
        gulp.watch('src/scss/libraries/**/*.*', ['libraries_css']);
        gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
     	gulp.watch('src/scss/**/*.scss').on('change', browserSync.reload);
     	gulp.watch('dist/**/*.html').on('change', browserSync.reload);
    });

gulp.task('default', ['functions_js', 'libraries_js', 'sass', 'libraries_css', 'browseSync', 'watch']);;       

