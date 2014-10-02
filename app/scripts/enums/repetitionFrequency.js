angular.module('donebytheway.enums')
    .factory('repetitionFrequency', function () {
        var repetitionFreq = {
            DAILY: 0,
            WEEKLY: 1,
            MONTHLY: 2,
            ANNUALLY: 3
        };

        return Object.freeze(repetitionFreq);
    });
