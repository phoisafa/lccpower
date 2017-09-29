"use strict";



app.directive('addSymbol', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            symbol: "="
        },
        link: function (scope, element, attr, ngModel) {
            //Formatters will NOT be called when the model is changed in the view.
            //Formatters are only called when the model changes in code
            ngModel.$formatters.push(function (value) {
                var dec = jQuery.trim(scope.symbol);
                var val = jQuery.trim(value);
                val = value + dec;
                return val;
            });

        }
    };
});


app.directive('toExponential', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            decimal: "="
        },
        link: function (scope, element, attr, ngModel) {
            //Formatters will NOT be called when the model is changed in the view.
            //Formatters are only called when the model changes in code
            ngModel.$formatters.push(function (value) {
                var dec = jQuery.trim(scope.decimal);
                if (jQuery.isNumeric(dec) == false) {
                    dec = 0;
                }
                var val = jQuery.trim(value);
                if (jQuery.isNumeric(val) == false) {
                    val = 0;
                } else {
                    if (val > 0) {
                        val = parseFloat(val);
                        val = val.toExponential(dec);
                    } else {
                        val = 0;
                    }
                }
                return val;
            });

        }
    };
});

//app.directive('customPopover', function ($filter, generalFunctions) {
//    return {
//        restrict: "A",
//        scope: {
//            popoverHtml: "=",
//            attributeVar: "=",
//            checkBigInteger: "="
//        },
//        link: function ($scope, element, attrs, ctrl) {
//            $(element).popover({
//                trigger: 'focus',
//                html: true,
//                content: $scope.popoverHtml,
//                placement: attrs.popoverPlacement,
//                delay: {
//                    "show": 0,
//                    "hide": 150
//                }
//            });
//            $scope.$watch("popoverHtml", function () {
//                $(element).popover("destroy");
//                $(element).popover({
//                    trigger: 'focus',
//                    html: true,
//                    content: $scope.popoverHtml,
//                    placement: attrs.popoverPlacement,
//                    delay: {
//                        "show": 0,
//                        "hide": 150
//                    }
//                });
//            });
//            //ctrl.$parsers.push(function (viewValue) {
//            //    return $filter('number')(ctrl.$modelValue);
//            //})
//            //ctrl.$render = function () {
//            //    elem.val($filter('number')(ctrl.$viewValue, false))
//            //}
//            element.on("change", function (e) {
//                var value = element[0].value;
//                //alert("after changed :" + value);
//                var needCheckBigInteger = true;
//                if ($scope.checkBigInteger == false) {
//                    needCheckBigInteger = false;
//                }
//                var format = generalFunctions.GetLocaleFormat(value, needCheckBigInteger);
//                value = format.returnValue;
//                element.val($filter('number')(value));
//                return value;
//            });
//            element.bind("focus", function () {
//                var objPopover = $("#" + attrs.id).next(".popover");
//                objPopover.children("div").each(function () {
//                    if ($(this).hasClass("popover-content") == true) {
//                        $(this).children("div").each(function () {
//                            $(this).children("ul").each(function () {
//                                $(this).children("li").each(function () {
//                                    $(this).children("a").each(function () {
//                                        $(this).unbind("vclick");
//                                        $(this).bind("vclick", function () {
//                                            var val = $(this).text();
//                                            var needCheckBigInteger = true;
//                                            if ($scope.checkBigInteger == false) {
//                                                needCheckBigInteger = false;
//                                            }
//                                            var format = generalFunctions.GetLocaleFormat(val, needCheckBigInteger);
//                                            if (format != undefined) {
//                                                val = format.returnValue;
//                                            }
//                                            var selectedText = parseFloat(val);
//                                            $scope.attributeVar = selectedText;
//                                            $scope.$apply();
//                                            element.val($filter('number')(val));
//                                        });
//                                    });
//                                });
//                            });
//                        });
//                    } else {
//                        var value = element[0].value;
//                        //alert(value);
//                        var needCheckBigInteger = true;
//                        if ($scope.checkBigInteger == false) {
//                            needCheckBigInteger = false;
//                        }
//                        var format = generalFunctions.GetLocaleFormat(value, needCheckBigInteger);
//                        value = format.returnValue;
//                        element.val(value);
//                        return value;
//                    }
//                });
//            });
//            //ctrl.$formatters.unshift(function (a) {
//            //    return $filter('number')(ctrl.$modelValue);
//            //});

//        }
//    };
//});
app.directive('customPopover', function ($filter, generalFunctions) {
    var forceShowPopop = false;
    function Focus($scope, element, attrs, ctrl) {
        var objPopover = $("#" + attrs.id).next(".popover");
        objPopover.children("div").each(function () {
            if ($(this).hasClass("popover-content") == true) {
                $(this).children("div").each(function () {
                    $(this).bind("scroll", function () { //do not hide popover when scroll
                        $(element).popover("toggle");
                        setTimeout(function () {
                            Focus($scope, element, attrs, ctrl);
                        }, 1);
                    });
                    $(this).children("ul").each(function () {
                        $(this).children("li").each(function () {
                            $(this).children("a").each(function () {
                                $(this).unbind("vclick");
                                $(this).bind("vclick", function () {
                                    var val = $(this).text();
                                    var needCheckBigInteger = true;
                                    if ($scope.checkBigInteger == false) {
                                        needCheckBigInteger = false;
                                    }
                                    var format = generalFunctions.GetLocaleFormat(val, needCheckBigInteger);
                                    if (format != undefined) {
                                        val = format.returnValue;
                                    }
                                    var selectedText = parseFloat(val);
                                    $scope.attributeVar = selectedText;
                                    $scope.$apply();
                                    element.val($filter('number')(val));
                                    $(element).popover("hide");
                                });
                            });
                        });
                    });
                });
            } else {
                var value = element[0].value;
                //alert(value);
                var needCheckBigInteger = true;
                if ($scope.checkBigInteger == false) {
                    needCheckBigInteger = false;
                }
                var format = generalFunctions.GetLocaleFormat(value, needCheckBigInteger);
                value = format.returnValue;
                element.val(value);
                return value;
            }
        });
    }
    return {
        restrict: "A",
        scope: {
            popoverHtml: "=",
            attributeVar: "=",
            checkBigInteger: "="
        },
        link: function ($scope, element, attrs, ctrl) {
            $('body').on('click', function (e) {
                if (!$(e.target).hasClass('custompopover')) { //check click on input with custom popover
                    //did not click on input with custom popover
                    if ($(e.target).data('toggle') !== 'popover'
                    && $(e.target).parents('.popover.in').length === 0) {
                        $('.popover').popover('hide');
                    }
                } else {
                    //click on input with custom popover
                    //check whether click on same input popover or other input popover
                    var hidePopup = true;
                    try {
                        var popoverId = "";
                        if ($(e.target)[0].hasAttributes('aria-describedby')) {
                            for (var i = 0; i < $(e.target)[0].attributes.length; i++) {
                                var attrib = $(e.target)[0].attributes[i];
                                if (attrib.name == 'aria-describedby') {
                                    if (attrib.value == $(e.target)[0].nextSibling.id) {
                                        popoverId = attrib.value;
                                    }
                                    break;
                                }
                            }
                        }
                        if (popoverId != undefined) {
                            $('.popover').each(function (i, obj) {
                                if ($(this)[0].id != popoverId) {
                                    $(this).popover('hide');
                                }
                            });
                        } else {
                            $('.popover').popover('hide');
                        }
                    } catch (e) {
                        console.log(e.message);
                        $('.popover').popover('hide');
                    }
                }
            });
            $(element).popover({
                trigger: 'focus',
                html: true,
                content: $scope.popoverHtml,
                placement: attrs.popoverPlacement,
                delay: {
                    "show": 0,
                    "hide": 15000000000
                }
            });
            $scope.$watch("popoverHtml", function () {
                $(element).popover("destroy");
                $(element).popover({
                    trigger: 'focus',
                    html: true,
                    content: $scope.popoverHtml,
                    placement: attrs.popoverPlacement,
                    delay: {
                        "show": 0,
                        "hide": 15000000000
                    }
                });
            });
            element.on("change", function (e) {
                var value = element[0].value;
                //alert("after changed :" + value);
                var needCheckBigInteger = true;
                if ($scope.checkBigInteger == false) {
                    needCheckBigInteger = false;
                }
                var format = generalFunctions.GetLocaleFormat(value, needCheckBigInteger);
                value = format.returnValue;
                element.val($filter('number')(value));
                return value;
            });
            element.bind("focus", function () {
                Focus($scope, element, attrs, ctrl);
            });
        }

    };
});

app.directive('onlyNum', function () {
    return function (scope, element, attrs) {
        var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 109, 188, 189, 190];
        element.bind("keydown", function (event) {
            //console.log(event.which);
            if ($.inArray(event.which, keyCode) == -1) {
                scope.$apply(function () {
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }
        });
        element.bind("keyup", function (event) {
            var numbers = /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/;
            var value = $(this).val();
            if (value.match(numbers)) {
                var acceptMinus = false;
                if (attrs.acceptminus == "true") {
                    acceptMinus = true;
                }
                if (acceptMinus == false) {
                    if (value < 0) {
                        $(this).val("");
                    }
                }
                var hasminvalue = false;
                var minvalue = 0;
                if (attrs.minvalue != undefined) {
                    if (jQuery.isNumeric(attrs.minvalue) == true) {
                        hasminvalue = true;
                        minvalue = attrs.minvalue;
                    }
                }
                if (hasminvalue == true) {
                    if (parseFloat(value) < parseFloat(minvalue)) {
                        $(this).val(minvalue);
                    }
                }
                var hasmaxvalue = false;
                var maxvalue = 0;
                if (attrs.maxvalue != undefined) {
                    if (jQuery.isNumeric(attrs.maxvalue) == true) {
                        hasmaxvalue = true;
                        maxvalue = attrs.maxvalue;
                    }
                }
                if (hasmaxvalue == true) {
                    if (parseFloat(value) > parseFloat(maxvalue)) {
                        $(this).val(maxvalue);
                    }
                }
            } else {
                if ($(this).val() == "") {
                    $(this).val("");
                }
            }
        });
        element.bind("change", function (event) {
            var value = $(this).val();
            var acceptMinus = false;
            if (attrs.acceptminus == "true") {
                acceptMinus = true;
            }
            if (acceptMinus == false) {
                if (value < 0) {
                    $(this).val("");
                }
            }
            var hasminvalue = false;
            var minvalue = 0;
            if (attrs.minvalue != undefined) {
                if (jQuery.isNumeric(attrs.minvalue) == true) {
                    hasminvalue = true;
                    minvalue = attrs.minvalue;
                }
            }
            if (hasminvalue == true) {
                if (parseFloat(value) < parseFloat(minvalue)) {
                    $(this).val(minvalue);
                }
            }
            var hasmaxvalue = false;
            var maxvalue = 0;
            if (attrs.maxvalue != undefined) {
                if (jQuery.isNumeric(attrs.maxvalue) == true) {
                    hasmaxvalue = true;
                    maxvalue = attrs.maxvalue;
                }
            }
            if (hasmaxvalue == true) {
                if (parseFloat(value) > parseFloat(maxvalue)) {
                    $(this).val(maxvalue);
                }
            }
        });
    };
})


app.directive("formatConc", function ($filter) {
    return {
        restrict: "A", // Only usable as an attribute of another HTML element
        require: "ngModel",
        scope: {
            decimals: "=",
            decimalPoint: "="
        },
        link: function (scope, element, attr, ngModel) {
            var decimalCount = parseInt(scope.decimals);
            var decimalPoint = scope.decimalPoint || ".";
            // Run when the model is first rendered and when the model is changed from code
            var value;
            ngModel.$render = function () {
                if (ngModel.$modelValue != null) {
                    if (ngModel.$modelValue > 1) {
                        value
                        if (typeof decimalCount === "number") {
                            value = ngModel.$modelValue.toFixed(decimalCount).toString().replace(".", decimalPoint);
                        } else {
                            value = ngModel.$modelValue.toString().replace(".", decimalPoint);
                        }
                    } else {
                        value = "< 1";
                    }
                    element.val(value);
                }
            }
        }
    }
});

app.directive('format', ['$filter', 'generalFunctions', function ($filter, generalFunctions) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ctrl.$render = function () {
                elem.val($filter(attrs.format)(ctrl.$viewValue));
            }

            ////This runs when we update the text field
            //ctrl.$parsers.push(function (viewValue) {
            //    return $filter(attrs.format)(ctrl.$modelValue);
            //})

            //ctrl.$formatters.unshift(function (a) {
            //    return $filter(attrs.format)(ctrl.$modelValue) + symbol;
            //    //var value = ctrl.$modelValue;
            //    //var format = generalFunctions.GetLocaleFormat(value);
            //    //value = format.returnValue;
            //    //return $filter(attrs.format)(value) + symbol;
            //});


            //ctrl.$parsers.unshift(function (viewValue) {
            //    //var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
            //    //elem.val($filter('number')(plainNumber) + symbol);
            //    //return plainNumber;
            //    var value = viewValue;
            //    var format = generalFunctions.GetLocaleFormat(viewValue);
            //    value = format.returnValue;
            //    //var plainNumber = value.replace(/[^\d|\-+|\.+]/g, '');
            //    elem.val($filter('number')(value) + symbol);
            //    return plainNumber;
            //});
            //ctrl.$parsers.unshift(function (viewValue) {
            //    if (viewValue == "") {
            //        viewValue = 0;
            //        elem.val($filter('number')(viewValue));
            //        //ctrl.$setViewValue(viewValue);
            //        //ctrl.$render();
            //    }
            //});
            //elem.on("change", function (e) {
            //    var value = elem[0].value;
            //    var format = generalFunctions.GetLocaleFormat(value);
            //    value = format.returnValue;
            //    elem.val($filter(attrs.format)(value) + symbol);
            //    return value;
            //});
        }
    };
} ]);

app.directive("decimals", function ($filter) {
    return {
        restrict: "A", // Only usable as an attribute of another HTML element
        require: "?ngModel",
        scope: {
            decimals: "@",
            decimalPoint: "@"
        },
        link: function (scope, element, attr, ngModel) {
            var decimalCount = parseInt(scope.decimals) || 2;
            var decimalPoint = scope.decimalPoint || ".";
            // Run when the model is first rendered and when the model is changed from code
            ngModel.$render = function () {
                if (ngModel.$modelValue != null && ngModel.$modelValue >= 0) {
                    if (typeof decimalCount === "number") {
                        element.val(ngModel.$modelValue.toFixed(decimalCount).toString().replace(".", decimalPoint));
                    } else {
                        element.val(ngModel.$modelValue.toString().replace(".", decimalPoint));
                    }
                }
            }
            // Run when the view value changes - after each keypress
            // The returned value is then written to the model
            ngModel.$parsers.unshift(function (newValue) {
                if (typeof decimalCount === "number") {
                    var floatValue = parseFloat(newValue.replace(decimalPoint, "."));
                    if (decimalCount === 0) {
                        return parseInt(floatValue);
                    }
                    return parseFloat(floatValue.toFixed(decimalCount));
                }

                return parseFloat(newValue.replace(decimalPoint, "."));
            });
            // Formats the displayed value when the input field loses focus
            element.on("change", function (e) {
                var floatValue = parseFloat(element.val().replace(decimalPoint, "."));
                if (!isNaN(floatValue) && typeof decimalCount === "number") {
                    if (decimalCount === 0) {
                        element.val(parseInt(floatValue));
                    } else {
                        var strValue = floatValue.toFixed(decimalCount);
                        element.val(strValue.replace(".", decimalPoint));
                    }
                }
            });
        }
    }
});

app.directive("formatDecimals", function () {
    return {
        restrict: "A", // Only usable as an attribute of another HTML element
        require: "ngModel",
        scope: {
            decimals: "=",
            decimalPoint: "="
        },
        link: function (scope, element, attr, ngModel) {
            var decimalPoint = ".";
            var value1 = (1 / 10).toLocaleString();
            if (value1.indexOf(",") > 0) {
                decimalPoint = ",";
            }
            // Run when the model is first rendered and when the model is changed from code
            var value;
            ngModel.$render = function () {
                if (ngModel.$modelValue != null) {
                    if (ngModel.$modelValue > 0) {
                        value = ngModel.$modelValue.toString().replace(".", decimalPoint);
                    } else {
                        value = 0;
                    }
                    element.val(value);
                }
            }
        }
    }
});

