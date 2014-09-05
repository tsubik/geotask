angular.module('donebytheway.controllers')
    .controller('LocationMapCtrl', function($scope,$ionicActionSheet, $location, $log, $timeout, $ionicNavBarDelegate, $stateParams, taskService, locationService, leafletEvents, leafletData, geolocation) {
        
        var taskId = $stateParams.taskId;
        var marker = {
            draggable: true,
            message: "Lokalizacja zadania",
            icon: {}
        };
        var locationReminder = locationService.selectedLocationReminder;

        if (!locationReminder) {
            $location.path('/');
            return;
        }
        $scope.maxRadiusRange = 5000;

        marker.lat = locationReminder.location.coords.latitude;
        marker.lng = locationReminder.location.coords.longitude;
        $scope.locationName = locationReminder.location.name;
        $scope.whenIgetCloser = locationReminder.whenIgetCloser;
        
        $scope.events = {
            map: {
                enable: ['zoomend'],
                logic: 'emit'
            }
        };
        $scope.center = {
            lat: marker.lat,
            lng: marker.lng,
            zoom: 12
        };

        $scope.$on('leafletDirectiveMap.zoomend', function(e) {
            leafletData.getMap().then(function(map) {
                var bounds = map.getBounds();
                var boundsDistanceRadius = geolocation.getDistance(bounds.getNorthWest(), bounds.getSouthEast()) * 1000 / 2;
                if(boundsDistanceRadius > $scope.paths.circle.radius){
                    $scope.maxRadiusRange = boundsDistanceRadius;    
                }
            });
        });


        $scope.paths = {
            circle: {
                type: "circle",
                radius: locationReminder.radius,
                latlngs: marker,
                clickable: false
            }
        };
        $scope.markers = {
            marker: marker
        };


        function saveReminder(newLocation){
            taskService.findById(taskId).then(function(task){
                locationReminder.location = newLocation;
                locationReminder.radius = $scope.paths.circle.radius;
                locationReminder.whenIgetCloser = $scope.whenIgetCloser;

                if(task.locationReminders.indexOf(locationReminder) < 0){
                    task.locationReminders.push(locationReminder);    
                }
                taskService.saveChanges();
            });
        };

        function saveReminderAndAddLocation(newLocation){
            saveReminder(newLocation);
            locationService.add(newLocation);
            locationService.saveChanges();
        };

        $scope.edit = function(){
            var newName = prompt('Wpisz nazwę lokalizacji', $scope.locationName);
            if(newName){
                $scope.locationName = newName;
            }
        };

        $scope.save = function() {
            var actionSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Zapisz' },
                    { text: 'Zapisz i dodaj nową lokalizację' }
                ],
                cancelText: 'Anuluj',
                buttonClicked: function(index){
                    var newLocation = locationService.createNew({
                        name: $scope.locationName,
                        coords: {
                            latitude: marker.lat,
                            longitude: marker.lng
                        }
                    });
                    switch(index){
                        case 0:  
                            saveReminder(newLocation);
                            break;
                        case 1: 
                            saveReminderAndAddLocation(newLocation);
                            break;
                    }
                    $location.path('/task/'+taskId+'/locations');
                    return true;
                }
            })
        };

        $scope.chooseWhenIgetCloser = function() {
            $scope.whenIgetCloser = true;
        };
        $scope.chooseWhenIamLeaving = function() {
            $scope.whenIgetCloser = false;
        };

        $scope.goBack = function() {
            $ionicNavBarDelegate.back();
        };
    });