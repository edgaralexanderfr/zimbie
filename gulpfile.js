var gulp = require('gulp');
var uglify = require('gulp-uglify');
var { gitDescribe } = require('git-describe');
var typedoc = require('gulp-typedoc');

function getProjectCurrentVersion(callback) {
  gitDescribe(__dirname, { customArguments: ['--abbrev=40'] }, (err, gitInfo) => {
    if (err) {
      throw err;
    }

    if (gitInfo.tag) {
      callback(gitInfo.tag);
    } else {
      callback(gitInfo.hash);
    }
  });
}

gulp.task('uglify', function () {
  return gulp.src('dist/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/min'));
});

gulp.task('typedoc', function (done) {
  getProjectCurrentVersion(function (version) {
    gulp.src(['src/'])
      .pipe(typedoc({
        module: 'amd',
        target: 'es5',
        out: './docs/' + version,
        name: 'Zimbie ' + version
      }));

    done();
  });
});
