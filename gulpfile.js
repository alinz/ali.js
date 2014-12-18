var gulp          = require("gulp"),

    del           = require("del"),
    rename        = require("gulp-rename"),

    Notification  = require("node-notifier"),
    util          = require("gulp-util"),

    browserify    = require("browserify"),
    watchify      = require("watchify"),
    source        = require("vinyl-source-stream"),

    reactify      = require("reactify"),
    uglify        = require("gulp-uglify"),

    browserSync   = require("browser-sync"),

    less          = require("gulp-less"),

    reload        = browserSync.reload;


var config = {
    lessMainFolder: "src/less",
    lessEntry:      "main.less",
    cssDestFolder:  "dist/css",
    cssFinalName:   "main.css",

    jsMainFolder:   "src/js",
    jsEntry:        "main.jsx",
    jsDestFolder:   "dist/js",
    jsFinalName:    "main.js",
};

function standardHandler(err){
  // Notification
  Notification.notify({ message: "Error: " + err.message });
  // Log to console
  util.log(util.colors.red("Error"), err.message);
}

function browserifyHandler(err){
  standardHandler(err);
  this.end();
}

//delete dist folder by calling: gulp clean
gulp.task("clean", function(cb) {
  del(["dist"], cb);
});

gulp.task("browserSync", function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

/////////////////////// LESS -> CSS
gulp.task("less", function () {
  var link = gulp.src("./" + config.lessMainFolder + "/" + config.lessEntry)
              .on("error", standardHandler)
              .pipe(less({ paths: [ config.lessMainFolder ] }))
              .on("error", standardHandler)
              .pipe(rename(config.cssFinalName))
              .on("error", standardHandler)
              .pipe(gulp.dest("./" + config.cssDestFolder));

  if (process.env.NODE_ENV === "development") {
    link = link.pipe(reload({ stream: true }));
  }

  return link;
});

gulp.task("watch-less", function () {
  gulp.watch("./" + config.lessMainFolder + "/**/*.less", ["less"]);
});
///////////////////////////////////////////////////////////////////////////////

/////////////////////// jsx -> js
gulp.task("js", function () {
  var link;

  function bundle() {
    link.bundle()
      .on("error", browserifyHandler)
      .pipe(source(config.jsEntry))
      .on("error", browserifyHandler)
      .pipe(rename(config.jsFinalName))
      .on("error", browserifyHandler)
      .pipe(gulp.dest(config.jsDestFolder))
      .on("error", browserifyHandler)
      .pipe(reload({ stream: true }));
  }

  link = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  }).on("error", browserifyHandler);

  if (process.env.NODE_ENV === "development") {
    link = watchify(link);
    link.on("update", function () {
      console.log("update");
      bundle();
    });
  }

  link.add("./" + config.jsMainFolder + "/" + config.jsEntry);
  link.transform(reactify);
  bundle();
});
///////////////////////////////////////////////////////////////////////////////

gulp.task("dev", ["clean"], function () {
  process.env.NODE_ENV = "development";
  gulp.start([ "watch-less", "js", "browserSync" ]);
});

gulp.task("prod", ["clean"], function () {
  process.env.NODE_ENV = "production";
  gulp.start([ "less", "js" ]);
});

gulp.task("default", function() {
  console.log("Run 'gulp dev or gulp prod'");
});
