"use strict";

app.controller("PageMenuCtrl", function ($scope, $filter, generalFunctions, GeneralSharedServices, lccFunctions, DataCollectionSharedService) {
    $scope.PageMenu = lccFunctions.GetPageMenu();
    $scope.infoDetails = [];

    $scope.ChangePageMenu = function (pageName) {
        generalFunctions.ChangePageMenu(pageName, $scope.PageMenu);
        GeneralSharedServices.ProjectChangePage(pageName);
    }

    $scope.$on("TranslationEvent", function () {
        setTimeout(function () {
        }, 100);

    });

    function InfoElement(title, value, type) {
        if (type == undefined) {
            type = "detail";
        }
        return {
            title: title,
            value: value,
            type: type
        };
    }

    $scope.showPage = function (page) {
        var show = true;
        if (page == $scope.PageMenu[6].name) {
            var totalSolution = generalFunctions.GetNumber(DataCollectionSharedService.Params.filterSolutions.totalSolution);
            if (totalSolution <= 1 || DataCollectionSharedService.ResultsReady == false) {
                show = false;
            }
        }
        return show;
    }

});