angular.module('donebytheway.controllers', ['donebytheway.services','donebytheway.enums']);
angular.module('donebytheway.enums', []);
angular.module('donebytheway.services', ['donebytheway.enums']);
angular.module('donebytheway.filters', ['donebytheway.enums']);
angular.module('donebytheway.directives', ['donebytheway.enums']);


angular.module('donebytheway', [
    'ionic',
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
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "views/menu.html",
                controller: 'AppCtrl'
            })
            .state('app.locations', {
                url: '/locations',
                views: {
                    'menuContent': {
                        templateUrl: 'views/locations.html',
                        controller: 'LocationsCtrl'
                    }
                }
            })
            .state('location', {
                url: '/location/:locationId',
                templateUrl: 'views/location.html',
                controller: 'LocationCtrl'
            })
            .state('app.tasks', {
                url: '/tasks',
                views: {
                    'menuContent': {
                        templateUrl: 'views/tasks.html',
                        controller: 'TasksCtrl'
                    }
                }
            })
            .state('app.nearby-tasks', {
                url: '/nearby-tasks',
                views: {
                    'menuContent': {
                        templateUrl: 'views/tasks.html',
                        controller: 'TasksCtrl'
                    }
                }
            })
            .state('app.done-tasks', {
                url: '/done-tasks',
                views: {
                    'menuContent': {
                        templateUrl: 'views/done-tasks.html',
                        controller: 'DoneTasksCtrl'
                    }
                }
            })
            .state('task', {
                url: '/task/:taskId',
                abstract: true,
                templateUrl: 'views/task.html',
                controller: 'TaskCtrl'
            })
            .state('task.note', {
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
                templateUrl: 'views/task-select-location.html'
            })
            .state('task-select-location-map', {
                url: '/task/:taskId/location-map',
                templateUrl: 'views/task-select-location-map.html',
                controller: 'LocationMapCtrl'
            })
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/tasks');

    });

ionic.Platform.ready(function() {
    angular.bootstrap(document, ['donebytheway']);
});