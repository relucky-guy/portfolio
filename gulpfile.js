const { src, dest, parallel, series, watch, on } = require('gulp');
const browserSync  = require('browser-sync');
const sass         = require('gulp-sass')(require('sass'));
const cleanCSS     = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require("gulp-rename");
const imagemin     = require('gulp-imagemin');
const htmlmin      = require('gulp-htmlmin');

function server() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
};

function styles() {
    return src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
};

function html() {
    return src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest("dist/"));
};

function scripts() {
    return src("src/js/**/*.js")
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
};

function fonts() {
    return src("src/fonts/**/*")
        .pipe(dest("dist/fonts"))
        .pipe(browserSync.stream());
};

function icons() {
    return src("src/icons/**/*")
        .pipe(dest("dist/icons"))
        .pipe(browserSync.stream());
};

function images() {
    return src("src/img/**/*")
        .pipe(imagemin())
        .pipe(dest("dist/img"))
        .pipe(browserSync.stream());
};

function startwatch() {
    watch("src/sass/**/*.+(scss|sass)", styles);
    watch("src/*.html").on('change', browserSync.reload);
    watch("src/*.html").on('change', html);
    watch("src/js/**/*.js").on('change', scripts);
    watch("src/fonts/**/*").on('all', fonts);
    watch("src/icons/**/*").on('all', icons);
    watch("src/img/**/*").on('all', images);
}

exports.server  = server;
exports.styles  = styles;
exports.html    = html;
exports.scripts = scripts;
exports.fonts   = fonts;
exports.icons   = icons;
exports.images  = images;

exports.default = parallel(styles, html, scripts, server, fonts, icons, images, startwatch);     