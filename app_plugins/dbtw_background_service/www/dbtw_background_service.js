 var exec = require("cordova/exec");

var BackgroundService = function() {
    
};

var BackgroundServiceError = function(code, message) {
    this.code = code || null;
    this.message = message || null;
};

/**
 * Starts the Service
 * 
 * @param successCallback The callback which will be called if the method is successful
 * @param failureCallback The callback which will be called if the method encounters an error
 */
BackgroundService.prototype.startService = function(successCallback, failureCallback) {
    return new Promise(function(resolve, reject) {
        exec(function(result){
            resolve(result);
            successCallback(result);
        },
        function(reason){
            reject(reason);
            failureCallback(reason);
        },
        'BTWPlugin',
        'startService',
        []);
    });
};

/**
 * Stops the Service
 *
 * @param successCallback The callback which will be called if the method is successful
 * @param failureCallback The callback which will be called if the method encounters an error
 */
BackgroundService.prototype.stopService = function(successCallback, failureCallback) {
    return new Promise(function(resolve, reject){
        exec(function(result){
            resolve(result);
            successCallback(result);
        },
        function(reason){
            reject(reason);
            failureCallback(reason);
        },
        'BTWPlugin',
        'stopService',
        []);
    }); 
};


/**
 * Returns the status of the service
 *
 * @param successCallback The callback which will be called if the method is successful
 * @param failureCallback The callback which will be called if the method encounters an error
 */
BackgroundService.prototype.getStatus = function(successCallback, failureCallback) {
    return new Promise(function(resolve, reject){
       exec(function(result){
            resolve(result);
            successCallback(result);
       },
       function(reason){
            reject(reason);
            failureCallback(reason);
       },
       'BTWPlugin',
       'getStatus',
       []); 
    });
};

var backgroundService = new BackgroundService();
module.exports = backgroundService;