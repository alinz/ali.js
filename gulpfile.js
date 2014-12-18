var gulp          = require("gulp"),
    del           = require('del'),
    Notification  = require('node-notifier'),
    util          = require('gulp-util'),
    browserify    = require('browserify'),
    watchify      = require('watchify'),
    source        = require('vinyl-source-stream'),
    buffer        = require('vinyl-buffer'),
    reactify      = require('reactify'),
    uglify        = require('gulp-uglify'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload;

var path = {
    jsx:    "./src/main.jsx",
    bundle: "ali.js",
    distjs: "dist/js"
};

function standardHandler(err){
  // Notification
  Notification.notify({ message: 'Error: ' + err.message });
  // Log to console
  util.log(util.colors.red('Error'), err.message);
}

function browserifyHandler(err){
  standardHandler(err);
  this.end();
}

//delete dist folder by calling: gulp clean
gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('watchify', function() {
  var bundler = watchify(browserify(path.jsx, watchify.args));

  bundler.on("error", function (err) { console.log(err); });

  function rebundle() {
    return bundler
            .bundle()
            .on('error', standardHandler)
            .pipe(source(path.bundle))
            .on('error', standardHandler)
            .pipe(gulp.dest(path.distjs))
            .on('error', standardHandler)
            .pipe(reload({ stream: true }))
            .on('error', standardHandler);
  }

  bundler.transform(reactify)
    .on("update", rebundle)
    .on('error', standardHandler);

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
