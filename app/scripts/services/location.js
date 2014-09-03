angular.module('donebytheway.services')
.factory('locationService', function(storage, $q){
    var locationService = {
        _locations: [],
        selectedLocationReminder: undefined,
        createNew: function(options){
            options = options || { };
            return {
                id: UUIDjs.create().toString(),
                name: options.name,
                coords: options.coords
            };
        },
        remove: function(location){
            this._locations.splice(this._locations.indexOf(location), 1);
        },
        findById: function(locationId){
            return self.getAll().then(function(locations){
                return locations.firstOrDefault(function(location){ return location.id === locationId; });
            });
        },
        saveChanges: function(){
            storage.setItem('donebytheway-locations', angular.toJson(this._locations));
        },
        getAll: function(){
            var self = this;
            if(!this._locationsPromise){
                this._locationsPromise = $q.defer();
                storage.getItem('donebytheway-locations').then(function(result){
                    if(result){
                        self._locations = angular.fromJson(result);
                    }
                    self._locationsPromise.resolve(self._locations);
                });
            }
            return this._locationsPromise.promise;
        }
    };

    return locationService;
});
