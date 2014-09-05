angular.module('donebytheway.controllers')
    .controller('LocationCtrl', function($scope, $state, $location, $log, $timeout, $ionicNavBarDelegate, $stateParams, locationService, leafletEvents) {
        var locationId = $stateParams.locationId;
        $scope.map = {
            center: {
                lat: 50,
                lng: 50,
                zoom: 12
            }
        };
        $scope.markers = {
            marker: {
                lat: 50,
                lng: 50,
                draggable: false,
                message: location.name,
                icon: {}
            }
        };

        locationService.findById(locationId).then(function(location) {
            if (!location) {
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
        });

        $scope.edit = function() {
            var newLocationName = prompt('Nazwa lokalizacji', $scope.location.name);
            if (newLocationName) {
                $scope.location.name = newLocationName;
            }
        }
    });
