angular.module('donebytheway.controllers')
    .controller('LocationCtrl', function ($scope, location) {
        $scope.location = location;

        $scope.map = {
            center: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                zoom: 12
            }
        };

        $scope.markers = {
            marker: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
                draggable: false,
                message: location.name,
                icon: {}
            }
        };

        $scope.edit = function () {
            var newLocationName = prompt('Nazwa lokalizacji', location.name);
            if (newLocationName) {
                location.name = newLocationName;
            }
        };
    });
