angular.module('donebytheway.controllers')
    .controller('TaskCtrl', function($scope, task, $ionicActionSheet, $stateParams, $log, $location, $state, $ionicModal, locationService, taskRepetitionService, repetitionFrequency, taskService) {
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

        $scope.addNewLocation = function() {
            taskService.saveChanges();
            $state.go('task-select-location', { taskId: task.id });
        };

        $scope.changeLocation = function(locationReminder) {
            locationService.selectedLocationReminder = locationReminder;
            $state.go('task-select-location-map', { taskId: task.id });
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
                    $state.go('main-menu.tasks');
                }
            });
        }
    });
