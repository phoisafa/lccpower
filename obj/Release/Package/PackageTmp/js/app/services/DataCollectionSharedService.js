"use strict";

app.factory("DataCollectionSharedService", function ($rootScope, $q, $http, $translate, generalFunctions, generalElements, GeneralSharedServices, lccElements, lccFunctions) {
    var sharedService = {};
    sharedService.Params = lccElements.LccParamsElement();
    sharedService.AccountInfo = undefined;
    //Server--START
    sharedService.AppURL = "https://cfss.camfil.net/clean/index.html" //application path
    sharedService.ServerDomain = "https://cfss.camfil.net/CFSSWebService/WebService/"; // Authentication
    sharedService.ServerURL = "https://cfss.camfil.net/CFSSApplicationServices/WebService/"; //Application Web Services
    sharedService.FileUploadURL = "https://cfss.camfil.net/fileuploader/FileUploader.ashx"; //Upload File
    sharedService.CFSSDomainURL = "https://cfss.camfil.net/cfss/"
    //Server--END
    //Development-START
    //sharedService.AppURL = "http://localhost:54300/index.html" //application path
    //sharedService.ServerURL = "http://localhost:52482/WebService/"; //Application Web Services
    //sharedService.FileUploadURL = "http://localhost:50222/FileUploader.ashx";  //Upload File
    //sharedService.ServerDomain = "http://localhost:53186/WebService/"; // Authentication
    //sharedService.CFSSDomainURL = "http://localhost:52192/"
    //Development-END
    sharedService.SessionExpired = false;
    sharedService.ApplicationID = 6;
    sharedService.LoadingPage = false;
    sharedService.firstTimeLoading = true;
    sharedService.verifyLoginCodeFirstTime = false;
    sharedService.localeCode = undefined;
    sharedService.SelectedLanguageID = 1;
    sharedService.TriggerLoadDataFromServer = false;
    sharedService.LoadDataFromServerCompleted = false;
    sharedService.dataEntries = undefined;
    sharedService.colDataFromServer = undefined;
    sharedService.UnitMeaChanged = {
        GasTurbine: false,
        RunningCond: false,
        FilterSolution: false,
        CostRate: false
    }
    sharedService.CamfilLogo = sharedService.CFSSDomainURL + "images/gfx_camfil-logo-green.gif";
    sharedService.UploadFileAction = "";

    //For gas turbine page
    sharedService.prevHeatRateOfEngineUnit = "";
    sharedService.prevFuelCostUnit = "";

    //For solution to compare page
    sharedService.currentSystem = undefined;
    sharedService.selectedSystem = 1;
    sharedService.registeredStage = 0;
    sharedService.openPopupTimes = 0;
    sharedService.refreshSystem = false;
    sharedService.tabFilterSelectionChanged = 0;
    sharedService.copySolutionInProgress = false;
    sharedService.firstTimeLoadSolutionPage = true;
    //For costs/rates page
    sharedService.UpdateSelectionListEventCompleted = {
        projectInfo:false,
        gasTurbine: false,
        runningCond:false,
        filterSolution: false,
        costsRates: false,
        ALL:false
    }

    //for Results page
    sharedService.failValidationPage = "";
    sharedService.failSolution = 0;
    sharedService.ServerData = undefined;
    sharedService.ServerDataReady = false;
    sharedService.ResultsFailed = false;
    sharedService.ResultsReady = false;
    sharedService.generatingAllResults = false;
    sharedService.UploadingEntry = false;
    sharedService.TempStringStorageID = "";
    sharedService.TempStringStorageTotalSeq = 0;
    sharedService.TempStringStorageTotalPass = 0;
    sharedService.TempStringStorageTotalFail = 0;
    sharedService.TempStringStorageProcessName = "";
    sharedService.Results = undefined;

    sharedService.UpdateLoadingPageFlag = function (turnOn) {
        sharedService.LoadingPage = turnOn;
        $rootScope.$broadcast("UpdateLoadingPageFlagEvent");
    }

    sharedService.UpdateAccountInfo = function (AccountInfo) {
        sharedService.AccountInfo = AccountInfo;
        if (sharedService.AccountInfo != undefined) {
            //sharedService.Params.unit = sharedService.AccountInfo.Unit;
            //sharedService.Params.unitId = sharedService.AccountInfo.UnitID;
            if (sharedService.AccountInfo.CurrencyID == 0) {
                sharedService.AccountInfo.Currency = "USD"; //default to USD for those users without currency setup
                sharedService.AccountInfo.CurrencyID = 2;
            }
            sharedService.Params.setting.currency = {
                name: sharedService.AccountInfo.Currency,
                id: sharedService.AccountInfo.CurrencyID
            }
            sharedService.UpdateUserApplicationUsage("LOGON");
        }
        $rootScope.$broadcast("AccountInfoUpdatedEvent");
    }

    sharedService.UpdateUserApplicationUsage = function (activity) {
        sharedService.CheckLoginCodeIsActive(sharedService.AccountInfo.LoginCode)
            .then(function (response) {
                //success
                if (response.passed == true) {
                    var msg = "Fail to update user application usage log!";
                    var jData = {};
                    jData.ApplicationID = sharedService.ApplicationID;
                    jData.Code = sharedService.AccountInfo.LoginCode;
                    jData.UserID = sharedService.AccountInfo.UserID;
                    jData.Activity = activity;
                    var url = sharedService.ServerURL + "UserApplicationUsageLog";
                    $http({
                        url: url,
                        method: "POST",
                        data: JSON.stringify(jData),
                        cache: false,
                        responseType: "json"
                    })
                        .then(function (response) {
                            //success
                            console.log(response.data);
                        },
                        function (response) {
                            //fail
                            console.log(response);
                            console.log(msg);
                        });
                } else {
                    //fail
                    generalFunctions.CustomisedReLoginAlert();
                }
            },
            function (response) {
                //fail
                generalFunctions.CustomisedReLoginAlert();
            });
    }

    sharedService.UpdateLocaleCode = function () {
        sharedService.localeCode = generalFunctions.GetUserLocale();
    }

    sharedService.UpdateLocaleCode = function () {
        sharedService.localeCode = generalFunctions.GetUserLocale();
    }

    sharedService.PerformLogin = function () {
        $rootScope.$broadcast("PerformLoginEvent");
    }

    sharedService.LoginCodeValidationCheck = function (LoginCode) {
        var deferred = $q.defer();
        sharedService.CheckLoginCodeIsActive(LoginCode)
            .then(function (response) {
                if (response.passed == true) {
                    sharedService.SessionExpired = false;
                    deferred.resolve({
                        passed: true
                    });
                } else {
                    SessionExpiredLogin();
                    deferred.reject({
                        passed: false
                    });
                }
            },
            function (response) {
                SessionExpiredLogin();
                deferred.reject({
                    passed: false
                });
            });
        return deferred.promise;
    }

    function SessionExpiredLogin() {
        sharedService.SessionExpired = true;
        sharedService.PerformLogin();
        generalFunctions.toast("MSG_SESSION_EXPIRED", 2000);
    }

    sharedService.CheckLoginCodeIsActive = function (LoginCode) {
        var deferred = $q.defer();
        var tLoginCode = LoginCode;
        if (tLoginCode == undefined) {
            tLoginCode = sharedService.AccountInfo.LoginCode;
        } else {
            if (tLoginCode == "") {
                tLoginCode = sharedService.AccountInfo.LoginCode;
            }
        }
        if (tLoginCode == undefined) {
            tLoginCode = "";
        }
        var jData = {};
        jData.pLoginCode = {};
        jData.pLoginCode.LoginCode = tLoginCode;
        $http({
            url: sharedService.ServerDomain + "LoginCodeRemainingActiveSecond",
            method: "POST",
            data: JSON.stringify(jData),
            cache: false,
            responseType: "json"
        })
            .then(function (response) {
                //success
                console.log(response);
                var passed = false;
                if (parseFloat(response.data) > 0) {
                    passed = true;
                }
                deferred.resolve({
                    passed: passed,
                    seconds: parseFloat(response.data)
                });
            },
            function (response) {
                //fail
                console.log(response.status);
                deferred.reject({
                    passed: false
                });
            });
        return deferred.promise;
    }



    sharedService.tmpLoginCode = undefined;
    sharedService.LoginCodeRemainingActiveSecond = function (pLoginCode) {
        var LoginCode = {
            LoginCode: pLoginCode
        }
        var timeOut = generalElements.SessionTimeOut();
        var msg = "Session time out. Please login again.";
        timeOut = {
            TimeOut: true,
            Msg: msg,
            URL: sharedService.AppURL
        }
        var jData = {};
        jData.pLoginCode = LoginCode;
        var url = sharedService.ServerDomain + "LoginCodeRemainingActiveSecond";
        $http({
            url: url,
            method: "POST",
            data: JSON.stringify(jData),
            cache: false,
            responseType: "json"
        })
        .then(function (response) {
            //success
            var data = response.data;
            if (data > 0) {
                sharedService.tmpLoginCode = LoginCode;
                if (sharedService.verifyLoginCodeFirstTime == false) {
                    $rootScope.$broadcast("TriggerByPassAuthenticationEvent");
                }
            } else {
                $rootScope.$broadcast("TriggerLoginPopupEvent");
            }
        },
        function (response) {
            //fail
            console.log(response);
            $rootScope.$broadcast("TriggerLoginPopupEvent");
        });
    }

    sharedService.TriggerCheckLoginCodeIsActive = function () {
        sharedService.CheckLoginCodeIsActive(sharedService.AccountInfo.LoginCode)
         .then(function (response) {
             //success
             if (response.passed == false) {
                 generalFunctions.CustomisedReLoginAlert();
             }
             //else {
             //    alert("Login code still active");
             //}
         },
          function (response) {
              //fail
              generalFunctions.CustomisedReLoginAlert();
          });
    }

    sharedService.UploadFileToServer = function (files) {
        var msg = "Failed to upload file to server!";
        try {
            var fd = new FormData();
            var url = sharedService.FileUploadURL;
            var name = undefined;
            angular.forEach(files, function (file) {
                fd.append('file', file)
                name = file.name;
            })
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(function (data) {
                    console.log(data);
                    switch (sharedService.UploadFileAction) {
                        case "LOGOAccount":
                        case "LOGOProject":
                            sharedService.TriggerUploadCompanyLogoToServer(name);
                            break;
                    }
                })
                .error(function (data) {
                    console.log(data);
                    generalFunctions.HideLoading();
                    generalFunctions.toast(msg);
                });
        } catch (ex) {
            console.log(ex.message);
            generalFunctions.HideLoading();
            generalFunctions.toast(msg);
        }
    }

    sharedService.GetCompanyLogo = function (LoginCode, UserName) {
        var jData = {};
        jData.pCode = LoginCode;
        jData.pUserName = UserName;
        $http({
            url: sharedService.ServerURL + "RetrieveCompanyLogo",
            method: "POST",
            data: JSON.stringify(jData),
            cache: false,
            responseType: "json"
        })
            .then(function (response) {
                //success
                console.log("Success:RetrieveCompanyLogo");
                console.log(response.status);
                if (response.data != undefined) {
                    if (response.data != undefined && response.data != '') {
                        sharedService.AccountInfo.CompanyLogo = sharedService.CFSSDomainURL + "CompanyLogo/" + sharedService.AccountInfo.Username + "/" + response.data;
                    } //else {
                    //DataCollectionSharedService.AccountInfo.CompanyLogo = DataCollectionSharedService.CamfilLogo;
                    //}
                    $rootScope.$broadcast("UpdateCompanyLogoEvent");
                }
            },
            function (response) {
                //fail
                console.log("Failed:RetrieveCompanyLogo");
                console.log(response.status);
            });
    }

    sharedService.TriggerChangeCompanyLogoEvent = function (From) {
        var action = "";
        switch (From) {
            case "Account":
                action = "LOGOAccount";
                break;
            case "Project":
                action = "LOGOProject";
                break;
        }
        sharedService.UploadFileAction = action;
        $rootScope.$broadcast("ChangeCompanyLogoEvent");
    }

    function RefreshCompanyLogo(filename) {
        var d = new Date();
        var imgFile = '';
        if (filename != undefined && filename != '') {
            sharedService.AccountInfo.CompanyLogo = sharedService.CFSSDomainURL + "CompanyLogo/" + sharedService.AccountInfo.Username + "/" + filename;
            imgFile = sharedService.AccountInfo.CompanyLogo + "?" + d.getTime();
        } else {
            sharedService.AccountInfo.CompanyLogo = "";
        }
        $("#imgAccountInfoCompanyLogo").attr("src", imgFile);
        $("#imgProjectInfoCompanyLogo").attr("src", imgFile);
        $rootScope.$broadcast("UpdateCompanyLogoEvent");
        if (sharedService.UploadFileAction == "LOGOAccount") {
            $rootScope.$broadcast("OpenAccountInfoPopupEvent");
        }

    }

    sharedService.TriggerUploadCompanyLogoToServer = function (filename) {
        sharedService.CheckLoginCodeIsActive(sharedService.AccountInfo.LoginCode)
            .then(function (response) {
                //success
                if (response.passed == true) {
                    var msg = "Failed upload company logo to server!";
                    var jData = {};
                    jData.Username = sharedService.AccountInfo.Username;
                    jData.Code = sharedService.AccountInfo.LoginCode;
                    jData.FileName = filename;
                    var url = sharedService.ServerURL + "UploadCompanyLogo";
                    $http({
                        url: url,
                        method: "POST",
                        data: JSON.stringify(jData),
                        cache: false,
                        responseType: "json"
                    })
                        .then(function (response) {
                            //success
                            console.log(response.data);
                            var data = response.data;
                            if (data.Fail == false) {
                                if (data.Output != "" && data.Output != undefined) {
                                    generalFunctions.HideLoading();
                                    generalFunctions.toast("Your file has been successfully uploaded!");
                                    RefreshCompanyLogo(data.Output);
                                }

                            } else {
                                generalFunctions.toast(msg);
                                generalFunctions.HideLoading();
                            }
                        },
                        function (response) {
                            //fail
                            console.log(response);
                            generalFunctions.HideLoading();
                            generalFunctions.toast(msg);
                        });
                } else {
                    //fail
                    generalFunctions.CustomisedReLoginAlert();

                }
            },
            function (response) {
                //fail
                generalFunctions.CustomisedReLoginAlert();
            });
    }

    sharedService.RemoveCompanyLogo = function () {
        sharedService.CheckLoginCodeIsActive(sharedService.AccountInfo.LoginCode)
            .then(function (response) {
                //success
                if (response.passed == true) {
                    var msg = "Failed remove your company logo!";
                    var jData = {};
                    jData.Username = sharedService.AccountInfo.Username;
                    var url = sharedService.ServerURL + "RemoveCompanyLogo";
                    $http({
                        url: url,
                        method: "POST",
                        data: JSON.stringify(jData),
                        cache: false,
                        responseType: "json"
                    })
                        .then(function (response) {
                            //success
                            console.log(response.data);
                            var success = response.data;
                            if (success == true) {
                                generalFunctions.HideLoading();
                                generalFunctions.toast("Your company logo has been successfully removed!");
                                RefreshCompanyLogo("");

                            } else {
                                generalFunctions.toast(msg);
                                generalFunctions.HideLoading();
                            }
                        },
                        function (response) {
                            //fail
                            console.log(response);
                            generalFunctions.HideLoading();
                            generalFunctions.toast(msg);
                        });
                } else {
                    //fail
                    generalFunctions.CustomisedReLoginAlert();

                }
            },
            function (response) {
                //fail
                generalFunctions.CustomisedReLoginAlert();
            });
    }

    function fetchProductGrouping(UserID, Username, LoginCode, RegionID, LanguageID) {
        //generalFunctions.ShowLoading("Fetching filter lists...");
        var jData = {};
        jData.ApplicationID = sharedService.ApplicationID;
        jData.UserID = UserID;
        jData.Username = Username;
        jData.RegionID = sharedService.AccountInfo.RegionID;
        jData.Code = LoginCode;
        jData.IsEN1822Filter = false;
        jData.System = "";
        var url = sharedService.ServerURL + "LoadFilterGroup";
        $http({
            url: url,
            method: "POST",
            data: JSON.stringify(jData),
            cache: false,
            responseType: "json"
        })
            //success
            .then(function (response) {
                console.log(response.data);
                sharedService.dataEntries.FilterGroup = response.data;
                GeneralSharedServices.UpdateDataEntriesFromServer();
                var PageMenu = lccFunctions.GetPageMenu();
                GeneralSharedServices.ProjectChangePage(PageMenu[0].name);
                //sharedService.TriggerTranslationEvent(sharedService.AccountInfo.LanguageID);
                generalFunctions.HideLoading();
                generalFunctions.toast("Application successfully loaded!");
                generalFunctions.ClosePopup("popupLogin");
                generalFunctions.HideSplashScreen(100);
                sharedService.verifyLoginCodeFirstTime = false;
                setTimeout(function () {
                    sharedService.UpdateLoadingPageFlag(false);
                }, 100);
            },
            function (response) {
                //fail
                console.log(response);
                sharedService.UpdateLoadingPageFlag(false);
                generalFunctions.HideLoading();
                sharedService.TriggerLoadDataFromServer = false;
                generalFunctions.toast("Failed to load application! Please try again.");
                $rootScope.$broadcast("TriggerLoginPopupEvent");
            });

    }

    sharedService.FetchALLSelectionData = function (UserID, Username, LoginCode, RegionID, LanguageID) {
        if (sharedService.TriggerLoadDataFromServer == false) {
            generalFunctions.ShowLoading("Loading application data...");
            sharedService.TriggerLoadDataFromServer = true;
            var jData = {};
            jData.ApplicationID = sharedService.ApplicationID;
            jData.UserID = UserID;
            jData.RegionID = RegionID;
            jData.LanguageID = 1;//LanguageID;
            jData.Username = Username;
            jData.Code = LoginCode;
            var url = sharedService.ServerURL + "LoadAllLCCPowerSelectionData";
            $http({
                url: url,
                method: "POST",
                data: JSON.stringify(jData),
                cache: false,
                responseType: "json"
            })
                .then(function (response) {
                    //success
                    console.log(response.data);
                    sharedService.LoadDataFromServerCompleted = true;
                    sharedService.colDataFromServer = response.data;
                    //sharedService.UpdateLoadingPageFlag(false);
                    sharedService.dataEntries = sharedService.UpdateDataEntries(sharedService.AccountInfo.UnitID);

                    fetchProductGrouping(UserID, Username, LoginCode, RegionID, LanguageID);
                },
                function (response) {
                    //fail
                    console.log(response);
                    sharedService.UpdateLoadingPageFlag(false);
                    generalFunctions.HideLoading();
                    sharedService.TriggerLoadDataFromServer = false;
                    generalFunctions.toast("Failed to load application! Please try again.");
                    $rootScope.$broadcast("TriggerLoginPopupEvent");
                });
        }
    }


    sharedService.UpdateDataEntries = function (unitId) {
        var dataEntries = lccElements.dataEntriesFromServerElement();
        dataEntries.General = sharedService.colDataFromServer.Selection.General;
        dataEntries.GasTurbineGroup = sharedService.colDataFromServer.GasTurbineGroup;
        var dataServer = undefined;
        if (unitId == 1) {
            dataServer = sharedService.colDataFromServer.Selection.DataEntriesForSI;
        } else {
            dataServer = sharedService.colDataFromServer.Selection.DataEntriesForUS;
        }
        dataEntries.GasTurbine = dataServer.Gasturbine;
        dataEntries.RunningCond = dataServer.RunningCond;
        dataEntries.SolutionToCompare = dataServer.SolutionToCompare;
        dataEntries.CostsRates = dataServer.CostsRates;

        return dataEntries;
    }

    //sharedService.TotalFilterStageChanged = function (type) {
    //    sharedService.totalFilterStageChanged = {
    //        filterSolution: true,
    //        costsRates: true,
    //    }
    //}

    sharedService.CheckUpdateSelectionListEventCompleted = function () {
        if (sharedService.UpdateSelectionListEventCompleted.projectInfo == true &&
            sharedService.UpdateSelectionListEventCompleted.gasTurbine == true && 
            sharedService.UpdateSelectionListEventCompleted.runningCond == true && 
            sharedService.UpdateSelectionListEventCompleted.filterSolution == true && 
            sharedService.UpdateSelectionListEventCompleted.costsRates == true ){
            sharedService.UpdateSelectionListEventCompleted.ALL = true;
            GeneralSharedServices.UpdateDataEntriesFromServerCompleted();
        }
    }

    sharedService.CheckUpdateUnitMeasurementSettingEventCompleted = function () {
        if (sharedService.UnitMeaChanged.GasTurbine == true &&
            sharedService.UnitMeaChanged.RunningCond == true &&
            sharedService.UnitMeaChanged.FilterSolution == true &&
            sharedService.UnitMeaChanged.CostRate== true ) {
            generalFunctions.HideLoading();
            var PageMenu = lccFunctions.GetPageMenu();
            if (GeneralSharedServices.PageName == PageMenu[5].name || GeneralSharedServices.PageName == PageMenu[6].name) {
                sharedService.CheckNeedToGenerateResult(true, true);
            } else {
                if (GeneralSharedServices.PageName == PageMenu[3].name) {
                    $("#ancpageSolutionsToCompare").trigger('click');
                }
            }
        }
    }

    sharedService.UpdateResultsStatus = function (resultsReady) {
        sharedService.ResultsReady = resultsReady;
    }

    sharedService.CheckNeedToGenerateResult = function (showMsg, forceGenerateResult) {
        var PageMenu = lccFunctions.GetPageMenu();
        var pass = false;
        if (forceGenerateResult == true) {
            sharedService.ClearResultGeneratingStatus(false);
        }
        if (sharedService.ResultsReady == false || forceGenerateResult == true) {
            var page = [PageMenu[1].name, PageMenu[2].name, PageMenu[3].name]; //gas turbine, running condition, solutions to compare
            for (var i = 0; i < page.length; i++) {
                if (sharedService.ValidateEntriesForEachPage(page[i], showMsg) == true) {
                     break;
                }
            }
            if (sharedService.failValidationPage != "") {
                GeneralSharedServices.PageName = sharedService.failValidationPage;
                generalFunctions.ChangePageMenu(sharedService.failValidationPage, PageMenu);
                generalFunctions.ChangePage(sharedService.failValidationPage, "none", false);
                GeneralSharedServices.FailValidationEvent();
            } else {
                sharedService.Results = undefined;
                GeneralSharedServices.ResultsReadyEvent();
                sharedService.TriggerCalculation( "UPLOAD ALL PARAMS TO SERVER", true);
            }
        }
    }

   sharedService.ValidateEntriesForEachPage = function (page,showMsg) {
        var PageMenu = lccFunctions.GetPageMenu();
        var failPage = "";
        var failSolution = 0;
        var msg = "";
        switch (page) {
            case PageMenu[0].name: //Project info
                if (sharedService.Params.projectName == undefined || sharedService.Params.projectName == "") {
                    msg = "Project name is required!";
                    failPage = PageMenu[0].name;
                }
                break;
            case PageMenu[1].name: //Gas turbine
                var fail = false;
                var gasTurbine = sharedService.Params.gasTurbine;
                var fields = ["Turbine", "Downtime filter replacement", "Price of Mwh Sold", "Output", "Reduction of output", "Heat rate increase", "dP-System", "Heat rate of engine", "Cost of fuel", "Time off line for fouled compressor washing", "Total system air flow"];
                var values = [gasTurbine.modelId, gasTurbine.downtimeFilterReplacement, gasTurbine.energySoldPrice, gasTurbine.output, gasTurbine.reductionOfOutput, gasTurbine.heatRateIncrease, gasTurbine.dPSystem, gasTurbine.heatRateOfEngine, gasTurbine.fuelCost, gasTurbine.timeOffFouledCompressorWashing, gasTurbine.totalSystemAirflow];
                for (var i = 0; i < fields.length; i++) {
                    var val = generalFunctions.GetNumber(values[i], false);
                    switch (fields[i]){
                        case "dP-System":
                        case "Cost of fuel":
                            if (val < 0) {
                                if (msg != '') {
                                    msg = msg + "<br/>";
                                }
                                msg = msg + "* " + fields[i];
                                fail = true;
                            }
                            break;
                        default:
                            if (val <= 0) {
                                if (msg != '') {
                                    msg = msg + "<br/>";
                                }
                                msg = msg + "* " + fields[i];
                                fail = true;
                            }
                            break;
                    }
                }
                if (fail == true) {
                    failPage = PageMenu[1].name;
                }
                break;
            case PageMenu[2].name: //Running condition
                var fail = false;
                var runningCond = sharedService.Params.runningCond;
                var fields = ["Fan system operating", "Time at base load", "Time at part load", "LCC period"];
                var values = [runningCond.fanSystemOperating, runningCond.timeBaseLoad, runningCond.timePartLoad, runningCond.lccPeriod];
                for (var i = 0; i < fields.length; i++) {
                    var cond = true;
                    if (fields[i] = "Time at part load") {
                        if (runningCond.turbineOperationTimeMode == "BASELOAD") {
                            cond = false;
                        }
                    }
                    if (cond == true) {
                        var val = generalFunctions.GetNumber(values[i], false);
                        if (val <= 0) {
                            if (msg != '') {
                                msg = msg + "<br/>";
                            }
                            msg = msg + "* " + fields[i];
                            fail = true;
                        }
                    }
                }
                if (fail == true) {
                    failPage = PageMenu[2].name;
                }
                break;
            case PageMenu[3].name: //Solutions to compare
                var fail = false;
                var filterSolutions = sharedService.Params.filterSolutions;
                //check filter exists
                for (var i = 0; i < filterSolutions.totalSolution; i++) {
                    var solution = filterSolutions.solutions[i];
                    var foundFilter = false;
                    for (var j = 0; j < solution.totalStage; j++) {
                        var filterInfo = solution.filters[j];
                        if (filterInfo.filterID > 0) {
                            foundFilter = true;
                            break;
                        }
                        if (j == solution.totalStage - 1) {
                            if (foundFilter == false) {
                                msg = solution.solutionName + ": Filter missing!";
                                failSolution = i + 1;
                                fail = true;
                                break;
                            }
                        }
                    }
                    if (fail == true) {
                        failPage = PageMenu[3].name;
                        break;
                    } 
                }
                if (failPage == false) {
                    //check input entries for each filter
                    for (var i = 0; i < filterSolutions.totalSolution; i++) {
                        var solution = filterSolutions.solutions[i];
                        var foundFilter = false;
                        for (var j = 0; j < solution.totalStage; j++) {
                            var filterInfo = solution.filters[j];
                            if (filterInfo.filterID > 0) {
                                var fields = ["Exchange interval", "No of filter", "Filter price"];
                                var values = [filterInfo.exchangeValue, filterInfo.noOfFilter, filterInfo.price];
                                var msg2 = "";
                                for (var x = 0; x < fields.length; x++) {
                                    var val = generalFunctions.GetNumber(values[x], false);
                                    if (val <= 0) {
                                        if (msg2 != '') {
                                            msg2 = msg2 + "<br/>";
                                        }
                                        msg2 = msg2 + "* " + fields[x];
                                        fail = true;
                                    }
                                    if (x == fields.length - 1) {
                                        if (msg2 != "") {
                                            if (msg != '') {
                                                msg = msg + "<br/>";
                                            }
                                            msg = msg + generalFunctions.GetStageName(j + 1) + "<br/>" + msg2;
                                        }
                                    }
                                }
                            }
                        }
                        if (fail == true) {
                            failPage = PageMenu[3].name;
                            failSolution = i + 1;
                            break;
                        }
                    }
                }
                break;
            case PageMenu[4].name: //Costs / Rates
                break;

        }
        sharedService.failValidationPage = failPage;
        sharedService.failSolution = failSolution;
        if (showMsg == true) {
            if (msg != '') {
                msg = "Please fill up value for all required fields:" + "<br/>" + msg;
                if (failSolution > 0) {
                    var solution = sharedService.Params.filterSolutions.solutions[failSolution-1];
                    msg = solution.solutionName + "<br/>" + msg;
                }
                generalFunctions.msgBox("Generate results", msg,"error");
            }
        }
        return fail;
    }

   function CompileDataForCalculation(generateResults, generateReport, saveCalculation) {
       var Data = {};
       Data.UnitID = sharedService.Params.setting.unit.unitId;
       Data.CurrencyID = sharedService.Params.setting.currency.id;

       //Gas turbine
       var gasTurbineParams = sharedService.Params.gasTurbine;
       var GasTurbine = {};
       GasTurbine.ManufacturerId = generalFunctions.GetNumber(gasTurbineParams.manufacturerId);
       GasTurbine.Manufacturer = gasTurbineParams.manufacturer
       GasTurbine.ModelId = generalFunctions.GetNumber(gasTurbineParams.modelId);
       GasTurbine.Turbine = gasTurbineParams.turbine;
       GasTurbine.Model = gasTurbineParams.model;
       GasTurbine.Year = gasTurbineParams.year;
       GasTurbine.IsoBaseRating = generalFunctions.GetNumber(gasTurbineParams.IsoBaseRating);
       GasTurbine.HeatRate = generalFunctions.GetNumber(gasTurbineParams.heatRate);
       GasTurbine.PressRatio = generalFunctions.GetNumber(gasTurbineParams.pressRatio);
       GasTurbine.MassFlow = generalFunctions.GetNumber(gasTurbineParams.massFlow);
       GasTurbine.TurbineSpeed = generalFunctions.GetNumber(gasTurbineParams.turbineSpeed);
       GasTurbine.TurbineInletTemp = gasTurbineParams.turbineInletTemp;
       GasTurbine.ExhaustTemp = gasTurbineParams.exhaustTemp;
       GasTurbine.ApproximateWeight = gasTurbineParams.approximateWeight;
       GasTurbine.Approximate = gasTurbineParams.approximate;
       GasTurbine.AirDensity = generalFunctions.GetNumber(gasTurbineParams.airDensity);
       GasTurbine.Comments = gasTurbineParams.comments;
       GasTurbine.DowntimeFilterReplacement = generalFunctions.GetNumber(gasTurbineParams.downtimeFilterReplacement);
       GasTurbine.EnergySoldPrice = generalFunctions.GetNumber(gasTurbineParams.energySoldPrice);
       GasTurbine.PriceIncrease = generalFunctions.GetNumber(gasTurbineParams.priceIncrease);
       GasTurbine.Output = generalFunctions.GetNumber(gasTurbineParams.output);
       GasTurbine.ReductionOfOutput = generalFunctions.GetNumber(gasTurbineParams.reductionOfOutput);
       GasTurbine.HeatRateIncrease = generalFunctions.GetNumber(gasTurbineParams.heatRateIncrease);
       GasTurbine.DPSystem = generalFunctions.GetNumber(gasTurbineParams.dPSystem);
       GasTurbine.HeatRateOfEngine = generalFunctions.GetNumber(gasTurbineParams.heatRateOfEngine);
       GasTurbine.HeatRateOfEngineUnit = gasTurbineParams.heatRateOfEngineUnit;
       GasTurbine.FuelCost = generalFunctions.GetNumber(gasTurbineParams.fuelCost);
       GasTurbine.FuelCostUnit = gasTurbineParams.fuelCostUnit;
       GasTurbine.TimeOffFouledCompressorWashing = generalFunctions.GetNumber(gasTurbineParams.timeOffFouledCompressorWashing);
       GasTurbine.WaterWashCost = generalFunctions.GetNumber(gasTurbineParams.waterWashCost);
       GasTurbine.TotalSystemAirflow = generalFunctions.GetNumber(gasTurbineParams.totalSystemAirflow);
       Data.GasTurbine = GasTurbine;

       //Running Condition
       var runningCondParams = sharedService.Params.runningCond;
       var RunningCond = {};
       RunningCond.RuntimeOfSystem = generalFunctions.GetNumber(runningCondParams.fanSystemOperating);
       RunningCond.LccPeriod = generalFunctions.GetNumber(runningCondParams.lccPeriod);
       //RunningCond.TotalSystemAirflow = generalFunctions.GetNumber(runningCondParams.totalSystemAirflow);
       RunningCond.OutdoorEnvironment = {
           ID: generalFunctions.GetNumber(runningCondParams.outdoorConc.id),
           Display: runningCondParams.outdoorConc.display,
           Value: generalFunctions.GetNumber(runningCondParams.outdoorConc.value),
           ExtraValue: generalFunctions.GetNumber(runningCondParams.outdoorConc.extraValue)
       };
       RunningCond.TurbineOperationTimeMode = runningCondParams.turbineOperationTimeMode;
       RunningCond.TimeBaseload = generalFunctions.GetNumber(runningCondParams.timeBaseLoad);
       RunningCond.TimePartload = generalFunctions.GetNumber(runningCondParams.timePartLoad);
       RunningCond.MajorMaintenanceInterval = generalFunctions.GetNumber(runningCondParams.majorMaintenanceInterval);
       RunningCond.MajorMaintenanceCost = generalFunctions.GetNumber(runningCondParams.majorMaintenanceCost);
       Data.RunningCond = RunningCond;

       //Solution to compare
       var solutionsToCompareParams = sharedService.Params.filterSolutions;
       var SolutionsToCompare = {};
       SolutionsToCompare.TotalSolution = solutionsToCompareParams.totalSolution;
       var Solutions = [];
       for (var i = 0; i < solutionsToCompareParams.totalSolution; i++) {
           var sol = solutionsToCompareParams.solutions[i];
           var Sol = {};
           Sol.Solution = sol.solution;
           Sol.SolutionName = sol.solutionName;
           Sol.TotalStage = sol.totalStage;
           Sol.FilterLifetimeCriteria = sol.filterLifetimeCriteria;
           Sol.WaterWashInterval = generalFunctions.GetNumber(sol.waterWashInterval);
           Sol.StopServiceFilter1 = sol.stopServiceFilter1;
           Sol.StopServiceFilter2 = sol.stopServiceFilter2;
           Sol.StopServiceFilter3 = sol.stopServiceFilter3;
           var Filters = [];
           for (var x = 0; x < sol.totalStage; x++) {
               var filter = sol.filters[x];
               var Filter = {};
               Filter.Solution = generalFunctions.GetNumber(filter.solution);
               Filter.Stage = generalFunctions.GetNumber(filter.stage);
               Filter.FilterGroupID = generalFunctions.GetNumber(filter.filterGroupID);
               Filter.FilterTypeID = generalFunctions.GetNumber(filter.filterTypeID);
               Filter.FilterID = generalFunctions.GetNumber(filter.filterID);
               Filter.ExchangeValue = generalFunctions.GetNumber(filter.exchangeValue);
               Filter.NoOfFilter = generalFunctions.GetNumber(filter.noOfFilter);
               Filter.FilterPrice = generalFunctions.GetNumber(filter.price);
               Filter.HousingCost = generalFunctions.GetNumber(filter.costs.housing);
               Filter.LaborCost = generalFunctions.GetNumber(filter.costs.labor);
               Filter.WasteHandlingCost = generalFunctions.GetNumber(filter.costs.wasteHandling);
               Filters.push(Filter);
           }
           Sol.Filters = Filters;
           Solutions.push(Sol);
       }
       SolutionsToCompare.Solutions = Solutions;
       Data.SolutionsToCompare = SolutionsToCompare;

       //Costs Rates
       var costsRatesParams = sharedService.Params.costsRates;
       var CostsRates = {};
       CostsRates.FilterPriceIncrease = generalFunctions.GetNumber(costsRatesParams.filterPriceIncrease);
       CostsRates.LaborCostIncrease = generalFunctions.GetNumber(costsRatesParams.laborCostIncrease);
       CostsRates.WasteHandlingIncrease = generalFunctions.GetNumber(costsRatesParams.wasteHandlingIncrease);
       CostsRates.NpvDiscountRate = generalFunctions.GetNumber(costsRatesParams.npvDiscountRate);
       Data.CostsRates = CostsRates;

       //Compare solution
       var compareSolutionParams = sharedService.Params.compareSolutions;
       var compareParams = [];
       if (compareSolutionParams != undefined) {
           if (compareSolutionParams.length > 0 ) {
               for (var x = 0; x < compareSolutionParams.length; x++) {
                   if ($.isNumeric(compareSolutionParams[x]) == true) {
                       compareParams.push(compareSolutionParams[x]);
                   }
               }
           }
       }
       Data.CompareSolutions = compareParams;

       return Data;
   }

   sharedService.TriggerCalculation = function (action, showLoading) {
       sharedService.CheckLoginCodeIsActive(sharedService.AccountInfo.LoginCode)
           .then(function (response) {
               //success
               if (response.passed == true) {
                   if (showLoading == undefined) {
                       showLoading = false;
                   }
                   sharedService.ShowResults(false, action, showLoading, true);
                   switch (action) {
                       case "UPLOAD ALL PARAMS TO SERVER":
                           sharedService.ServerDataReady = false;
                           sharedService.ServerData = CompileDataForCalculation(true,false,false);
                           sharedService.UploadServerData2TempStringStorage(sharedService.ServerData, "UPLOAD ALL PARAMS TO SERVER", true);
                           break;
                       case "GENERATE ALL RESULTS":
                           sharedService.generatingAllResults = true;
                           sharedService.TriggerCalculationAtServer(true);
                           break;
                   }
               } else {
                   //fail
                   generalFunctions.CustomisedReLoginAlert();

               }
           },
           function (response) {
               //fail
               generalFunctions.CustomisedReLoginAlert();
           });
   }
    
   sharedService.ShowResults = function (show, action, showLoadingMsg, updateStatus) {
       if (updateStatus == undefined) {
           updateStatus = true;
       }
       if (show == false) {
           switch (action) {
               case "UPLOAD ALL PARAMS TO SERVER":
               case "GENERATE ALL RESULTS":
                   if (showLoadingMsg == true) {
                       generalFunctions.ShowLoading("Generating results...");
                   }
                   break;
           }
       } else {
           switch (action) {
               case "UPLOAD ALL PARAMS TO SERVER":
               case "GENERATE ALL RESULTS":
                   if (sharedService.ResultsReady == true) {
                       generalFunctions.HideLoading();
                   }
                   break;
           }

       }
   }

   sharedService.UploadServerData2TempStringStorage = function (jData, ProcessName, BroadCast) {
       if (sharedService.UploadingEntry == false) {
           sharedService.UploadingEntry = true;
           sharedService.TempStringStorageID = "";
           sharedService.TempStringStorageTotalSeq = 0;
           sharedService.TempStringStorageTotalPass = 0;
           sharedService.TempStringStorageTotalFail = 0;
           sharedService.TempStringStorageProcessName = "";
           if (jData != undefined) {
               var strJData = JSON.stringify(jData);
               var totalLength = strJData.length;
               var totalCharUpload = 3072;//1024;
               var totalSeq = 1;
               if (totalLength > totalCharUpload) {
                   totalSeq = Math.floor(totalLength / totalCharUpload);
                   if ((totalLength / totalCharUpload) % 1 > 0) {
                       totalSeq = totalSeq + 1;
                   }
               }
               sharedService.TempStringStorageProcessName = ProcessName;
               sharedService.TempStringStorageID = generalFunctions.uuid.new();
               sharedService.TempStringStorageTotalSeq = totalSeq;
               sharedService.TempStringStorageTotalPass = 0;
               sharedService.TempStringStorageTotalFail = 0;
               for (var i = 0; i < totalSeq; i++) {
                   var tStr = "";
                   var tStartChar = i * totalCharUpload;
                   if (i < (totalSeq - 1)) {
                       tStr = strJData.substr(tStartChar, totalCharUpload);
                   } else {
                       tStr = strJData.substr(tStartChar, totalLength - tStartChar);
                   }
                   var url = sharedService.ServerURL + "TempStringStorage";
                   var tData = {};
                   tData.ID = sharedService.TempStringStorageID;
                   tData.TempString = tStr;
                   tData.Seq = i + 1;
                   $http({
                       url: url,
                       method: "POST",
                       data: JSON.stringify(tData),
                       cache: false,
                       responseType: "json"
                   })
                       .then(function (response) {
                           //success
                           console.log("Success-Upload Data to Server: " + ProcessName);
                           if (response.data.toString().toLowerCase() == "true") {
                               sharedService.TempStringStorageTotalPass = sharedService.TempStringStorageTotalPass + 1;
                           } else {
                               sharedService.TempStringStorageTotalFail = sharedService.TempStringStorageTotalFail + 1;
                           }
                           sharedService.RunProcess(BroadCast);
                       },
                       function (response) {
                           //fail
                           console.log("Failed-Upload Data to Server: " + ProcessName);
                           console.log(response);
                           sharedService.TempStringStorageTotalFail = sharedService.TempStringStorageTotalFail + 1;
                           sharedService.RunProcess(BroadCast);
                       });
               }
           }
       }
   }

   sharedService.RunProcess = function (BroadCast) {
       if (sharedService.TempStringStorageTotalPass == sharedService.TempStringStorageTotalSeq) {
           if (BroadCast == true) {
               sharedService.UploadingEntry = false;
               $rootScope.$broadcast("RunProcessSuccessEvent");
           }
       } else {
           if ((sharedService.TempStringStorageTotalPass + sharedService.TempStringStorageTotalFail) == sharedService.TempStringStorageTotalSeq) {
               if (BroadCast == true) {
                   sharedService.UploadingEntry = false;
                   $rootScope.$broadcast("RunProcessFailEvent");
               }
           }
       }
   }

   sharedService.TriggerCalculationAtServer = function (showMsg) {
       if (sharedService.ServerDataReady == true) {
           var jData = {};
           jData.ApplicationID = sharedService.ApplicationID;
           jData.UserID = sharedService.AccountInfo.UserID
           jData.Username = sharedService.AccountInfo.Username;
           jData.Code = sharedService.AccountInfo.LoginCode;
           jData.TempStringStorageID = sharedService.TempStringStorageID;
           jData.TotalSeq = sharedService.TempStringStorageTotalSeq;
           jData.LanguageID = sharedService.SelectedLanguageID;
           jData.RegionID = sharedService.AccountInfo.RegionID;
           var url = sharedService.ServerURL + "LCCPowerGenerateSummaryResults";
           $http({
               url: url,
               method: "POST",
               data: JSON.stringify(jData),
               cache: false,
               responseType: "json"
           })
               .then(function (response) {
                   //success
                   console.log("Success-Generate Summary Results");
                   console.log(response.data);
                   var results = response.data;
                   var allPassed = true;
                   var resultReady = false;
                   //sharedService.Results = elements.creoInitialResults();
                   var msg=[];
                   if (results != undefined) {
                       sharedService.Results = results;
                       if (results.Fail == false) {
                           resultReady = true;
                       }
                       if (showMsg == true) {
                           for (var v = results.Solutions.length - 1; v >=0 ; v--) {
                               var sol = results.Solutions[v];
                               if (sol.MsgCollection.length > 0) {
                                   for (var w = 0; w < sol.MsgCollection.length; w++) {
                                       var temp2 = sol.MsgCollection[w];
                                       var cond = true;
                                       if (sol.Fail == true && temp2.Fail == false) {
                                           cond = false;
                                       }
                                       if (cond == true) {
                                           msg.push(temp2);
                                       }
                                   }
                               }
                           }
                           if (msg.length > 0) {
                               for (var z = 0; z < msg.length; z++) {
                                   var temp2 = msg[z];
                                   var type = "error";
                                   if (temp2.Fail == false) {
                                        type = "info";
                                   }
                                   generalFunctions.msgBox("Solution " + temp2.SolutionType + " (" + generalFunctions.GetStageName(generalFunctions.OnlyNum(temp2.Stage)) + ")", temp2.Msg, type);
                               }
                           }
                       }
                   }
                   if (resultReady == false) {
                       console.log("Failed-Generate Summary Results");
                       //generalFunctions.toast("Failed to generate results");
                       generalFunctions.msgBox("Results", "Failed to generate results", "error");
                   }
                   sharedService.ClearResultGeneratingStatus(resultReady, true);
                   generalFunctions.HideLoading();
               },
               function (response) {
                   //fail
                   sharedService.Results = undefined;
                   console.log("Failed-Generate Summary Results");
                   console.log(response);
                   generalFunctions.HideLoading();
                   sharedService.ClearResultGeneratingStatus(false);
                   generalFunctions.toast("Failed to generate results");
               });
       }
   }

   sharedService.ClearResultGeneratingStatus = function (resultReady, updateResults) {
       sharedService.ServerData = undefined;
       sharedService.generatingAllResults = false;
       sharedService.ServerDataReady = false
       sharedService.ResultsReady = resultReady;
       sharedService.ResultsFailed = false;
       if (resultReady == false) {
           if (sharedService.Results != undefined) {
               sharedService.ResultsFailed = sharedService.Results.Fail;
           }
           sharedService.Results = undefined;
       } 
       if (updateResults == true) {
           GeneralSharedServices.ResultsReadyEvent();
       }
   }
    return sharedService;
});