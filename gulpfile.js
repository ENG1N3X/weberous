const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const pug = require("gulp-pug");
const browserSync = require("browser-sync");

gulp.task("styles", function () {
  return gulp
    .src("./src/assets/sass/*.+(sass|scss)")
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(autoprefixer(["last 2 version", "> 5%", "IE 10"], { cascade: true }))
    .pipe(rename({ basename: "theme", suffix: "", prefix: "" }))
    .pipe(gulp.dest("src/assets"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("styles-libs", function () {
  return gulp
    .src("./src/assets/libs/css/*.+(scss|sass|css)")
    .pipe(sass()) // { outputStyle: "compressed" }
    .pipe(gulp.dest("src/assets"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("scripts", function () {
  return gulp
    .src("./src/assets/js/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      }),
    )
    .pipe(concat("theme.js"))
    .pipe(gulp.dest("src/assets"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("pug-layout", function () {
  return gulp
    .src("src/layout/pug/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("src/layout"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("pug-sections", function () {
  return gulp
    .src("src/sections/pug/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("src/sections"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("pug-templates", function () {
  return gulp
    .src("src/templates/pug/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("src/templates"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("pug-snippets", function () {
  return gulp
    .src("src/snippets/pug/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("src/snippets"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "src/",
      index: "templates/index.html",
    },
    notify: false,
    open: false,
    reloadOnRestart: true,
    browser: "google chrome",
  });
});

gulp.task("watch", function () {
  gulp.watch("src/assets/sass/**/*.+(sass|scss)", gulp.parallel("styles"));
  gulp.watch("src/assets/libs/css/*.+(scss|sass|css)", gulp.parallel("styles-libs"));
  gulp.watch("src/assets/js/*.js", gulp.parallel("scripts"));
  gulp.watch("src/layout/pug/*.pug", gulp.parallel("pug-layout", "pug-templates"));
  gulp.watch("src/sections/pug/*.pug", gulp.parallel("pug-sections", "pug-templates"));
  gulp.watch("src/templates/pug/*.pug", gulp.parallel("pug-templates"));
  gulp.watch("src/snippets/pug/*.pug", gulp.parallel("pug-snippets", "pug-templates"));
});

gulp.task("build", async () => {
  gulp.src("src/assets/*.+(js|css|scss)").pipe(gulp.dest("build/assets"));
  gulp.src("src/layout/*.html").pipe(gulp.dest("build/layout"));
  gulp.src("src/sections/*.html").pipe(gulp.dest("build/sections"));
  gulp.src("src/snippets/*.html").pipe(gulp.dest("build/snippets"));
  gulp.src("src/templates/*.html").pipe(gulp.dest("build/templates"));
  gulp.src("src/static/**").pipe(gulp.dest("build/static"));
});

gulp.task("default", gulp.parallel("styles", "styles-libs", "scripts", "pug-layout", "pug-sections", "pug-templates", "pug-snippets", "watch", "browser-sync"));
