angular.module('donebytheway.controllers')
    .controller('AppCtrl', function($scope, $window, $state, $log, $location, taskService, locationService, $ionicSideMenuDelegate, $ionicNavBarDelegate) {
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.reset = function(){
        	// window.localStorage.clear();
        	// taskService.tasks = [];
        	// locationService.locations = [];
            $window.location.reload();
        }

        $scope.getPreviousTitle = function() {
            return $ionicNavBarDelegate.getPreviousTitle();
        };
    });
