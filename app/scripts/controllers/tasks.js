angular.module('donebytheway.controllers')
    .controller('TasksCtrl', function ($scope, $filter, toasty, $state, $log, taskService) {
        $scope.tasks = [];
        $scope.filteredTasks = [];
        if ($state.is('main-menu.nearby-tasks')) {
            $scope.subTitle = 'Zadania w pobliżu';
        } else {
            $scope.subTitle = 'Wszystkie zadania';
        }

        function getTasksByState() {
            if ($state.is('main-menu.nearby-tasks')) {
                return taskService.findNearby();
            } else if ($state.is('main-menu.done-tasks')) {
                return taskService.getCompleted();
            }
            // else if($state.is('main-menu.today-tasks')) {
            //     return taskService.
            // }
            return taskService.getNotCompleted();
        }

        $scope.isLoading = true;

        getTasksByState().then(function (tasks) {
            tasks.forEach(function (task) {
                task.selected = false;
            });
            $scope.tasks = tasks;
            $scope.filteredTasks = $scope.tasks;
            $scope.isLoading = false;
        });

        $scope.$watch('filter', function (newValue, oldValue) {
            $scope.filteredTasks = $filter('filterBy')($scope.tasks, ['note'], newValue);
        });

        $scope.addNewTask = function () {
            taskService.createdTask = taskService.createNew();
            $state.go('task.default', {
                taskId: taskService.createdTask.id
            });
        };

        $scope.cancelSelections = function () {
            angular.forEach($scope.tasks, function (task) {
                task.selected = false;
            });
        };

        $scope.markSelectedTasksAsDone = function () {
            var selectedTasks = $scope.tasks.filter(selectedTaskFilter);
            angular.forEach(selectedTasks, function (task) {
                taskService.markAsDone(task);
                $scope.tasks.splice($scope.tasks.indexOf(selectedTasks), 1);
            });
            taskService.saveChanges();
            // toasty.pop.success({
            //     title: "Success!",
            //     msg: 'Click to change me.',
            //     timeout: 0,
            //     duration: 2000
            // });
        };

        $scope.removeSelectedTasks = function () {
            var selectedTasks = $scope.tasks.filter(selectedTaskFilter);
            angular.forEach(selectedTasks, function (task) {
                taskService.remove(task);
                $scope.tasks.splice($scope.tasks.indexOf(selectedTasks), 1);
            });
            taskService.saveChanges();
        };

        $scope.editTask = function (task) {
            if ($scope.anyTaskSelected()) {
                $scope.selectTask(task);
            } else {
                $state.go('task.default', {
                    taskId: task.id
                });
            }
        };

        $scope.selectTask = function (task) {
            task.selected = !task.selected;
        };

        $scope.anyTaskSelected = function () {
            return $scope.tasks.filter(selectedTaskFilter).length > 0;
        };
        $scope.onlyOneSelected = function () {
            return $scope.tasks.filter(selectedTaskFilter).length === 1;
        };
        $scope.selectedTaskCount = function () {
            return $scope.tasks.filter(selectedTaskFilter).length;
        };

        $scope.editSelectedTask = function () {
            var task = $scope.tasks.filter(selectedTaskFilter)[0];
            $state.go('task.default', {
                taskId: task.id
            });
        };

        $scope.isSearching = false;
        $scope.search = function () {
            $scope.isSearching = true;
        };
        $scope.cancelSearch = function () {
            $scope.filter = '';
            $scope.isSearching = false;
        };

        $scope.itemTouch = function ($event) {
            angular.element($event.target).addClass('preSelected');
        };

        $scope.itemRelease = function ($event) {
            angular.element($event.target).removeClass('preSelected');
        };

        function selectedTaskFilter(item) {
            return item.selected;
        }
    });
