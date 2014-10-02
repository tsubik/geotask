angular.module('donebytheway.services')
    .factory('settingsService', function ($log, $q, $window, browser) {

        var backgroundService = $window.backgroundService;
        if (!backgroundService) {
            if (browser.isMobile()) {
                $log.error('Error. BackgroundService cordova plugin is not provided.')
            } else {
                $log.log('BackgroundService cordova plugin is not provided. Using mockupService instead.')
                backgroundService = {
                    _isRunning: false,
                    getStatus: function () {
                        var def = $q.defer();
                        def.resolve(this._isRunning);
                        return def.promise;
                    },
                    startService: function () {
                        var def = $q.defer();
                        this._isRunning = true;
                        def.resolve(true);
                        return def.promise;
                    },
                    stopService: function () {
                        var def = $q.defer();
                        this._isRunning = false;
                        def.resolve(true);
                        return def.promise;
                    },
                    addGeoNotifications: function () {
                        var def = $q.defer();
                        def.resolve(true);
                        return def.promise;
                    }
                };
            }
        }

        return {
            getBackGroundServiceState: function () {
                return backgroundService.getStatus();
            },
            startBackGroundService: function () {
                return backgroundService.startService();
            },
            stopBackGroundService: function () {
                return backgroundService.stopService();
            },
            addGeoNotifications: function (geoNotifications) {
                return backgroundService.addGeoNotifications(geoNotifications);
            }
        }
    })
