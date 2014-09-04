angular.module('donebytheway.controllers')
.controller('SelectLocationCtrl', function($scope, $log, $location, $stateParams, geolocation, locationService, taskService){
    var taskId = $stateParams.taskId;
    locationService.getAll().then(function(locations){
        $scope.locations = locations;
    });
    $scope.location = '';

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

    $scope.$on('ionSearchPlace.locationSelected', function(event, location){
        $scope.selectLocation(locationService.createNew({
            name: location.display_name,
            coords: {
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lon)
            }
        }));
    });

    $scope.addNewLocation = function(){
        $location.path('task/'+taskId+'/add-location');
    };

    $scope.selectCurrentLocation = function(){
        $scope.selectLocation($scope.currentPosition);
    };

    $scope.selectLocation = function(location){
        locationService.selectedLocationReminder = {
            id: UUIDjs.create().toString(),
            location: location,
            radius: 1000,
            whenIgetCloser: true
        };
        $location.path('task/'+taskId+'/location-map');
    };

    $scope.goBackToTask = function(){
        $location.path('task/'+taskId);
    };
});
