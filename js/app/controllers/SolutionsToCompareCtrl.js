"use strict";

app.controller("SolutionsToCompareCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions, lccElements) {
    $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
    $scope.FilterSolutions = DataCollectionSharedService.Params.filterSolutions;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.Results = undefined;
    $scope.unit = [false, true];

    $scope.dataEntries = undefined;
    $scope.showPrevButton = true;
    $scope.showNextButton = true;

    var PageMenu = lccFunctions.GetPageMenu();
    $scope.Page = PageMenu[3];

    $scope.tabs = [];
    var maxtotalSolutions = 10;

    $scope.showCopyButton = false;

    $scope.NextPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[4].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[4].name);
    }

    $scope.PrevPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[2].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[2].name);
    }

    $scope.$on("ProjectChangePageEvent", function () {
        if (GeneralSharedServices.PageName == PageMenu[3].name) {
           // setTimeout(function () {
               console.time('Load Solution2Compare');
                generalFunctions.ChangePage(PageMenu[3].name, "none", false);
                $scope.FilterSolutions = DataCollectionSharedService.Params.filterSolutions;
                $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
                $scope.Setting = DataCollectionSharedService.Params.setting;
                $scope.Results = DataCollectionSharedService.Results;
                //$scope.$apply();
                if (DataCollectionSharedService.firstTimeLoadSolutionPage == true) {
                    //setTimeout(function () {
                        ShowSolutionsTab(true);
                    //}, 1);
                    DataCollectionSharedService.firstTimeLoadSolutionPage = false;
                } else {
                    ShowSolutionsTab(true,undefined,undefined,false);
                }

           // }, 1);
        }
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
        //$scope.$apply();
    });

    $scope.$on("TriggerUpdateSelectionListEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.$apply();
        setTimeout(function () {
            ResetValue(true, true);
            DataCollectionSharedService.UpdateSelectionListEventCompleted.filterSolution = true;
            DataCollectionSharedService.CheckUpdateSelectionListEventCompleted();
        }, 1)
    });

    $scope.$on("FailValidationEvent", function () {
        if (DataCollectionSharedService.failValidationPage == PageMenu[3].name) {
            if (DataCollectionSharedService.failSolution > 0) {
                $scope.switchTabs("S" + DataCollectionSharedService.failSolution);
                DataCollectionSharedService.failValidationPage = "";
            }
        }
    });

    $scope.$on("ResultsReadyEvent", function () {
        var valueChanged = false;
        $scope.Results = DataCollectionSharedService.Results;
        if ($scope.Results != undefined) {
            if ($scope.Results.Fail == false) {
                DataCollectionSharedService.UpdateLoadingPageFlag(true);
                for (var v = 0; v < $scope.Results.Solutions.length; v++) {
                    var sol = $scope.Results.Solutions[v];
                    for (var w = 0; w < sol.FiltersPerformance.length; w++) {
                        var filter = sol.FiltersPerformance[w];
                        if (filter != undefined) {
                            var exchangeCriteria = $scope.FilterSolutions.solutions[sol.Solution - 1].filterLifetimeCriteria;
                            var exchangeValueInput = generalFunctions.GetNumber($scope.FilterSolutions.solutions[sol.Solution - 1].filters[w].exchangeValue);
                            if (exchangeCriteria == "PRESSUREBASE") {
                                if (exchangeValueInput != filter.FinalPressureDrop) {
                                    $scope.FilterSolutions.solutions[sol.Solution - 1].filters[w].exchangeValue = filter.FinalPressureDrop;
                                    valueChanged = true;
                                }
                            } else {
                                if (exchangeValueInput != filter.FilterLife) {
                                    $scope.FilterSolutions.solutions[sol.Solution - 1].filters[w].exchangeValue = filter.FilterLife;
                                    valueChanged = true;
                                }
                            }
                        }
                    }
                }
                if (valueChanged == true) {
                    UpdateDataToSharedService(undefined, false);
                    DataCollectionSharedService.refreshSystem = true;
                    DataCollectionSharedService.copySolutionInProgress = true;
                }
                setTimeout(function () {
                    DataCollectionSharedService.UpdateLoadingPageFlag(false);
                }, 10);
            }
        }
    });

    $scope.$on("UpdateUnitMeasurementSettingEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.FilterSolutions = DataCollectionSharedService.Params.filterSolutions;
        $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
        $scope.Setting = DataCollectionSharedService.Params.setting;
        //$scope.$apply();
        setTimeout(function () {
            ResetValue(false, true);
            DataCollectionSharedService.UnitMeaChanged.FilterSolution = true;
            DataCollectionSharedService.CheckUpdateUnitMeasurementSettingEventCompleted();
        }, 1)
    });

    function ResetValue(resetAll, update) {
        if (resetAll == true) {
            ShowSolutionsTab();
        }
        //$scope.$apply();
        if (update == true) {
            UpdateDataToSharedService(false);
        }
    }

    function UpdateDataToSharedService(generateResults,updateResults) {
        if (generateResults == undefined) {
            generateResults = false;
        } else {
            if (DataCollectionSharedService.ResultsReady == false) {
                generateResults = false;
            }
        }
        if (updateResults == undefined) {
            updateResults = true;
        }
        DataCollectionSharedService.Params.filterSolutions = $scope.FilterSolutions;
        if (updateResults == true) {
            DataCollectionSharedService.UpdateResultsStatus(generateResults);
        }
    }

    $scope.$watch("FilterSolutions.totalSolution", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            setTimeout(function () {
                var goToSolution = 1;
                for (var i = 1; i <= $scope.FilterSolutions.totalSolution; i++) {
                    if (CheckFilterExist(i) == false) {
                        goToSolution = i;
                        break;
                    }
                }
                ShowSolutionsTab(true, undefined, goToSolution);
            }, 1);
            UpdateDataToSharedService(false);
        }
    });

    function CheckFilterExist(iSolution) {
        var filterExist = false;
        var filterList = $scope.FilterSolutions.solutions[iSolution - 1].filters;
        for (var i = 0; i < filterList.length; i++) {
            if (generalFunctions.OnlyNum(filterList[i].filterID) > 0) {
                filterExist = true;
                break;
            }
        }
        return filterExist;
    }

    function ShowSolutionsTab(openTab, delayOpenTab, page,modifyCol) {
        //console.time('ShowSolutionsTab');
        var totalSolutions = $scope.FilterSolutions.totalSolution;
        if (modifyCol == undefined) {
            modifyCol = true;
        }
        if (modifyCol == true) {
            var colWidth = "0";
            var style = ['ui-block-a', 'ui-block-b', 'ui-block-c', 'ui-block-d', 'ui-block-e'];
            $scope.tabs = [];
            for (var i = 1; i <= maxtotalSolutions; i++) {
                if (i <= totalSolutions) {
                    $scope.tabs.push(createTabElement("S" + i, "pageS" + i, true));
                } else {
                    $scope.tabs.push(createTabElement("S" + i, "pageS" + i, false));
                }
            }
            if (totalSolutions < 6) {
                colWidth = 100 / totalSolutions + "%";
            } else {
                colWidth = 100 / 2 + "%";
            }
            var iStyle = 0;
            for (var i = 0; i < $scope.tabs.length; i++) {
                if ($scope.tabs[i].active == true) {
                    $('[href="#' + $scope.tabs[i].page + '"]').closest('li').show();
                    $('[href="#' + $scope.tabs[i].page + '"]').closest('li').css("width", colWidth);
                    $('[href="#' + $scope.tabs[i].page + '"]').closest('li').removeClass("ui-block-a ui-block-b ui-block-c ui-block-d ui-block-e");
                    if (totalSolutions <= 5) {
                        $('[href="#' + $scope.tabs[i].page + '"]').closest('li').addClass(style[iStyle]);
                    } else {
                        if ((iStyle % 2) == 0) {
                            $('[href="#' + $scope.tabs[i].page + '"]').closest('li').addClass(style[0]);
                        } else {
                            $('[href="#' + $scope.tabs[i].page + '"]').closest('li').addClass(style[1]);
                        }
                    }
                    iStyle = iStyle + 1;
                    $("#" + $scope.tabs[i].page).show();
                } else {
                    $('[href="#' + $scope.tabs[i].page + '"]').closest('li').hide();
                    $("#" + $scope.tabs[i].page).hide();
                }
            }
        }
        if (openTab == true) {
            if ($scope.tabs.length > 0) {
                var delay = 0;
                if (delayOpenTab == true) {
                    delay = 1;
                }
                setTimeout(function () {
                    var openPage = 0;
                    if (page > 0) {
                        openPage = page - 1;
                    }
                    //$scope.switchTabs(tabs[openPage].name);
                    //$('#anc' + $scope.tabs[openPage].name).trigger('click');
                    $('#tabSystems a[href="#page' + $scope.tabs[openPage].name + '"]').trigger('click');
                    //console.timeEnd('ShowSolutionsTab');
                    console.timeEnd('Load Solution2Compare');
                }, delay);
            }
        }
        
    }

    function createTabElement(name, page, active) {
        return { name: name, page: page, active: active };
    }

    $scope.switchTabs = function (page) {
        switch (page) {
            case "S1": 
                DataCollectionSharedService.selectedSystem = 1;
                break;
            case "S2":
                DataCollectionSharedService.selectedSystem = 2;
                break;
            case "S3":
                DataCollectionSharedService.selectedSystem = 3;
                break;
            case "S4":
                DataCollectionSharedService.selectedSystem = 4;
                break;
            case "S5":
                DataCollectionSharedService.selectedSystem = 5;
                break;
            case "S6":
                DataCollectionSharedService.selectedSystem = 6;
                break;
            case "S7":
                DataCollectionSharedService.selectedSystem = 7;
                break;
            case "S8":
                DataCollectionSharedService.selectedSystem = 8;
                break;
            case "S9":
                DataCollectionSharedService.selectedSystem = 9;
                break;
            case "S10":
                DataCollectionSharedService.selectedSystem = 10;
                break;
        }
        for (var i = 0; i < $scope.tabs.length; i++) {
            if ($scope.tabs[i].name == page) {
                $("#" + $scope.tabs[i].page).css('display', 'block');
                $("#anc" + $scope.tabs[i].name).removeClass('tabSolutionsToCompare');
                $("#anc" + $scope.tabs[i].name).addClass('ui-btn-active');

            } else {
                $("#" + $scope.tabs[i].page).css('display', 'none');
                $("#anc" + $scope.tabs[i].name).removeClass('ui-btn-active');
                $("#anc" + $scope.tabs[i].name).addClass('tabSolutionsToCompare');
            }
        }
        DataCollectionSharedService.refreshSystem = true;
        UpdateCopySolutionDDL();
        GeneralSharedServices.RefreshFilterPage();
    }

    $scope.$on("UpdateFilterSelectionsEvent", function () {
        var updateSolution = DataCollectionSharedService.currentSolution;
        if (updateSolution != undefined) {
            $scope.FilterSolutions.solutions[updateSolution.solution - 1] = updateSolution;
        }
        //$scope.$apply();
        UpdateDataToSharedService(false);
    });

    $scope.CopySolution = function () {
        var currentSolution = generalFunctions.GetNumber(DataCollectionSharedService.selectedSystem);
        var copySolution = generalFunctions.GetNumber($('#cboSolutions :selected').text());
        if (copySolution > 0) {
            var source = $scope.FilterSolutions.solutions[copySolution - 1];
            $scope.FilterSolutions.solutions[currentSolution - 1].totalStage = source.totalStage;
            $scope.FilterSolutions.solutions[currentSolution - 1].filterLifetimeCriteria = source.filterLifetimeCriteria;
            $scope.FilterSolutions.solutions[currentSolution - 1].stopServiceFilter1 = source.stopServiceFilter1;
            $scope.FilterSolutions.solutions[currentSolution - 1].stopServiceFilter2 = source.stopServiceFilter2;
            $scope.FilterSolutions.solutions[currentSolution - 1].stopServiceFilter3 = source.stopServiceFilter3;
            $scope.FilterSolutions.solutions[currentSolution - 1].waterWashInterval = source.waterWashInterval;
            for (var i = 0; i < source.filters.length; i++) {
                var filter = source.filters[i];
                $scope.FilterSolutions.solutions[currentSolution - 1].filters[i] = {
                    solution: currentSolution.solution,
                    stage: filter.stage,
                    filterName: filter.filterName,
                    filterID: filter.filterID,
                    filterGroupID: filter.filterGroupID,
                    filterTypeID: filter.filterTypeID,
                    exchangeValue: filter.exchangeValue,
                    noOfFilter: filter.noOfFilter,
                    price: filter.price,
                    costs: {
                        housing: filter.costs.housing,
                        labor: filter.costs.labor,
                        wasteHandling: filter.costs.wasteHandling
                    }
                }
            }
            $scope.FilterSolutions.solutions[currentSolution - 1].costsByStage = source.costsByStage;
            UpdateDataToSharedService(false);
            DataCollectionSharedService.refreshSystem = true;
            DataCollectionSharedService.copySolutionInProgress = true;
            GeneralSharedServices.RefreshFilterPage();
        }
    }

    function UpdateCopySolutionDDL() {
        var element = "cboSolutions"
        var $el = $("#" + element);

        var newOptions = [];
        var currentSolution = generalFunctions.GetNumber(DataCollectionSharedService.selectedSystem);
        for (var i = 1; i <= $scope.FilterSolutions.totalSolution; i++) {
            if (i != currentSolution) {
                if (CheckFilterExist(i) == true) {
                    var option = { text: i, value: i };
                    newOptions.push(option);
                }
            }
        }
        $scope.showCopyButton = false;
        $el.empty(); // remove old options
        if (newOptions != undefined) {
            if (newOptions.length > 0) {
                $scope.showCopyButton = true;
                $.each(newOptions, function (key, val) {
                    $el.append($("<option></option>")
                        .attr("value", val.value).text(val.text));
                });
                generalFunctions.ChangeComboBoxSelection(newOptions[0].text, element, true, true);
            }
        }
    }

    function CalculateNoOfFilter(airFlow) {
        var noOfFilterRequired = 1;
        var massFlow = DataCollectionSharedService.Params.gasTurbine.massFlow;
        var airDensity = DataCollectionSharedService.Params.gasTurbine.airDensity;
        var airFlow = airFlow;

        noOfFilterRequired = lccFunctions.CalculateNoOfFilter(massFlow, airDensity, airFlow);
        return noOfFilterRequired;
    }

    $scope.$on("TurbineChangedEvent", function () {
        var noOfFilterChanged = false;
        for (var i = 1; i <= $scope.FilterSolutions.totalSolution; i++) {
            var solution = $scope.FilterSolutions.solutions[i - 1];
            if (CheckFilterExist(i) == true) {
                for (var j = 0; j < solution.totalStage; j++) {
                    var filterInfo = solution.filters[j];
                    if (filterInfo.noOfFilter <= 1) {
                        filterInfo.noOfFilter = CalculateNoOfFilter(filterInfo.filterAirFlow);
                        $('#cboNoOfFilter' + (j + 1) + "S" + i).val(generalFunctions.GetNumberLocale(filterInfo.noOfFilter, false));
                        noOfFilterChanged = true;
                    }
                }
            }
        }
        UpdateDataToSharedService(!(noOfFilterChanged));
    });
});