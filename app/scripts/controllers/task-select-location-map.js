angular.module('donebytheway.controllers')
    .controller('TaskSelectLocationMapCtrl', function($scope, locationReminder, $ionicActionSheet, $state, $log, $timeout, $ionicNavBarDelegate, $stateParams, taskService, locationService, leafletEvents, leafletData, geolocation) {
        var taskId = $stateParams.taskId;

        $scope.locationReminder = locationReminder;

        $scope.events = {
            map: {
                enable: ['zoomend'],
                logic: 'emit'
            }
        };
        $scope.center = {
            lat: locationReminder.location.coords.latitude,
            lng: locationReminder.location.coords.longitude,
            zoom: 12
        };
        $scope.markers = {
            marker: {
                draggable: true,
                message: "Lokalizacja zadania",
                lat: locationReminder.location.coords.latitude,
                lng: locationReminder.location.coords.longitude,
                icon: {}
            }
        };
        $scope.paths = {
            circle: {
                type: "circle",
                radius: locationReminder.radius,
                latlngs: $scope.markers.marker,
                clickable: false
            }
        };
        $scope.maxRadiusRange = locationReminder.radius;
        updateMaxRadiusRange();
        $scope.$on('leafletDirectiveMap.zoomend', updateMaxRadiusRange);

        $scope.edit = function() {
            var newName = prompt('Wpisz nazwę lokalizacji', locationReminder.location.name);
            if (newName) {
                locationReminder.location.name = newName;
            }
        };

        $scope.save = function() {
            var actionSheet = $ionicActionSheet.show({
                buttons: [{
                    text: 'Zapisz'
                }, {
                    text: 'Zapisz i dodaj nową lokalizację'
                }],
                cancelText: 'Anuluj',
                buttonClicked: function(index) {
                    var newLocation = locationService.createNew({
                        name: locationReminder.location.name,
                        coords: {
                            latitude: $scope.markers.marker.lat,
                            longitude: $scope.markers.marker.lng
                        }
                    });
                    switch (index) {
                        case 0:
                            saveReminder(newLocation);
                            break;
                        case 1:
                            saveReminderAndAddLocation(newLocation);
                            break;
                    }
                    $state.go('task.locations', {
                        taskId: taskId
                    })
                    return true;
                }
            })
        };

        $scope.chooseWhenIgetCloser = function() {
            locationReminder.whenIgetCloser = true;
        };
        $scope.chooseWhenIamLeaving = function() {
            locationReminder.whenIgetCloser = false;
        };

        $scope.goBack = function() {
            $ionicNavBarDelegate.back();
        };

        function saveReminder(newLocation) {
            taskService.findById(taskId).then(function(task) {
                locationReminder.location = newLocation;
                locationReminder.radius = $scope.paths.circle.radius;
                if (task.locationReminders.indexOf(locationReminder) < 0) {
                    task.locationReminders.push(locationReminder);
                }
                taskService.saveChanges();
                taskService.syncLocationReminder(task);
            });
        };

        function saveReminderAndAddLocation(newLocation) {
            saveReminder(newLocation);
            locationService.add(newLocation);
            locationService.saveChanges();
        };

        function updateMaxRadiusRange() {
            leafletData.getMap().then(function(map) {
                var bounds = map.getBounds();
                var boundsDistanceRadius = geolocation.getDistance(bounds.getNorthWest(), bounds.getSouthEast()) * 1000 / 2;
                if (boundsDistanceRadius > $scope.paths.circle.radius) {
                    $scope.maxRadiusRange = boundsDistanceRadius;
                    $scope.paths.circle.radius -= 1;
                    //fucked up way, but it works
                    $timeout(function() {
                        $scope.paths.circle.radius += 1;
                    });
                }
            });
        }
    });
