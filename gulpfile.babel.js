import gulp from 'gulp';

const folder = {
  dist: {
    styles: '/public/css',
    scripts: '/public/js',
  },
  resources: {
    styles: '/resources/styles',
    scripts: '/resources/scripts',
  },
};

class TaskRunner {
  constructor() {
    gulp.task('styles', this.styles);
    gulp.task('scripts', this.scripts);
    gulp.task('default', ['styles', 'scripts'])
  }

  styles() {
    console.log('styles');
  }

  scripts() {
    console.log('scripts');
  }
}

new TaskRunner();
