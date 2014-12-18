var gulp        = require("gulp"),
    del         = require('del'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    reactify    = require('reactify'),
    uglify      = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

var path = {
    jsx:    "./src/main.jsx",
    bundle: "ali.js",
    distjs: "dist/js"
};

//delete dist folder by calling: gulp clean
gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  })
});

gulp.task('watchify', function() {
  var bundler = watchify(browserify(path.jsx, watchify.args));

  function rebundle() {
    return bundler
            .bundle()
            .pipe(source(path.bundle))
            .pipe(gulp.dest(path.distjs))
            .pipe(reload({ stream: true }));
  }

  bundler.transform(reactify).on("update", rebundle);

  return rebundle();
});

gulp.task('browserify', function() {
  browserify(path.jsx)
    .transform(reactify)
    .bundle()
    .pipe(source(path.bundle))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(path.distJs));
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['browserSync', 'watchify']);
});

gulp.task('build', ['clean'], function() {
  process.env.NODE_ENV = 'production';
  gulp.start(['browserify']);
});

gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});
