angular.module('geolocation', ['ngResource'])
    .factory('geolocation', function ($resource) {
        var Geolocation = $resource(
            'http://open.mapquestapi.com/nominatim/v1/:action', {
                action: 'search',
                format: 'json',
                json_callback: 'JSON_CALLBACK',
                limit: 1
            }, {
                get: {
                    method: 'JSONP',
                    isArray: true
                },
                query: {
                    method: 'JSONP',
                    isArray: true
                }
            }
        );
        var currentPositionCache;

        Geolocation.getCurrentPosition = function (callback, error) {
            var success = function (position) {
                callback(currentPositionCache = position);
            };
            navigator.geolocation.getCurrentPosition(success, error || function () {});
            if (currentPositionCache) {
                setTimeout(function () {
                    success(currentPositionCache);
                }, 0);
            }
        };

        Geolocation.getDistance = function (p1, p2) {
            var lat1 = p1.latitude || p1.lat,
                lon1 = p1.longitude || p1.lng;
            var lat2 = p2.latitude || p2.lat,
                lon2 = p2.longitude || p2.lng;

            var R = 6371; // km
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var lat1 = lat1 * Math.PI / 180;
            var lat2 = lat2 * Math.PI / 180;

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        return Geolocation;
    });
