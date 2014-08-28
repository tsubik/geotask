angular.module('donebytheway.controllers')
.controller('TasksCtrl', function($scope,$state,$log,$location,$ionicSideMenuDelegate, taskService){
    var tasks = [];
    var taskPromise;

    if($state.is('app.nearby-tasks')){
        taskPromise = taskService.findNearbyTasks();
        $scope.title = 'Zadania w pobliżu';
    } 
    else{
        taskPromise = taskService.getAllTasks();
        $scope.title = 'Wszystkie zadania';
    }
    $scope.isSearching = true;

    taskPromise.then(function(result){
        $scope.$apply(function(){
            $scope.tasks = tasks = result;
            $scope.isSearching = false;    
        });
    });

    var selectedTask = function(item) { return item.selected; };

    $scope.openMenuSettings = function(){

    };

    $scope.addNewTask = function(){
        var task = taskService.createNew();
        taskService.tasks.push(task);
        taskService.saveChanges();
        $location.path('/task/'+task.id);
    };

    $scope.cancelSelections = function(){
        angular.forEach(tasks, function(task){
            task.selected = false;
        });
    };

    $scope.markSelectedTasksAsDone = function(){
        var selectedTasks = tasks.filter(selectedTask);
        angular.forEach(selectedTasks, function(task){
            taskService.markAsDone(task);
        });
        taskService.saveChanges();
    };

    $scope.removeSelectedTasks = function(){;
        var selectedTasks = tasks.filter(selectedTask);
        angular.forEach(selectedTasks, function(task){
            taskService.remove(task);
        });
        taskService.saveChanges();
    };

    $scope.editTask = function(task){
        if($scope.anyTaskSelected()){
            $scope.selectTask(task);
        }
        else{
            $location.path('/task/'+task.id);
        }
    };

    $scope.selectTask = function(task){
        task.selected = !task.selected;
    };

    $scope.addLocationToTask = function(){
        var task = tasks.filter(selectedTask)[0];
        $location.path('/task/'+task.id+'/select-location');
    };

    $scope.anyTaskSelected = function(){
        return tasks.filter(selectedTask).length > 0;
    };
    $scope.onlyOneSelected = function(){
        return tasks.filter(selectedTask).length === 1;
    };
    $scope.selectedTaskCount = function(){
        return tasks.filter(selectedTask).length;
    };

    $scope.editSelectedTask = function(){
        var task = tasks.filter(selectedTask)[0];
        $location.path('/task/'+task.id);
    };
});
