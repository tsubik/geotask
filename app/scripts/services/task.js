angular.module('donebytheway.services')
    .factory('taskService', function(locationService, geolocation, taskRepetitionService, repetitionFrequency) {
        var taskService = {
            tasks: [],
            doneTasks: [],
            createdTask: undefined,
            createNew: function() {
                return {
                    id: UUIDjs.create().toString(),
                    note: '',
                    dateFrom: undefined,
                    timeFrom: undefined,
                    dateTo: undefined,
                    timeTo: undefined,
                    locationReminders: [],
                    repetition: taskRepetitionService.createNew(repetitionFrequency.DAILY)
                };
            },
            markAsDone: function(task){
                this.remove(task);
                this.doneTasks.push(task);
            },
            addIfNotAdded: function(task){
                if(!this.tasks.firstOrDefault(function(t) {
                    return t.id === task.id;
                })){
                    this.tasks.push(task);
                }
            },
            remove: function(task){
                this.tasks.splice(this.tasks.indexOf(task), 1);
            },
            findById: function(taskId) {
                if(this.createdTask && this.createdTask.id === taskId){
                    return this.createdTask;
                }

                return this.tasks.firstOrDefault(function(task) {
                    return task.id === taskId;
                });
            },
            findNearbyTasks: function() {
                var self = this;
                var promise = new Promise(function(resolve, reject) {
                    geolocation.getCurrentPosition(
                        function(position) {
                            var currentCoords = position.coords;
                            var tasks = self.tasks.filter(function(task) {
                                var isNearby = false;
                                if (!task.locationReminders || task.locationReminders.length === 0) {
                                    return false;
                                }

                                angular.forEach(task.locationReminders, function(reminder) {
                                    if (geolocation.getDistance(currentCoords, reminder.location.coords) <= 5000) {
                                        isNearby = true;
                                        return;
                                    }
                                });
                                return isNearby;
                            });
                            resolve(tasks);
                        },
                        function() {
                            reject('error');
                        });
                });
                return promise;
            },
            getAllTasks: function(){
                var self = this;
                var promise = new Promise(function(resolve, reject) {
                    resolve(self.tasks);
                });
                return promise;
            },
            saveChanges: function() {
                window.localStorage['donebytheway-tasks'] = angular.toJson(this.tasks);
                window.localStorage['donebytheway-done-tasks'] = angular.toJson(this.doneTasks);
            },
        };
        var _tasks = [];
        try {
            _tasks = angular.fromJson(window.localStorage['donebytheway-tasks']);
            _doneTasks = angular.fromJson(window.localStorage['donebytheway-done-tasks']);
            angular.forEach(_tasks, function(task) {
                task.selected = false;
            });

        } catch (e) {};
        taskService.tasks = _tasks || [];
        taskService.doneTasks = _doneTasks || [];
        return taskService;
    });
