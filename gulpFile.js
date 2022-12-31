const gulp = require("gulp");

const cssnano = require("gulp-cssnano");
const sass = require("gulp-sass")(require("node-sass"));
const rev = require("gulp-rev");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const del = require("del");
gulp.task("css", (done) => {
  console.log("css minifying");
  gulp
    .src("./assets/scss/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets/css"));

  gulp
    .src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets")) // write rev'd assets to build dir
    .pipe(
      rev.manifest({
        base: "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});
gulp.task("js", function (done) {
  console.log("minifying js...");
  gulp
    .src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets")) // write rev'd assets to build dir
    .pipe(
      rev.manifest({
        base: "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

gulp.task("images", function (done) {
  console.log("compressing images...");
  gulp
    .src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    // .pipe(gulp.dest('./public/assets'))
    .pipe(rev())
    .pipe(gulp.dest("./public/assets")) // write rev'd assets to build dir
    .pipe(
      rev.manifest({
        base: "./public/assets",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});
//Empty the build folder
gulp.task("clean:assets", function (done) {
  del.sync("./public");
  del.sync("./rev-manifest.json");
  //this will delete the manifest every time gulp build runs ,so may solve your problem of manifest adding,deleting,etc.
  done();
});
gulp.task(
  "build",
  gulp.series("clean:assets", "images", "css", "js"),
  function (done) {
    console.log("Building assets");
    done();
  }
);
