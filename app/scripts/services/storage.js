angular.module('donebytheway.services')
.factory('storage', function(){
    
    if(window.asyncLocalStorage){
        return window.asyncLocalStorage;
    }

    var storage = {
        getItem: function(key){
            return new Promise(function(resolve, reject){
                resolve(window.localStorage[key]);
            });
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
