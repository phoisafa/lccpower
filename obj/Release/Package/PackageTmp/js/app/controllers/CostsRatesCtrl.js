"use strict";

app.controller("CostsRatesCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions, lccElements) {
    $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
    $scope.CostsRates = DataCollectionSharedService.Params.costsRates;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.unit = [false, true];

    $scope.dataEntries = undefined;
    $scope.showPrevButton = true;
    $scope.showNextButton = true;

    var PageMenu = lccFunctions.GetPageMenu();
    $scope.Page = PageMenu[4];

    $scope.NextPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[5].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[5].name);
    }

    $scope.PrevPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[3].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[3].name);
    }

    $scope.$on("ProjectChangePageEvent", function () {
        if (GeneralSharedServices.PageName == PageMenu[4].name) {
            //setTimeout(function () {
            console.time('Load CostsRates');
            //console.time('CostsRates:changePage');
            generalFunctions.ChangePage(PageMenu[4].name, "none", false);
            //console.timeEnd('CostsRates:changePage');
                $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
                $scope.CostsRates = DataCollectionSharedService.Params.costsRates;
                $scope.Setting = DataCollectionSharedService.Params.setting;
                //$scope.$apply();
                //ModifyCostsByStageCSS();
                console.timeEnd('Load CostsRates');
            //}, 1);
        }
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
        //$scope.$apply();
    });

    $scope.$on("UpdateUnitMeasurementSettingEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.Setting = DataCollectionSharedService.Params.setting;
        //$scope.$apply();
        setTimeout(function () {
            //ResetValue(false, true);
            DataCollectionSharedService.UnitMeaChanged.CostRate = true;
            DataCollectionSharedService.CheckUpdateUnitMeasurementSettingEventCompleted();
        }, 1)
    });

    $scope.$on("FailValidationEvent", function () {
        if (DataCollectionSharedService.failValidationPage == PageMenu[4].name) {
            DataCollectionSharedService.failValidationPage = "";
        }
    });

    $scope.$on("TriggerUpdateSelectionListEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.$apply();
        $('#cboFilterPriceIncrease').editableSelect({ filter: false });
        $('#cboLaborCostIncrease').editableSelect({ filter: false });
        $('#cboWasteHandlingIncrease').editableSelect({ filter: false });
        $('#cboNPVDiscountRate').editableSelect({ filter: false });
        //$('#cboMajorMaintenanceInterval').editableSelect({ filter: false });
        //$('#cboHousingCost1').editableSelect({ filter: false });
        //$('#cboHousingCost2').editableSelect({ filter: false });
        //$('#cboHousingCost3').editableSelect({ filter: false });
        //$('#cboWasteHandlingCost1').editableSelect({ filter: false });
        //$('#cboWasteHandlingCost2').editableSelect({ filter: false });
        //$('#cboWasteHandlingCost3').editableSelect({ filter: false });
        //$('#cboLaborCost1').editableSelect({ filter: false });
        //$('#cboLaborCost2').editableSelect({ filter: false });
        //$('#cboLaborCost3').editableSelect({ filter: false });
        //$('#cboWaterWashCost1').editableSelect({ filter: false });
        //$('#cboWaterWashCost2').editableSelect({ filter: false });
        //$('#cboWaterWashCost3').editableSelect({ filter: false });
        setTimeout(function () {
            ResetValue(true, true);
            DataCollectionSharedService.UpdateSelectionListEventCompleted.costsRates = true;
            DataCollectionSharedService.CheckUpdateSelectionListEventCompleted();
        }, 1)
    });


    function ModifyCostsByStageCSS() {
        var style;
        switch ($scope.RunningCond.totalStage) {
            case 1:
                style = 'tblCostsWith1Col';
                break;
            case 2:
                style = 'tblCostsWith2Col';
                break;
            case 3:
                style = 'tblCostsWith3Col';
                break;
        }
        $('.tblCosts').find('.ui-input-text').each(function () {
            $(this).removeClass('tblCostsWith1Col tblCostsWith2Col tblCostsWith3Col');
            $(this).addClass(style);
        });
    }

    function ResetValue(resetAll, update) {
        if (resetAll == true) {
            $scope.CostsRates.filterPriceIncrease = $scope.dataEntries.CostsRates.FilterPriceIncrease;
            $scope.CostsRates.laborCostIncrease = $scope.dataEntries.CostsRates.LaborCostIncrease;
            $scope.CostsRates.wasteHandlingIncrease = $scope.dataEntries.CostsRates.WasteHandlingIncrease;
            $scope.CostsRates.npvDiscountRate = $scope.dataEntries.CostsRates.NPVDiscountRate;
            $scope.CostsRates.majorMaintenanceInterval = $scope.dataEntries.GasTurbine.CompressorInterval;
            //for (var i = 0; i < 3; i++) {
            //    $scope.CostsRates.costs[i].housing = $scope.dataEntries.CostsRates.HousingCost;
            //    $scope.CostsRates.costs[i].wasteHandling = $scope.dataEntries.CostsRates.WasteHandlingCost;
            //    $scope.CostsRates.costs[i].labor = $scope.dataEntries.CostsRates.LaborCost;
            //    $scope.CostsRates.costs[i].waterWash = $scope.dataEntries.CostsRates.WaterWashCost;
            //}
        }
        //$scope.$apply();
        $("#cboFilterPriceIncrease").val(generalFunctions.GetNumberLocale($scope.CostsRates.filterPriceIncrease, false));
        $("#cboLaborCostIncrease").val(generalFunctions.GetNumberLocale($scope.CostsRates.laborCostIncrease, false));
        $("#cboWasteHandlingIncrease").val(generalFunctions.GetNumberLocale($scope.CostsRates.wasteHandlingIncrease, false));
        $("#cboNPVDiscountRate").val(generalFunctions.GetNumberLocale($scope.CostsRates.npvDiscountRate, false));
        //$("#cboMajorMaintenanceInterval").val(generalFunctions.GetNumberLocale($scope.CostsRates.majorMaintenanceInterval, false));
        //for (var i = 1; i < 4; i++) {
        //    $("#cboHousingCost" + i).val(generalFunctions.GetNumberLocale($scope.CostsRates.costs[i - 1].housing, false));
        //    $("#cboWasteHandlingCost" + i).val(generalFunctions.GetNumberLocale($scope.CostsRates.costs[i - 1].wasteHandling, false));
        //    $("#cboLaborCost" + i).val(generalFunctions.GetNumberLocale($scope.CostsRates.costs[i - 1].labor, false));
        //    $("#cboWaterWashCost" + i).val(generalFunctions.GetNumberLocale($scope.CostsRates.costs[i - 1].waterWash, false));
        //}
        if (update == true) {
            UpdateDataToSharedService();
        }
    }

    function UpdateDataToSharedService() {
        DataCollectionSharedService.Params.costsRates = $scope.CostsRates;
        DataCollectionSharedService.UpdateResultsStatus(false);
    }

    $scope.GetStageName = function (stage) {
        return generalFunctions.GetStageName(stage);
    };

    $scope.showTotalStage = function (stage) {
        if ($scope.RunningCond.totalStage >= stage) {
            return true;
        } else {
            return false;
        }
    };

    $scope.$watch("CostsRates.filterPriceIncrease", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            UpdateDataToSharedService()
        }
    });

    $scope.$watch("CostsRates.laborCostIncrease", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            UpdateDataToSharedService()
        }
    });

    $scope.$watch("CostsRates.wasteHandlingIncrease", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            UpdateDataToSharedService()
        }
    });

    $scope.$watch("CostsRates.npvDiscountRate", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            UpdateDataToSharedService()
        }
    });
});