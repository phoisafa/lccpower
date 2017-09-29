"use strict";

app.controller("UnitMeasurementCtrl", function ($scope, $filter, lccElements, lccFunctions, generalFunctions, DataCollectionSharedService,GeneralSharedServices) {
    $scope.test = "SI";
    $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.dataEntries = undefined;
    var affectedPage = ["pageGasTurbine", "pageSolutionsToCompare", "pageResults","pageComparison"];

    $scope.$on("TriggerUpdateSelectionListEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.$apply();
     });

    $scope.$on("TriggerUpdateSelectionListEventCompleted", function () {
        if (DataCollectionSharedService.UpdateSelectionListEventCompleted.ALL == true) {
            var unitId = DataCollectionSharedService.AccountInfo.UnitID;
            if (unitId != generalFunctions.OnlyNum($scope.Setting.unit.unitId)) {
                $scope.ChangeUnitMeasurement(unitId, "", false,true);
                //$scope.$apply();
            } 
        }
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
        //$scope.$apply();
    });

    $scope.ChangeUnitMeasurement = function (unitId, triggerPage, resetDataEvent,initializePageEvent) {
        if (unitId != generalFunctions.OnlyNum($scope.Setting.unit.unitId)) {
            if (resetDataEvent == true) {
                generalFunctions.ShowLoading("Processing...");
            }
            setTimeout(function () {
                if (unitId != generalFunctions.OnlyNum($scope.Setting.unit.unitId)) {
                    var unit;
                    if (unitId == 1) {
                        unit = "SI";
                    } else {
                        unit = "US";
                    }
                    //Change dataEntries list and unit measurement
                    DataCollectionSharedService.dataEntries = DataCollectionSharedService.UpdateDataEntries(unitId);
                    if (resetDataEvent == true || initializePageEvent == true) {
                        DataCollectionSharedService.UnitMeaChanged = {
                            GasTurbine: false,
                            RunningCond: false,
                            FilterSolution: false,
                            CostRate: false
                        };
                    }
                    $scope.Setting.unit = lccElements.MeasurementUnitElement(unitId);
                    $scope.$apply();
                    //Modify css for radio button

                    DataCollectionSharedService.UpdateLoadingPageFlag(true);
                    var page = triggerPage.replace("Title", "");
                    //for (var i = 0; i < affectedPage.length; i++) {
                    //    $('#lblrdbSI' + affectedPage[i] + "Title").removeClass("ui-radio-on ui-btn-active ui-radio-off");
                    //    $('#lblrdbUS' + affectedPage[i] + "Title").removeClass("ui-radio-on ui-btn-active ui-radio-off");
                    //}
                    //switch (unitId) {
                    //    case 1:
                    //        for (var i = 0; i < affectedPage.length; i++) {
                    //            $('#lblrdbSI' + affectedPage[i] + "Title").addClass("ui-radio-on ui-btn-active");
                    //            $('#lblrdbUS' + affectedPage[i] + "Title").addClass("ui-radio-off");
                    //        }
                    //        break;
                    //    case 2:
                    //        for (var i = 0; i < affectedPage.length; i++) {
                    //            $('#lblrdbSI' + affectedPage[i] + "Title").addClass("ui-radio-off");
                    //            $('#lblrdbUS' + affectedPage[i] + "Title").addClass("ui-radio-on ui-btn-active");
                    //        }
                    //        break;
                    //}
                    //setTimeout(function () {
                    //update selection list and value to element
                    if (initializePageEvent == true) {
                        //case "pageGasTurbine":
                        DataCollectionSharedService.Params.gasTurbine.dPSystem = $scope.dataEntries.GasTurbine.dPSystem;
                        DataCollectionSharedService.Params.gasTurbine.totalSystemAirflow = $scope.dataEntries.RunningCond.TotalSystemAirFlow;

                    } else {
                        //case "pageGasTurbine":
                        DataCollectionSharedService.Params.gasTurbine.dPSystem = generalFunctions.OnlyNum(generalFunctions.PressureDropUnitConversion(generalFunctions.GetNumber(DataCollectionSharedService.Params.gasTurbine.dPSystem), unit));
                        DataCollectionSharedService.Params.gasTurbine.totalSystemAirflow = generalFunctions.OnlyNum(generalFunctions.AirFlowUnitConversion(generalFunctions.GetNumber(DataCollectionSharedService.Params.gasTurbine.totalSystemAirflow), unit));

                        //case "pageSolutionsToCompare"
                        var filterSolutions = DataCollectionSharedService.Params.filterSolutions.solutions;
                        for (var i = 0; i < filterSolutions.length; i++) {
                            var solution = filterSolutions[i];
                            if (solution.filterLifetimeCriteria == 'PRESSUREBASE') {
                                solution.filters[0].exchangeValue = generalFunctions.OnlyNum(generalFunctions.PressureDropUnitConversion(generalFunctions.GetNumber(solution.filters[0].exchangeValue), unit));
                                solution.filters[1].exchangeValue = generalFunctions.OnlyNum(generalFunctions.PressureDropUnitConversion(generalFunctions.GetNumber(solution.filters[1].exchangeValue), unit));
                                solution.filters[2].exchangeValue = generalFunctions.OnlyNum(generalFunctions.PressureDropUnitConversion(generalFunctions.GetNumber(solution.filters[2].exchangeValue), unit));
                            }
                        }
                    }
                    DataCollectionSharedService.Params.gasTurbine.heatRateOfEngineUnit = $scope.Setting.unit.heatRateEngine;
                    DataCollectionSharedService.Params.gasTurbine.fuelCostUnit = $scope.Setting.unit.fuelCost;
                    //Update selection list
                    //case "pageGasTurbine":
                    generalFunctions.UpdateSelectionList("dPSystem", DataCollectionSharedService.dataEntries.GasTurbine.List.dPSystem, false, true, generalFunctions.OnlyNum(DataCollectionSharedService.Params.gasTurbine.dPSystem));
                    generalFunctions.UpdateSelectionList("TotalSystemAirFlow", DataCollectionSharedService.dataEntries.RunningCond.List.TotalSystemAirFlow, false, true, generalFunctions.OnlyNum(DataCollectionSharedService.Params.gasTurbine.totalSystemAirflow));

                    //case "pageSolutionsToCompare"
                    var filterSolutions = DataCollectionSharedService.Params.filterSolutions.solutions;
                    for (var i = 0; i < filterSolutions.length; i++) {
                        var solution = filterSolutions[i];
                        if (solution.filterLifetimeCriteria == 'PRESSUREBASE') {
                            generalFunctions.UpdateSelectionList("FinalDP1" + "S" + (i + 1), DataCollectionSharedService.dataEntries.RunningCond.List.FinalPressureDrop, false, true, generalFunctions.OnlyNum(solution.filters[0].exchangeValue));
                            generalFunctions.UpdateSelectionList("FinalDP2" + "S" + (i + 1), DataCollectionSharedService.dataEntries.RunningCond.List.FinalPressureDrop, false, true, generalFunctions.OnlyNum(solution.filters[1].exchangeValue));
                            generalFunctions.UpdateSelectionList("FinalDP3" + "S" + (i + 1), DataCollectionSharedService.dataEntries.RunningCond.List.FinalPressureDrop, false, true, generalFunctions.OnlyNum(solution.filters[2].exchangeValue));
                        }
                    }
                    //$scope.$apply();
                    UpdateDataToSharedService(true);
                }
            }, 1);
        }
    }



    function UpdateDataToSharedService(TriggerUpdate) {
        DataCollectionSharedService.Params.setting.unit = $scope.Setting.unit;
        GeneralSharedServices.UpdateUnitMeasurementSetting();
        DataCollectionSharedService.UpdateLoadingPageFlag(false);
    }
});