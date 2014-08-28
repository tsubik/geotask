angular.module('donebytheway.controllers')
.controller('DoneTasksCtrl', function($scope,taskService){
    $scope.tasks = taskService.doneTasks;
});
