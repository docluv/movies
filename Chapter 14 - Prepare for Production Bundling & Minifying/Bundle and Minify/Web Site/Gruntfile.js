module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'js/debug/*.js']
        },
        jshint: {
            options: {
                browser: true
            }
        },
        concat: {
            app: {
                src: [
                'js/debug/love2dev.app.js',
                'js/debug/love2dev.app.api.js',
                'js/debug/love2dev.app.home-view.js',
                'js/debug/love2dev.app.article-view.js',
                'js/debug/love2dev.app.articles-view.js',
                'js/debug/love2dev.app.tags-view.js',
                'js/debug/love2dev.app.search-view.js',
                'js/debug/love2dev.app.events-view.js',
                'js/debug/love2dev.app.archive-view.js',
                'js/debug/love2dev.app.libraries-view.js',
                'js/debug/love2dev.app.presentations-view.js',
                'js/debug/love2dev.app.calendar-view.js',
                'js/debug/love2dev.bootstrap.js'
                ],
                dest: 'js/app.js',
                separator: ';'
            },
            license: {
                src: ['js/debug/license.txt',
                'js/deep-tissue.min.js'
                ],
                dest: 'js/deep-tissue.min.js',
                separator: ';'
            }

        },
        cssmin: {
            css: {
                src: [
                    'css/debug/site.css',
                    'css/debug/animations.css',
                    'css/debug/toolbar.css',
                    'css/debug/movie-grid.css',
                    'css/debug/movie.app.nav.css',
                    'css/debug/movie.app.forms.css',
                    'css/debug/movie.app.home-view.css',
                    'css/debug/movie.app.movie-view.css',
                    'css/debug/movie.app.movies-view.css',
                    'css/debug/movie.app.theaters-view.css',
                    'css/debug/movie.app.search-view.css',
                    'css/debug/movie.app.profile-view.css',
                    'css/debug/movie.app.news-view.css',
                    'css/debug/movie.app.maps-view.css',
                    'css/debug/movie.app.account-view.css',
                    'css/debug/movie.app.login-view.css'
                ],
                dest: 'css/site.min.css'
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
                'js/libs/mbp.js',
                'js/libs/reqwest.js',
                'js/libs/backpack.js',
                'js/libs/deeptissue.js',
                'js/libs/toolbar.js',
                'js/libs/mustache.js',
                'js/libs/spa.js',
                'js/libs/rqData.js',
                'js/debug/movie.app.js',
                'js/debug/movie.app.api.js',
                'js/debug/movie.app.grid-view.js',
                'js/debug/movie.app.home-view.js',
                'js/debug/movie.app.account-view.js',
                'js/debug/movie.app.movies-view.js',
                'js/debug/movie.app.movie-view.js',
                'js/debug/movie.app.login-view.js',
                'js/debug/movie.app.maps-view.js',
                'js/debug/movie.app.news-view.js',
                'js/debug/movie.app.profile-view.js',
                'js/debug/movie.app.search-view.js',
                'js/debug/movie.app.theaters-view.js',
                'js/debug/movie.bootstrap.js'
                ],
                dest: 'js/applib.js'
            }

        }
    });

    grunt.loadNpmTasks('grunt-contrib');

    // Default task.
    grunt.registerTask('default', ['uglify', 'cssmin']);

};