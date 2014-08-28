angular.module('donebytheway.controllers')
.controller('LocationsCtrl', function($scope, $log, $location, geolocation, locationService, taskService){
	var locations = locationService.locations;
    $scope.locations = locations;

    var selectedLocation = function(item) { return item.selected; };

    $scope.locationOnClick = function(location){
        if($scope.anyLocationsSelected()){
        	$scope.locationOnHold(location);
        }
        else{
        	$location.path('/location/'+location.id);
    	}
    };

    $scope.locationOnHold = function(location){
    	location.selected = !location.selected;
    };

    $scope.cancelSelections = function(){
        angular.forEach(locations, function(location){
            location.selected = false;
        });
    };
    $scope.showSelected = function(){
    	var location = locations.filter(selectedLocation)[0];
    	$location.path('/location/'+location.id)
    }

    $scope.removeSelectedLocations = function(){
        var selectedLocations = locations.filter(selectedLocation);
        angular.forEach(selectedLocations, function(location){
            locationService.remove(location);
        });
        locationService.saveChanges();
    };

    $scope.anyLocationsSelected = function(){
        return locations.filter(selectedLocation).length > 0;
    };
    $scope.onlyOneSelected = function(){
        return locations.filter(selectedLocation).length === 1;
    };
    $scope.selectedLocationsCount = function(){
        return locations.filter(selectedLocation).length;
    };
});
