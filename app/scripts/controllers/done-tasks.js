angular.module('donebytheway.controllers')
    .controller('DoneTasksCtrl', function ($scope, taskService) {
        $scope.tasks = [];
        $scope.subTitle = 'Wykonane';
        taskService.getAllDoneTasks().then(function (tasks) {
        	tasks.forEach(function (task) {
        		task.selected = false;
        	});
            $scope.tasks = tasks;
        });
    });
