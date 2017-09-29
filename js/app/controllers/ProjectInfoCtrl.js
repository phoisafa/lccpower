"use strict";

app.controller("ProjectInfoCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions) {
    var PageMenu = lccFunctions.GetPageMenu();
    $scope.Page = PageMenu[0];
    $scope.ProjectName = DataCollectionSharedService.Params.projectName;
    $scope.ReportDate = DataCollectionSharedService.Params.reportDate;
    $scope.Project = DataCollectionSharedService.Params.projectInfo;
    $scope.Description = DataCollectionSharedService.Params.description;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.dataEntries = undefined;
    $scope.selectedCurrency = undefined;
    $scope.showPrevButton = false;
    $scope.showNextButton = true;
    $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
    $scope.CompanyLogo = undefined;
    var showAboutPopup = true;


    $scope.NextPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[1].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[1].name);
    }



    $scope.$on("ShowAboutPopupEvent", function () {
        if (DataCollectionSharedService.colDataFromServer != undefined) {
            if (DataCollectionSharedService.colDataFromServer.ShowAboutApplicationPopup != undefined) {
                showAboutPopup = DataCollectionSharedService.colDataFromServer.ShowAboutApplicationPopup;
            }
        }
    });

    $scope.$on("TriggerUpdateSelectionListEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.$apply();
        var currencyId = DataCollectionSharedService.AccountInfo.CurrencyID;
        $scope.selectedCurrency = GetCurrency(currencyId);
        setTimeout(function () {
            generalFunctions.ChangeComboBoxSelection($scope.selectedCurrency.display, "cboCurrency", true, true);
            DataCollectionSharedService.UpdateSelectionListEventCompleted.projectInfo = true;
            DataCollectionSharedService.CheckUpdateSelectionListEventCompleted();
        }, 1)
    });

    function GetCurrency(currencyId) {
        var currency = undefined;
        for (var i = 0; i < $scope.dataEntries.General.Currency.length; i++) {
            var tmpCurrency = $scope.dataEntries.General.Currency[i];
            if (tmpCurrency.value == currencyId) {
                currency = tmpCurrency;
                break;
            }
        }
        if (currency == undefined) {
            currency = $scope.dataEntries.General.Currency[0];
        }
        return currency
    }

    $scope.$on("ProjectChangePageEvent", function () {
        if (GeneralSharedServices.PageName == PageMenu[0].name) {
            console.time('Load ProjectInfo');
            //$("#divProjectInfoTemplate").removeClass("ng-hide");
            //setTimeout(function () {
                generalFunctions.ChangePage(PageMenu[0].name, "none", false);
                $scope.ProjectName = DataCollectionSharedService.Params.projectName;
                $scope.ReportDate = DataCollectionSharedService.Params.reportDate;
                $scope.Project = DataCollectionSharedService.Params.projectInfo;
                $scope.Description = DataCollectionSharedService.Params.description;
                $scope.Setting = DataCollectionSharedService.Params.setting;
                //$scope.$apply();
            //}, 1);
                console.timeEnd('Load ProjectInfo');

        }
    });

    $scope.$on("ResetDataEvent", function () {
        $scope.ResetValue(true);
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
    });

    $scope.$on("FailValidationEvent", function () {
        if (DataCollectionSharedService.failValidationPage == PageMenu[0].name) {
            DataCollectionSharedService.failValidationPage = "";
        }
    });

    $scope.ResetValue = function (resetAll) {
        if (DataCollectionSharedService.TriggerLoadRecordFromServer == true && DataCollectionSharedService.ProjectInfoLoaded == false) {
            $scope.ProjectName = DataCollectionSharedService.Params.projectName;
            $scope.ReportDate = DataCollectionSharedService.Params.reportDate;
            $scope.Description = DataCollectionSharedService.Params.description;
            $("#txtReportDate").val($scope.ReportDate);
            $scope.Project = DataCollectionSharedService.Params.projectInfo;
            DataCollectionSharedService.SuccessUpdateRecord(PageMenu[0].name);
        } else {
            $scope.ProjectName = "";
            $scope.ReportDate = generalFunctions.TodayDate();
            $scope.Description = "";
            $("#txtReportDate").val($scope.ReportDate);
            $scope.Project = generalElements.ProjectInfoElement();
            RefreshAccountInfo();
        }
        //$scope.$apply();
    }


    function RefreshAccountInfo() {
        var info = DataCollectionSharedService.AccountInfo;
        if (info != undefined) {
            $scope.Project.Rep.Name = info.Company;
            $scope.Project.Rep.Street = info.Street;
            $scope.Project.Rep.City = info.City;
            $scope.Project.Rep.State = info.State;
            $scope.Project.Rep.Zip = info.Zip;
            $scope.Project.Rep.Country = info.Country;
            $scope.Project.PrepareBy.Name = info.FullName;
            $scope.Project.PrepareBy.Title = info.Designation;
            $scope.Project.PrepareBy.Tel = info.Tel;
            $scope.Project.PrepareBy.Fax = info.Fax;
            $scope.Project.PrepareBy.Mobile = info.Mobile;
            $scope.Project.PrepareBy.Email = info.Email;
            $scope.CompanyLogo = info.CompanyLogo
        } else {
            $scope.Project.Rep.Name = "";
            $scope.Project.Rep.Street = "";
            $scope.Project.Rep.City = "";
            $scope.Project.Rep.State = "";
            $scope.Project.Rep.Zip = "";
            $scope.Project.Rep.Country = "";
            $scope.Project.PrepareBy.Name = "";
            $scope.Project.PrepareBy.Title = "";
            $scope.Project.PrepareBy.Tel = "";
            $scope.Project.PrepareBy.Fax = "";
            $scope.Project.PrepareBy.Mobile = "";
            $scope.Project.PrepareBy.Email = "";
            $scope.CompanyLogo = "";
        }
        $scope.Setting = DataCollectionSharedService.Params.setting;
        //$scope.$apply();
    }

    $scope.RefreshCamfilRepInfo = function () {
        RefreshAccountInfo();
    }

    $scope.$on("AccountInfoUpdatedEvent", function () {
        RefreshAccountInfo();
    });

    function UpdateDataToSharedService() {
        DataCollectionSharedService.Params.projectInfo = $scope.Project;
        DataCollectionSharedService.Params.projectName = $scope.ProjectName;
        DataCollectionSharedService.Params.reportDate = $scope.ReportDate;
        DataCollectionSharedService.Params.description = $scope.Description;
        DataCollectionSharedService.Params.setting = $scope.Setting;
        DataCollectionSharedService.UpdateResultsStatus(false);
    }


    $scope.$watch("ProjectName", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            UpdateDataToSharedService();
        }
    });

    $scope.$watch("ReportDate", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            UpdateDataToSharedService();
        }
    });

    $scope.$watch("Description", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            UpdateDataToSharedService();
        }
    });

    $scope.$watch("Setting.currency.id", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            var currencyId = generalFunctions.GetNumber($scope.Setting.currency.id);
            for (var i = 0; i < $scope.dataEntries.General.Currency.length; i++) {
                var currency = $scope.dataEntries.General.Currency[i];
                if (currency.value == currencyId) {
                    $scope.Setting.currency = {
                        name: currency.display,
                        id: currency.value
                    }
                }
            }
            UpdateDataToSharedService();
            setTimeout(function () {
                generalFunctions.ChangeComboBoxSelection($scope.Setting.currency.name, "cboCurrency", true, true);
            }, 1);
        }
    }, true);


    $scope.NextPage = function () {
        var currentPageName = $.mobile.activePage.attr("id");
        var index = generalFunctions.GetCurrentPageIndex(PageMenu, currentPageName);
        if (index < (PageMenu.length - 1)) {
            index = index + 1;
            generalFunctions.ChangePageMenu(PageMenu[index].name, PageMenu);
            GeneralSharedServices.ProjectChangePage(PageMenu[index].name);
        }
    }

    $scope.focusEvent = function (control, focus) {
        if (focus == true) {
            $("#" + control).addClass("ui-focus");
        } else {
            $("#" + control).removeClass("ui-focus");
        }

    }

    $scope.OptionMenuClicked = function () {
        DataCollectionSharedService.TriggerCheckLoginCodeIsActive();
    }

    $scope.$on("UpdateCompanyLogoEvent", function () {
        $scope.CompanyLogo = DataCollectionSharedService.AccountInfo.CompanyLogo;
        //$scope.$apply();
    });

    $scope.ChangeLogo = function () {
        DataCollectionSharedService.TriggerChangeCompanyLogoEvent("Project");
    }

    $scope.RemoveLogo = function () {
        DataCollectionSharedService.RemoveCompanyLogo();
    }



});