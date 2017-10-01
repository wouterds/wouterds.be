import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';

const paths = {
  dist: {
    styles: './public/css',
    scripts: './public/js',
  },
  resources: {
    styles: './resources/styles',
    scripts: './resources/scripts',
  },
};

class TaskRunner {
  constructor() {
    gulp.task('styles', this.styles);
    gulp.task('scripts', this.scripts);
    gulp.task('default', ['styles', 'scripts'])
  }

  styles() {
    return gulp.src(paths.resources.styles + '/**/**.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed',
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
      .pipe(gulp.dest(paths.dist.styles));
  }

  scripts() {
    return gulp.src(paths.resources.scripts + '/**/**.js')
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(babel({
        presets: [
          "minify",
        ]
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.dist.scripts));
  }
}

new TaskRunner();
