"use strict";

app.factory("GeneralSharedServices", function ($rootScope, $q, $http, generalElements) {
    var sharedService = {};
    sharedService.PageName = "";

    sharedService.ProjectChangePage = function (pageName) {
        this.PageName = pageName;
        $rootScope.$broadcast("ProjectChangePageEvent");
    }


    sharedService.OpenAccountInfo = function () {
        $rootScope.$broadcast("OpenAccountInfoEvent");
    }

    sharedService.RefreshOptionsPanel = function () {
        setTimeout(function () {
            $("#pnlOptions").panel();
            $("#pnlOptions").trigger("create");
            $("#ulPanelOptions").listview("refresh");
            var page = jQuery.trim(window.location.hash);
            var listItems = $("#ulPanelOptions li");
        }, 100); //1000
    }

    sharedService.PerformLogout = function () {
        $rootScope.$broadcast("PerformLogoutEvent");
    }


    sharedService.UpdateUnitMeasurementSetting = function () {
        $rootScope.$broadcast("UpdateUnitMeasurementSettingEvent");
    }

    sharedService.UpdateDataEntriesFromServer = function (pageName) {
        $rootScope.$broadcast("TriggerUpdateSelectionListEvent");
    }

    sharedService.UpdateDataEntriesFromServerCompleted = function () {
        $rootScope.$broadcast("TriggerUpdateSelectionListEventCompleted");
    }


    sharedService.RefreshFilterPage = function () {
        $rootScope.$broadcast("RefreshFilterPageEvent");
    }

    sharedService.UpdateFilterSelections = function () {
        $rootScope.$broadcast("UpdateFilterSelectionsEvent");
    }

    sharedService.FailValidationEvent = function () {
        $rootScope.$broadcast("FailValidationEvent");
    }

    sharedService.TurbineChangedEvent = function () {
        $rootScope.$broadcast("TurbineChangedEvent");
    }

    sharedService.ResultsReadyEvent = function () {
        $rootScope.$broadcast("ResultsReadyEvent");
    }
    return sharedService;
});