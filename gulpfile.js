var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('uglify', function () {
  gulp.src('dist/main.js')
    .pipe(uglify())
      .pipe(gulp.dest('dist/min'));
});