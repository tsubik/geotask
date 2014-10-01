angular.module('donebytheway.controllers')
.controller('TaskSelectLocationCtrl', function($scope, $log, $state, $stateParams, geolocation, locationService, taskService){
    var taskId = $stateParams.taskId;
    $scope.locations = [];
    $scope.location = '';

    activate();

    $scope.$on('ionSearchPlace.locationSelected', function(event, location){
        $scope.selectLocation(locationService.createNew({
            name: location.display_name,
            coords: {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon)
            }
        }));
    });

    $scope.selectCurrentLocation = function(){
        $scope.selectLocation($scope.currentPosition);
    };

    $scope.selectLocation = function(location){
        locationService.selectedLocationReminder = {
            id: UUIDjs.create().toString(),
            location: angular.copy(location),
            radius: 1000,
            whenIgetCloser: true
        };
        $state.go('task-select-location-map', { taskId: taskId});
    };

    $scope.goBackToTask = function(){
        $state.go('task.locations', { taskId: taskId});
    };

    function activate(){
        locationService.getAll().then(function(locations){
            $scope.locations = locations;
        });
        geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
                $scope.currentPosition = {
                    display_name: 'Bieżąca lokalizacja',
                    name: 'Bieżąca lokalizacja',
                    coords: position.coords
                };
            })
        }, function() {
           
        });
    }
});
