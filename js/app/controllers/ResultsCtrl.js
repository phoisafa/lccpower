"use strict";

app.controller("ResultsCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions, lccElements) {
    $scope.Results = undefined;
    $scope.Params = DataCollectionSharedService.Params;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.AccountInfo = DataCollectionSharedService.AccountInfo;
    $scope.unit = [false, true];

    $scope.LoadingPage = false;
    $scope.showPrevButton = true;
    $scope.showNextButton = true;

    $scope.currentPage = "";

    $scope.selectedSolution = 0;
    $scope.Solution = undefined;
    $scope.colWidth = [];

    $scope.ResultsFailed = false;

    var PageMenu = lccFunctions.GetPageMenu();
    $scope.Page = PageMenu[5];

    var tabs = [{ name: "Summary", page: "pageSummary", active: true },
        { name: "Solution", page: "pageSolution", active: false }]

    $scope.$on("AccountInfoUpdatedEvent", function () {
        $scope.AccountInfo = DataCollectionSharedService.AccountInfo;
        //$scope.$apply();
    });

    $scope.NextPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[6].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[6].name);
    }

    $scope.PrevPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[4].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[4].name);
    }

    $scope.$on("ProjectChangePageEvent", function () {
        if (GeneralSharedServices.PageName == PageMenu[5].name) {
            //setTimeout(function () {
                generalFunctions.ChangePage(PageMenu[5].name, "none", false);
                $scope.Params = DataCollectionSharedService.Params;
                $scope.Setting = DataCollectionSharedService.Params.setting;
                //$scope.$apply();
                //$scope.switchTabs(tabs[0].name, true);
                $('#anc' + tabs[0].name).trigger('click');
                setTimeout(function () {
                    $scope.GenerateResults(false);
                }, 1);
           // }, 1);
        }
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
        //$scope.$apply();
    });

    $scope.$on("FailValidationEvent", function () {
        if (DataCollectionSharedService.failValidationPage == PageMenu[5].name) {
            DataCollectionSharedService.failValidationPage = "";
        }
    });

    $scope.GenerateResults = function (forceGenerate) {
        DataCollectionSharedService.CheckNeedToGenerateResult(true, forceGenerate);
    }

    $scope.$on("RunProcessSuccessEvent", function () {
        switch (DataCollectionSharedService.TempStringStorageProcessName) {
            case "UPLOAD ALL PARAMS TO SERVER":
                if (DataCollectionSharedService.generatingAllResults == false) {
                    DataCollectionSharedService.ServerDataReady = true;
                    DataCollectionSharedService.generatingAllResults = true;
                    DataCollectionSharedService.TriggerCalculation("GENERATE ALL RESULTS");
                    break;
                }
        }
    });

    $scope.$on("RunProcessFailEvent", function () {
        switch (DataCollectionSharedService.TempStringStorageProcessName) {
            case "UPLOAD ALL PARAMS TO SERVER":
            case "GENERATE ALL RESULTS":
                DataCollectionSharedService.ClearResultGeneratingStatus(false);
                generalFunctions.toast("Failed to generate results");
                break;
        }
    });

    $scope.switchTabs = function (page,refreshPage) {
        $scope.currentPage = page;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].name == page) {
                $("#" + tabs[i].page).css('display', 'block');
                $("#anc" + tabs[i].name).removeClass('tabSolutionsToCompare');
                $("#anc" + tabs[i].name).addClass('ui-btn-active');

            } else {
                $("#" + tabs[i].page).css('display', 'none');
                $("#anc" + tabs[i].name).removeClass('ui-btn-active');
                $("#anc" + tabs[i].name).addClass('tabSolutionsToCompare');
            }
        }
        if (refreshPage == true) {
            switch (page) {
                case "Solution":
                    ShowSolutionResults();
                    break;
            }
        }
    }

    $scope.$on("ResultsReadyEvent", function () {
        $scope.Results = DataCollectionSharedService.Results;
        $scope.ResultsFailed = DataCollectionSharedService.ResultsFailed;
        //$scope.$apply();
        $('#ancSummary').trigger('click');
        UpdateSolutionResultDDL();
        if ($scope.currentPage == "Solution") {
            ShowSolutionResults();
        }
    });

    $scope.PopupChart = function (pTitle) {
        var FileName = "";
        switch (pTitle) {
            case "TCO":
                FileName = $scope.Results.Charts.TCOChart;
                break;
            case "CapitalInvestment":
                FileName = $scope.Results.Charts.CapitalInvestmentChart;
                break;
            case "DirectFilter":
                FileName = $scope.Results.Charts.DirectFilterCostChart;
                break;
            case "PressureDrop":
                FileName = $scope.Results.Charts.PressureDropCostChart;
                break;
            case "Fouling":
                FileName = $scope.Results.Charts.FoulingCostChart;
                break;
            case "Downtime":
                FileName = $scope.Results.Charts.DowntimeCostChart;
                break;
            case "TCOSOLUTION":
                if ($scope.Solution != undefined) {
                    FileName = $scope.Solution.Charts.TCOChart;
                }
                break
            case "LIFETIMESOLUTION":
                if ($scope.Solution != undefined) {
                    FileName = $scope.Solution.Charts.FilterLifeTimeChart;
                }
                break
        }
        $("#imgChart").attr("src", FileName);
        $("#imgChart").attr("alt", pTitle);
        $("#hplCloseChart").addClass("ui-btn-icon-notext");
        $("#hplCloseChart").removeClass("ui-btn-icon-top");
        generalFunctions.OpenPopup("popupChart");
        $("#popupChart").bind({
            popupafterclose: function (event, ui) {
                $scope.switchTabs($scope.currentPage);
            }
        });
        //$("#popupChart").popup("open", { positionTo: 'origin' });
    }

    function UpdateSolutionResultDDL() {
        var element = "cboSolutionResult"
        var $el = $("#" + element);
        $el.empty(); // remove old options
        if ($scope.Results != undefined) {
            var newOptions = [];
            for (var i = 0; i < $scope.Results.Solutions.length; i++) {
                var solution = $scope.Results.Solutions[i];
                if (solution != undefined) {
                    var iSolution = solution.Solution;
                    if (solution.Fail == false) {
                        var option = { text: iSolution, value: iSolution };
                        newOptions.push(option);
                    }
                }
            }
            if (newOptions != undefined) {
                if (newOptions.length > 0) {
                    $scope.showCopyButton = true;
                    $.each(newOptions, function (key, val) {
                        $el.append($("<option></option>")
                            .attr("value", val.value).text(val.text));
                    });
                    generalFunctions.ChangeComboBoxSelection(newOptions[0].text, element, true, true);
                    setTimeout(function () {
                        $scope.selectedSolution = generalFunctions.GetNumber($('#cboSolutionResult').val());
                        //$scope.$apply();
                    }, 10);
                }
            }
        }
    }

    function ShowSolutionResults() {
        if ($scope.Results != undefined) {
            if ($scope.Results.Fail == false) {
                for (var i = 0; i < $scope.Results.Solutions.length; i++) {
                    var solution = $scope.Results.Solutions[i];
                    if (solution != undefined) {
                        var iSolution = solution.Solution;
                        if (iSolution == $scope.selectedSolution) {
                            if (solution.Fail == false) {
                                $scope.Solution = solution;
                                switch ($scope.Solution.TotalStage) {
                                    case 1:
                                        $scope.colWidth = ['50%', '50%', '0%', '0%'];
                                        break;
                                    case 2:
                                        $scope.colWidth = ['40%', '30%', '30%', '0%'];
                                        break;
                                    case 3:
                                        $scope.colWidth = ['22%', '26%', '26%', '26%'];
                                        break;
                                }
                                //$scope.$apply();
                            }
                        }
                    }
                }
            }
        }
        var row = 1;
        $('#divSolutionResults').find('.ui-grid-c').each(function () { 
            var css = ['header', 'ng-hide'];
            var cond = true;
            for (var i = 0;i < css.length; i++) {
                var cssClass = css[i];
                if ($(this).hasClass(cssClass) == true) {
                    cond = false;
                    break;
                }
            }
            if (cond == true) {
                if (row % 2 == 0) {
                    $(this).addClass('CellStyleAlternate')
                } else {
                    $(this).removeClass('CellStyleAlternate')
                }
                row = row + 1;
            }
        })
    }

    $scope.$watch("selectedSolution", function () {
        if ($scope.LoadingPage == false) {
            ShowSolutionResults();
        }
    }, true);

    $scope.GetStageName = function (stage) {
        return generalFunctions.GetStageName(stage);
    };


    $scope.showFilterPicture = function (stage) {
        var photo = "images/no-image.png";
        if ($scope.Results != undefined) {
            if ($scope.Results.Fail == false) {
                var picPath = "https://cfss.camfil.net/cfss2/picture/";
                if ($scope.Solution != undefined) {
                    if ($scope.Solution.FiltersPerformance[stage - 1] != undefined) {
                        if ($scope.Solution.FiltersPerformance[stage - 1].FilterID > 0) {
                            if ($scope.Solution.FiltersPerformance[stage - 1].FilterPic != '') {
                                photo = picPath + $scope.Solution.FiltersPerformance[stage - 1].FilterPic;
                            }
                        }
                    }
                }
            }
        }
        return photo;
    }
 });