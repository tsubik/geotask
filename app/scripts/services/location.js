angular.module('donebytheway.services')
.factory('locationService', function(){
    var locationService = {
        locations: [],
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
            this.locations.splice(this.locations.indexOf(location), 1);
        },
        findById: function(locationId){
            return this.locations.firstOrDefault(function(location){ return location.id === locationId; });
        },
        saveChanges: function(){
            window.localStorage['donebytheway-locations'] = angular.toJson(this.locations);
        }
    };
    var _locations = [];
    try{
        _locations = angular.fromJson(window.localStorage['donebytheway-locations']);
    }catch(e){
    };
    locationService.locations = _locations || [];

    return locationService;
});
