angular.module('donebytheway.controllers', ['donebytheway.services','donebytheway.enums']);
angular.module('donebytheway.enums', []);
angular.module('donebytheway.services', ['donebytheway.enums']);
angular.module('donebytheway.filters', ['donebytheway.enums']);
angular.module('donebytheway.directives', ['donebytheway.enums']);


angular.module('donebytheway', [
    'ionic',
    'toasty',
    'leaflet-directive',
    'ion-search-place',
    'geolocation',
    'donebytheway.enums',
    'donebytheway.controllers',
    'donebytheway.directives',
    'donebytheway.services',
    'donebytheway.filters'
])
    .config(function($stateProvider, $urlRouterProvider,$ionicNavBarConfig, $ionicTabsConfig) {
        $ionicTabsConfig.type = '';
        $stateProvider
            //Main menu
            .state('main-menu', {
                url: "",
                abstract: true,
                templateUrl: "views/main-menu.html",
                controller: 'MainMenuCtrl'
            })
            .state('main-menu.locations', {
                url: '/locations',
                views: {
                    'menuContent': {
                        templateUrl: 'views/locations.html',
                        controller: 'LocationsCtrl'
                    }
                }
            })
            .state('main-menu.tasks', {
                url: '/tasks',
                views: {
                    'menuContent': {
                        templateUrl: 'views/tasks.html',
                        controller: 'TasksCtrl'
                    }
                }
            })
            .state('main-menu.nearby-tasks', {
                url: '/nearby-tasks',
                views: {
                    'menuContent': {
                        templateUrl: 'views/tasks.html',
                        controller: 'TasksCtrl'
                    }
                }
            })
            .state('main-menu.done-tasks', {
                url: '/done-tasks',
                views: {
                    'menuContent': {
                        templateUrl: 'views/tasks-done.html',
                        controller: 'DoneTasksCtrl'
                    }
                }
            })
            .state('main-menu.settings', {
                url: '/settings',
                views: {
                    menuContent: {
                        templateUrl: 'views/settings.html',
                        controller: 'SettingsCtrl'
                    }
                },
                resolve: {
                    settings: function(settingsService){
                        return settingsService.getBackGroundServiceState().then(function(isRunning){
                            return {
                                isRunning: isRunning
                            };
                        });
                    }
                }
            })

            //Task edition
            .state('task', {
                url: '/task/:taskId',
                abstract: true,
                templateUrl: 'views/task.html',
                controller: 'TaskCtrl',
                resolve: {
                    task: function(taskService, $stateParams){
                        return taskService.findById($stateParams.taskId);
                    }
                },
                onExit: function(taskService){
                    if(taskService.createdTask && taskService.createdTask.note){
                        taskService.addIfNotAdded(taskService.createdTask);
                        taskService.saveChanges();    
                        taskService.createdTask = undefined;
                    }
                }
            })
            .state('task.default', {
                url: '',
                views: {
                    "note-tab": {
                        templateUrl: 'views/task-note.html'
                    }
                }
            })
            .state('task.locations', {
                url: '/locations',
                views: {
                    'locations-tab': {
                        templateUrl: 'views/task-locations.html'
                    }
                }
            })
            .state('task.calendar', {
                url: '/calendar',
                views: {
                    'calendar-tab': {
                        templateUrl: 'views/task-calendar.html'
                    }
                }
            })
            .state('task-select-location', {
                url: '/task/:taskId/select-location',
                templateUrl: 'views/task-select-location.html',
                controller: 'TaskSelectLocationCtrl'
            })
            .state('task-select-location-map', {
                url: '/task/:taskId/select-location-map',
                templateUrl: 'views/task-select-location-map.html',
                controller: 'TaskSelectLocationMapCtrl',
                resolve: {
                    locationReminder: function(locationService, $location){
                        if(!locationService.selectedLocationReminder){
                            $location.path('/');
                        }
                        return locationService.selectedLocationReminder;
                    }
                }
            })

            //Location edition
            .state('location', {
                url: '/location/:locationId',
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl',
                resolve: {
                    location: function(locationService, $stateParams){
                        return locationService.findById($stateParams.locationId);
                    }
                },
                onExit: function(locationService){
                    locationService.saveChanges();
                }
            })
            
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tasks');

    });

ionic.Platform.ready(function() {
    angular.bootstrap(document, ['donebytheway']);
});