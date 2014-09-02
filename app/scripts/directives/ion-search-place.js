angular.module('ion-search-place', [])
    .directive('ionSearchPlace', [
        'ionic',
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$q',
        '$timeout',
        '$rootScope',
        '$document',
        'geolocation',
        function($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $document, geolocation) {
            return {
                require: '?ngModel',
                restrict: 'E',
                template: '<input type="text" readonly="readonly" ng-click="popup()" class="ion-search-place" autocomplete="off">',
                replace: true,
                link: function(scope, element, attrs, ngModel) {
                    scope.searched_locations = [];
                    var searchEventTimeout = undefined;

                    var POPUP_TPL = [
                        '<div class="ion-search-place-container" style="display: none;">',
                        '<div class="bar bar-header item-input-inset">',
                        '<label class="item-input-wrapper">',
                        '<i class="icon ion-ios7-search placeholder-icon"></i>',
                        '<input class="search-place-search" type="search" ng-model="searchQuery" placeholder="Wpisz adres, wyszukaj miejsce">',
                        '</label>',
                        '<button class="button button-clear">',
                        'Cancel',
                        '</button>',
                        '</div>',
                        '<ion-list>',
                        '<ion-item ng-repeat="location in searched_locations" type="item-text-wrap" ng-click="selectLocation(location)">',
                        '{{location.display_name}}',
                        '</ion-item>',
                        '</ion-list>',
                        '</div>'
                    ].join('');

                    var popupPromise = $ionicTemplateLoader.compile({
                        template: POPUP_TPL,
                        scope: scope,
                        appendTo: $document[0].body
                    });

                    popupPromise.then(function(el) {
                        var searchInputElement = angular.element(el.element.find('input'));

                        scope.selectLocation = function(location) {
                            ngModel.$setViewValue(location);
                            ngModel.$render();
                            el.element.css('display', 'none');
                            scope.$emit('ionSearchPlace.locationSelected', location)
                            //$ionicBackdrop.release();
                        };

                        scope.$watch('searchQuery', function(query) {
                            //scope.searched_locations.push({ display_name: 'Duupa'});
                            if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                            searchEventTimeout = $timeout(function() {
                                if (!query) return;
                                if (query.length < 3);
                                var locations = geolocation.query({
                                    q: query,
                                    limit: 5
                                }, function() {
                                    scope.searched_locations = locations;
                                });
                            }, 500); // we're throttling the input by 500ms to be nice to geolocation API
                        });

                        var onClick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            //$ionicBackdrop.retain();
                            el.element.css('display', 'block');
                            searchInputElement[0].focus();
                            setTimeout(function() {
                                searchInputElement[0].focus();
                            }, 0);
                        };

                        var onCancel = function(e) {
                            scope.searchQuery = '';
                            scope.searched_locations = [];
                            //$ionicBackdrop.release();
                            el.element.css('display', 'none');
                        };

                        element.bind('click', onClick);
                        element.bind('touchend', onClick);

                        el.element.find('button').bind('click', onCancel);
                    });

                    if (attrs.placeholder) {
                        element.attr('placeholder', attrs.placeholder);
                    }


                    ngModel.$formatters.unshift(function(modelValue) {
                        if (!modelValue) return '';
                        return modelValue;
                    });

                    ngModel.$parsers.unshift(function(viewValue) {
                        return viewValue;
                    });

                    ngModel.$render = function() {
                        if (!ngModel.$viewValue) {
                            element.val('');
                        } else {
                            element.val(ngModel.$viewValue.display_name || '');
                        }
                    };
                }
            };
        }
    ]);
