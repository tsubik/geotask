angular.module('donebytheway.filters')
.filter('locationReminder', function($log){
    return function(locationReminder, onlyDistance){
    	if(!locationReminder){
    		return '';
    	}
        if(locationReminder.whenIgetCloser){
            return 'Gdy się zbliżam na {0} m{1}'.format(locationReminder.radius, onlyDistance ? "" : " do <b>{0}</b>".format(locationReminder.location.name));
        }
        else{
            return 'Gdy się oddalam na {0} m{1}'.format(locationReminder.radius, onlyDistance ? "" : " od <b>{0}</b>".format(locationReminder.location.name));
        }
    };
});
