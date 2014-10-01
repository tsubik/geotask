angular.module('donebytheway.services')
	.factory('geofence', function($window, $log){
		return $window.geofence || {
			addOrUpdate: function(geofences){
				$log.log('Geofences added ', geofences);
			},
			remove: function(ids){
				$log.log('Geofences removed', ids);
			},
			removeAll: function(){
				$log.log('All geofences removed');
			}
		};
	})