angular.module('donebytheway.controllers')
    .controller('MainMenuCtrl', function($scope, $window, $state, $log, $location, taskService, locationService, $ionicSideMenuDelegate, $ionicNavBarDelegate) {
        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.reset = function(){
        	// window.localStorage.clear();
        	// taskService.tasks = [];
        	// locationService.locations = [];
            $window.location.reload();
        };

        $scope.resetService = function(){
            dbtwBackgroundService.startService(function(r) {
                $window.plugins.toast.showLongBottom('Service started!');
            },
            function(e) {
                $window.plugins.toast.showLongBottom('Error starting service!');
                $log.log('Error starting service', e);
            });
        };

        $scope.getPreviousTitle = function() {
            return $ionicNavBarDelegate.getPreviousTitle();
        };
    });
