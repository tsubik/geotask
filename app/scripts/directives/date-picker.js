angular.module('donebytheway.directives')
    .directive('datePicker',
        function ($window) {
            if (!$window.datePicker) {
                return {};
            }

            return {
                restrict: 'E',
                require: 'ngModel',
                template: '{{date}}',
                link: function (scope, element, ngModelCtrl) {

                    scope.date = ngModelCtrl.$viewValue || 'Kiedykolwiek';
                    element.bind('focus', function () {
                        var options = {
                            date: new Date(),
                            mode: 'date'
                        };

                        //This event is fired when the user has selected a date on the DatePicker
                        $window.datePicker.show(options, function (date) {
                            ngModelCtrl.$setViewValue(date);
                        });
                    });
                }
            };
        }
);
