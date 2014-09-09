angular.module('donebytheway.controllers')
.controller('LocationsCtrl', function($scope, $log, $state, locationService){
	$scope.locations = [];
    $scope.subTitle = "Zapamiętane lokalizacje";
    locationService.getAll().then(function(locations){
        $scope.locations = locations;
    });

    $scope.locationOnClick = function(location){
        if($scope.anyLocationsSelected()){
        	$scope.locationOnHold(location);
        }
        else{
            $state.go('location', { locationId: location.id });
        }
    };

    $scope.locationOnHold = function(location){
    	location.selected = !location.selected;
    };

    $scope.cancelSelections = function(){
        angular.forEach($scope.locations, function(location){
            location.selected = false;
        });
    };
    $scope.showSelected = function(){
    	var location = $scope.locations.filter(selectedLocationFilter)[0];
    	$state.go('location', { locationId: location.id });
    }

    $scope.removeSelectedLocations = function(){
        var selectedLocations = $scope.locations.filter(selectedLocationFilter);
        angular.forEach(selectedLocations, function(location){
            locationService.remove(location);
        });
        locationService.saveChanges();
    };

    $scope.anyLocationsSelected = function(){
        return $scope.locations.filter(selectedLocationFilter).length > 0;
    };
    $scope.onlyOneSelected = function(){
        return $scope.locations.filter(selectedLocationFilter).length === 1;
    };
    $scope.selectedLocationsCount = function(){
        return $scope.locations.filter(selectedLocationFilter).length;
    };

    function selectedLocationFilter(item) { return item.selected; };
});
