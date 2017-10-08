// Import libs
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';

// Paths
const paths = {
  dist: {
    styles: './public/static/css',
    scripts: './public/static/js',
  },
  resources: {
    styles: './resources/styles',
    scripts: './resources/scripts',
    vendor: './node_modules',
  },
};

// Src files
const src = {
  styles: `${paths.resources.styles}/**/**.scss`,
  scripts: `${paths.resources.scripts}/**/**.js`,
  vendor: [
  ]
};

class TaskRunner {
  constructor() {
    // Tasks
    gulp.task('styles', this.styles);
    gulp.task('scripts', this.scripts);
    gulp.task('vendor', this.vendor);

    // Default task
    gulp.task('default', ['styles', 'scripts', 'vendor']);

    // Watch task
    gulp.task('watch', ['default'], () => {
      gulp.watch(src.styles, ['styles']);
      gulp.watch(src.scripts, ['scripts']);
      gulp.watch(src.vendor, ['vendor']);
    });
  }

  styles() {
    return gulp.src(src.styles)
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed',
        includePaths: ['node_modules'],
      }).on('error', sass.logError))
      .pipe(postcss([
        autoprefixer({
          browsers: [
            'last 3 versions',
            'last 2 major versions',
            'ie >= 9',
          ],
        }),
      ]))
      .pipe(sourcemaps.write())
      .pipe(concat('app.css'))
      .pipe(gulp.dest(paths.dist.styles));
  }

  scripts() {
    return gulp.src(src.scripts)
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(babel({
        presets: [
          "minify",
        ]
      }))
      .pipe(sourcemaps.write())
      .pipe(concat('app.js'))
      .pipe(gulp.dest(paths.dist.scripts));
  }

  vendor() {
    console.log(src.vendor);
    return gulp.src(src.vendor)
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(paths.dist.scripts));
  }
}

// Start our task runner
new TaskRunner();
