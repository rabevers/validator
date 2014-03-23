module.exports = function(grunt) {

    // configure the tasks
    grunt.initConfig({

        copy: {
            build: {
                cwd: 'src',
                src: [ '**', '!**/*.styl' ],
                dest: 'build',
                expand: true
            },
        },
        stylus: {
            build: {
                options: {
                    linenos: true,
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: 'source',
                    src: [ '**/*.styl' ],
                    dest: 'build',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            build: {
                expand: true,
                cwd: 'build',
                src: [ '**/*.css' ],
                dest: 'build'
            }
        },
        cssmin: {
            build: {
                files: {
                    'build/style.css': [ 'build/**/*.css' ]
                }
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'build/validator-min.js': [ 'src/**/*.js' ]
                }
            }
        },
        clean: {
            build: {
                src: [ 'build' ]
            },
            stylesheets: {
                src: [ 'build/**/*.css', '!build/style.css' ]
            },
            scripts: {
                src: [ 'build/**/*.js', '!build/validator.js,!build/validator-min.js' ]
            },
        },
        watch: {
            stylesheets: {
                files: 'src/**/*.styl',
                tasks: [ 'stylesheets' ]
            },
            copy: {
                files: [ 'src/**', '!src/**/*.styl' ],
                tasks: [ 'copy', 'test' ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: 'build',
                    hostname: '*'
                }}
       },
       jasmine: {
            src : 'src/**/*.js',
            options : {
                specs : 'test/**/*Spec.js',
                helpers : 'test/**/*Helper.js',
                vendor : 'lib/jquery-1.11.0.js'
            }
       },
       jshint : {
        all : [
            "Gruntfile.js",
            "test/spec/*.js",
            "src/**/*.js"
        ],
        options : {
            jshintrc : '.jshintrc'
        }
       }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // define the tasks
    grunt.registerTask(
        'test',
        'Test the validator javascript code',
        [ 'jshint', 'jasmine' ]
    );

    grunt.registerTask(
        'scripts',
        'Compiles the JavaScript files.',
        [ 'clean:scripts', 'uglify' ]
    );
    
    grunt.registerTask(
        'stylesheets',
        'Compiles the stylesheets.',
        [ 'clean:stylesheets', 'stylus', 'autoprefixer', 'cssmin' ]
    );

    grunt.registerTask(
        'build',
        'Compiles all of the assets and copies the files to the build directory.',
        [ 'clean:build', 'copy', 'stylesheets', 'scripts' ]
    );

    grunt.registerTask(
        'default',
        'Watches the project for changes, automatically builds them and runs a server.',
        [ 'build', 'test', 'connect', 'watch' ]
    );

};
