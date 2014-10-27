angular.module('ContactsApp')
	.value('FieldTypes',{
		text:['Text','should be Text'],
		email:['Email','should be Email'],
		number:['Number','should be Number'],
		date:['Date','should be Date'],
		datetime:['Datetime','should be Datetime'],
		month:['Month','should be Month'],
		time:['Time','should be Time'],
		week:['Week','should be Week'],
		url:['URL','should be Url',''],
		tel:['Tel','should be Tel',''],
		color:['Color','should be Color']
	})
	.directive('formField',function($timeout,FieldTypes){
		return {
			restrict:'EA',
			templateUrl:'views/form-field.html',
			replace:true,
			scope:{
				record:'=',//two way binding
				field:'@',
				required:'@',
				live:'@'
			},
			link:function($scope,element,attr){ //runs during the creation of the directive
				
				$scope.$on('record:invalid',function(){
					$scope[$scope.field].$setDirty();
					console.log($scope.field);
				});

				$scope.fields = FieldTypes;

				$scope.remove = function(field){
					delete $scope.record[field];
					$scope.blurUpdate();
				};

				$scope.blurUpdate = function(){
					if($scope.live !== 'false'){
						$scope.record.$update(function(updatedRecord){
							$scope.record = updatedRecord;
						});
					}
				};

				var saveTimeout;

				$scope.update = function(){
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout($scope.blurUpdate,1000);
				};

			}
		}
	})
	.directive('newField',function($filter,FieldTypes){
		return {
			restrict:'EA',
			templateUrl:'views/new-field.html',
			replace:true,
			scope:{
				record:'=',
				live: '@'
			},
			require: '^form',//^ <- parent
			link:function($scope,element,attr,form){
				$scope.types = FieldTypes;
				$scope.field = {};
				$scope.show = function(type){
					$scope.field.type = type;
					$scope.display = true;
				};
				$scope.remove = function(){
					$scope.field = {};
					$scope.display = false;
				};
				$scope.add = function(){
					if(form.newField.$valid){
						$scope.record[$filter('camelCase')($scope.field.name)] = [$scope.field.value,$scope.field.type];
						$scope.remove();
					}
					if($scope.live !== 'false'){
						$scope.record.$update(function(updatedRecord){
							$scope.record = updatedRecord;
						});
					}
				};

			}
		}
	});