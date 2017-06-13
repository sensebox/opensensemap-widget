const gulp = require('gulp');
const connect = require('gulp-connect');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const open = require('gulp-open');

gulp.task('connect', function () {
  	connect.server({
  		port: 8000,
  		livereload: true
  	});
});

gulp.task('lint', function () {
	gulp.src(['src/**/*.js','!node_modules/**'])
    	.pipe(eslint())
    	.pipe(eslint.result(result => {
        	// Called for each ESLint result. 
        	console.log(`ESLint result: ${result.filePath}`);
        	console.log(`# Messages: ${result.messages.length}`);
        	console.log(`# Warnings: ${result.warningCount}`);
        	console.log(`# Errors: ${result.errorCount}`);
    	}));
});

gulp.task('watch', function() {
    gulp.watch('./src/*.js', ['lint', 'build', 'reload'])
});

gulp.task('build', () => {
	return gulp.src('src/script.js')
        .pipe(babel({
        	minified: true,
        	comments: false
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('reload', () => {
	gulp.src('./index.html')
		.pipe(connect.reload());
});

gulp.task('open', () => {
	gulp.src(__filename)
		.pipe(open({
			uri: 'http://localhost:8000'
		}));
});
 
gulp.task('dev', ['connect', 'watch', 'lint', 'build', 'open']);