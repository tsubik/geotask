cordova.define("com.tsubik.cordova.dbtw_background_service.dbtwBackgroundService", function(require, exports, module) { function CreateBackgroundService(require, exports, module) {
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
            return exec(successCallback,
                    failureCallback,
                    'BTWPlugin',
                    'startService');
        };

        /**
         * Stops the Service
         *
         * @param successCallback The callback which will be called if the method is successful
         * @param failureCallback The callback which will be called if the method encounters an error
         */
        BackgroundService.prototype.stopService = function(successCallback, failureCallback) {
            return exec(successCallback,
                    failureCallback,
                    'BTWPlugin',
                    'stopService');
        };


        /**
         * Returns the status of the service
         *
         * @param successCallback The callback which will be called if the method is successful
         * @param failureCallback The callback which will be called if the method encounters an error
         */
        BackgroundService.prototype.getStatus = function(successCallback, failureCallback) {
            return exec(successCallback,
                    failureCallback,
                    'BTWPlugin',
                    'getStatus');
        };
       
        var backgroundService = new BackgroundService();
        module.exports = backgroundService;
    };


    CreateBackgroundService(require, exports, module);
});
