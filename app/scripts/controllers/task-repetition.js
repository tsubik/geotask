angular.module('donebytheway.controllers')
    .controller('TaskRepetitionCtrl', function ($scope, taskRepetitionService, dayOfWeek, repetitionFrequency) {
        $scope.frequencies = [{
            value: repetitionFrequency.DAILY,
            title: 'Codziennie'
        }, {
            value: repetitionFrequency.WEEKLY,
            title: 'Co tydzień'
        }, {
            value: repetitionFrequency.MONTHLY,
            title: 'Co miesiąc'
        }, {
            value: repetitionFrequency.ANNUALLY,
            title: 'Co rok'
        }];
        $scope.dayOfWeek = dayOfWeek;
        $scope.repetitionFrequency = repetitionFrequency;
        $scope.selectedFrequency = $scope.task.repetition.frequency;
        $scope.daysOfWeek = $scope.task.repetition.daysOfWeek;

        $scope.isDayOfWeek = function (dof) {
            return ($scope.task.repetition.daysOfWeek & dof);
        };

        $scope.toggleDay = function (dof) {
            $scope.task.repetition.daysOfWeek ^= dof;
        };

        $scope.changeFrequency = function () {
            $scope.task.repetition = taskRepetitionService.createNew($scope.selectedFrequency);
        };

        $scope.closeRepetitionModal = function () {
            $scope.repetitionModal.hide();
        };
    });
