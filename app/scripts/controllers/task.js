angular.module('donebytheway.controllers')
    .controller('TaskCtrl', function($scope, $stateParams, $log, $location, $state, $ionicModal, locationService, taskRepetitionService, repetitionFrequency, taskService) {
        var taskId = $stateParams.taskId;
        var task;

        taskService.findById(taskId).then(function(t){
            task = t;
            if (!task) {
                task = taskService.createNew();
            }
            $scope.task = task; 
            $ionicModal.fromTemplateUrl('views/task-repetition-popup.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.repetitionModal = modal;
            });

            $scope.$on('$destroy', function() {
                $scope.repetitionModal.remove();
            });
        });
        

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

        $scope.changeLocationReminder = function(locationReminder) {
            locationService.selectedLocationReminder = locationReminder;
            $location.path('/task/{0}/location-map'.format(taskId));
        };

        $scope.removeLocation = function(locationReminder) {
            var index = task.locationReminders.indexOf(locationReminder);
            task.locationReminders.splice(index, 1);
        };

        $scope.changeRepetition = function() {
            $scope.repetitionModal.show();
        }
    });
