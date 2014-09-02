angular.module('donebytheway.controllers')
.controller('DoneTasksCtrl', function($scope,taskService){
    taskService.initialized.then(function(){
    	$scope.tasks = taskService.doneTasks;
    	$scope.apply();	
    });
});
