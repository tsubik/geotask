angular.module('donebytheway.controllers')
    .controller('AppCtrl', function($scope, $state, $log, $location, taskService, locationService, $ionicSideMenuDelegate, $ionicNavBarDelegate) {
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.reset = function(){
        	window.localStorage.clear();
        	taskService.tasks = [];
        	locationService.locations = [];
        	$state.go('app.tasks', { reload: true });
        }

        $scope.getPreviousTitle = function() {
            return $ionicNavBarDelegate.getPreviousTitle();
        };
    });
