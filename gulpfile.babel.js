import gulp from 'gulp';

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
