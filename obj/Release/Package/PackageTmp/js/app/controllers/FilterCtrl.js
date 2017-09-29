"use strict";

app.controller("FilterCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions, lccElements) {
    $scope.FilterSolutions = DataCollectionSharedService.Params.filterSolutions;
    //$scope.RunningCond = DataCollectionSharedService.Params.runningCond;
    $scope.GasTurbine = DataCollectionSharedService.Params.gasTurbine;
    $scope.Setting = DataCollectionSharedService.Params.setting;

    $scope.Solution = DataCollectionSharedService.currentSolution;

    $scope.dataEntries = undefined;
    $scope.FilterSelectionList = undefined;
    $scope.allFilter = [];
    $scope.filterGroup = [];
    $scope.tabs = [true, false];
    $scope.ShowBackButton = true;

    $scope.costStatus = "off";
    $scope.costTheme = "c";

    $scope.themes = ["a", "b", "c"];

    $scope.CriteriaUnit = undefined;

    $scope.selectedFilterSelectionTab = "";

    $scope.colWidth = [];
    $scope.selectedStage = [
        { name: "1st Stage", active: true, checked: true },
        { name: "2nd Stage", active: true, checked: true },
        { name: "3rd Stage", active: true, checked: true }
    ];

    var selectedID = "";
    var selectedTypeID = 0;


    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
        //$scope.$apply();
    });

    $scope.$on("TriggerUpdateSelectionListEvent", function () {
        //if ($scope.page == "S" + DataCollectionSharedService.selectedSystem) {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.FilterSelectionList = $scope.dataEntries.FilterGroup;
        $scope.$apply();
        //}
        $('#cboFinalDP1' + $scope.page).editableSelect({ filter: false });
        $('#cboFinalDP2' + $scope.page).editableSelect({ filter: false });
        $('#cboFinalDP3' + $scope.page).editableSelect({ filter: false });
        $('#cboTime1' + $scope.page).editableSelect({ filter: false });
        $('#cboTime2' + $scope.page).editableSelect({ filter: false });
        $('#cboTime3' + $scope.page).editableSelect({ filter: false });
        $('#cboNoOfFilter1' + $scope.page).editableSelect({ filter: false });
        $('#cboNoOfFilter2' + $scope.page).editableSelect({ filter: false });
        $('#cboNoOfFilter3' + $scope.page).editableSelect({ filter: false });
        $('#txtFilter1Price' + $scope.page).editableSelect({ filter: false });
        $('#txtFilter2Price' + $scope.page).editableSelect({ filter: false });
        $('#txtFilter3Price' + $scope.page).editableSelect({ filter: false });
        $('#cboHousingCost1' + $scope.page).editableSelect({ filter: false });
        $('#cboHousingCost2' + $scope.page).editableSelect({ filter: false });
        $('#cboHousingCost3' + $scope.page).editableSelect({ filter: false });
        $('#cboLaborCost1' + $scope.page).editableSelect({ filter: false });
        $('#cboLaborCost2' + $scope.page).editableSelect({ filter: false });
        $('#cboLaborCost3' + $scope.page).editableSelect({ filter: false });
        $('#cboWasteHandlingCost1' + $scope.page).editableSelect({ filter: false });
        $('#cboWasteHandlingCost2' + $scope.page).editableSelect({ filter: false });
        $('#cboWasteHandlingCost3' + $scope.page).editableSelect({ filter: false });
        $('#cboWaterWashInterval' + $scope.page).editableSelect({ filter: false });
        LoadFilterList(true, true);
        $('#tabFilterSelection' + $scope.page).click('tabsselect', function (event, ui) {
            var loadAllFilter = false;
            $("#tabFilterGrouping").removeClass("tabNoSelected");
            $("#tabFilter").removeClass("tabNoSelected");
            var page = "S" + DataCollectionSharedService.selectedSystem;
            //switch ($("#tabFilterSelection" + page).tabs('option', 'active')) {
            //switch ($("#tabFilterSelection" + page + " ul.tabs li").find(".active").context.activeElement.id) {
            if ($("#tabFilterSelection" + page + " ul.tabs li").find(".active").context.activeElement.id == "" && $scope.selectedFilterSelectionTab == "") {
                $scope.selectedFilterSelectionTab = "Filter";
            } else {
                if ($("#tabFilterSelection" + page + " ul.tabs li").find(".active").context.activeElement.id != "") {
                    $scope.selectedFilterSelectionTab = $("#tabFilterSelection" + page + " ul.tabs li").find(".active").context.activeElement.id.replace("tab", "");
                }
            }
            switch ($scope.selectedFilterSelectionTab) {
                case "FilterGrouping": //filter grouping
                    if ($scope.tabs[1] == false) {
                        LoadFilterList(false);
                    }
                    $scope.tabs = [false, true];
                    ModifyTabCSS("FilterGrouping");
                    break;
                case "Filter": //all filter
                    if ($scope.tabs[0] == false) {
                        //LoadFilterList(true);
                        $scope.ResetValue();
                        //$scope.$apply();
                    }
                    $scope.tabs = [true, false];
                    ModifyTabCSS("Filter");
                    ShowBackButton(false);
                    break;
            }
            DataCollectionSharedService.tabFilterSelectionChanged = 1;
            //ShowBackButton();
        });

        setTimeout(function () {
            $("#popupFilterList")
                .enhanceWithin().popup()
                .bind({
                    popupafteropen: function (event, ui) {
                        var page = "S" + DataCollectionSharedService.selectedSystem;
                        $("#anc" + page).addClass('ui-btn-active');
                        $("#ulFilterList2").each(function () {
                            $(this).find("li").each(function () {
                                var anc = $(this).find("a");
                                anc.addClass("ui-btn-c");
                                anc.removeClass("ui-btn-b");
                            });
                        });
                    },
                    popupbeforeposition: function (event, ui) {
                        //var page = "S" + DataCollectionSharedService.selectedSystem;
                        // $("#anc" + page).addClass('ui-btn-active');
                        $scope.registeredStageName = $scope.Solution.solutionName + " ( " + generalFunctions.GetStageName(DataCollectionSharedService.registeredStage) + " )";
                        $scope.tabs = [true, false];
                        $scope.selectedFilterSelectionTab = "Filter";
                        var page = "S" + DataCollectionSharedService.selectedSystem;
                        //$("#tabFilterSelection" + page ).tabs("option", "active", 0);
                        setTimeout(function () {
                            $('#tabFilterSelection' + page + ' a[href="#Filter"]').trigger('click');
                            ModifyTabCSS("Filter");
                        }, 10);
                    },
                    popupafterclose: function () {
                        $scope.ResetValue();
                    }
                })
        }, 1);
        setTimeout(function () {
            ResetValue(true, true);
        }, 1)


    });

    function ModifyTabCSS(selectedTab) {
        switch (selectedTab) {
            case "Filter":
                $("#liFilter").addClass("ui-tabs-active ui-state-active");
                $("#Filter").attr("aria-hidden", "false");
                $("#Filter").attr("aria-expanded", "true");
                $("#Filter").css("display", "block");
                $("#tabFilter").removeClass("tabNoSelected");
                $("#liFilterGrouping").removeClass("ui-tabs-active ui-state-active");
                $("#FilterGrouping").attr("aria-hidden", "true");
                $("#FilterGrouping").attr("aria-expanded", "false");
                $("#FilterGrouping").css("display", "none");
                $("#tabFilterGrouping").addClass("tabNoSelected");
                break;
            case "FilterGrouping":
                $("#liFilterGrouping").addClass("ui-tabs-active ui-state-active");
                $("#FilterGrouping").attr("aria-hidden", "false");
                $("#FilterGrouping").attr("aria-expanded", "true");
                $("#FilterGrouping").css("display", "block");
                $("#tabFilterGrouping").removeClass("tabNoSelected");
                $("#liFilter").removeClass("ui-tabs-active ui-state-active");
                $("#Filter").attr("aria-hidden", "true");
                $("#Filter").attr("aria-expanded", "false");
                $("#Filter").css("display", "none");
                $("#tabFilter").addClass("tabNoSelected");
                break;
        }
    }

    $scope.ResetValue = function () {
        $scope.tabs = [true, false];
        ResetGroupList();
        //$scope.$apply();
    }

    $scope.$on("RefreshFilterPageEvent", function () {
        //console.time('RefreshFilterPageEvent');
        if (DataCollectionSharedService.refreshSystem == true) {
            if (DataCollectionSharedService.copySolutionInProgress == true) {
                RefreshPageAfterCopy();
            } else {
                UpdateSystem();
            }
            setTimeout(function () {
                DataCollectionSharedService.refreshSystem = false;
            }, 100);
            
        }
        //console.timeEnd('RefreshFilterPageEvent');
    });

    function RefreshPageAfterCopy() {
        $scope.FilterSolutions = DataCollectionSharedService.Params.filterSolutions;
        DataCollectionSharedService.currentSystem = $scope.FilterSolutions.solutions[DataCollectionSharedService.selectedSystem - 1];
        $scope.Solution = DataCollectionSharedService.currentSystem;
        updateFilterServiceStop();
        //$scope.$apply();
        $scope.ChangeFilterLifetimeCriteria($scope.Solution.filterLifetimeCriteria, false, undefined, false);
        //CheckCostEntriesMode(false, $scope.Solution.costsByStage);
        for (var i = 1; i < 4; i++) {
            $('#cboFinalDP' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].exchangeValue, false));
            $('#cboTime' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].exchangeValue, false));
            $('#cboNoOfFilter' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].noOfFilter, false));
            $('#txtFilter' + i + "PriceS" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].price, false));
            $('#cboHousingCost' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].costs.housing, false));
            $('#cboLaborCost' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].costs.labor, false));
            $('#cboWasteHandlingCost' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].costs.wasteHandling, false));
        }
        generalFunctions.ChangeComboBoxSelection($scope.Solution.totalStage, "cboTotalStagesS" + $scope.Solution.solution, true, true);
        $('#cboWaterWashIntervalS' + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.waterWashInterval, false));
        DataCollectionSharedService.copySolutionInProgress = false;
    }

    function UpdateSystem() {
        //console.time('RefreshSolutionPage');
        $scope.Setting = DataCollectionSharedService.Params.setting;
        $scope.FilterSolutions = DataCollectionSharedService.Params.filterSolutions;
        $scope.GasTurbine = DataCollectionSharedService.Params.gasTurbine;
        if (DataCollectionSharedService.currentSystem == undefined) {
            DataCollectionSharedService.currentSystem = $scope.FilterSolutions.solutions[0];
        } else {
            if (DataCollectionSharedService.currentSystem.solution != DataCollectionSharedService.selectedSystem) {
                DataCollectionSharedService.currentSystem = $scope.FilterSolutions.solutions[DataCollectionSharedService.selectedSystem - 1];
            }
        }
        $scope.Solution = DataCollectionSharedService.currentSystem;
        UpdateDataToSharedService(false, false);
        updateFilterServiceStop();
        //$scope.$apply();
        var resetALL = false;
        if (CheckFilterExist(1) == false) {
            var page = "S" + DataCollectionSharedService.selectedSystem;
            var control = "cboTime1" + page;
            if (generalFunctions.OnlyNum($("#" + control)[0].value) <= 0) {
                resetALL = true;
            }
        }
        $scope.ChangeFilterLifetimeCriteria($scope.Solution.filterLifetimeCriteria, resetALL, undefined, false);
        //console.timeEnd('RefreshSolutionPage');
    }

    function updateFilterServiceStop() {
        if ($scope.Solution.stopServiceFilter1 == 0) {
            $scope.selectedStage[0].checked = false;
        } else {
            $scope.selectedStage[0].checked = true;
        }
        if ($scope.Solution.stopServiceFilter2 == 0) {
            $scope.selectedStage[1].checked = false;
        } else {
            $scope.selectedStage[1].checked = true;
        }
        if ($scope.Solution.stopServiceFilter3 == 0) {
            $scope.selectedStage[2].checked = false;
        } else {
            $scope.selectedStage[2].checked = true;
        }
        checkFilterStage(1);
        checkFilterStage(2);
        checkFilterStage(3);
    }

    function ResetValue(resetAll, update) {
        if (resetAll == true) {
            switch ($scope.page) {
                case "S1":
                    $scope.Solution = $scope.FilterSolutions.solutions[0];
                    break;
                case "S2":
                    $scope.Solution = $scope.FilterSolutions.solutions[1];
                    break;
                case "S3":
                    $scope.Solution = $scope.FilterSolutions.solutions[2];
                    break;
                case "S4":
                    $scope.Solution = $scope.FilterSolutions.solutions[3];
                    break;
                case "S5":
                    $scope.Solution = $scope.FilterSolutions.solutions[4];
                    break;
                case "S6":
                    $scope.Solution = $scope.FilterSolutions.solutions[5];
                    break;
                case "S7":
                    $scope.Solution = $scope.FilterSolutions.solutions[6];
                    break;
                case "S8":
                    $scope.Solution = $scope.FilterSolutions.solutions[7];
                    break;
                case "S9":
                    $scope.Solution = $scope.FilterSolutions.solutions[8];
                    break;
                case "S10":
                    $scope.Solution = $scope.FilterSolutions.solutions[9];
                    break;
            }
            $scope.Solution.waterWashInterval = $scope.dataEntries.GasTurbine.CompressorInterval;
        }
        //$scope.$apply();
        $('#cboWaterWashInterval' + $scope.page).val(generalFunctions.GetNumberLocale($scope.Solution.waterWashInterval, false));
        if (update == true) {
            UpdateDataToSharedService();
        }
    }

    function UpdateDataToSharedService(generateResult,update) {
        DataCollectionSharedService.currentSolution = $scope.Solution;
        if (update != false && DataCollectionSharedService.refreshSystem == false) {
            GeneralSharedServices.UpdateFilterSelections();
        }
    }

    function UpdateWhenEntriesChanged(generateResult) {
        if (DataCollectionSharedService.selectedSystem != undefined && DataCollectionSharedService.currentSolution != undefined) {
            if (DataCollectionSharedService.selectedSystem == DataCollectionSharedService.currentSolution.solution) {
                UpdateDataToSharedService(generateResult);
            }
        }
    }

    $scope.GetStageName = function (stage) {
        return generalFunctions.GetStageName(stage);
    };

    $scope.showTotalStage = function (stage) {
        if ($scope.LoadingPage == false) {
            if ($scope.Solution != undefined) {
                if ($scope.Solution.totalStage >= stage) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    };

    $scope.ShowSelectFilter = function (stage, system) {
        DataCollectionSharedService.registeredStage = stage;
        var filter = filter = $scope.Solution.filters[stage - 1];;
        $scope.ResetValue();
        //$scope.$apply();
        if ($scope.allFilter != undefined) {
            if ($scope.allFilter.length == 0) {
                $scope.FilterSelectionList = $scope.dataEntries.FilterGroup;
                //$scope.$apply();
                LoadFilterList(true, true);
            }
        }
        OpenPopup();
    }

    $scope.CancelSelectFilter = function () {
        ClosePopup();
    }

    $scope.SelectFilterGoBack = function () {
        selectedID = 0;
        if (selectedTypeID > 0) {
            selectedTypeID = 0;
        }
        LoadFilterList();
    }

    $scope.SelectFilter = function (type, id) {
        $scope.selectedFilterSelectionTab = type;
        var listView = "";
        var page = "S" + DataCollectionSharedService.selectedSystem;
        //switch ($("#tabFilterSelection" + page).tabs('option', 'active')) {
        switch ($scope.selectedFilterSelectionTab) {
            //case 0: //all filter
            case "Filter": //all filter
                if ($scope.tabs[0] == true) {
                    listView = "ulFilterList2";
                }
                break;
            //case 1: //filter grouping
            case "FilterGrouping": //filter grouping
                if ($scope.tabs[1] == true) {
                    listView = "ulFilterList";
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
        if ($scope.tabs[1] == true) { //filter grouping
            if (selectedTypeID == 0) {
                selectedTypeID = id;
            } else {
                selectedID = id;
            }
            if (selectedTypeID == 0 || selectedID == 0) {
                LoadFilterList();
            }
            if (selectedID > 0) {
                $scope.OKSelectFilter();
            }
        } else {  //all filter
            selectedID = id;
            $scope.OKSelectFilter();
        }
        ShowBackButton();
    }

    $scope.OKSelectFilter = function () {
        var found = false;
        if ($scope.tabs[1] == true) {
            if (selectedID > 0) {
                for (var i = 0; i < $scope.FilterSelectionList.length; i++) {
                    var group = $scope.FilterSelectionList[i];
                    for (var j = 0; j < group.Types.length; j++) {
                        var type = group.Types[j];
                        if (type.FilterTypeID == selectedTypeID) {
                            for (var x = 0; x < type.Filters.length; x++) {
                                var filterInfo = type.Filters[x];
                                if (filterInfo.FilterID == selectedID) {
                                    UpdateFilter(filterInfo, false);
                                    found = true;
                                    break;
                                }
                            }
                            if (found == true) {
                                break;
                            }
                        }
                    }
                    if (found == true) {
                        break;
                    }
                }
            }
        } else {  //all filter
            if (selectedID > 0) {
                for (var i = 0; i < $scope.FilterSelectionList.length; i++) {
                    var group = $scope.FilterSelectionList[i];
                    for (var j = 0; j < group.Types.length; j++) {
                        var type = group.Types[j];
                        for (var x = 0; x < type.Filters.length; x++) {
                            var filterInfo = type.Filters[x];
                            if (filterInfo.FilterID == selectedID) {
                                UpdateFilter(filterInfo, false);
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
        }
        ResetGroupList();
        setTimeout(function () {
            //$scope.$apply();
            ClosePopup(true);
        }, 1);
    }

    $scope.ClearFilter = function (stage, page) {
        var page = "S" + DataCollectionSharedService.selectedSystem;
        $scope.Solution.filters[stage - 1] = lccElements.FilterElements($scope.Solution.solution, stage);
        //$scope.$apply();
        UpdateDataToSharedService();
        $('#cboFinalDP' + stage + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[stage - 1].exchangeValue, false));
        $('#cboNoOfFilter' + stage + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[stage - 1].noOfFilter, false));
        $('#txtFilter' + stage + "PriceS" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[stage - 1].price, false));
        setTimeout(function () {
            $("#lblFilter" + stage + "ErrMsg" + page)[0].textContent = "";
            $("#divFilterErrMessage" + page).css("display", "none");
            $("#anc" + page).addClass('ui-btn-active');
            $('#ancClearFilter' + stage + page).removeClass('ui-btn-active');
        }, 1)
    }

    function UpdateFilter(filterInfo, calcNoOfFilter) {
        var filter = lccElements.assignFilter();
        filter.filterID = filterInfo.FilterID;
        filter.filterName = filterInfo.FilterDisplayName;
        filter.filterGroupID = filterInfo.FilterGroupID;
        filter.filterGroup = filterInfo.FilterGroup;
        filter.filterTypeID = filterInfo.FilterTypeID;
        filter.filterType = filterInfo.FilterType;
        filter.filterMedia = filterInfo.FilterMedia;
        filter.filterEffMedia = filterInfo.FilterEffmedia.toFixed(1);
        filter.width = filterInfo.Width;
        filter.height = filterInfo.Height;
        filter.depth = filterInfo.Depth;
        filter.noOfPocket = filterInfo.NoOfPocket;
        filter.filterClass = filterInfo.FilterClass;
        filter.filterEnergyClass = filterInfo.FilterEnergyClass;
        filter.finalPressureDrop = filterInfo.FinalPressureDrop;
        filter.unitPrice = filterInfo.UnitPrice;
        filter.filterPicture = filterInfo.FilterPicture;
        filter.airFlow = filterInfo.AirFlow;
        $scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].filterID = filter.filterID;
        $scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].filterName = filter.filterName;
        $scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].filterGroupID = filter.filterGroupID;
        $scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].filterTypeID = filter.filterTypeID;
        $scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].filterAirFlow = filter.airFlow;
        var noOfFilterRequired = CalculateNoOfFilter(filter.airFlow);
        if (calcNoOfFilter == false) {
            if (generalFunctions.OnlyNum($scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].noOfFilter) > 1) {
                noOfFilterRequired = $scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].noOfFilter;
            }
        }
        $scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].noOfFilter = noOfFilterRequired;
        $scope.ChangeFilterLifetimeCriteria($scope.Solution.filterLifetimeCriteria, false, DataCollectionSharedService.registeredStage, false);
        //$scope.$apply();
        $('#cboNoOfFilter' + DataCollectionSharedService.registeredStage + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[DataCollectionSharedService.registeredStage - 1].noOfFilter, false));
        DataCollectionSharedService.registeredStage = 0;
    }

    function CalculateNoOfFilter(airFlow) {
        var noOfFilterRequired = 1;
        var massFlow = DataCollectionSharedService.Params.gasTurbine.massFlow;
        var airDensity = DataCollectionSharedService.Params.gasTurbine.airDensity;
        //var airFlow = filter.airFlow;

        noOfFilterRequired = lccFunctions.CalculateNoOfFilter(massFlow, airDensity, airFlow);
        return noOfFilterRequired;
    }


    function LoadFilterList(showAll, disablePopup) {
        var reloadList = false;
        var openPopup = true;
        if (disablePopup == true) {
            openPopup = false;
        }
        var temp = [];
        var filterList = $scope.FilterSelectionList;
        switch (showAll) {
            case true:
                $scope.allFilter = [];
                for (var i = 0; i < filterList.length; i++) {
                    var group = filterList[i];
                    for (var j = 0; j < group.Types.length; j++) {
                        var type = group.Types[j];
                        for (var x = 0; x < type.Filters.length; x++) {
                            var filterInfo = type.Filters[x];
                            var filter = {
                                category: "Filter",
                                value: filterInfo.FilterID,
                                name: filterInfo.FilterDisplayName,
                                Width: filterInfo.Width,
                                WidthUS: generalFunctions.DimensionUnitConversion(generalFunctions.OnlyNum(filterInfo.Width), "US"),
                                Height: filterInfo.Height,
                                HeightUS: generalFunctions.DimensionUnitConversion(generalFunctions.OnlyNum(filterInfo.Height), "US"),
                                Depth: filterInfo.Depth,
                                DepthUS: generalFunctions.DimensionUnitConversion(generalFunctions.OnlyNum(filterInfo.Depth), "US"),
                                FilterClass: filterInfo.FilterClass,
                                FilterClassUS: filterInfo.FilterClass,
                                MediaSurface: filterInfo.FilterEffmedia.toFixed(1),
                                MediaSurfaceUS: generalFunctions.AreaUnitConversion(generalFunctions.OnlyNum(filterInfo.FilterEffmedia), "US"),
                                Picture: filterInfo.FilterPicture,
                                Manufacturer: filterInfo.FilterGroup,
                                Type: filterInfo.FilterType
                            }
                            temp.push(filter);
                        }
                    }
                }
                $scope.allFilter = temp;
                break;
            default:
                temp = [];
                $scope.filterGroup = [];
                if (selectedTypeID > 0) { //filter
                    for (var i = 0; i < filterList.length; i++) {
                        var group = filterList[i];
                        for (var j = 0; j < group.Types.length; j++) {
                            var type = group.Types[j];
                            if (type.FilterTypeID == selectedTypeID) {
                                for (var x = 0; x < type.Filters.length; x++) {
                                    var filterInfo = type.Filters[x];
                                    var filter = {
                                        category: "Filter",
                                        value: filterInfo.FilterID,
                                        name: filterInfo.FilterDisplayName,
                                        Width: filterInfo.Width,
                                        WidthUS: generalFunctions.DimensionUnitConversion(generalFunctions.OnlyNum(filterInfo.Width), "US"),
                                        Height: filterInfo.Height,
                                        HeightUS: generalFunctions.DimensionUnitConversion(generalFunctions.OnlyNum(filterInfo.Height), "US"),
                                        Depth: filterInfo.Depth,
                                        DepthUS: generalFunctions.DimensionUnitConversion(generalFunctions.OnlyNum(filterInfo.Depth), "US"),
                                        FilterClass: filterInfo.FilterClass,
                                        FilterClassUS: filterInfo.FilterClass,
                                        MediaSurface: filterInfo.FilterEffmedia.toFixed(1),
                                        MediaSurfaceUS: generalFunctions.AreaUnitConversion(generalFunctions.OnlyNum(filterInfo.FilterEffmedia), "US"),
                                        Picture: filterInfo.FilterPicture,
                                        Manufacturer: filterInfo.FilterGroup,
                                        Type: filterInfo.FilterType
                                    }
                                    temp.push(filter);
                                }
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < filterList.length; i++) {
                        var group = filterList[i];
                        for (var j = 0; j < group.Types.length; j++) {
                            var itm = group.Types[j];
                            var filter = {
                                category: "Folder",
                                value: itm.FilterTypeID,
                                name: itm.FilterType,
                                totalChild: itm.TotalChild
                            }
                            temp.push(filter);
                        }
                    }
                }
                $scope.filterGroup = temp
        }
        $scope.$apply();
        ShowBackButton();
        if (reloadList == false) {
            if (openPopup == true) {
                OpenPopup();
            }
        }
    }

    function ResetGroupList() {
        selectedID = 0;
        selectedTypeID = 0;
    }

    function OpenPopup() {
        $("input[data-type='search']").val("");
        $("input[data-type='search']").trigger("keyup");
        $("#ulFilterList").listview("refresh");
        $("#ulFilterList2").listview("refresh");
        DataCollectionSharedService.openPopupTimes = 1;
        generalFunctions.OpenPopup("popupFilterList", "pop");
    }

    function ClosePopup(generateResult) {
        UpdateDataToSharedService(generateResult);
        generalFunctions.ClosePopup("popupFilterList");
    }

    function ShowBackButton(pShow) {
        var vShow = false;
        if (pShow == undefined) {
            if (selectedTypeID > 0) {
                vShow = true;
            }
        } else {
            vShow = pShow;
        }
        $scope.ShowBackButton = vShow;
        //$scope.$apply();
        if (vShow == true) {
            $("#backButtonFilter").show();
        } else {
            $("#backButtonFilter").hide();
        }
    }

    //$scope.ShowCostEntries = function () {
    //    CheckCostEntriesMode(false);
    //    UpdateDataToSharedService();
    //}

    //function CheckCostEntriesMode(resetValue,enabled) {
    //    var costMode = false;
    //    if (resetValue == true) {
    //        $scope.costStatus = "off";
    //    } else {
    //        if (enabled != undefined) {
    //            if (enabled == true) {
    //                $scope.costStatus = "on";
    //            } else {
    //                $scope.costStatus = "off";
    //            }
    //        } else {
    //            if ($scope.costStatus == "on") {
    //                $scope.costStatus = "off";
    //            } else {
    //                $scope.costStatus = "on";
    //            }
    //        }
    //    }
    //    if ($scope.costStatus == "on") {
    //        costMode = true;
    //    } else {
    //        costMode = false;
    //    }
    //    $scope.Solution.costsByStage = costMode;
    //    var page = "S" + DataCollectionSharedService.selectedSystem;
    //    if (costMode == false) {
    //        $scope.costTheme = "c";
    //        $("#divCost" + page).addClass("ng-hide");
    //    } else {
    //        $scope.costTheme = "g";
    //        $("#divCost" + page).removeClass("ng-hide");
    //    }
    //    if (enabled = true || enabled == false) {
    //        $("#divSwitch" + page).removeClass("off on");
    //        $("#spanwitch" + page).removeClass("off on");
    //        $("#divPageSectionTitleWithSwitch" + page).removeClass("ui-bar-g");
    //        $("#divPageSectionTitleWithSwitch" + page).removeClass("ui-bar-c");
    //        if (enabled == true) {
    //            $("#divSwitch" + page).addClass("on");
    //            $("#divSwitch" + page).attr("ng-init", "status : 'on'");
    //            $("#spanwitch" + page).addClass("on");
    //            $("#divPageSectionTitleWithSwitch" + page).attr("data-theme", "g");
    //            $("#divPageSectionTitleWithSwitch" + page).addClass("ui-bar-g");
    //        } else {
    //            $("#divSwitch" + page).addClass("off");
    //            $("#divSwitch" + page).attr("ng-init", "status : 'off'");
    //            $("#spanwitch" + page).addClass("off");
    //            $("#divPageSectionTitleWithSwitch" + page).attr("data-theme", "c");
    //            $("#divPageSectionTitleWithSwitch" + page).addClass("ui-bar-c");
    //        }
    //    }
    //    //$scope.$apply();
    //}

    $scope.ChangeFilterLifetimeCriteria = function (criteria, resetALL, stage, update) {
        var page = "S" + DataCollectionSharedService.selectedSystem;
        if (criteria != undefined) {
            $scope.Solution.filterLifetimeCriteria = criteria;
        }
        $('#lblrdbFinalDP' + page).removeClass("ui-radio-on ui-btn-active ui-radio-off");
        $('#lblrdbTime' + page).removeClass("ui-radio-on ui-btn-active ui-radio-off");
        switch (criteria) {
            case "PRESSUREBASE":
                $('#lblrdbFinalDP' + page).addClass("ui-radio-on ui-btn-active");
                $('#lblrdbTime' + page).addClass("ui-radio-off");
                $scope.CriteriaUnit = $scope.Setting.unit.pressureDrop;
                break;
            case "TIMEBASE":
                $('#lblrdbTime' + page).addClass("ui-radio-on ui-btn-active");
                $('#lblrdbFinalDP' + page).addClass("ui-radio-off");
                $scope.CriteriaUnit = $filter('translate')('hours');
                break;
        }
        var exchangeValue = "";
        var control;
        if ($scope.Solution.filterLifetimeCriteria == 'PRESSUREBASE') {
            var unitId = generalFunctions.OnlyNum($scope.Setting.unit.unitId);
            if (unitId == 1) {
                exchangeValue = 450;
            } else {
                exchangeValue = 2;
            }
            control = 'cboFinalDP';
        } else {
            exchangeValue = 8760;
            control = 'cboTime';
        }
        if (resetALL == true) {
             for (var i = 0; i < $scope.Solution.filters.length; i++) {
                 if (CheckFilterExist(i + 1) == true) {
                     $scope.Solution.filters[i].exchangeValue = exchangeValue;
                    $('#' + control + (i + 1) + page).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i].exchangeValue, false));
                } 
            }
        } else {
            if (stage > 0) {
                if (CheckFilterExist(stage) == true) {
                    $scope.Solution.filters[stage-1].exchangeValue = exchangeValue;
                    $('#' + control + stage + page).val(generalFunctions.GetNumberLocale($scope.Solution.filters[stage-1].exchangeValue, false));
                }
            }
        }
        if (update == true) {
            UpdateDataToSharedService();
        }

    };

    function CheckFilterExist(stage) {
        var filterExist = false;
        if ($scope.Solution.filters != undefined) {
            if ($scope.Solution.filters[stage - 1].filterID > 0) {
                    filterExist = true;
            }
        }
        return filterExist;
    }


    function Validation(type, stage) {
        var page = "S" + DataCollectionSharedService.selectedSystem;
        var Pass = true;
        var control = undefined;
        var value = 0;
        switch (type) {
            case "FinalPressureDrop":
                if (stage > 0) {
                    control = "cboFinalDP" + stage + page;
                    value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].exchangeValue);
                    if (CheckFilterExist(stage) == true) {
                        if (value < 0) {
                            value = 0;
                        } else {
                            if ($scope.Setting.unit.unitId == 1) {
                                if (value > 1000) {
                                    value = 450;
                                }
                            } else {
                                if (value > 4) {
                                    value = 2;
                                }
                            }

                        }
                    } else {
                        value = "";
                    }
                    $scope.Solution.filters[stage - 1].exchangeValue = value;
                   
                }
                break;
            case "Time":
                if (stage > 0) {
                    control = "cboTime" + stage + page;
                    value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].exchangeValue);
                    if (CheckFilterExist(stage) == true) {
                        if (value < 50) {
                            value = 50;
                        } else {
                            if (value > 43800) {
                                value = 43800;
                            }
                        }
                    } else {
                        value = "";
                    }
                    $scope.Solution.filters[stage - 1].exchangeValue = value;
                }
                break;
            case "NoOfFilter":
                if (stage > 0) {
                    control = "cboNoOfFilter" + stage + page;
                    value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].noOfFilter);
                    if (CheckFilterExist(stage)) {
                        if (value <= 0) {
                            var airFlow = $scope.Solution.filters[stage - 1].filterAirFlow;
                            value = CalculateNoOfFilter(airFlow);
                        }
                    } else {
                        value = "";
                    }
                    $scope.Solution.filters[stage - 1].noOfFilter = value;
                }
                break;
            case "FilterPrice":
                if (stage > 0) {
                    control = "cboFilterPrice" + stage + page;
                    value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].price);
                    if (CheckFilterExist(stage)) {
                        if (value <= 0) {
                            value = 1;
                        }
                    } else {
                        value = "";
                    }
                    $scope.Solution.filters[stage - 1].price = value;
                }
                break;
            //case "FouledCompressorInterval":
            //    break;
            case "WaterWashInterval":
                control = "cboWaterWashInterval";
                value = generalFunctions.GetNumber($scope.Solution.waterWashInterval);
                if (value < 0) {
                    value = 0;
                } 
                $scope.Solution.waterWashInterval= value;
                break;
            //case "MajorMaintenanceInterval":
            //    break;
            case "HousingCost":
                if (stage > 0) {
                    control = "cboHousingCost" + stage + page;
                    value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].costs.housing);
                    if (CheckFilterExist(stage)) {
                        if (value <= 0) {
                            value = 0;
                        }
                    } else {
                        value = "";
                    }
                    $scope.Solution.filters[stage - 1].costs.housing = value;
                }
                break;
            case "LaborCost":
                if (stage > 0) {
                    control = "cboLaborCost" + stage + page;
                    value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].costs.labor);
                    if (CheckFilterExist(stage)) {
                        if (value <= 0) {
                            value = 0;
                        }
                    } else {
                        value = "";
                    }
                    $scope.Solution.filters[stage - 1].costs.labor = value;
                }
                break;
            case "WasteHandlingCost":
                if (stage > 0) {
                    control = "cboWasteHandlingCost" + stage + page;
                    value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].costs.wasteHandling);
                    if (CheckFilterExist(stage)) {
                        if (value <= 0) {
                            value = 0;
                        }
                    } else {
                        value = "";
                    }
                    $scope.Solution.filters[stage - 1].costs.wasteHandling = value;
                }
                break;
            //case "WaterWashCost":
            //    if (stage > 0) {
            //        control = "cboWaterWashCost" + stage + page;
            //        value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].costs.waterWash);
            //        if (CheckFilterExist(stage)) {
            //            if (value <= 0) {
            //                value = 0;
            //            }
            //        } else {
            //            value = "";
            //        }
            //        $scope.Solution.filters[stage - 1].costs.waterWash = value;
            //    }
            //    break;
            //case "MajorMaintenanceCost":
            //    if (stage > 0) {
            //        control = "cboMajorMaintenanceCost" + stage + page;
            //        value = generalFunctions.GetNumber($scope.Solution.filters[stage - 1].costs.majorMaintenance);
            //        if (CheckFilterExist(stage)) {
            //            if (value <= 0) {
            //                value = 0;
            //            }
            //        } else {
            //            value = "";
            //        }
            //        $scope.Solution.filters[stage - 1].costs.majorMaintenance = value;
            //    }
            //    break;
        }
        generalFunctions.AssignValueToControl(control, value);
        return Pass;
    }

    $scope.$watch("Solution.filters[0].exchangeValue", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if ($scope.Solution.filterLifetimeCriteria == 'PRESSUREBASE') {
                if (Validation("FinalPressureDrop", 1) == true) {
                    UpdateWhenEntriesChanged(false);
                }
            } else {
                if (Validation("Time", 1) == true) {
                    UpdateWhenEntriesChanged(false);
                }
            }
        }
    });

    $scope.$watch("Solution.filters[1].exchangeValue", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if ($scope.Solution.filterLifetimeCriteria == 'PRESSUREBASE') {
                if (Validation("FinalPressureDrop", 2) == true) {
                    UpdateWhenEntriesChanged(false);
                }
            } else {
                if (Validation("Time", 2) == true) {
                    UpdateWhenEntriesChanged(false);
                }
            }
        }
    });

    $scope.$watch("Solution.filters[2].exchangeValue", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if ($scope.Solution.filterLifetimeCriteria == 'PRESSUREBASE') {
                if (Validation("FinalPressureDrop", 3) == true) {
                    UpdateWhenEntriesChanged(false);
                }
            } else {
                if (Validation("Time", 3) == true) {
                    UpdateWhenEntriesChanged(false);
                }
            }
        }
    });

    $scope.$watch("Solution.filters[0].noOfFilter", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("NoOfFilter", 1) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[1].noOfFilter", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("NoOfFilter", 2) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[2].noOfFilter", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("NoOfFilter", 3) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[0].price", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("FilterPrice", 1) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[1].price", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("FilterPrice", 2) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[2].price", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("FilterPrice", 3) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    //$scope.$watch("Solution.fouledCompressorInterval", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("FouledCompressorInterval") == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});

    $scope.$watch("Solution.waterWashInterval", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("WaterWashInterval") == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    //$scope.$watch("Solution.majorMaintenanceInterval", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("MajorMaintenanceInterval") == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});

    $scope.$watch("Solution.filters[0].costs.housing", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("HousingCost", 1) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[1].costs.housing", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("HousingCost", 2) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[2].costs.housing", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("HousingCost", 3) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[0].costs.labor", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("LaborCost", 1) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[1].costs.labor", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("LaborCost", 2) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[2].costs.labor", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("LaborCost", 3) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[0].costs.wasteHandling", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("WasteHandlingCost", 1) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[1].costs.wasteHandling", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("WasteHandlingCost", 2) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.filters[2].costs.wasteHandling", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            if (Validation("WasteHandlingCost", 3) == true) {
                UpdateWhenEntriesChanged(false);
            }
        }
    });

    $scope.$watch("Solution.totalStage", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            for (var i = 1; i < 4; i++) {
                if (i > $scope.Solution.totalStage) {
                    $scope.Solution.filters[i - 1] = lccElements.FilterElements($scope.Solution.solution, i);
                    $('#cboFinalDP' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].exchangeValue, false));
                    $('#cboTime' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].exchangeValue, false));
                    $('#cboNoOfFilter' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].noOfFilter, false));
                    $('#txtFilter' + i + "PriceS" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].price, false));
                    $('#cboHousingCost' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].costs.housing, false));
                    $('#cboLaborCost' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].costs.labor, false));
                    $('#cboWasteHandlingCost' + i + "S" + $scope.Solution.solution).val(generalFunctions.GetNumberLocale($scope.Solution.filters[i - 1].costs.wasteHandling, false));
                }
            }
            $scope.Solution.totalStage = generalFunctions.GetNumber($scope.Solution.totalStage);
            switch ($scope.Solution.totalStage) {
                case 1:
                    $scope.colWidth = ['100%', '0%', '0%'];
                    break;
                case 2:
                    $scope.colWidth = ['50%', '50%', '0%'];
                    break;
                case 3:
                    $scope.colWidth = ['33%', '33%', '33%'];
                    break;
            }
            UpdateWhenEntriesChanged(false);
        }
    });

    
    $scope.$watch("selectedStage[0].checked", function (newVal, oldVal) {
        checkFilterStage(1, true);
    });

    $scope.$watch("selectedStage[1].checked", function (newVal, oldVal) {
        checkFilterStage(2, true);
    });

    $scope.$watch("selectedStage[2].checked", function (newVal, oldVal) {
        checkFilterStage(3, true);
    });

    function checkFilterStage(stage, update) {
        if ($scope.LoadingPage == false) {
            var page = "S" + DataCollectionSharedService.selectedSystem;
            var lbl = "lblchkStage" + stage + page;
            var checked;
            switch (stage) {
                case 1:
                    checked = $scope.selectedStage[0].checked;
                    break;
                case 2:
                    checked = $scope.selectedStage[1].checked;
                    break;
                case 3:
                    checked = $scope.selectedStage[2].checked;
                    break;
            }
            $("#" + lbl).removeClass("ui-checkbox-on ui-checkbox-off");
            if (checked == true) {
                $("#" + lbl).addClass("ui-checkbox-on");
            } else {
                $("#" + lbl).addClass("ui-checkbox-off");
            }
            switch (stage) {
                case 1:
                    if (checked == true) {
                        $scope.Solution.stopServiceFilter1 = 1;
                    } else {
                        $scope.Solution.stopServiceFilter1 = 0;
                    }
                    break;
                case 2:
                    if (checked == true) {
                        $scope.Solution.stopServiceFilter2 = 1;
                    } else {
                        $scope.Solution.stopServiceFilter2 = 0;
                    }
                    break;
                case 3:
                    if (checked == true) {
                        $scope.Solution.stopServiceFilter3 = 1;
                    } else {
                        $scope.Solution.stopServiceFilter3 = 0;
                    }
                    break;
            }
            if (update == true) {
                UpdateDataToSharedService();
            }
        }
    }
    //$scope.$watch("Solution.filters[0].costs.waterWash", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("WaterWashCost", 1) == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});

    //$scope.$watch("Solution.filters[1].costs.waterWash", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("WaterWashCost", 2) == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});

    //$scope.$watch("Solution.filters[2].costs.waterWash", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("WaterWashCost", 3) == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});

    //$scope.$watch("Solution.filters[0].costs.majorMaintenance", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("MajorMaintenanceCost", 1) == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});

    //$scope.$watch("Solution.filters[1].costs.majorMaintenance", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("MajorMaintenanceCost", 2) == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});

    //$scope.$watch("Solution.filters[2].costs.majorMaintenance", function () {
    //    if ($scope.LoadingPage == false) {
    //        if (Validation("MajorMaintenanceCost", 3) == true) {
    //            UpdateWhenEntriesChanged(false);
    //        }
    //    }
    //});
});