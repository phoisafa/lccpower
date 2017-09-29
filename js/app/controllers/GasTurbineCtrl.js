"use strict";

app.controller("GasTurbineCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions,lccElements) {
    $scope.GasTurbine = DataCollectionSharedService.Params.gasTurbine;
   // $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.unit = [false, true];
    //$scope.selectedStage = [
    //    { name: "1st Stage", active: true, checked: true },
    //    { name: "2nd Stage", active: true, checked: true },
    //    { name: "3rd Stage", active: true, checked: true}
    //];

    $scope.dataEntries = undefined;
    $scope.gasTurbineGroupingList = undefined;
    $scope.showPrevButton = true;
    $scope.showNextButton = true;

    var PageMenu = lccFunctions.GetPageMenu();
    $scope.Page = PageMenu[1];

    var selectedID = "";
    var selectedGroupID = 0;
    $scope.ShowBackButton = true;
    $scope.modelList = undefined;
    $scope.groupingList = undefined;
    $scope.openPopupTimes = 0;

    $scope.NextPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[2].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[2].name);
    }

    $scope.PrevPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[0].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[0].name);
    }
    $scope.$on("ProjectChangePageEvent", function () {
        if (GeneralSharedServices.PageName == PageMenu[1].name) {
            console.time('Load GasTurbine');
           // setTimeout(function () {
                generalFunctions.ChangePage(PageMenu[1].name, "none", false);
                $scope.GasTurbine = DataCollectionSharedService.Params.gasTurbine;
                //$scope.RunningCond = DataCollectionSharedService.Params.runningCond;
                $scope.Setting = DataCollectionSharedService.Params.setting;
                //$scope.$apply();
          //  }, 1);
                console.timeEnd('Load GasTurbine');
        }
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
        //$scope.$apply();
    });

    $scope.$on("FailValidationEvent", function () {
        if (DataCollectionSharedService.failValidationPage == PageMenu[1].name) {
            DataCollectionSharedService.failValidationPage = "";
        }
    });

    $scope.$on("UpdateUnitMeasurementSettingEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.GasTurbine = DataCollectionSharedService.Params.gasTurbine;
        //$scope.RunningCond = DataCollectionSharedService.Params.runningCond;
        $scope.Setting = DataCollectionSharedService.Params.setting;
        //$scope.$apply();
        generalFunctions.ChangeComboBoxSelection($scope.GasTurbine.heatRateOfEngineUnit + "/kWh", "cboHeatRateOfEngineUnit", true, true);
        generalFunctions.ChangeComboBoxSelection("$/" + $scope.GasTurbine.fuelCostUnit, "cboFuelCostUnit", true, true);
        heatRateOfEngineUnitChanged();
        fuelCostUnitChangedEvent();
        setTimeout(function () {
            ResetValue(false, true);
            DataCollectionSharedService.UnitMeaChanged.GasTurbine = true;
            DataCollectionSharedService.CheckUpdateUnitMeasurementSettingEventCompleted();
        }, 1)
    });

    $scope.$on("TriggerUpdateSelectionListEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.gasTurbineGroupingList = $scope.dataEntries.GasTurbineGroup;
        LoadTurbineList(true, true);
        $scope.$apply();
        $('#tabTurbineSelection').click('tabsselect', function (event, ui) {
            var loadAllTurbine = false;
            $("#tabGrouping").removeClass("tabNoSelected");
            $("#tabTurbine").removeClass("tabNoSelected");
            switch ($("#tabTurbineSelection").tabs('option', 'active')) {
                case 0: //all turbine
                    if ($scope.tabs[0] == false) {
                        //LoadTurbineList(true);
                        $scope.ResetValue();
                        //$scope.$apply();
                    }
                    $scope.tabs = [true, false];
                    $("#tabGrouping").addClass("tabNoSelected");
                    break;
                case 1: //turbine grouping
                    if ($scope.tabs[1] == false) {
                        LoadTurbineList(false);
                    }
                    $scope.tabs = [false, true];
                    $("#tabTurbine").addClass("tabNoSelected");
                    break;
            }
            ShowBackButton();
        });
        setTimeout(function () {
            $("#popupTurbineList")
                .enhanceWithin().popup()
                .bind({
                    popupafteropen: function (event, ui) {
                        $("#ulTurbineList2").each(function () {
                            $(this).find("li").each(function () {
                                var anc = $(this).find("a");
                                anc.addClass("ui-btn-c");
                                anc.removeClass("ui-btn-b");
                            });
                        });
                        console.timeEnd("ClosePopup:Turbine");
                    },
                    popupbeforeposition: function (event, ui) {
                        if ($scope.openPopupTimes == 1) {
                            $scope.tabs = [true, false];
                            $('#tabTurbineSelection a[href="#Turbine"]').trigger('click');
                            $scope.openPopupTimes = 0;

                        }
                    }
                })
        }, 1);
        $('#cboDowntimeFilterReplacement').editableSelect({ filter: false });
        $('#cboEnergySoldPrice').editableSelect({ filter: false });
        $('#cboPriceIncrease').editableSelect({ filter: false });
        $('#cboOutput').editableSelect({ filter: false });
        $('#cboReductionOfOutput').editableSelect({ filter: false });
        $('#cboHeatRateIncrease').editableSelect({ filter: false });
        $('#cbodPSystem').editableSelect({ filter: false });
        $('#cboHeatRateOfEngine').editableSelect({ filter: false });
        $('#cboFuelCost').editableSelect({ filter: false });
        $('#cboTimeOffFouledCompressorWashing').editableSelect({ filter: false });
        //$('#cboFoulingRateOutput').editableSelect({ filter: false });
        //$('#cboWaterWashInterval').editableSelect({ filter: false });
        $('#cboWaterWashCost').editableSelect({ filter: false });
        //$('#cboFouledCompressorInterval').editableSelect({ filter: false });
        $('#cboTotalSystemAirFlow').editableSelect({ filter: false });
        setTimeout(function () {
            ResetValue(true, true);
            DataCollectionSharedService.UpdateSelectionListEventCompleted.gasTurbine = true;
            DataCollectionSharedService.CheckUpdateSelectionListEventCompleted();
        }, 1)
    });

    function ResetValue(resetAll,update) {
        if (resetAll == true) {
            $scope.GasTurbine.downtimeFilterReplacement = $scope.dataEntries.GasTurbine.DowntimeReplacement;
            $scope.GasTurbine.energySoldPrice = $scope.dataEntries.GasTurbine.SoldPrice;
            $scope.GasTurbine.priceIncrease = $scope.dataEntries.GasTurbine.PriceIncrease;
            $scope.GasTurbine.output = $scope.dataEntries.GasTurbine.Output;
            $scope.GasTurbine.reductionOfOutput = $scope.dataEntries.GasTurbine.OutputReduction;
            $scope.GasTurbine.heatRateIncrease = $scope.dataEntries.GasTurbine.HeatRateIncrease;
            $scope.GasTurbine.dPSystem = $scope.dataEntries.GasTurbine.dPSystem;
            $scope.GasTurbine.heatRateOfEngine = $scope.dataEntries.GasTurbine.EngineHeatRate;
            $scope.GasTurbine.fuelCost = $scope.dataEntries.GasTurbine.FuelCost;
            $scope.GasTurbine.timeOffFouledCompressorWashing = $scope.dataEntries.GasTurbine.CompressorWashingTime;
            //$scope.GasTurbine.foulingRateOutput = $scope.dataEntries.GasTurbine.FoulingRateOutput;
            //$scope.GasTurbine.waterWashInterval = $scope.dataEntries.GasTurbine.CompressorInterval;
            $scope.GasTurbine.waterWashCost = 0;
            $scope.GasTurbine.totalSystemAirflow = $scope.dataEntries.RunningCond.TotalSystemAirFlow;
            //$scope.selectedStage[0].checked = true; 
            //$scope.selectedStage[1].checked = true; 
            //$scope.selectedStage[2].checked = true; 
            DataCollectionSharedService.prevHeatRateOfEngineUnit = $scope.GasTurbine.heatRateOfEngineUnit;
            DataCollectionSharedService.prevFuelCostUnit = $scope.GasTurbine.fuelCostUnit;

        }
        //checkFilterStage(1);
        //checkFilterStage(2);
        //checkFilterStage(3);
        //$scope.$apply();
        $("#cboDowntimeFilterReplacement").val(generalFunctions.GetNumberLocale($scope.GasTurbine.downtimeFilterReplacement, false));
        $("#cboEnergySoldPrice").val(generalFunctions.GetNumberLocale($scope.GasTurbine.energySoldPrice, false));
        $("#cboPriceIncrease").val(generalFunctions.GetNumberLocale($scope.GasTurbine.priceIncrease, false));
        $("#cboOutput").val(generalFunctions.GetNumberLocale($scope.GasTurbine.output, false));
        $("#cboReductionOfOutput").val(generalFunctions.GetNumberLocale($scope.GasTurbine.reductionOfOutput, false));
        $("#cboHeatRateIncrease").val(generalFunctions.GetNumberLocale($scope.GasTurbine.heatRateIncrease, false));
        $("#cbodPSystem").val(generalFunctions.GetNumberLocale($scope.GasTurbine.dPSystem, false));
        $("#cboHeatRateOfEngine").val(generalFunctions.GetNumberLocale($scope.GasTurbine.heatRateOfEngine, false));
        $("#cboFuelCost").val(generalFunctions.GetNumberLocale($scope.GasTurbine.fuelCost, false));
        $("#cboTimeOffFouledCompressorWashing").val(generalFunctions.GetNumberLocale($scope.GasTurbine.timeOffFouledCompressorWashing, false));
        //$("#cboFoulingRateOutput").val(generalFunctions.GetNumberLocale($scope.GasTurbine.foulingRateOutput, false));
        //$("#cboWaterWashInterval").val(generalFunctions.GetNumberLocale($scope.GasTurbine.waterWashInterval, false));
        $("#cboWaterWashCost").val(generalFunctions.GetNumberLocale($scope.GasTurbine.waterWashCost, false));
        $("#cboTotalSystemAirFlow").val(generalFunctions.GetNumberLocale($scope.GasTurbine.totalSystemAirflow, false));
        if (update == true) {
            UpdateDataToSharedService();
        }
    }

    function UpdateDataToSharedService() {
        DataCollectionSharedService.Params.gasTurbine = $scope.GasTurbine;
        //DataCollectionSharedService.Params.runningCond = $scope.RunningCond;
        DataCollectionSharedService.UpdateResultsStatus(false);
    }


    function LoadTurbineList(showAll, disablePopup) {
        var reloadList = false;
        var openPopup = true;
        if (disablePopup == true) {
            openPopup = false;
        }
        var temp = [];
        var turbineList = $scope.gasTurbineGroupingList;
        switch (showAll) {
            case true:
                $scope.modelList = [];
                for (var i = 0; i < turbineList.length; i++) {
                    var group = turbineList[i];
                    for (var x = 0; x < group.Models.length; x++) {
                        var turbineInfo = group.Models[x];
                        var turbine = {
                            category: "item",
                            value: turbineInfo.ModelID,
                            name: turbineInfo.Model,
                            manufacturerId: turbineInfo.ManufacturerID,
                            manufacturer: turbineInfo.Manufacturer,
                            years: turbineInfo.Years,
                            isoBaseRating: turbineInfo.ISOBaseRating,
                            heatRate: turbineInfo.HeatRate,
                            pressRatio: turbineInfo.PressRatio,
                            massFlow: turbineInfo.MassFlow,
                            turbineSpeed: turbineInfo.TurbineSpeed,
                            tempInlet: turbineInfo.TempInlet,
                            tempExhaust: turbineInfo.TempExhaust,
                            weight: turbineInfo.Weight,
                            length: turbineInfo.Length,
                            width: turbineInfo.Width,
                            height: turbineInfo.Height,
                            comments: turbineInfo.Comments,
                            lUnit: turbineInfo.LUnit,
                            picture:turbineInfo.Picture
                        }
                        temp.push(turbine);
                    }
                }
                $scope.modelList = temp;
                break;
            default:
                temp = [];
                $scope.groupingList = [];
                if (selectedGroupID > 0) {
                    for (var i = 0; i < turbineList.length; i++) {
                        var group = turbineList[i];
                        if (group.ManufacturerID == selectedGroupID) {
                            for (var x = 0; x < group.Models.length; x++) {
                                var turbineInfo = group.Models[x];
                                var turbine = {
                                    category: "item",
                                    value: turbineInfo.ModelID,
                                    name: turbineInfo.Model,
                                    manufacturerId: turbineInfo.ManufacturerID,
                                    manufacturer: turbineInfo.Manufacturer,
                                    years: turbineInfo.Years,
                                    isoBaseRating: turbineInfo.ISOBaseRating,
                                    heatRate: turbineInfo.HeatRate,
                                    pressRatio: turbineInfo.PressRatio,
                                    massFlow: turbineInfo.MassFlow,
                                    turbineSpeed: turbineInfo.TurbineSpeed,
                                    tempInlet: turbineInfo.TempInlet,
                                    tempExhaust: turbineInfo.TempExhaust,
                                    weight: turbineInfo.Weight,
                                    length: turbineInfo.Length,
                                    width: turbineInfo.Width,
                                    height: turbineInfo.Height,
                                    comments: turbineInfo.Comments,
                                    lUnit: turbineInfo.LUnit,
                                    picture: turbineInfo.Picture
                                }
                                temp.push(turbine);
                            }
                        }
                    }
                } else {
                    if (turbineList.length == 1) {
                        selectedGroupID = generalFunctions.OnlyNum(turbineList[0].ManufacturerID);
                        if (selectedGroupID > 0) {
                            reloadList = true;
                        }
                    } else {
                        for (var i = 0; i < turbineList.length; i++) {
                            var itm = turbineList[i];
                            var totalChild = 0;
                            if (itm.Models != undefined) {
                                totalChild = itm.Models.length;
                            }
                            var turbine = {
                                category: "folder",
                                value: itm.ManufacturerID,
                                name: itm.Manufacturer,
                                totalChild: totalChild
                            }
                            temp.push(turbine);
                        }
                    }
                }
                $scope.groupingList = temp;
                break;
        }
        $scope.$apply();
        ShowBackButton();
        if (reloadList == false) {
            if (openPopup == true) {
                OpenPopup();
            }
        } else {
            LoadTurbineList(showAll, disablePopup);
        }
    }


    function ShowBackButton() {
        var vShow = false;
        if (selectedGroupID > 0) {
            vShow = true;
        } else {
            if (selectedGroupID > 0) {
                if (totalGroup > 1) {
                    vShow = true;
                }
            }
        }
        $scope.ShowBackButton = vShow;
        //$scope.$apply();
        if (vShow == true) {
            $("#backButton").show();
        } else {
            $("#backButton").hide();
        }
    }

    $scope.ShowSelectGasturbine = function () {
        ResetGroupList();
        OpenPopup();
    }

    function OpenPopup() {
        console.time("ClosePopup:Turbine");
        $("input[data-type='search']").val("");
        $("input[data-type='search']").trigger("keyup");
        $("#ulGasTurbineList").listview("refresh");
        $("#ulGasTurbineList2").listview("refresh");
        $scope.openPopupTimes = 1;
        generalFunctions.OpenPopup("popupTurbineList", "pop");
    }

    function ResetGroupList() {
        selectedID = 0;
        selectedGroupID = 0;
    }

    $scope.SelectTurbine = function (id) {
        var listView = "";
        switch ($("#tabTurbineSelection").tabs('option', 'active')) {
            case 0: //all gas turbine
                if ($scope.tabs[0] == true) {
                    listView = "ulTurbineList2";
                }
                break;
            case 1: //turbine manufacturer
                if ($scope.tabs[1] == true) {
                    listView = "ulTurbineList";
                }
                break;
        }
        $("#" + listView).each(function () {
            $(this).find("li").each(function () {
                var anc = $(this).find("a");
                anc.removeClass("ui-btn-c ui-btn-b");
                if (anc.attr("id") == id) {
                    anc.addClass("ui-btn-b");
                } else {
                    anc.addClass("ui-btn-c");
                }
            });
        });
        ShowBackButton();
        if ($scope.tabs[1] == true) { //filter grouping
            if (selectedGroupID == 0) {
                selectedGroupID = id;
            } else {
                selectedID = id;
            }
            if (selectedGroupID == 0 || selectedID == 0) {
                LoadTurbineList();
            }
            if (selectedID > 0) {
                $scope.OKSelectTurbine();
            }
        } else {  //all filter
            selectedID = id;
            $scope.OKSelectTurbine();
        }
    }

    $scope.CancelSelectTurbine = function () {
        generalFunctions.ClosePopup("popupTurbineList");
    }

    $scope.SelectTurbineGoBack = function () {
        ResetGroupList();
        LoadTurbineList();
    }

    $scope.ResetValue = function () {
        $scope.tabs = [true, false];
        ResetGroupList();
        //$scope.$apply();
    }

    $scope.OKSelectTurbine = function () {
        var found = false;
        if ($scope.tabs[1] == true) {
            if (selectedID > 0) {
                for (var i = 0; i < $scope.gasTurbineGroupingList .length; i++) {
                    var group = $scope.gasTurbineGroupingList [i];
                    if (group.ManufacturerID == selectedGroupID) {
                        for (var x = 0; x < group.Models.length; x++) {
                            var turbineInfo = group.Models[x];
                            if (turbineInfo.ModelID == selectedID) {
                                UpdateGasTurbine(turbineInfo, undefined, undefined, true);
                                found = true;
                                break;
                            }
                        }
                        if (found == true) {
                            break;
                        }
                    }
                    if (found == true) {
                        break;
                    }
                }
            }
        } else {  //all filter
            if (selectedID > 0) {
                for (var i = 0; i < $scope.gasTurbineGroupingList .length; i++) {
                    var group = $scope.gasTurbineGroupingList [i];
                    for (var x = 0; x < group.Models.length; x++) {
                        var turbineInfo = group.Models[x];
                        if (turbineInfo.ModelID == selectedID) {
                            UpdateGasTurbine(turbineInfo, undefined, undefined,true);
                            found = true;
                            break;
                        }
                    }
                    if (found == true) {
                        break;
                    }
                }
            }
        }
        ResetGroupList();
        setTimeout(function () {
            //$scope.$apply();
            generalFunctions.ClosePopup("popupTurbineList");
        }, 1);
    }

    function UpdateGasTurbine(turbineInfo, pApproximate,pAirDensity,update) {
        if (turbineInfo != undefined) {
            $scope.GasTurbine.manufacturerId = turbineInfo.ManufacturerID;
            $scope.GasTurbine.manufacturer = turbineInfo.Manufacturer;
            $scope.GasTurbine.model = turbineInfo.Model;
            $scope.GasTurbine.turbine = turbineInfo.Model;
            $scope.GasTurbine.modelId = turbineInfo.ModelID;
            $scope.GasTurbine.year = turbineInfo.Years;
            $scope.GasTurbine.isoBaseRating = generalFunctions.GetNumberLocale(turbineInfo.ISOBaseRating, false);
            $scope.GasTurbine.heatRate = generalFunctions.GetNumberLocale(turbineInfo.HeatRate,false);
            $scope.GasTurbine.pressRatio = generalFunctions.GetNumberLocale(turbineInfo.PressRatio, false);
            $scope.GasTurbine.massFlow = generalFunctions.GetNumberLocale(turbineInfo.MassFlow, false);
            $scope.GasTurbine.turbineSpeed = generalFunctions.GetNumberLocale(turbineInfo.TurbineSpeed, false);
            $scope.GasTurbine.turbineInletTemp = turbineInfo.TempInlet;
            $scope.GasTurbine.exhaustTemp = turbineInfo.TempExhaust;
            $scope.GasTurbine.approximateWeight = turbineInfo.Weight;
            if (pApproximate != undefined && pApproximate!='') {
                $scope.GasTurbine.approximate = pApproximate;
            } else {
                if ($scope.Setting.unit.unitId == 1) {
                    $scope.GasTurbine.approximate = turbineInfo.Length + " x " + turbineInfo.Width + " x " + turbineInfo.Height + " " + turbineInfo.LUnit;
                } else {
                    $scope.GasTurbine.approximate = turbineInfo.Length + " x " + turbineInfo.Height + " x " + turbineInfo.Width + " " + turbineInfo.LUnit;
                }
            }
            if (pAirDensity != undefined && pAirDensity != '') {
                $scope.GasTurbine.airDensity = pAirDensity;
            } else {
                var val = 12 / 10;
                $scope.GasTurbine.airDensity = val;
            }
            $scope.GasTurbine.airDensity = generalFunctions.GetNumberLocale($scope.GasTurbine.airDensity, false);
            $scope.GasTurbine.comments = turbineInfo.Comments;
            calculate("HeatRateOfEngine");
            calculate("Output");
            calculate("Airflow");
            //$scope.$apply();
            GeneralSharedServices.TurbineChangedEvent();
            if (update == true) {
                UpdateDataToSharedService();
            }
        }
    }

    function calculate(type,update) {
        switch (type) {
            case "HeatRateOfEngine":
                $scope.GasTurbine.heatRateOfEngine = lccFunctions.CalculateHeatRatekJperkWh($scope.GasTurbine.heatRate);
                $("#cboHeatRateOfEngine").val(generalFunctions.GetNumberLocale($scope.GasTurbine.heatRateOfEngine, false));
                break;
            case "Output":
                $scope.GasTurbine.output = lccFunctions.CalculateOutput($scope.GasTurbine.isoBaseRating);
                $("#cboOutput").val(generalFunctions.GetNumberLocale($scope.GasTurbine.output, false));
                break;
            case "Airflow":
                var massFlow = generalFunctions.GetNumber($scope.GasTurbine.massFlow);
                var airDensity = generalFunctions.GetNumber($scope.GasTurbine.airDensity);
                if (isNaN(massFlow) == false && isNaN(airDensity) == false) {
                    if (massFlow > 0 && airDensity > 0) {
                        $scope.GasTurbine.totalSystemAirflow = lccFunctions.CalculateAirFlow(massFlow, airDensity);
                        $("#cboTotalSystemAirFlow").val(generalFunctions.GetNumberLocale($scope.GasTurbine.totalSystemAirflow, false));
                    }
                }
                break;
        }
        if (update == true) {
            UpdateDataToSharedService();
        }
    }

    //$scope.$watch("selectedStage[0].checked", function () {
    //    checkFilterStage(1,true);
    //});

    //$scope.$watch("selectedStage[1].checked", function () {
    //    checkFilterStage(2, true);
    //});

    //$scope.$watch("selectedStage[2].checked", function () {
    //    checkFilterStage(3, true);
    //});

    //function checkFilterStage(stage, update) {
    //    if ($scope.LoadingPage == false) {
    //        var lbl = "lblchkStage" + stage;
    //        var checked;
    //        switch (stage) {
    //            case 1:
    //                checked = $scope.selectedStage[0].checked;
    //                break;
    //            case 2:
    //                checked = $scope.selectedStage[1].checked;
    //                break;
    //            case 3:
    //                checked = $scope.selectedStage[2].checked;
    //                break;
    //        }
    //        $("#" + lbl).removeClass("ui-checkbox-on");
    //        $("#" + lbl).removeClass("ui-checkbox-off");
    //        if (checked == true) {
    //            $("#" + lbl).addClass("ui-checkbox-on");
    //        } else {
    //            $("#" + lbl).addClass("ui-checkbox-off");
    //        }
    //        switch (stage) {
    //            case 1:
    //                if (checked == true) {
    //                    $scope.GasTurbine.stopServiceFilter1 = 1;
    //                } else {
    //                    $scope.GasTurbine.stopServiceFilter1 = 0;
    //                }
    //                break;
    //            case 2:
    //                if (checked == true) {
    //                    $scope.GasTurbine.stopServiceFilter2 = 1;
    //                } else {
    //                    $scope.GasTurbine.stopServiceFilter2 = 0;
    //                }
    //                break;
    //            case 3:
    //                if (checked == true) {
    //                    $scope.GasTurbine.stopServiceFilter3 = 1;
    //                } else {
    //                    $scope.GasTurbine.stopServiceFilter3 = 0;
    //                }
    //                break;
    //        }
    //        if (update == true) {
    //            UpdateDataToSharedService();
    //        }
    //    }
    //}

    $scope.$watch("GasTurbine.heatRate", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            calculate("HeatRateOfEngine",true);
        }
    });

    $scope.$watch("GasTurbine.isoBaseRating", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            calculate("Output", true);
        }
    });

    $scope.$watch("GasTurbine.massFlow", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            calculate("Airflow", true);
        }
    });


    $scope.$watch("GasTurbine.airDensity", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            calculate("Airflow", true);
        }
    });

    $scope.$watch("GasTurbine.downtimeFilterReplacement", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("DowntimeFilterReplacement");
        }
    });

    $scope.$watch("GasTurbine.energySoldPrice", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("EnergySoldPrice");
        }
    });

    $scope.$watch("GasTurbine.priceIncrease", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("PriceIncrease");
        }
    });

    $scope.$watch("GasTurbine.reductionOfOutput", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("ReductionOfOutput");
        }
    });

    $scope.$watch("GasTurbine.output", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("Output");
        }
    });

    $scope.$watch("GasTurbine.heatRateIncrease", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("HeatRateIncrease");
        }
    });

    $scope.$watch("GasTurbine.dPSystem", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("dPSystem");
        }
    });

    $scope.$watch("GasTurbine.heatRateOfEngine", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("HeatRateOfEngine");
        }
    });

    $scope.$watch("GasTurbine.fuelCost", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("FuelCost");
        }
    });

    $scope.$watch("GasTurbine.timeOffFouledCompressorWashing", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("TimeOffFouledCompressorWashing");
        }
    });


    //$scope.$watch("GasTurbine.waterWashInterval", function (newVal, oldVal) {
    //    if ($scope.LoadingPage == false) {
    //        Validate("WaterWashInterval");
    //    }
    //});

    $scope.$watch("GasTurbine.waterWashCost", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate("WaterWashCost");
        }
    });

    $scope.$watch("GasTurbine.heatRateOfEngineUnit", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            heatRateOfEngineUnitChanged();
        }
    });
    
    function heatRateOfEngineUnitChanged() {
        if ($scope.GasTurbine.heatRateOfEngineUnit != DataCollectionSharedService.prevHeatRateOfEngineUnit) {
            var val = generalFunctions.EnergyUnitConversion($scope.GasTurbine.heatRateOfEngine, DataCollectionSharedService.prevHeatRateOfEngineUnit, $scope.GasTurbine.heatRateOfEngineUnit, 0);
            if (val <= 0) {
                val = 8000;
            }
            $scope.GasTurbine.heatRateOfEngine = val;
            Validate("HeatRateOfEngine");
            DataCollectionSharedService.prevHeatRateOfEngineUnit = $scope.GasTurbine.heatRateOfEngineUnit;
        }
    }

    $scope.$watch("GasTurbine.fuelCostUnit", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if ($scope.GasTurbine.fuelCostUnit != DataCollectionSharedService.prevFuelCostUnit) {
                fuelCostUnitChangedEvent();
            }
        }
    });

    function fuelCostUnitChangedEvent() {
        var list;
        var val;
        switch ($scope.GasTurbine.fuelCostUnit) {
            case "MJ":
                DataCollectionSharedService.dataEntries.GasTurbine.List.FuelCost = DataCollectionSharedService.dataEntries.GasTurbine.List.FuelCostMJ;
                DataCollectionSharedService.dataEntries.GasTurbine.FuelCost = DataCollectionSharedService.dataEntries.GasTurbine.FuelCostMJ;
                break;
            case "MMBtu":
            case "Mcf":
                DataCollectionSharedService.dataEntries.GasTurbine.List.FuelCost = DataCollectionSharedService.dataEntries.GasTurbine.List.FuelCostMMBTU;
                DataCollectionSharedService.dataEntries.GasTurbine.FuelCost = DataCollectionSharedService.dataEntries.GasTurbine.FuelCostMMBTU;
                break;
        }
        val = DataCollectionSharedService.dataEntries.GasTurbine.FuelCost;
        generalFunctions.UpdateSelectionList("FuelCost", DataCollectionSharedService.dataEntries.GasTurbine.List.FuelCost, false, true, val);
        Validate("FuelCost");
        DataCollectionSharedService.prevFuelCostUnit = $scope.GasTurbine.fuelCostUnit;
    }

    $scope.$watch("GasTurbine.totalSystemAirflow", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate('totalSystemAirflow',true);
        }
    });

    function Validate(type,calculateAirflow) {
        var control = undefined;
        var value = 0;
        switch (type) {
            case "DowntimeFilterReplacement":
                control = "cboDowntimeFilterReplacement";
                value = generalFunctions.GetNumber($scope.GasTurbine.downtimeFilterReplacement);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.downtimeFilterReplacement = value;
                break;
            case "EnergySoldPrice":
                control = "cboEnergySoldPrice";
                value = generalFunctions.GetNumber($scope.GasTurbine.energySoldPrice);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.energySoldPrice = value;
                break;
            case "PriceIncrease":
                control = "cboPriceIncrease";
                value = generalFunctions.GetNumber($scope.GasTurbine.priceIncrease);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.priceIncrease = value;
                break;
            case "Output":
                control = "cboOutput";
                value = generalFunctions.GetNumber($scope.GasTurbine.output);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.output = value;
                break;
            case "ReductionOfOutput":
                control = "cboReductionOfOutput";
                value = generalFunctions.GetNumber($scope.GasTurbine.reductionOfOutput);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.reductionOfOutput = value;
                break;
            case "HeatRateIncrease":
                control = "cboHeatRateIncrease";
                value = generalFunctions.GetNumber($scope.GasTurbine.heatRateIncrease);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.heatRateIncrease = value;
                break;
            case "dPSystem":
                control = "cbodPSystem";
                value = generalFunctions.GetNumber($scope.GasTurbine.dPSystem);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.dPSystem = value;
                break;
            case "HeatRateOfEngine":
                control = "cboHeatRateOfEngine";
                value = generalFunctions.GetNumber($scope.GasTurbine.heatRateOfEngine);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.heatRateOfEngine = value;
                break;
            case "FuelCost":
                control = "cboFuelCost";
                value = generalFunctions.GetNumber($scope.GasTurbine.fuelCost);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.fuelCost = value;
                break;
            case "TimeOffFouledCompressorWashing":
                control = "cboTimeOffFouledCompressorWashing";
                value = generalFunctions.GetNumber($scope.GasTurbine.timeOffFouledCompressorWashing);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.timeOffFouledCompressorWashing = value;
                break;
            //case "WaterWashInterval":
            //    control = "cboWaterWashInterval";
            //    value = generalFunctions.GetNumber($scope.GasTurbine.waterWashInterval);
            //    if (value < 0) {
            //        value = 0;
            //    } 
            //    $scope.GasTurbine.waterWashInterval= value;
            //    break;
            case "WaterWashCost":
                control = "cboWaterWashCost";
                value = generalFunctions.GetNumber($scope.GasTurbine.waterWashCost);
                if (value < 0) {
                    value = 0;
                }
                $scope.GasTurbine.waterWashCost = value;
                break;
           case "totalSystemAirflow":
                control = "cboTotalSystemAirFlow";
                value = generalFunctions.GetNumber($scope.GasTurbine.totalSystemAirflow);
                if (value < 0) {
                    value = 0;
                } 
                $scope.GasTurbine.totalSystemAirflow = value;
                break;
        }
        generalFunctions.AssignValueToControl(control, value);
        if (calculateAirflow == true) {
            calculate("Airflow", true);
        }
        setTimeout(function () {
            UpdateDataToSharedService();
        }, 1);
    }
});
