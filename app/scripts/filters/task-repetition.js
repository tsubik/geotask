angular.module('donebytheway.filters')
.filter('repetition', function($log, taskRepetitionService, repetitionFrequency, dayOfWeek){
    return function(input){
    	if(!input){
    		return '';
    	}

        if(input.frequency === repetitionFrequency.WEEKLY){
        	var retVal = input.title;
            var daysOfWeekStr = '';
            if(input.daysOfWeek & dayOfWeek.MONDAY){
                daysOfWeekStr += "PON. ";
            }
            if(input.daysOfWeek & dayOfWeek.TUESDAY){
                daysOfWeekStr += "WT. ";
            }
            if(input.daysOfWeek & dayOfWeek.WEDNESDAY){
                daysOfWeekStr += "ŚR. ";
            }
            if(input.daysOfWeek & dayOfWeek.THURSDAY){
                daysOfWeekStr += "CZW. ";
            }
            if(input.daysOfWeek & dayOfWeek.FRIDAY){
                daysOfWeekStr += "PT. ";
            }
            if(input.daysOfWeek & dayOfWeek.SATURDAY){
                daysOfWeekStr += "SOB. ";
            }
            if(input.daysOfWeek & dayOfWeek.SUNDAY){
                daysOfWeekStr += "NIEDZ. "
            }

            if(daysOfWeekStr.length > 0){
                retVal += " w " + daysOfWeekStr;
            }
            return retVal;
        }
        else{
        	return input.title;
        }
    };
});
