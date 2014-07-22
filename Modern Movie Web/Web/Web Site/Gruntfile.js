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
                        'css/dev/site.css',
                        'css/dev/animations.css',
                        'css/dev/touch.css',
                        'css/dev/ui/*.css',
                        'css/dev/views/*.css',
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
                  'js/libs/backpack.js',
                  'js/libs/reqwest.min.js',
                  'js/libs/rqdata.js',
                  'js/libs/rottentomatoes.js',
                  'js/libs/fakeTheaters.js',
                  'js/libs/movie-data.js',
                  'js/libs/mustache.js',
                  'js/libs/mustacheViewEngine.js',
                  'js/libs/spa.js',
                  'js/libs/class.js',
                  'js/libs/view.js',
                  'js/libs/listView.js',
                  'js/libs/formView.js',
                  'js/libs/deeptissue.js',
                  'js/libs/panorama.js',
                  'js/libs/toolbar.js',

                'js/dev/movie.app.js',
                'js/dev/ui/*.js',
                'js/dev/views/*.js',
                'js/dev/movie.app.bootstrap.js'
                ],
                dest: 'js/applib.js'
            }
        },
        bump: {
            options: {
                files: ['app.cache'],
                updateConfigs: [],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        }

    });

    // Default task.
    grunt.registerTask('default', [/*'jshint', 'qunit', */'uglify', 'cssmin']);

};