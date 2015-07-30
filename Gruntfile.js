module.exports = function(grunt){
    grunt.initConfig({
        env : {
            dev : {
                NODE_ENV : 'development'
            },
            test : {
                NODE_ENV : 'test'
            }
        },
        
        nodemon : {
                dev: {
                    script: 'server/server.js',
                    options: {
                        ext: 'js,html',
                        watch: ['server/server.js', 'config/**/*.js', 'app/**/*.js']
                    }
                }
        },
        karma : {
            unit : {
                configFile : 'karma.conf.js'
            }            
        },
        jshint: {
            all: {
                src: [  'server/server.js',
                        'server/**/*.js', 
                        'public/controllers/**/*.js', 
                        'public/services/**/*.js', 'public/angularApp.js']
            }
        },
        csslint: {
            all: {
                src: 'public/stylesheets/*.css'
            }
        },
        watch: {
            js: {
                files: ['server/server.js', 
                        'server/**/*.js',  
                        'public/controllers/**/*.js', 
                        'public/services/*.js', 'public/angularApp.js'],
                tasks: ['jshint']
            },
            css: {
                files: 'public/stylesheets/*.css',
                tasks: ['csslint']
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                    options: {
                    logConcurrentOutput: true
                }
            }
        },
        debug: {
            tasks: ['nodemon:debug', 'watch', 'node-inspector'],
            options: {
                logConcurrentOutput: true
            }
        },
        'node-inspector': {
            debug: {}
        }
    });
    
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-karma');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-node-inspector');
    
    //grunt.registerTask('default', ['env:dev', 'lint', 'concurrent']); 
    grunt.registerTask('default', ['env:dev', 'concurrent']);
    grunt.registerTask('debug', ['env:dev', 'concurrent:debug']);
    grunt.registerTask('test', ['env:test', 'karma']);
    //grunt.registerTask('lint', ['jshint', 'csslint']);
};