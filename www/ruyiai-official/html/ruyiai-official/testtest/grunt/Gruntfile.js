module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      compress: {
        files: {
          '../console/css/merge.min.css': 
        	  ['../console/css/bootstrap.min.css','../console/css/jquery-ui.css',
	         	'../console/css/font-awesome-ie7.min.css','../console/css/font-awesome.min.css',
	        	'../console/css/robot.css','../console/css/api_manager.css',
	        	'../console/css/api_manager_two.css','../console/css/new-user.css',
	        	'../console/css/angularDemo.css','../console/css/bootstrap-submenu.min.css',
	        	'../console/css/common.css'
	        	
	        	,'../console/css/action_set.css','../console/css/loading.css',
	        	'../console/css/skill_store.css','../console/css/jquery.Jcrop.min.css',
	        	'../console/css/import_knowledge_base.css','../console/css/log_statistics.css',
	        	'../console/css/jquery.Jcrop.min.css','../console/css/skill_store.css',
	        	'../console/css/star-rating.min.css','../console/css/swipe.min.css']
        }
      }
    },
    uglify: {
      "my_target": {
        "files": [
//		        {
//		         '../console/js/merge/merge_external.min.js': 
//		        	 ['../console/js/external/jquery.min.js',
//		        	  '../console/js/external/jquery-ui.js',
//		        	  '../console/js/external/angular.min.js',
//		        	  '../console/js/external/angular-ui-router.js',
//		        	  '../console/js/external/angular-sanitize.min.js',
//		        	  '../console/js/external/sortable.js',
//		        	  '../console/js/external/bootstrap.min.js',
//		        	  '../console/js/external/components.js',
//		        	  '../console/js/external/bootstrap-submenu.min.js',
//		        	  '../console/js/external/bootstrap-switch.js',
//		        	  '../console/js/external/customize.js',
//		        	  '../console/js/external/highcharts.js',
//		        	  '../console/js/external/highlight.js',
//		        	  '../console/js/external/jquery.color.js',
//		        	  '../console/js/external/jquery.Jcrop.min.js',
//		        	  '../console/js/external/moxie.js',
//		        	  '../console/js/external/plupload.dev.js',
//		        	  '../console/js/external/plupload.full.min.js',
//		        	  '../console/js/external/qiniu.js',
//		        	  '../console/js/external/qiniu.min.js',
//		        	  '../console/js/external/star-rating.min.js',
//		        	  '../console/js/external/ui.js',
//		        	  '../console/js/external/zh_CN.js',
//		        	  
//		        	  '../console/js/external/jquery.cookie.js']
//		        },
		        {
			         '../console/js/merge/common.min.js': ['../console/js/common/common.js']
			    },
		        {
		          '../console/js/merge/merge_local.min.js': ['../console/js/*.js']
		        }
		,
        {
        '../xiaomi-menu/js/xiaomi-menu.min.js': ['../xiaomi-menu/js/jquery.min.js','../xiaomi-menu/js/angular.min.js','../xiaomi-menu/js/jquery.cookie.js','../xiaomi-menu/js/common.js','../xiaomi-menu/js/smooth-scroll.min.js']
        },
        {
            '../xiaomi-ui-template/js/xiaomi-ui-template.min.js': 
            	['../xiaomi-ui-template/js/jquery.min.js'
            	 ,'../xiaomi-ui-template/js/angular.min.js'
            	 ,'../xiaomi-ui-template/js/angular-sanitize.min.js'
            	 ,'../xiaomi-ui-template/js/jquery.cookie.js'
            	 ,'../xiaomi-ui-template/js/components.js'
            	 ,'../xiaomi-ui-template/js/common.js']
            }
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // 默认任务
  grunt.registerTask('default', ['uglify','cssmin']);
}