angular.module('ContactsApp')
	.controller('ListController',function($scope,Contact,$location){
		$scope.contacts = Contact.query();
		$scope.fields = ['firstName','lastName'];


		$scope.sort = function(field){
			$scope.sort.field = field;
			$scope.sort.order = !$scope.sort.order;
		};

		$scope.show = function(id){
			$location.url('/contact/'+id);
		}


		$scope.sort.field = 'firstName';
		$scope.sort.order = false;
	})
	.controller('NewController',function($scope,Contact,$location){
		$scope.contact = new Contact({
				firstName:['','text'],
				lastName:['','text'],
				email:['','email'],
				cellPhone:['','tel'],
				homePhone:['','tel'],
				birthday:['','date'],
				website:['','url'],
				address:['','text']
		});


		$scope.save = function(){
			if ($scope.newContact.$invalid) {
				$scope.$broadcast('record:invalid');
			}else{
				$scope.contact.$save();
				$location.url('/contacts');
			}
		};

		$scope.show = function(id){
			$location.url('/contact/'+id);
		}
	})
	.controller('SingleController',function($scope,$location,Contact,$routeParams){
		$scope.contact = Contact.get({ id: parseInt($routeParams.id, 10) }); 
        $scope.delete = function () {
            $scope.contact.$delete();
            $location.url('/contacts');
        };
	});