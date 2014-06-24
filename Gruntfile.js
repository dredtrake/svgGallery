'use strict';
module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };
    grunt.initConfig({
        yeoman: yeomanConfig,
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/none/{,*/}*.js',
                '!<%= yeoman.app %>/none/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        uglify: {
            min: {
                // options: {
                //     sourceMap: true,
                //     sourceMapName: 'svg-gallery.map'
                // },
                files: {
                    'svg-gallery.min.js': ['svg-gallery.js']
                }
            }
        }
    });

    grunt.registerTask('build', [
        // 'concat',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'jshint',
        // 'test', coming soon !
        'build'
    ]);
};