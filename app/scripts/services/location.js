angular.module('donebytheway.services')
    .factory('locationService', function (storage, $q, $log) {
        var locationService = {
            _locations: [],
            selectedLocationReminder: undefined,
            createNew: function (options) {
                options = options || {};
                return {
                    id: UUIDjs.create().toString(),
                    name: options.name,
                    coords: options.coords
                };
            },
            add: function (location) {
                this._locations.push(location);
            },
            remove: function (location) {
                this._locations.splice(this._locations.indexOf(location), 1);
            },
            findById: function (locationId) {
                $log.log('locationService.findById()', locationId);
                return this.getAll().then(function (locations) {
                    return locations.firstOrDefault(function (location) {
                        return location.id === locationId;
                    });
                });
            },
            saveChanges: function () {
                $log.log('locationService.saveChanges()');
                storage.setItem('donebytheway-locations', angular.toJson(this._locations));
            },
            getAll: function () {
                var self = this;
                $log.log('locationService.getAll()');
                if (!this._locationsPromise) {
                    this._locationsPromise = $q.defer();
                    storage.getItem('donebytheway-locations').then(function (result) {
                        $log.log('locationService.getAll(): fetching data from localStorage');
                        if (result) {
                            self._locations = angular.fromJson(result);
                        }
                        self._locationsPromise.resolve(self._locations);
                    });
                }
                return this._locationsPromise.promise;
            }
        };
        locationService.getAll();

        return locationService;
    });
