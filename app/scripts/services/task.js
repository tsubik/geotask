angular.module('donebytheway.services')
    .factory('taskService', function ($log, geofence, locationService, geolocation, taskRepetitionService, repetitionFrequency, storage, $q) {

        var taskService = {
            _tasks: [],
            _tasksPromise: null,
            createdTask: undefined,
            createNew: function () {
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
            markAsDone: function (task) {
                var currentDate = new Date();
                task.isCompleted = true;
                task.completedDate = currentDate;
                task.selected = undefined;
            },
            syncLocationReminder: function (task) {
                if (task.locationReminders.length > 0) {
                    var geoNotifications = task.locationReminders.map(function (lr) {
                        return {
                            id: lr.id,
                            notificationText: lr.location.name,
                            latitude: lr.location.coords.latitude,
                            longitude: lr.location.coords.longitude,
                            radius: lr.radius,
                            transitionType: lr.whenIgetCloser ? 1 : 0,
                            data: task
                        };
                    });
                    geofence.addOrUpdate(geoNotifications);
                }
            },
            addIfNotAdded: function (task) {
                if (!this._tasks.firstOrDefault(function (t) {
                        return t.id === task.id;
                    })) {
                    this._tasks.push(task);
                }
            },
            remove: function (task) {
                this._tasks.splice(this._tasks.indexOf(task), 1);
            },
            findById: function (taskId) {
                var self = this;
                return self.getAllTasks().then(function (tasks) {
                    if (self.createdTask && self.createdTask.id === taskId) {
                        return self.createdTask;
                    }

                    return tasks.firstOrDefault(function (task) {
                        return task.id === taskId;
                    });
                });
            },
            findNearby: function () {
                var self = this;
                var def = $q.defer();
                geolocation.getCurrentPosition(function (position) {
                    self.getNotCompleted()
                        .then(function (tasks) {
                            return filterNearbyTasks(tasks, position, 5000);
                        })
                        .then(function (tasks) {
                            def.resolve(tasks);
                        }, function () {
                            def.reject('error')
                        });
                });
                return def.promise;
            },
            getNotCompleted: function () {
                return this.getAllTasks().then(function (tasks) {
                    return tasks.filter(function (task) {
                        return !task.isCompleted;
                    });
                });
            },
            getCompleted: function () {
                return this.getAllTasks().then(function (tasks) {
                    return tasks.filter(function (task) {
                        return task.isCompleted;
                    });
                });
            },
            // getForToday: function () {
            //     return this.getAllTasks().then(function (tasks) {
            //         return tasks.filter(function (task) {
            //             var currentDate = new Date();
            //             //if is today
            //             return currentDate.toDateString() === task.
            //         });
            //     });
            // },
            getAllTasks: function () {
                var self = this;
                if (!self._tasksPromise) {
                    self._tasksPromise = $q.defer();
                    storage.getItem('donebytheway-tasks').then(function (result) {
                        $log.log('getAllTasks() loading from localstorage');
                        var tasks = [];
                        if (result) {
                            tasks = angular.fromJson(result)
                        }
                        angular.forEach(tasks, function (task) {
                            task.selected = false;
                        });
                        self._tasks = tasks;
                        self._tasksPromise.resolve(tasks);
                    }, function (reason) {
                        self._tasks = [];
                        self._tasksPromise.resolve(self._tasks);
                    });
                }
                return self._tasksPromise.promise;
            },
            saveChanges: function () {
                storage.setItem('donebytheway-tasks', angular.toJson(this._tasks));
            }
        };
        return taskService;

        function filterNearbyTasks(tasks, position, distance) {
            var currentCoords = position.coords;
            var _tasks = tasks.filter(function (task) {
                var isNearby = false;
                if (!task.locationReminders || task.locationReminders.length === 0) {
                    return false;
                }

                angular.forEach(task.locationReminders, function (reminder) {
                    if (geolocation.getDistance(currentCoords, reminder.location.coords) <= distance) {
                        isNearby = true;
                        return;
                    }
                });
                return isNearby;
            });
            return _tasks;
        };
    });
