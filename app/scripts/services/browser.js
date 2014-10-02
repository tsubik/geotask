angular.module('donebytheway.services')
    .factory('browser', function ($window) {
        var userAgent = $window.navigator.userAgent;

        return {
            isMobile: function () {
                if (userAgent.match(/Android/i) || userAgent.match(/webOS/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPad/i) || userAgent.match(/iPod/i) || userAgent.match(/BlackBerry/i) || userAgent.match(/Windows Phone/i)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    })
