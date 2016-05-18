'use strict';
angular.module("businessHoursControl", ['pascalprecht.translate']);

angular.module("businessHoursControl").config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        "business-hours.weekdays": "Week days",
        "business-hours.weekend": "Weekend",
        "business-hours.alldays": "All days",
        "business-hours.add_opening": "Add opening hour",
        "business-hours.choose_day": "Day"
    });
    $translateProvider.preferredLanguage('en');
    return $translateProvider.useSanitizeValueStrategy('escapeParameters');
}]);
angular.module("businessHoursControl")
    .directive('businessHours', function () {
        return {
            restrict: 'E',
            scope: {
                model: "="
            },
            controller: "BusinessHoursCtrl",
            template: function () {
                return '<div ng-repeat="day in days">' +
                    '<span ng-show="hours_for(model, day).length"><span class="size-sm ly-inline-block">{{days_label[day]}}</span> ' +
                    '<span class="push-left" ng-repeat="hour in hours_for(model, day)">{{hour.start}} &ndash; {{hour.end}}</span>' +
                    '</span>' +
                    '</div>';
            }
        };
    })

    .directive('businessHoursInput', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                model: "=ngModel"
            },
            controller: "BusinessHoursCtrl",
            template: function (elem, attrs) {
                return '<div ng-repeat="hour in model" class="hours-per-days-wrapper">' +
                    '<a ng-click="remove_hour($index)" class="hours-per-days-remove"><i class="closemark">x</i></a>' +
                    '<div class="dropdown" auto-close="outsideClick">' +
                    '<button type="button" class="dropdown-toggle" ng-click="toggle_dropdown($index)">' +
                    '<span class="arrow-down">' +
                    '<?xml version="1.0" encoding="utf-8"?>' +
                    '<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->' +
                    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
                    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0"' +
                    'width="15px" height="11px" viewBox="-7.5 -5.5 15 11" xml:space="preserve">' +
                    '<path fill="#9E9E9E" d="M-7.5-2.645L-4.896-5.5L0-0.184L4.896-5.5L7.5-2.645L0,5.5L-7.5-2.645z"/>' +
                    '</svg>' +
                    '</span>' +
                    '<span class="days-text">{{days_group_label(hour.days) | translate}}</span>' +
                    '</button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                    '<li ng-repeat="day in days"><a ng-click="toggle_day(hour, $index)">' +
                    '<i ng-class="{\'checked\': checked_day(hour.days, day)}">' +
                    '<?xml version="1.0" encoding="utf-8"?>' +
                    '<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->' +
                    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
                    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0"' +
                    'width="11.428px" height="9.361px" viewBox="-5.714 -4.6805 11.428 9.361" xml:space="preserve">' +
                    '<path fill="#5D5D5D" d="M4.627-4.478l-6.85,7.436l-2.398-2.686c-0.25-0.28-0.655-0.28-0.905,0s-0.25,0.731,0,1.013l2.846,3.187' +
                    'c0.125,0.14,0.289,0.21,0.452,0.21c0.16,0,0.32-0.067,0.444-0.202l7.302-7.927c0.255-0.275,0.261-0.729,0.015-1.015' +
                    'C5.284-4.748,4.881-4.755,4.627-4.478z"/>' +
                    '</svg>' +
                    '</i> {{days_label[day]}}</a>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="hours-inputs-wrapper">' +
                    '<input type="time" name="bhTimeStart" ng-model="hour.start" placeholder="10:00" required="">' +
                    '<input type="time" name="bhTimeEnd" ng-model="hour.end" placeholder="18:00" required="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="add-next-days">' +
                    '<a ng-click="add_hour()" ng-hide="selected_days.length>6"><i class="fa fa-plus-circle push-xsmall-right"></i>{{\'business-hours.add_opening\' | translate}}</a>' +
                    '</div>';
            },
            link: function(scope, element, attrs, ctrl) {
                if(attrs.closeEvent) {
                    scope.$on(attrs.closeEvent, function ($event, target) {
                        target = angular.element(target);
                        if (!recursiveCheckClasses(target, ['dropdown-toggle', 'dropdown-menu'])) {
                            element.find('.dropdown-menu').removeClass('open');
                        }
                    });
                }
                function recursiveCheckClasses(element, classNames) {
                    if(checkClasses(element, classNames)) {
                        return true;
                    } else if(element.parent().length === 0) {
                        return false;
                    }
                    return recursiveCheckClasses(element.parent(), classNames);
                }
                function checkClasses(element, classNames) {
                    for(var i=0;i<classNames.length;i++) {
                        if(element.hasClass(classNames[i])) {
                            return true;
                        }
                    }
                    return false;
                }
                element.bind('keydown', function(evt) {
                    if ('13' == evt.which) {
                        evt.preventDefault(); // Doesn't work at all
                        window.stop(); // Works in all browsers but IE
                        document.execCommand("Stop"); // Works in IE
                        scope.add_hour();
                        return false; // Don't even know why it's here. Does nothing.
                    }
                });

                scope.toggle_dropdown = function (index) {
                    var dropdown = angular.element(element.find('.dropdown-menu')[index]);
                    var isOpen = dropdown.hasClass('open');
                    element.find('.dropdown-menu').removeClass('open');
                    dropdown.toggleClass('open',!isOpen);
                };
            }
        };
    })
    .directive('greaterThan', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);

                return attrs.$observe('greaterThan', function (comparisonModel) {
                    return validate(ctrl.$viewValue);
                });

                function validate(viewValue) {
                    var comparisonModel, end, start;
                    comparisonModel = attrs.greaterThan;
                    if (!viewValue || !comparisonModel) {
                        ctrl.$setValidity('greaterThan', true);
                        return viewValue;
                    }
                    start = comparisonModel.split(":");
                    end = viewValue.split(":");
                    ctrl.$setValidity('greaterThan', (parseInt(start[0], 10) < parseInt(end[0], 10)) || (parseInt(start[0], 10) === parseInt(end[0], 10) && parseInt(start[1], 10) < parseInt(end[1], 10)));
                    return viewValue;
                }
            }
        };
    });

angular.module("businessHoursControl").controller("BusinessHoursCtrl", ["$scope", "$q", "$translate", "$locale", function ($scope, $q, $translate, $locale) {
    var dom;
    $scope.days = [0, 1, 2, 3, 4, 5, 6];
    $scope.days_label = angular.copy($locale.DATETIME_FORMATS.DAY);
    dom = $scope.days_label.shift();
    $scope.days_label.push(dom);
    $scope.weekdays = [0, 1, 2, 3, 4];
    $scope.weekend = [5, 6];
    $scope.selected_days = [];

    _.map($scope.model, function(hours) {
        _.map(hours.days, function(day) {
            $scope.selected_days.push(day);
        });
    });


    $scope.range_hours = function () {
        var hours, mins;
        hours = _.range(0, 24);
        return mins = _.flatten(_.map([0, 15, 30, 45], function (mins) {
            return _.map(hours, function (hour) {
                return hour + ":" + (_.padLeft(mins, 2, '0'));
            });
        }));
    };
    $scope.hours_for = function (hours, day) {
        return _.sortBy(_.where(hours, {
            days: [day]
        }), function (item) {
            return item.start.getTime();
        });
    };
    $scope.toggle_day = function (hour, index) {
        var i;
        if ((i = _.indexOf(hour.days, $scope.days[index])) >= 0) {
            var selected_id = _.indexOf($scope.selected_days, $scope.days[index]);
            if(selected_id>=0) {
                $scope.selected_days.splice(selected_id, 1);
            }
            return hour.days.splice(i, 1);
        } else if(_.indexOf($scope.selected_days, $scope.days[index]) < 0) {
            hour.days.push($scope.days[index]);
            $scope.selected_days.push($scope.days[index]);
            return hour.days = _.sortBy(hour.days, function (day) {
                return _.indexOf($scope.days, day);
            });
        } else {

        }
    };
    $scope.days_group_label = function (days) {
        if (_.xor(days, $scope.weekdays).length === 0) {
            return "business-hours.weekdays";
        }
        if (_.xor(days, $scope.weekend).length === 0) {
            return "business-hours.weekend";
        }
        if (_.xor(days, $scope.days).length === 0) {
            return "business-hours.alldays";
        }
        if (days.length > 0) {
            return _.map(days, function (day) {
                return $scope.days_label[day].slice(0, 3);
            }).join(",");
        }
        return "business-hours.choose_day";
    };
    $scope.add_hour = function () {
        if($scope.selected_days.length > 6) {
            return;
        }
        var value = {};
        if($scope.model.length > 0) {
            value.days = [];
        } else {
            value.days = angular.copy($scope.weekdays);
            for(var i=0;i<value.days.length;i++) {
                $scope.selected_days.push(value.days[i]);
            }
        }
        return $scope.model.push(value);
    };
    $scope.remove_hour = function (index) {
        var days = $scope.model[index].days;
        if(days.length > 0) {
            for(var i=0;i<days.length;i++) {
                var day = days[i];
                console.log(day, $scope.selected_days.indexOf(day));
                $scope.selected_days.splice($scope.selected_days.indexOf(day), 1);
            }
        }
        return $scope.model.splice(index, 1);
    };
    return $scope.checked_day = function (days, day) {
        return !!_.include(days, day);
    };
}]);

