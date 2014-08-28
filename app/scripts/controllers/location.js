angular.module('donebytheway.controllers')
    .controller('LocationCtrl', function($scope, $location, $log, $timeout, $ionicNavBarDelegate, $stateParams, locationService, leafletEvents) {
        var locationId = $stateParams.locationId;

        var location = locationService.findById(locationId);
        if(!location){
            $location.path('/');
        }
        $scope.location = location;

        var marker = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            draggable: false,
            message: location.name,
            icon: {}
        };

        $scope.map = {
            center: {
                lat: marker.lat,
                lng: marker.lng,
                zoom: 12
            }
        };

        $scope.markers = {
            marker: marker
        };

        $scope.goBack = function() {
            $ionicNavBarDelegate.back();
        };

        $scope.edit = function(){
            var newLocationName = prompt('Nazwa lokalizacji',$scope.location.name);
            if(newLocationName){
                $scope.location.name = newLocationName;
            }
        }
    });
