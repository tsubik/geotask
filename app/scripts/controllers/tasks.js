angular.module('donebytheway.controllers')
.controller('TasksCtrl', function($scope,$state,$log,$location,$ionicSideMenuDelegate, taskService){
    $scope.tasks = [];
    if($state.is('app.nearby-tasks')){
        $scope.title = 'Zadania w pobliżu';
    } 
    else{
        $scope.title = 'Wszystkie zadania';
    }    

    function getTasksByState(){
        if($state.is('app.nearby-tasks')){
            return taskService.findNearbyTasks();
        } 
        return taskService.getAllTasks();    
    }

    $scope.isLoading = true;

    $scope.$watch('filter', function(newValue, oldValue){
        if(newValue === oldValue){
            return;
        }
        getTasksByState().then(function(_tasks){
            $scope.$apply(function(){
                if(newValue===''){
                    $scope.tasks = _tasks;
                }
                else{
                    $scope.tasks = _tasks.filter(function(t){
                        return t.note.indexOf(newValue) >= 0;
                    });  
                }
            });
        });
    });

    getTasksByState().then(function(result){
        $scope.$apply(function(){
            $scope.tasks = result;
            $scope.isLoading = false;    
        });
    });

    var selectedTask = function(item) { return item.selected; };

    $scope.openMenuSettings = function(){

    };

    $scope.addNewTask = function(){
        taskService.createdTask = taskService.createNew();
        $location.path('/task/'+taskService.createdTask.id);
    };

    $scope.cancelSelections = function(){
        angular.forEach($scope.tasks, function(task){
            task.selected = false;
        });
    };

    $scope.markSelectedTasksAsDone = function(){
        var selectedTasks = $scope.tasks.filter(selectedTask);
        angular.forEach(selectedTasks, function(task){
            taskService.markAsDone(task);
        });
        taskService.saveChanges();
    };

    $scope.removeSelectedTasks = function(){;
        var selectedTasks = $scope.tasks.filter(selectedTask);
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
        var task = $scope.tasks.filter(selectedTask)[0];
        $location.path('/task/'+task.id+'/select-location');
    };

    $scope.anyTaskSelected = function(){
        return $scope.tasks.filter(selectedTask).length > 0;
    };
    $scope.onlyOneSelected = function(){
        return $scope.tasks.filter(selectedTask).length === 1;
    };
    $scope.selectedTaskCount = function(){
        return $scope.tasks.filter(selectedTask).length;
    };

    $scope.editSelectedTask = function(){
        var task = $scope.tasks.filter(selectedTask)[0];
        $location.path('/task/'+task.id);
    };

    $scope.isSearching = false;
    $scope.search = function(){
        $scope.isSearching = true;
    };
    $scope.cancelSearch = function(){
        $scope.filter = '';
        $scope.isSearching = false;
    };
});
