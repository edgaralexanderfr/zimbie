var gulp = require('gulp');
var typescript = require('gulp-typescript');
var uglify = require('gulp-uglify');
var typedoc = require('gulp-typedoc');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
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
});

gulp.task('uglify', function() {
  return gulp.src('app/js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function () {
  return gulp.src('app/css/index.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function(done) {
  gulp.src('app/assets/**/*')
    .pipe(gulp.dest('dist/assets/'));

  gulp.src('app/lib/**/*')
    .pipe(gulp.dest('dist/lib/'));

  gulp.src('app/index.html')
    .pipe(gulp.dest('dist/'));

  done();
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

gulp.task('browser-sync', function (done) {
  browserSync.init({
    port: 9999,
    server: {
      baseDir: './dist/'
    }
  });

  gulp.watch('./src/**/*', gulp.series('typescript', 'uglify', 'minify-css', 'copy', function (done) {
    done();
  }));

  gulp.watch('./app/assets/**/*', gulp.series('copy', function (done) {
    done();
  }));

  gulp.watch('./dist/**/*', gulp.series('browser-sync-reload', function (done) {
    done();
  }));

  done();
});

gulp.task('browser-sync-reload', function (done) {
  browserSync.reload();
  done();
});

gulp.task('default', gulp.series('typescript', 'uglify', 'minify-css', 'copy', function (done) {
  done();
}));
