angular.module('donebytheway.controllers')
    .controller('TaskCtrl', function($scope,$ionicActionSheet, $stateParams, $log, $location, $state, $ionicModal, locationService, taskRepetitionService, repetitionFrequency, taskService) {
        var taskId = $stateParams.taskId;
        var task;
        $scope.taskId = taskId;
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
        };

        $scope.more = function(){
            var actionSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Odchacz jako wykonane' }
                ],
                destructiveText: 'Usuń',
                cancelText: 'Anuluj',
                buttonClicked: function(index){
                    switch(index){
                        case 0:  
                            taskService.markAsDone(task);
                            taskService.saveChanges();
                            break;
                    }
                    return true;
                },
                destructiveButtonClicked: function(){
                    taskService.remove(task);
                    taskService.saveChanges();
                    $state.go('app.tasks');
                }
            });
        }
    });
