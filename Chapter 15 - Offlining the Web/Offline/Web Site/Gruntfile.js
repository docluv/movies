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
            files: ['Gruntfile.js', 'js/debug/*.js']
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
                        'css/debug/toolbar.css',
                        'css/debug/touch.css',
                        'css/debug/panorama.css',
                        'css/debug/movie.app.home-view.css',
                        'css/debug/movie.app.forms.css',
                        'css/debug/movie-grid.css',
                        'css/debug/movie.app.login-view.css',
                        'css/debug/movie.app.maps-view.css',
                        'css/debug/movie.app.movie-view.css',
                        'css/debug/movie.app.movies-view.css',
                        'css/debug/movie.app.nav.css',
                        'css/debug/movie.app.news-view.css',
                        'css/debug/movie.app.profile-view.css',
                        'css/debug/movie.app.search-view.css',
                        'css/debug/movie.app.theaters-view.css']
                }
            }
        },
        uglify: {
            options: {
                compress: true
            },
            //    options: {
            //        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            //'<%= grunt.template.today("yyyy-mm-dd") %> */'
            //    },

            applib: {
                src: [
            //    'js/libs/add2home.js',
                //'js/libs/helper.js',
                'js/libs/mbp.js',
                'js/libs/reqwest.js',
                'js/libs/backpack.js',
                'js/libs/deeptissue.js',
                'js/libs/toolbar.js',
                'js/libs/mustache.js',
                'js/libs/panorama.js',
                'js/libs/spa.js',
                'js/libs/rqData.js',
                'js/debug/movie.app.js',
                'js/debug/movie.app.api.js',
                'js/debug/movie.app.grid.js',
                'js/debug/movie.app.home-view.js',
                'js/debug/movie.app.account-view.js',
                'js/debug/movie.app.login-view.js',
                'js/debug/movie.app.maps-view.js',
                'js/debug/movie.app.movie-view.js',
                'js/debug/movie.app.movies-view.js',
                'js/debug/movie.app.news-view.js',
                'js/debug/movie.app.search-view.js',
                'js/debug/movie.app.profile-view.js',
                'js/debug/movie.app.search-view.js',
                'js/debug/movie.app.theaters-view.js',
                'js/debug/movie.app.bootstrap.js'
                ],
                dest: 'js/applib.js'
            }

        }
    });

    //grunt.loadnpmtasks('grunt-contrib-uglify');
    //grunt.loadnpmtasks('grunt-contrib-cssmin');
    //grunt.loadnpmtasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('default', [/*'jshint', */'uglify', 'cssmin']);

};