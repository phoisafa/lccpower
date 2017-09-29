"use strict";
app.controller("RunningCondCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions, lccElements) {
    $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
    $scope.Setting = DataCollectionSharedService.Params.setting;
    $scope.unit = [false, true];
    $scope.dataEntries = undefined;

    $scope.showPrevButton = true;
    $scope.showNextButton = true;

    $scope.CriteriaUnit = undefined;

    var PageMenu = lccFunctions.GetPageMenu();
    $scope.Page = PageMenu[2];

    $scope.NextPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[3].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[3].name);
    }

    $scope.PrevPage = function () {
        generalFunctions.ChangePageMenu(PageMenu[1].name, PageMenu);
        GeneralSharedServices.ProjectChangePage(PageMenu[1].name);
    }

    $scope.$on("ProjectChangePageEvent", function () {
        if (GeneralSharedServices.PageName == PageMenu[2].name) {
            console.time('Load RunningCond');
           // setTimeout(function () {
                generalFunctions.ChangePage(PageMenu[2].name, "none", false);
                $scope.RunningCond = DataCollectionSharedService.Params.runningCond;
                $scope.Setting = DataCollectionSharedService.Params.setting;
               //$scope.$apply();
               // $("#cboTotalSystemAirFlow").val(generalFunctions.GetNumberLocale($scope.RunningCond.totalSystemAirflow, false));
               // $scope.ChangeFilterStage($scope.RunningCond.totalStage, false);
           // }, 1);
                console.timeEnd('Load RunningCond');
        }
    });

    $scope.$on("UpdateLoadingPageFlagEvent", function () {
        $scope.LoadingPage = DataCollectionSharedService.LoadingPage;
       //$scope.$apply();
    });

    $scope.$on("FailValidationEvent", function () {
        if (DataCollectionSharedService.failValidationPage == PageMenu[2].name) {
            DataCollectionSharedService.failValidationPage = "";
        }
    });

    $scope.$on("TriggerUpdateSelectionListEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.$apply();
        $('#cboFanSystemOperating').editableSelect({ filter: false });
        $('#cboLCCPeriod').editableSelect({ filter: false });
        //$('#cboTotalSystemAirFlow').editableSelect({ filter: false });
        $('#cboTimeBaseLoad').editableSelect({ filter: false });
        $('#cboTimePartLoad').editableSelect({ filter: false });
        $('#cboMajorMaintenanceInterval').editableSelect({ filter: false });
        //$('#cboMajorMaintenanceCost').editableSelect({ filter: false });
        //$('#cboFinalDP1').editableSelect({ filter: false });
        //$('#cboFinalDP2').editableSelect({ filter: false });
        //$('#cboFinalDP3').editableSelect({ filter: false });
        //$('#cboTime1').editableSelect({ filter: false });
        //$('#cboTime2').editableSelect({ filter: false });
        //$('#cboTime3').editableSelect({ filter: false });
        setTimeout(function () {
            ResetValue(true, true);
            DataCollectionSharedService.UpdateSelectionListEventCompleted.runningCond = true;
            DataCollectionSharedService.CheckUpdateSelectionListEventCompleted();
        }, 1)
    });

    $scope.$on("UpdateUnitMeasurementSettingEvent", function () {
        $scope.dataEntries = DataCollectionSharedService.dataEntries;
        $scope.Setting = DataCollectionSharedService.Params.setting;
       //$scope.$apply();
        setTimeout(function () {
            //ResetValue(false, true);
            DataCollectionSharedService.UnitMeaChanged.RunningCond = true;
            DataCollectionSharedService.CheckUpdateUnitMeasurementSettingEventCompleted();
        }, 1)
    });

    function ResetValue(resetAll, update) {
        if (resetAll == true) {
            $scope.RunningCond.fanSystemOperating = $scope.dataEntries.RunningCond.FanSysOperating;
            $scope.RunningCond.lccPeriod = $scope.dataEntries.RunningCond.LCCPeriod;
           // $scope.RunningCond.totalSystemAirflow = $scope.dataEntries.RunningCond.TotalSystemAirFlow;
            $scope.RunningCond.timeBaseLoad = $scope.dataEntries.RunningCond.TimeBaseLoad;
            $scope.RunningCond.timePartLoad = $scope.dataEntries.RunningCond.TimePartLoad;
            $scope.RunningCond.majorMaintenanceInterval = 0;
           // $scope.RunningCond.majorMaintenanceCost = 0;
            var conc;
            if ($scope.RunningCond.outdoorEnv == 'OUTDOORENV') {
                conc = $scope.dataEntries.RunningCond.OutdoorEnvironment;
                $("#cboOutdoorEnv > option").each(function () {
                    if (this.value == conc) {
                        generalFunctions.ChangeComboBoxSelection(this.text, "cboOutdoorEnv", true, true);
                    }
                });
            } else {
                conc = $scope.dataEntries.RunningCond.OutdoorEnvironmentPM;
                $("#cboOutdoorEnvPM > option").each(function () {
                    if (this.value == conc) {
                        generalFunctions.ChangeComboBoxSelection(this.text, "cboOutdoorEnv", true, true);
                    }
                });
            }

        }
        $scope.ChangeOutdoorEnvironmentCriteria($scope.RunningCond.outdoorEnv,false);
        $scope.ChangeTurbineOperationTimeModeCriteria($scope.RunningCond.turbineOperationTimeMode,false);
       //$scope.$apply();
        $("#cboFanSystemOperating").val(generalFunctions.GetNumberLocale($scope.RunningCond.fanSystemOperating, false));
        $("#cboLCCPeriod").val(generalFunctions.GetNumberLocale($scope.RunningCond.lccPeriod, false));
       // $("#cboTotalSystemAirFlow").val(generalFunctions.GetNumberLocale($scope.RunningCond.totalSystemAirflow, false));
        $("#cboTimeBaseLoad").val(generalFunctions.GetNumberLocale($scope.RunningCond.timeBaseLoad, false));
        $("#cboTimePartLoad").val(generalFunctions.GetNumberLocale($scope.RunningCond.timePartLoad, false));
        $("#cboMajorMaintenanceInterval").val(generalFunctions.GetNumberLocale($scope.RunningCond.majorMaintenanceInterval, false));
        //$("#cboMajorMaintenanceCost").val(generalFunctions.GetNumberLocale($scope.RunningCond.majorMaintenanceCost, false));
        if (update == true) {
            UpdateDataToSharedService();
        }
    }

    function UpdateDataToSharedService() {
        DataCollectionSharedService.Params.runningCond = $scope.RunningCond;
        DataCollectionSharedService.UpdateResultsStatus(false);
    }

    //$scope.ChangeFilterStage = function (stage,update) {
    //    $scope.RunningCond.totalStage = generalFunctions.OnlyNum(stage);
    //   //$scope.$apply();
    //    $('#lblrdbStage1').removeClass("ui-radio-on ui-btn-active ui-radio-off");
    //    $('#lblrdbStage2').removeClass("ui-radio-on ui-btn-active ui-radio-off");
    //    $('#lblrdbStage3').removeClass("ui-radio-on ui-btn-active ui-radio-off");
    //    var style;
    //    switch (stage) {
    //        case 1:
    //            $('#lblrdbStage1').addClass("ui-radio-on ui-btn-active");
    //            $('#lblrdbStage2').addClass("ui-radio-off");
    //            $('#lblrdbStage3').addClass("ui-radio-off");
    //            style = 'tblCostsWith1Col';
    //            break;
    //        case 2:
    //            $('#lblrdbStage2').addClass("ui-radio-on ui-btn-active");
    //            $('#lblrdbStage1').addClass("ui-radio-off");
    //            $('#lblrdbStage3').addClass("ui-radio-off");
    //            style = 'tblCostsWith2Col';
    //           break;
    //        case 3:
    //            $('#lblrdbStage3').addClass("ui-radio-on ui-btn-active");
    //            $('#lblrdbStage1').addClass("ui-radio-off");
    //            $('#lblrdbStage2').addClass("ui-radio-off");
    //            style = 'tblCostsWith3Col';
    //            break;
    //    }
    //    $('.tblCosts').find('.ui-input-text').each(function () {
    //        $(this).removeClass('tblCostsWith1Col');
    //        $(this).removeClass('tblCostsWith2Col');
    //        $(this).removeClass('tblCostsWith3Col');
    //        $(this).addClass(style);
    //    });
    //    DataCollectionSharedService.TotalFilterStageChanged();
    //    if (update == true) {
    //        UpdateDataToSharedService();
    //    }
    //};

    //$scope.ChangeFilterLifetimeCriteria = function (criteria,update) {
    //    $scope.RunningCond.filterLifetimeCriteria = criteria;
    //    $('#lblrdbFinalDP').removeClass("ui-radio-on ui-btn-active ui-radio-off");
    //    $('#lblrdbTime').removeClass("ui-radio-on ui-btn-active ui-radio-off");
    //    switch (criteria) {
    //        case "FINALDP":
    //            $('#lblrdbFinalDP').addClass("ui-radio-on ui-btn-active");
    //            $('#lblrdbTime').addClass("ui-radio-off");
    //            $scope.CriteriaUnit = $scope.Setting.unit.pressureDrop;
    //            break;
    //        case "TIME":
    //            $('#lblrdbTime').addClass("ui-radio-on ui-btn-active");
    //            $('#lblrdbFinalDP').addClass("ui-radio-off");
    //            $scope.CriteriaUnit = $filter('translate')('hours');
    //            break;
    //    }
    //    if ($scope.RunningCond.filterLifetimeCriteria == 'FINALDP') {
    //        $scope.RunningCond.exchangeCriteria[0].value = 450;
    //        $scope.RunningCond.exchangeCriteria[1].value = 450;
    //        $scope.RunningCond.exchangeCriteria[2].value = 450;
    //        $("#cboFinalDP1").val(generalFunctions.GetNumberLocale($scope.RunningCond.exchangeCriteria[0].value, false));
    //        $("#cboFinalDP2").val(generalFunctions.GetNumberLocale($scope.RunningCond.exchangeCriteria[1].value, false));
    //        $("#cboFinalDP3").val(generalFunctions.GetNumberLocale($scope.RunningCond.exchangeCriteria[2].value, false));
    //    } else {
    //        $scope.RunningCond.exchangeCriteria[0].value = 8760;
    //        $scope.RunningCond.exchangeCriteria[1].value = 8760;
    //        $scope.RunningCond.exchangeCriteria[2].value = 8760;
    //        $("#cboTime1").val(generalFunctions.GetNumberLocale($scope.RunningCond.exchangeCriteria[0].value, false));
    //        $("#cboTime2").val(generalFunctions.GetNumberLocale($scope.RunningCond.exchangeCriteria[1].value, false));
    //        $("#cboTime3").val(generalFunctions.GetNumberLocale($scope.RunningCond.exchangeCriteria[2].value, false));
    //    }
    //    if (update == true) {
    //        UpdateDataToSharedService();
    //    }

    //};

    function GetSelectedOutdoorEnv(conc) {
        var outdoorEnv=undefined;
        var list;
        if ($scope.RunningCond.outdoorEnv == "OUTDOORENV") {
            list = $scope.dataEntries.RunningCond.List.OutdoorEnvironment;
        } else {
            list = $scope.dataEntries.RunningCond.List.OutdoorEnvironmentPM;
        }
        for (var i = 0; i < list.length; i++) {
            var tmp = list[i];
            if (tmp.value == conc) {
                outdoorEnv = {
                    id: tmp.id,
                    display: tmp.display,
                    value: generalFunctions.GetNumber(tmp.value),
                    extraValue: tmp.extraValue
                }             
                break;
            }
        }
        return outdoorEnv;
    }

    $("#cboOutdoorEnv").change(function () {
        $scope.RunningCond.outdoorConc = GetSelectedOutdoorEnv(this.value);
       //$scope.$apply();
        UpdateDataToSharedService();
    });

    $("#cboOutdoorEnvPM").change(function () {
        $scope.RunningCond.outdoorConc = GetSelectedOutdoorEnv(this.value);
       //$scope.$apply();
        UpdateDataToSharedService();
    });

    $scope.ChangeOutdoorEnvironmentCriteria = function (criteria,update) {
        $scope.RunningCond.outdoorEnv = criteria;
       //$scope.$apply();
        var conc;
        $('#lblrdbOutdoorEnv').removeClass("ui-radio-on ui-btn-active ui-radio-off");
        $('#lblrdbOutdoorEnvPM').removeClass("ui-radio-on ui-btn-active ui-radio-off");
        switch (criteria) {
            case "OUTDOORENV":
                $('#lblrdbOutdoorEnv').addClass("ui-radio-on ui-btn-active");
                $('#lblrdbOutdoorEnvPM').addClass("ui-radio-off");

                conc = $scope.dataEntries.RunningCond.OutdoorEnvironment;
                $("#cboOutdoorEnv > option").each(function () {
                    if (this.value == conc) {
                        $scope.RunningCond.outdoorConc = GetSelectedOutdoorEnv(this.value);
                        generalFunctions.ChangeComboBoxSelection(this.text, "cboOutdoorEnv", true, true);
                    }
                });

                break;
            case "PM":
                $('#lblrdbOutdoorEnvPM').addClass("ui-radio-on ui-btn-active");
                $('#lblrdbOutdoorEnv').addClass("ui-radio-off");

                conc = $scope.dataEntries.RunningCond.OutdoorEnvironmentPM;
                $("#cboOutdoorEnvPM > option").each(function () {
                    if (this.value == conc) {
                        $scope.RunningCond.outdoorConc = GetSelectedOutdoorEnv(this.value);
                        generalFunctions.ChangeComboBoxSelection(this.text, "cboOutdoorEnvPM", true, true);
                    }
                });

                break;
        }
        if (update == true) {
            UpdateDataToSharedService();
        }
    };

    $scope.ChangeTurbineOperationTimeModeCriteria = function (criteria,update) {
        $scope.RunningCond.turbineOperationTimeMode = criteria;
       //$scope.$apply();
        var conc;
        $('#lblrdbBaseLoad').removeClass("ui-radio-on ui-btn-active ui-radio-off");
        $('#lblrdbPartLoad').removeClass("ui-radio-on ui-btn-active ui-radio-off");
        switch (criteria) {
            case "BASELOAD":
                $('#lblrdbBaseLoad').addClass("ui-radio-on ui-btn-active");
                $('#lblrdbPartLoad').addClass("ui-radio-off");
                //$('#cboTimeBaseLoad').attr('readonly', false);
                //$('#cboTimeBaseLoad').removeClass('input-disabled');
                $scope.RunningCond.timeBaseLoad = 100;
                $scope.RunningCond.timePartLoad = 0;		
                break;
            case "PARTLOAD":
                $('#lblrdbPartLoad').addClass("ui-radio-on ui-btn-active");
                $('#lblrdbBaseLoad').addClass("ui-radio-off");
                //$('#cboTimeBaseLoad').attr('readonly', true);
                //$('#cboTimeBaseLoad').addClass('input-disabled');
                $scope.RunningCond.timeBaseLoad =30;
                $scope.RunningCond.timePartLoad = 70;	
                break;
        }
        $("#cboTimeBaseLoad").val(generalFunctions.GetNumberLocale($scope.RunningCond.timeBaseLoad, false));
        $("#cboTimePartLoad").val(generalFunctions.GetNumberLocale($scope.RunningCond.timePartLoad, false));
        if (update == true) {
            UpdateDataToSharedService();
        }
    };

    //$scope.showTotalStage = function (stage) {
    //    if ($scope.RunningCond.totalStage >= stage) {
    //        return true;
    //    } else {
    //        return false;
    //    }
    //};

    $scope.GetStageName = function (stage) {
        return generalFunctions.GetStageName(stage);
    };

    function Validate(type, stage) {
        var control = undefined;
        var value = 0;
        switch (type) {
            case "fanSystemOperating":
                control = "cboFanSystemOperating";
                value = generalFunctions.GetNumber($scope.RunningCond.fanSystemOperating);
                if (value < 50) {
                    value = 50;
                } else {
                    if (value > 8760) {
                        value = 8760;
                    }
                }
                $scope.RunningCond.fanSystemOperating = value;
                break;
            case "timeBaseLoad":
                control = "cboTimeBaseLoad";
                value = generalFunctions.GetNumber($scope.RunningCond.timeBaseLoad);
                if ($scope.RunningCond.turbineOperationTimeMode == "BASELOAD") {
                    value = 100;
                } else {
                    if (value < 0) {
                        value = 100;
                    } else {
                        if (value > 100) {
                            value = 100;
                        }
                    }
                    var Partload = generalFunctions.GetNumber($scope.RunningCond.timePartLoad);
                    if (Partload + value > 100) {
                        $scope.RunningCond.timePartLoad = 100 - value;
                    }
                }
                $scope.RunningCond.timeBaseLoad = value;
                break;
            case "timePartLoad":
                control = "cboTimePartLoad";
                value = generalFunctions.GetNumber($scope.RunningCond.timePartLoad);
                if ($scope.RunningCond.turbineOperationTimeMode == "BASELOAD") {
                    value = 0;
                } else {
                    if (value < 0) {
                        value = 100;
                    } else {
                        if (value > 100) {
                            value = 100;
                        }
                    }
                    var Baseload = generalFunctions.GetNumber($scope.RunningCond.timeBaseLoad);
                    if (Baseload + value > 100) {
                        $scope.RunningCond.timeBaseLoad = 100 - value;
                    }
                }
                $scope.RunningCond.timePartLoad = value;
                break;
            case "FinalPressureDrop":
                if (stage > 0) {
                    control = "cboFinalDP" + stage;
                    value = generalFunctions.GetNumber($scope.RunningCond.exchangeCriteria[stage - 1].value);
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
                    $scope.RunningCond.exchangeCriteria[stage-1].value = value;
                }
                break;
            case "Time":
                if (stage > 0) {
                    control = "cboTime" + stage;
                    value = generalFunctions.GetNumber($scope.RunningCond.exchangeCriteria[stage - 1].value);
                    if (value < 50) {
                        value = 50;
                    } else {
                        if (value > 43800) {
                            value = 43800;
                        }
                    }
                    $scope.RunningCond.exchangeCriteria[stage - 1].value = value;
                }
                break;
            case "lccPeriod":
                control = "cboLCCPeriod";
                value = generalFunctions.GetNumber($scope.RunningCond.lccPeriod);
                if (value < 1) {
                    value = 1;
                } else {
                    if (value > 40) {
                        value = 40;
                    }
                }            //case "totalSystemAirflow":
            //    control = "cboTotalSystemAirFlow";
            //    value = generalFunctions.GetNumber($scope.RunningCond.totalSystemAirflow);
            //    if (value < 0) {
            //        value = 0;
            //    } 
            //    $scope.RunningCond.totalSystemAirflow = value;
            //    break;
                $scope.RunningCond.lccPeriod = value;
                break;

            case "majorMaintenanceInterval":
                control = "cboMajorMaintenanceInterval";
                value = generalFunctions.GetNumber($scope.RunningCond.majorMaintenanceInterval);
                if (value < 0) {
                    value = 0;
                }
                $scope.RunningCond.majorMaintenanceInterval = value;
                break;
            //case "majorMaintenanceCost":
            //    control = "cboMajorMaintenanceCost";
            //    value = generalFunctions.GetNumber($scope.RunningCond.majorMaintenanceCost);
            //    if (value < 0) {
            //        value = 0;
            //    }
            //    $scope.RunningCond.majorMaintenanceCost = value;
            //    break;
        }
        generalFunctions.AssignValueToControl(control, value);
        setTimeout(function () {
            UpdateDataToSharedService();
        }, 1);
    }

    $scope.$watch("RunningCond.fanSystemOperating", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate('fanSystemOperating');
        }
    });

    $scope.$watch("RunningCond.timeBaseLoad", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate('timeBaseLoad');
        }
    });

    $scope.$watch("RunningCond.timePartLoad", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate('timePartLoad');
        }
    });

    //$scope.$watch("RunningCond.exchangeCriteria[0].value", function () {
    //    if ($scope.LoadingPage == false) {
    //        if ($scope.RunningCond.filterLifetimeCriteria == 'PRESSUREBASE') {
    //            Validate('FinalPressureDrop', 1);
    //        } else {
    //            Validate('Time', 1);
    //        }
    //    }
    //});

    //$scope.$watch("RunningCond.exchangeCriteria[1].value", function () {
    //    if ($scope.LoadingPage == false) {
    //        if ($scope.RunningCond.filterLifetimeCriteria == 'PRESSUREBASE') {
    //            Validate('FinalPressureDrop', 2);
    //        } else {
    //            Validate('Time', 2);
    //        }
    //    }
    //});

    //$scope.$watch("RunningCond.exchangeCriteria[2].value", function () {
    //    if ($scope.LoadingPage == false) {
    //        if ($scope.RunningCond.filterLifetimeCriteria == 'PRESSUREBASE') {
    //            Validate('FinalPressureDrop', 3);
    //        } else {
    //            Validate('Time', 3);
    //        }
    //    }
    //});

    $scope.$watch("RunningCond.lccPeriod", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate('lccPeriod');
        }
    });


    //$scope.$watch("RunningCond.totalSystemAirflow", function () {
    //    if ($scope.LoadingPage == false) {
    //        Validate('totalSystemAirflow');
    //    }
    //});


    $scope.$watch("RunningCond.majorMaintenanceInterval", function (newVal, oldVal) {
        if ($scope.LoadingPage == false) {
            Validate('majorMaintenanceInterval');
        }
    });

    //$scope.$watch("RunningCond.majorMaintenanceCost", function () {
    //    if ($scope.LoadingPage == false) {
    //        Validate('majorMaintenanceCost');
    //    }
    //});


});