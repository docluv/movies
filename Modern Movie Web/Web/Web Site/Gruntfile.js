module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            all: ['js/specs/**/*.html']
        },
        jshint: {
            options: {
                browser: true
            },
            files: ['Gruntfile.js', 'js/debug/*.js', 'js/libs/*.js']
        },
        cssmin: {
            sitecss: {
                options: {
                    banner: '/* My minified css file */'
                },
                files: {
                    'css/site.min.css': [
                        'css/debug/site.css',
                        'css/debug/animations.css',
                        'css/debug/ui/*.css',
                        'css/debug/views/*.css',
                    ]
                }
            }
        },
        uglify: {
            options: {
                compress: true
            },
            applib: {
                src: [
                'js/libs/dollarbill.min.js',
                'js/libs/reqwest.js',
                'js/libs/rottentomatoes.js',
                'js/libs/fakeTheaters.js',
                'js/libs/movie-data.js',
                'js/libs/backpack.js',
                'js/libs/deeptissue.js',
                'js/libs/toolbar.js',
                'js/libs/mustache.js',
                'js/libs/panorama.js',
                'js/libs/spa.js',
                'js/libs/rqData.js',
                'js/debug/movie.app.js',
                'js/debug/ui/*.js',
                'js/debug/views/*.js',
                'js/debug/movie.app.bootstrap.js'
                ],
                dest: 'js/applib.js'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', [/*'jshint', 'qunit', */'uglify', 'cssmin']);

};