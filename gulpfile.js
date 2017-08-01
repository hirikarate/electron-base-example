const 
	del = require("del"),
	cache = require('gulp-cached'),
	concat = require('gulp-concat'),
	debug = require("gulp-debug"),
	gulp = require("gulp"),
	merge = require('merge-stream'),
	replace = require('gulp-replace'),
	sass = require('gulp-sass'),
	sequence = require('gulp-watch-sequence'),
	sourcemaps = require('gulp-sourcemaps'),
	tsc = require("gulp-typescript"),
	tsProject = tsc.createProject("tsconfig.json"),
	tslint = require('gulp-tslint'),
	uglifycss = require('gulp-uglifycss'),
	watch = require('gulp-watch'),
	gulpWebpack = require('gulp-webpack'),
	webpack = require('webpack')
	;


// Environment plugin
var environments = require('gulp-environments'),
	development = environments.development,
	production = environments.production;

/*
 *	Build mode. Read more: https://www.npmjs.com/package/gulp-environments
 */
gulp.task('set-dev-mode', ['edit-file-dev'], development.task);	// Build as Development mode (with source maps)
gulp.task('set-prod-mode', ['edit-file-prod'], production.task);	// Build as Production mode (minification, no source maps)

gulp.task('edit-file-dev', function() {
	let editFile = (srcStream) => {
		return srcStream
			.pipe(replace(/<!-- DEV \//, '<!-- DEV -->')) // Replace "<!-- DEV /" with "<!-- DEV -->"
			.pipe(replace(/\/\*\/ DEV/, '//* DEV')) // Replace "/*/ DEV" with "//* DEV"
			.pipe(replace(/<!-- PROD -->/, '<!-- PROD /')) // Replace "<!-- PROD -->" with "<!-- PROD /"
			.pipe(replace(/\/\/\* PROD/, '/*/ PROD')) // Replace "//* PROD" with "/*/ PROD"
			;
	};

	let app = editFile(gulp.src(['./src/app.ts']))
		.pipe(gulp.dest('./src'));
	let view = editFile(gulp.src(['./views/**/*.html']))
		.pipe(gulp.dest('./views'));

	let packageJson = gulp.src(['./package.json'])
		.pipe(replace(/"main": "bundles\/main-bundle.js"/, '"main": "main.js"'))
		.pipe(gulp.dest('./'));

		return merge(app, view, packageJson);
});

gulp.task('edit-file-prod', function() {
	let editFile = (srcStream) => {
		return srcStream
			.pipe(replace(/<!-- DEV -->/, '<!-- DEV /')) // Replace "<!-- DEV -->" with "<!-- DEV /"
			.pipe(replace(/\/\/\* DEV/, '/*/ DEV')) // Replace "//* DEV" with "/*/ DEV"
			.pipe(replace(/<!-- PROD \//, '<!-- PROD -->')) // Replace "<!-- PROD /" with "<!-- PROD -->"
			.pipe(replace(/\/\*\/ PROD/, '//* PROD')) // Replace "/*/ PROD" with "//* PROD"
			;
	};

	let app = editFile(gulp.src(['./src/app.ts']))
		.pipe(gulp.dest('./src'));
	let view = editFile(gulp.src(['./views/**/*.html']))
		.pipe(gulp.dest('./views'));
	
	let packageJson = gulp.src(['./package.json'])
		.pipe(replace(/"main": "main.js"/, '"main": "bundles/main-bundle.js"'))
		.pipe(gulp.dest('./'));


		return merge(app, view, packageJson);
});


const DIST_FOLDER = 'dist',
	BUNDLE_FOLDER = 'bundles';

/**
 * Removes `dist` folder.
 */
gulp.task('clean', function() {
	return del.sync([DIST_FOLDER]);
});


/**
 * Checks coding convention.
 */
const srcToLint = ['src/**/*.ts', '!node_modules/**/*.*'];
let lintCode = function() {
	return gulp.src(srcToLint)
		.pipe(cache('linting'))
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report())
};
gulp.task('tslint', ['clean'], lintCode);
gulp.task('tslint-hot', lintCode);


/**
 * Compiles TypeScript backend sources and writes to `dist` folder.
 */
const TS_FILES = ['src/**/*.ts', '!node_modules/**/*.*'],
	TYPING_FILES = ['typings/**/*.d.ts'];
let compile = function () {

	let onError = function (err) {
		console.error(err.toString());
		this.emit('end');
	};

	let compileTs = gulp.src(TS_FILES)
		.pipe(cache('compiling'));

	let includeTypings = gulp.src(TYPING_FILES);

	return merge(compileTs, includeTypings)
		.on('error', onError)
		.on('failed', onError)
		.pipe(debug())
		.pipe(development(sourcemaps.init()))
		.pipe(tsProject(tsc.reporter.fullReporter(true)))
		// .pipe(production(uglify())) // unglif if built in production mode
		.pipe(development(sourcemaps.write('./')))
		.pipe(gulp.dest(DIST_FOLDER));
};
gulp.task('compile', ['tslint'], compile);
gulp.task('compile-hot', ['tslint-hot'], compile);


/**
 * Copies all resources that are not TypeScript files into `dist` directory.
 */
const RESRC_FILES = ['src/**/*', '!./**/*.ts'];
gulp.task('resources', () => {
	return gulp.src(RESRC_FILES)
		.pipe(cache('resourcing'))
		.pipe(debug())
		.pipe(gulp.dest(DIST_FOLDER));
});

/**
 * Transpiles SASS files to CSS
 */
const SASS_FILES = 'assets/css/**/*.scss';
gulp.task('sass', function () {
	return gulp.src(SASS_FILES)
		.pipe(sass().on('error', sass.logError))
		.pipe(production(uglifycss({
			'uglyComments': true
		})))
		.pipe(gulp.dest('assets/css'));
});


/**
 * Pack source files into smaller bundles
 */
let gulpPack = function(src, filename, dest) {
	
	let onError = function (err) {
		console.error(err.toString());
		this.emit('end');
	};

	return gulp.src(src)
		.on('error', onError)
		.pipe(gulpWebpack({
			target: 'electron',
			output: {
				filename
			},
			module: {
				loaders: [
					{
						test: /tiny-cdn$/,
						loader: 'shebang-loader'
					}
				]
			}
		}, webpack))
		.pipe(gulp.dest(dest));
};

gulp.task('pack-backend', ['compile'], function() {
	return gulpPack(['./main.js'], 'main-bundle.js', BUNDLE_FOLDER);
});

gulp.task('pack-frontend', ['compile'], function() {
	return gulpPack(['./dist/renderer/DefaultScreen.js'], 'frontend-bundle.js', BUNDLE_FOLDER);
});

gulp.task('pack-lib', function() {
	return gulp.src([
		'./assets/js/lib/jquery-1.12.4.min.js',
		'./assets/js/lib/bootstrap-3.3.7.min.js'
	])
	.pipe(concat('lib-bundle.js'))
	.pipe(gulp.dest(BUNDLE_FOLDER));
});

/*
 * Default task which is automatically called by "gulp" command.
 */
gulp.task('default', [
	'set-dev-mode',
	'clean',
	'tslint',
	'compile',
	'sass',
	'resources'
]);

/*
 * gulp release
 */
gulp.task('release', [
	'set-prod-mode',
	'clean',
	'tslint',
	'compile',
	'sass',
	'resources',
	'pack-backend',
	'pack-frontend',
	'pack-lib'
]);

/*
 * gulp watch
 */
gulp.task('watch', ['default'] /*['clean', 'tslint', 'compile', 'sass', 'resources']*/, () => {
	let queue = sequence(1000); // 1 sec

	watch(RESRC_FILES, {
		name: 'watch-resource',
		emitOnGlob: false
	}, queue.getHandler('resources'));

	watch(TS_FILES, {
		name: 'watch-code',
		emitOnGlob: false
	}, queue.getHandler('tslint-hot', 'compile-hot'));

	watch(SASS_FILES, {
		name: 'watch-sass',
		emitOnGlob: false
	}, queue.getHandler('sass'));
});

gulp.task('clean-cache', function () {
	cache.caches = {};
});