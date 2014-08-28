angular.module('donebytheway.controllers')
    .controller('TaskRepetitionCtrl', function($scope,$log, taskService, taskRepetitionService, dayOfWeek, repetitionFrequency) {
        $scope.frequencies = [
            { value: repetitionFrequency.DAILY, title: 'Codziennie' },
            { value: repetitionFrequency.WEEKLY, title: 'Co tydzień'},
            { value: repetitionFrequency.MONTHLY, title: 'Co miesiąc'},
            { value: repetitionFrequency.ANNUALLY, title: 'Co rok'}
        ];
        $scope.dayOfWeek = dayOfWeek;
        $scope.repetitionFrequency = repetitionFrequency;
        $scope.selectedFrequency = $scope.model.repetition.frequency;
        $scope.daysOfWeek = $scope.model.repetition.daysOfWeek;

        $scope.isDayOfWeek = function(dof){
            return ($scope.model.repetition.daysOfWeek & dof);
        };

        $scope.toggleDay = function(dof){
            $scope.model.repetition.daysOfWeek ^= dof;
        };

        $scope.changeFrequency = function(){
            $scope.model.repetition = taskRepetitionService.createNew($scope.selectedFrequency);
        };
    });
