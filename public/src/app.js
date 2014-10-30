angular.module('ContactsApp',['ngRoute','ngResource','ngMessages'])
	.config(function($routeProvider,$locationProvider){
		
		$routeProvider.when('/contacts',{
			controller:'ListController',
			templateUrl:'views/list.html'
		})
		.when('/contacts/new',{
			controller:'NewController',
			templateUrl:'views/new.html'
		})
		.when('/contact/:id',{
			controller:'SingleController',
			templateUrl:'views/single.html'
		})
		.when('/settings',{
			controller:'SettingsController',
			templateUrl:'views/settings.html'
		})
		.otherwise({redirectTo:'/contacts'});

		$locationProvider.html5Mode(true); //dinamyc location change
	})
	.value('options',{})
	.run(function(options,Fields){
		Fields.get().success(function(data){
			options.displayed_field = data;
		});
	});