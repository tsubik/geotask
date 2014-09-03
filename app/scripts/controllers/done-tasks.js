angular.module('donebytheway.controllers')
.controller('DoneTasksCtrl', function($scope,taskService){
	$scope.tasks = [];
	taskService.getAllDoneTasks().then(function(tasks){
		$scope.tasks = tasks;
	})
});
