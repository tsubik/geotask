angular.module('donebytheway.enums')
    .factory('dayOfWeek', function () {
        var dayOfWeek = {
            NONE: 0,
            MONDAY: 1,
            TUESDAY: 1 << 1,
            WEDNESDAY: 1 << 2,
            THURSDAY: 1 << 3,
            FRIDAY: 1 << 4,
            SATURDAY: 1 << 5,
            SUNDAY: 1 << 6
        };

        return Object.freeze(dayOfWeek);
    });
