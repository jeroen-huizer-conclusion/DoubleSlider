/**
tasks:
- default	: 	does nothing
- deploy	: 	copies specific files into the runtimeGlobs, useful for developing/debugging
- pack		: 	packs the widget files into an .mpk in the /pkg/ folder
- dist		:	packs an .mpk and copy it to the project's widget folder
- watch		: 	watch all files defined in the runtimeGlobs, runs deploy when any of them changes
	

*/

// Settings:
var widgetName = 'DoubleSlider';
var testFolder = './test';
var watchGlobs = ['/**/*.js', '/**/*.html'];

// Dependencies
var gulp = require('gulp');
var changed = require('gulp-changed');
var zip = require('gulp-zip');

// Path to the widgetFiles
var srcFolder = './src/';

gulp.task('default', function() {
  // No default
});

gulp.task('deploy', function() {
	
	var destFolder = testFolder + '/deployment/web/widgets/' + widgetName;
	var srcGlobs = watchGlobs.map(globToSrc);
		
	console.log('Copy widget files to ' + destFolder);
	
	gulp.src(srcGlobs)
		.pipe(gulp.dest(destFolder));
	
});

gulp.task('pack', function(callback){
	
	console.log('Create widget package.');
	
	gulp.src(srcFolder + '/**/*')
        .pipe(zip(widgetName+'.mpk'))
        .pipe(gulp.dest('./pkg'))
		.on('end', callback);
		
});

gulp.task('dist', ['pack'], function(){
	

	var destFolder = testFolder + '/widgets/';
	console.log('Deploy widget package to '+destFolder);
	
	gulp.src('./pkg/'+widgetName+'.mpk')
		.pipe(gulp.dest(destFolder));
	
	
});

gulp.task('watch', function(){
	
	console.log('Watching .js and .html files, will copy to deployment folders on change.');
	
	var srcGlobs = [];
	var srcGlobs = watchGlobs.map(globToSrc);
	
	var watcher = gulp.watch(srcGlobs, ['deploy']);
	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

function globToSrc (glob){
	return srcFolder+'/'+widgetName+glob; 
}
