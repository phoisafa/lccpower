"use strict";

app.controller("ComparisonCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions, lccElements) {
    $scope.Results = undefined;
    $scope.Params = DataCollectionSharedService.Params;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.AccountInfo = DataCollectionSharedService.AccountInfo;
    $scope.unit = [false, true];

    $scope.LoadingPage = false;
    $scope.showPrevButton = true;
    $scope.showNextButton = false;

    $scope.colWidth = [];
    $scope.CompareSolution = [];
    $scope.SelectedSolutions = [];

    var PageMenu = lccFunctions.GetPageMenu();
    $scope.Page = PageMenu[6];

    $scope.$on("AccountInfoUpdatedEvent", function () {
        $scope.AccountInfo = DataCollectionSharedService.AccountInfo;
        ////$scope.$apply();
    });


    $scope.PrevPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[5].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[5].name);
    }

    $scope.$on("ProjectChangePageEvent", function () {
        if (GeneralSharedServices.PageName == PageMenu[6].name) {
           // setTimeout(function () {
                generalFunctions.ChangePage(PageMenu[6].name, "none", false);
                $scope.Params = DataCollectionSharedService.Params;
                $scope.Setting = DataCollectionSharedService.Params.setting;
                $scope.Results = DataCollectionSharedService.Results;
                //$scope.$apply();
                if (DataCollectionSharedService.ResultsReady == false) {
                    DataCollectionSharedService.CheckNeedToGenerateResult(true, false);
                } else {
                    setTimeout(function () {
                        ShowContent();
                    }, 1);
                }
          //  }, 1);
        }
    });

    $scope.$on("ResultsReadyEvent", function () {
        if (DataCollectionSharedService.ResultsReady == true) {
            $scope.Results = DataCollectionSharedService.Results;
            if (DataCollectionSharedService.Params.compareSolutions.length > 0) {
                $scope.SelectedSolutions = DataCollectionSharedService.Params.compareSolutions;
            }
            UpdateDataToSharedService(false);
            //$scope.$apply();
            setTimeout(function () {
                ShowContent();
            }, 1);
        }
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
        //$scope.$apply();
    });

    function ShowContent() {
        var container = $('#cblist');
        container.html('');

        var css1 = "";
        var css2 = "";
        var totalCompareSolution = generalFunctions.GetNumber($scope.Results.Comparison.Solutions.length);
        switch (totalCompareSolution) {
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
        var totalSolution = generalFunctions.GetNumber($scope.Results.TotalSuccessSolution);
        switch (totalSolution) {
            case 1:
                css1 = "ui-grid-solo"
                break;
            case 2:
                css1 = "ui-grid-a"
                break;
            case 3:
                css1 = "ui-grid-b"
                break;
            case 4:
                css1 = "ui-grid-c"
                break;
            default:
                css1 = "ui-grid-d"
                break;
        }

        var mainStr = "";
        var str = "";
        var col = 1;
        var marginTop=-1;
        for (var i = 0; i < $scope.Results.Solutions.length; i++) {
            var solution = $scope.Results.Solutions[i];
            if (solution.Fail == false) {
                var name = "Solution " + solution.Solution;
                var id = "Solution" + solution.Solution;
                switch (col) {
                    case 1:
                        css2 = "ui-block-a"
                        break;
                    case 2:
                        css2 = "ui-block-b"
                        break;
                    case 3:
                        css2 = "ui-block-c"
                        break;
                    case 4:
                        css2 = "ui-block-d"
                        break;
                    case 5:
                        css2 = "ui-block-e"
                        break;
                }
                str = str + "<div class=\"ui-checkbox " + css2 + "\" style=\"margin-top:" + marginTop + "%;\">"
                str = str + "<label id=\"lblchk" + id + "\" for=\"chk" + id + "\" style=\"border:0px;\" class=\"ng-binding ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-first-child ui-checkbox-off\" >" + name + "</label>";
                str = str + "<input id=\"chk" + id + "\" type=\"checkbox\" class=\"ng-valid ng-dirty\" />";
                str = str + "</div>"
                col = col + 1;
                //if (col > 5) {
                //    col = 1;
                //    marginTop = -2;
                //}
            }
        }
        mainStr = "<div class=\"" + css1 + "\">" + str + "</div>"
        $(mainStr).appendTo(container);

        $scope.CompareSolution = [];
        $('#cblist input[type=checkbox]').each(function (index) {
            $(this).removeAttr("disabled");
            var lbl = 'lbl' + this.id;
            $('#' + lbl).css({ "color": "black" });

            var checked = false;
            for (var i = 0; i < $scope.Results.Comparison.Solutions.length; i++) {
                var solution = $scope.Results.Comparison.Solutions[i];
                var currentSolution = generalFunctions.GetNumber(this.id.replace("chkSolution", ""));
                if (solution.Solution == currentSolution) {
                    $scope.CompareSolution.push(solution);
                    //$scope.SelectedSolutions.push(generalFunctions.GetNumber(solution.Solution));
                    checked = true;
                    break;
                }
            }
           // UpdateDataToSharedService(false);
            $(this).prop('checked', checked);
            var ele = "#lbl" + this.id;
            $(ele).removeClass("ui-checkbox-on ui-checkbox-off");
                if (checked == true) {
                $(ele).addClass("ui-checkbox-on");
            } else {
                $(ele).addClass("ui-checkbox-off");
            }
            if ($scope.Results.Comparison.Solutions.length >= 3) {
                if (checked == false) {
                    $(this).attr("disabled", true);
                    var lbl = 'lbl' + this.id;
                    $('#' + lbl).css({ "color": "lightgrey" });
                }
            }
            $(this).change(function () {
                var ele = "#lbl" + this.id;
                $(ele).removeClass("ui-checkbox-on ui-checkbox-off");
                if (this.checked) {
                    $(ele).addClass("ui-checkbox-on");
                } else {
                    $(ele).addClass("ui-checkbox-off");
                }
                if ($('#cblist input[type=checkbox]:checked').length >= 3) {
                    $('#cblist input[type=checkbox]:not(:checked)').each(function (index) {
                        $(this).removeClass("ui-checkbox-on ui-checkbox-off");
                        $(this).addClass("ui-checkbox-off");
                        $(this).attr("disabled", true);
                        var lbl = 'lbl' + this.id;
                        $('#' + lbl).css({ "color": "lightgrey" });
                    });
                } else {
                    $('#cblist input[type=checkbox]').each(function (index) {
                        $(this).removeAttr("disabled");
                        var lbl = 'lbl' + this.id;
                        $('#' + lbl).css({ "color": "black" });
                    });
                }
                $scope.SelectedSolutions = [];
                $('#cblist input[type=checkbox]:checked').each(function (index) {
                    var solution = generalFunctions.GetNumber(this.id.replace("chkSolution", ""));
                    $scope.SelectedSolutions.push(solution);
                });
                UpdateDataToSharedService();
            });

        });
        //$scope.$apply();

        var row = 1;
        $('#divCompareResults').find('.ui-grid-c').each(function () {
            var css = ['header', 'ng-hide'];
            var cond = true;
            for (var i = 0; i < css.length; i++) {
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

    $scope.PopupChart = function (pTitle) {
        var FileName = "";
        switch (pTitle) {
            case "TCO":
                FileName = $scope.Results.Comparison.Charts.TCOChart;
                break;
            case "LifeTime1":
                FileName = $scope.Results.Comparison.Charts.FilterLifeTimeChartByStage.Stage1;
                break;
            case "LifeTime2":
                FileName = $scope.Results.Comparison.Charts.FilterLifeTimeChartByStage.Stage2;
                break;
            case "LifeTime3":
                FileName = $scope.Results.Comparison.Charts.FilterLifeTimeChartByStage.Stage3;
                break;
        }
        $("#imgChart").attr("src", FileName);
        $("#imgChart").attr("alt", pTitle);
        $("#hplCloseChart").addClass("ui-btn-icon-notext");
        $("#hplCloseChart").removeClass("ui-btn-icon-top");
        generalFunctions.OpenPopup("popupChart");
    }

    $scope.showFilterStage = function (stage) {
        var show = false;
        if ($scope.CompareSolution.length > 0) {
            for (var i = 0; i < $scope.CompareSolution.length; i++) {
                var solution = $scope.CompareSolution[i];
                if (solution.FiltersPerformance[stage-1] != undefined) {
                    if (solution.FiltersPerformance[stage-1].FilterID > 0) {
                        show = true;
                    }
                }
            }
        }
        return show;
    }

    $scope.GetStageName = function (stage) {
        return generalFunctions.GetStageName(stage);
    };

    $scope.GenerateResults = function (stage) {
        DataCollectionSharedService.CheckNeedToGenerateResult(true, true);
    }

    function UpdateDataToSharedService(updateResult) {
        DataCollectionSharedService.Params.compareSolutions = $scope.SelectedSolutions;
        if (updateResult == true) {
            DataCollectionSharedService.UpdateResultsStatus(false);
        }
    }

    $scope.showFilterPicture = function (solution, stage) {
        var photo = "images/no-image.png";
        if ($scope.CompareSolution != undefined) {
            if ($scope.CompareSolution[solution - 1] != undefined) {
                var picPath = "https://cfss.camfil.net/cfss2/picture/";
                if ($scope.CompareSolution[solution - 1].FiltersPerformance[stage - 1] != undefined) {
                    if ($scope.CompareSolution[solution - 1].FiltersPerformance[stage - 1].FilterID > 0) {
                        if ($scope.CompareSolution[solution - 1].FiltersPerformance[stage - 1].FilterPic != '') {
                            photo = picPath + $scope.CompareSolution[solution - 1].FiltersPerformance[stage - 1].FilterPic;
                        }
                    }
                }
            }
        }
        return photo;
    }
});