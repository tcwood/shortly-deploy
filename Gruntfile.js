module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options: {
        separator: ';\n' 
      },
      client: {
        src: ['public/client/*.js'],
        dest: 'public/dist/client.js'
      },
      lib: {
        src: ['public/lib/*.js'],
        dest: 'public/dist/lib.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/client.min.js': ['public/dist/client.js'],
          'public/dist/lib.min.js': ['public/dist/lib.js'] 
        }
      }
    },

    eslint: {
      target: [
        'public/client/*.js' 
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.js': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    clean: ['public/dist/client.js', 'public/dist/lib.js'],

    shell: {
      prodServer: {
        command: 'git push live master'
      },
      github: {
        command: 'git push origin master'
      },
      commit: {
        command: 'git add . && git commit'
      },
      kill: {
        command: 'kill -kill `lsof -t -i tcp:4568`'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([
      'nodemon', 'watch'
    ]);
  });

  grunt.registerTask('commit', function(target) {
    grunt.task.run('shell:commit');
  });

  grunt.registerTask('push', function(target) {
    grunt.task.run([
      'shell:prodServer'
    ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('build', [
    'concat', 'uglify', 'cssmin', 'clean'
  ]);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([
        'eslint', 'build', 'test', 'shell:github', 'push'
      ]);
    } else {
      grunt.task.run([
        'eslint', 'test', 'server-dev'
      ]);
    }
  });
};