// Karma configuration
// Generated on Wed Jul 22 2015 11:52:49 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/vendors/core/angular.js',
      'public/vendors/core/angular*.js',
      'public/vendors/core/satellizer.min.js',
      'public/vendors/angular-moment.js',
      'public/directives/truncate.js',
      'public/angularApp.js',
      'public/services/*.js',
      'public/controllers/*/*.js',
      'test/*/*.js',
      'public/partials/**/*.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
     
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'public/partials/',
      // create a single module that contains templates from all the files
      moduleName: 'templates'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    hostname : process.env.IP,
    port : process.env.PORT,
    runnerPort : 0,
    plugins : ['karma-jasmine', 'karma-phantomjs-launcher'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
