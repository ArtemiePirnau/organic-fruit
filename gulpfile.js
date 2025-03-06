const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');


function cleanDist() {
  return del('dist')
}

function sprite() {
  return src("app/images/dist/*.svg")
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg",
          example: true
        }
      }
    }))
    .pipe(dest("app/images/dist"))
}

function images() {
  return src('app/images/src/*.*', "!app/images/src/*.svg")
    .pipe(newer("app/images/dist"))
    .pipe(avif({ quality: 50 }))

    .pipe(src('app/images/src/*.*'))
    .pipe(newer("app/images/dist"))
    .pipe(webp())

    .pipe(src('app/images/src/*.*'))
    .pipe(newer("app/images/dist"))

    .pipe(imagemin(
      [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]
    ))
    .pipe(dest('app/images/dist'))
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    "node_modules/slick-carousel/slick/slick.min.js",
    "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js",
    "node_modules/star-rating-svg/dist/jquery.star-rating-svg.min.js",
    "node_modules/aos/dist/aos.js",
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}


function styles() {
  return src([
    'app/scss/style.scss',
    "node_modules/slick-carousel/slick/slick.css",
    "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css",
    "node_modules/aos/dist/aos.css"
  ])
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function build() {
  return src([
    'app/css/style.min.css',
    'app/fonts/**/*',
    'app/js/main.min.js',
    'app/*.html'
  ], { base: 'app' })
    .pipe(dest('dist'))
}

function watching() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/images/src'], images);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.sprite = sprite;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, watching);


