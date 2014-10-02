angular.module('donebytheway.filters')
    .filter('locationReminder', function ($log) {
        return function (locationReminder, onlyDistance) {
            if (!locationReminder) {
                return '';
            }
            if (locationReminder.whenIgetCloser) {
                return '<i class="icon ion-arrow-shrink"></i> na {0} m{1}'.format(locationReminder.radius, onlyDistance ? "" : " do <b>{0}</b>".format(locationReminder.location.name));
            } else {
                return '<i class="icon ion-arrow-expand"></i> na {0} m{1}'.format(locationReminder.radius, onlyDistance ? "" : " od <b>{0}</b>".format(locationReminder.location.name));
            }
        };
    });
