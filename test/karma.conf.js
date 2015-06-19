/*jslint indent: 2, maxlen: 80 */
/*globals module */

module.exports = function (config) {
  'use strict';

  config.set({
    basePath : '../',
    files : [
      'components/angular/angular.js',
      'components/angular-mocks/angular-mocks.js',
      'components/underscore/underscore.js',
      'src/parserinator.js',
      'test/parserinator.spec.js',
      { pattern: 'test/mock/*.json', watched: true, served: true, included: false }
    ],
    exclude : [
      'node_modules'
    ],
    autoWatch : true,
    frameworks: ['jasmine-jquery', 'jasmine'],
    browsers : ['Chrome'],
    plugins : [
      'karma-jasmine-jquery',
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
      'karma-babel-preprocessor'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/*.js': ['babel'],
      'test/*.spec.js': ['babel'],
      'src/parserinator.js': ['coverage']
    },
    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    }
  });
};
