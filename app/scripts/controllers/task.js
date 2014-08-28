angular.module('donebytheway.controllers')
    .controller('TaskCtrl', function($scope, $stateParams, $log, $location, $state, $ionicPopup, locationService, taskRepetitionService, repetitionFrequency, taskService) {
        var taskId = $stateParams.taskId;
        task = taskService.findById(taskId);
        if (!task) {
            task = taskService.createNew();
        }

        $scope.task = task;

        $scope.saveTask = function() {
            taskService.addIfNotAdded(task);
            taskService.saveChanges();
            taskService.createdTask = undefined;
            $state.go('app.tasks');
        };

        $scope.addNewLocation = function() {
            taskService.saveChanges();
            $location.path('/task/{0}/select-location'.format(taskId));
        };

        $scope.changeLocationReminder = function(locationReminder){
            locationService.selectedLocationReminder = locationReminder;
            $location.path('/task/{0}/location-map'.format(taskId));
        };

        $scope.removeLocation = function(locationReminder) {
            var index = task.locationReminders.indexOf(locationReminder);
            task.locationReminders.splice(index, 1);
        };

        $scope.changeRepetition = function() {
            $scope.model = {
                repetition: task.repetition || taskRepetitionService.createNew(repetitionFrequency.DAILY)
            };

            var popup = $ionicPopup.show({
                templateUrl: 'views/task-repetition-popup.html',
                scope: $scope,
                buttons: [{
                    text: 'Gotowe',
                    type: 'button-positive'
                }]
            }).then(function(res) {
                task.repetition = $scope.model.repetition;
            });
        }
    });
