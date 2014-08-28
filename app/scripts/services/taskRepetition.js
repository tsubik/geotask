angular.module('donebytheway.services')
  .factory('taskRepetitionService', function(repetitionFrequency, dayOfWeek) {
      var taskRepetitionService = {
        createNew: function(frequency){
          switch(frequency){
            case repetitionFrequency.DAILY:
              return {
                title: 'Codziennie',
                frequency: frequency
              };
            case repetitionFrequency.WEEKLY:
              return {
                title: 'Co tydzień',
                frequency: frequency,
                daysOfWeek: dayOfWeek.NONE
              };
            case repetitionFrequency.MONTHLY:
              return {
                title: 'Co miesiąc',
                frequency: frequency
              };
            case repetitionFrequency.ANNUALLY:
              return {
                title: 'Co rok',
                frequency: frequency
              };
          }
        }
      }

      return taskRepetitionService;
  });
