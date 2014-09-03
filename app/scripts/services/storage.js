angular.module('donebytheway.services')
.factory('storage', function($q){
    
    if(window.asyncLocalStorage){
        return window.asyncLocalStorage;
    }

    var storage = {
        getItem: function(key){
            var def = $q.defer();
            def.resolve(window.localStorage[key]);
            return def.promise;
        },
        setItem: function(key, value){
            window.localStorage[key] = value;
        },
        removeItem: function(key){
            window.localStorage.removeItem(key);
        },
        clear: function(){
            window.localStorage.clear();
        }
    };

    return storage;
});
