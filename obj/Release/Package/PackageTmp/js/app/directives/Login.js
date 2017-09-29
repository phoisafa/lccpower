"use strict";

app.directive("popupLogin", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupLogin.html?v=8",
        controller: "LoginCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupLogin").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupAccountInfo", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupAccountInfo.html?v=8",
        controller: "LoginCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupAccountInfo").enhanceWithin().popup();
            }, 1);
        }
    };
});