var gulp = require('gulp');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var typedoc = require('gulp-typedoc');
var { gitDescribe } = require('git-describe');

var tsProject = typescript.createProject('tsconfig.json');

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

gulp.task('typescript', function() {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('.'));
})

gulp.task('uglify', function() {
  return gulp.src('app/js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function(done) {
  gulp.src('app/lib/phaser.min.js')
    .pipe(gulp.dest('dist/lib'));

  gulp.src('app/lib/require.js')
    .pipe(gulp.dest('dist/lib'));

  gulp.src('app/index.html')
    .pipe(gulp.dest('dist/'));

  done();
})

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('typedoc', function(done) {
  getProjectCurrentVersion(function(version) {
    gulp.src(['src/'])
      .pipe(typedoc({
        module: 'amd',
        target: 'es5',
        out: 'docs/' + version,
        name: 'Zimbie ' + version
      }));

    done();
  });
});

gulp.task('default', gulp.series('typescript', 'uglify', 'copy', function(done) {
  done();
}));
