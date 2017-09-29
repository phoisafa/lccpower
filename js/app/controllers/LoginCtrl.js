"use strict";

app.controller("LoginCtrl", function ($scope, $http, $q, $filter, generalFunctions, DataCollectionSharedService, GeneralSharedServices, lccFunctions) {
    $scope.login = {
        emailID: "fan.phoisan@camfil.com", //development
        password: "Camfil@12"
        //emailID: "", //Server
        //password: ""
    };
    $scope.infoDetails = [];
    $scope.CompanyLogo = "";

    var LoginCode = "";
    var AccountInfo = undefined;

    //$scope.$on("PerformLoginEvent", function () {
    //    PerformLogin();
    //});
    $scope.$on("PerformLoginEvent", function () {
        console.log("PerformLoginEvent");
        //PerformLogin();
        //ByPassAuthentication();
        var LoginCodeParam = generalFunctions.GetURLParameterByName("AccessCode");
        console.log("LoginCode from URL=" + LoginCodeParam);
        if (LoginCodeParam != null && LoginCodeParam != "") {
            console.log("Store login code into cookie");
            generalFunctions.SetCookie("CFSSLoginCode", LoginCodeParam);
            console.log("CFSSLoginCode=" + LoginCodeParam);
            console.log("Store login code into cookie-SUCCESS");
            console.log("Reload page without login code");
            window.location.replace(DataCollectionSharedService.AppURL);
        } else {
            if (DataCollectionSharedService.verifyLoginCodeFirstTime == false) {
                console.log("Check login code from cookie");
                LoginCodeParam = generalFunctions.CheckCookie("CFSSLoginCode");
                console.log("CFSSLoginCode=" + LoginCodeParam);
                console.log("Check login code from cookie-SUCCESS");
                if (LoginCodeParam != "") {
                    console.log("Get login code from cookie");
                    generalFunctions.ShowLoading("Validate user authentication...");
                    DataCollectionSharedService.LoginCodeRemainingActiveSecond(LoginCodeParam);
                } else {
                    console.log("No login code in cookie");
                    PerformLogin();
                }
            }
        }
    });

    $scope.$on("TriggerLoginPopupEvent", function () {
        generalFunctions.HideLoading();
        PerformLogin();
    });

    $scope.$on("TriggerByPassAuthenticationEvent", function () {
        if (DataCollectionSharedService.tmpLoginCode != undefined && DataCollectionSharedService.verifyLoginCodeFirstTime == false) {
            DataCollectionSharedService.verifyLoginCodeFirstTime = true;
            LoginCode = DataCollectionSharedService.tmpLoginCode.LoginCode;
            ByPassAuthentication(LoginCode);
        } else {
            if (DataCollectionSharedService.verifyLoginCodeFirstTime == false) {
                generalFunctions.HideLoading();
                PerformLogin();
            }
        }


        //        LoginCode = DataCollectionSharedService.tmpLoginCode.LoginCode;
        //        ByPassAuthentication(LoginCode);
        //DataCollectionSharedService.tmpLoginCode = "";
    });

    function ByPassAuthentication(LoginCode) {
        console.log("Success:LoginCode =" + LoginCode);
        if (LoginCode != "") {
            $scope.GetAccessRight(LoginCode)
            .then(function (response) {
                var foundApp = true;
                //var foundApp = false
                //var Info = response;
                //if (Info != undefined) {
                //    for (var i = 0; i < Info.length; i++) {
                //        if (Info[i].ApplicationID == DataCollectionSharedService.ApplicationID) {
                //            if (Info[i].Approved == true) {
                //                foundApp = true;
                //                break;
                //            }
                //        }
                //    }
                //}
                if (foundApp == true) {
                    DataCollectionSharedService.UpdateLoadingPageFlag(true);
                    GetUserInfo();
                } else {
                    LoginCode = "";
                    FailSignIn(true);
                }
            }, function (response) {
                LoginCode = "";
                FailSignIn(true);
            });
        } else {
            FailSignIn(true);
        }
    }

    function PerformLogin() {
        ////Server-START
        //$scope.login.password = "";
        //setTimeout(function () {
        //    generalFunctions.OpenPopup("popupLogin");
        //}, 10);
        //$("#popupLogin").bind({
        //    popupafterclose: function (event, ui) {
        //        if (DataCollectionSharedService.AccountInfo == undefined) {
        //            ResetUserInfo();
        //            $scope.login.password = "";
        //            setTimeout(function () {
        //                generalFunctions.OpenPopup("popupLogin");
        //            }, 10);
        //        }
        //    }
        //});
        ////Server-END
        //Development-START
        setTimeout(function () {
            generalFunctions.OpenPopup("popupLogin");
        }, 10);
        $("#popupLogin").bind({
            popupafterclose: function (event, ui) {
                if (DataCollectionSharedService.AccountInfo == undefined) {
                    setTimeout(function () {
                        generalFunctions.OpenPopup("popupLogin");
                    }, 10);
                }
            }
        });
        //Development-END
    }

    $scope.SignIn = function (isValid, event) {
        generalFunctions.ShowLoading("Signing in...");
        event.preventDefault();
        if (isValid) {
            var jData = {};
            jData.pValidate = {};
            jData.pValidate.EmailID = $scope.login.emailID;
            jData.pValidate.Password = $scope.login.password;
            $scope.login.password = "";
            $http({
                url: DataCollectionSharedService.ServerDomain + "ValidateAccount2",
                method: "POST",
                data: JSON.stringify(jData),
                cache: false,
                responseType: "json"
            })
            .then(function (response) {
                //success
                console.log(response);
                //alert("Success: " + response.data);
                LoginCode = response.data.LoginCode;
                if (LoginCode != "") {
                    $scope.GetAccessRight(LoginCode)
                    .then(function (response) {
                        var foundApp = true;
                        //var foundApp = false
                        //var Info = response;
                        //if (Info != undefined) {
                        //    for (var i = 0; i < Info.length; i++) {
                        //        if (Info[i].ApplicationID == DataCollectionSharedService.ApplicationID) {
                        //            if (Info[i].Approved == true) {
                        //                foundApp = true;
                        //                break;
                        //            }
                        //        }
                        //    }
                        //}
                        if (foundApp == true) {
                            DataCollectionSharedService.UpdateLoadingPageFlag(true);
                            console.log("Store login code into cookie");
                            generalFunctions.SetCookie("CFSSLoginCode", LoginCode);
                            console.log("CFSSLoginCode=" + LoginCode);
                            console.log("Store login code into cookie-SUCCESS");
                            GetUserInfo();
                        } else {
                            LoginCode = "";
                            FailSignIn(true);
                        }
                    }, function (response) {
                        LoginCode = "";
                        FailSignIn(true);
                    });
                } else {
                    FailSignIn(true);
                }
            },
            function (response) {
                //fail
                console.log(response.status);
                FailSignIn(true);
                //alert("Fail: " + response);
            });
        }
    }

    $scope.GetAccessRight = function (LoginCode) {
        var deferred = $q.defer();
        var jData = {};
        jData.pLoginCode = {};
        jData.pLoginCode.LoginCode = LoginCode;
        $http({
            url: DataCollectionSharedService.ServerDomain + "RetrieveAccountAccessRights",
            method: "POST",
            data: JSON.stringify(jData),
            cache: false,
            responseType: "json"
        })
        .then(function (response) {
            //success
            console.log(response);
            deferred.resolve(response.data);
        },
        function (response) {
            //fail
            console.log(response.status);
            deferred.reject(response.status);
        });
        return deferred.promise;
    }

    function FailSignIn(ShowMsg) {
        ResetUserInfo();
        generalFunctions.HideLoading();
        if (ShowMsg == true) {
            generalFunctions.toast("Failed to sign in, please try again!");
        }
    }

    function GetUserInfo() {
        if (LoginCode != "") {
            DataCollectionSharedService.LoginCodeValidationCheck(LoginCode)
                .then(function () {
                    ////Development-START
                    //var AccountInfo = {
                    //    LoginCode: "853926654d5e4ed39b6a430275890ce4",
                    //    UserID: 15,
                    //    Username: "PhoiSaFa",
                    //    Email: "fan.phoisan@camfil.com",
                    //    FirstName: "Phoi San",
                    //    LastName: "Fan",
                    //    FullName: "Fan Phoi San",
                    //    Company: "Camfil Malaysia SDN BHD",
                    //    Department: "Camfil AB - Group Research & Development",
                    //    Designation: "Software System & Application Developer",
                    //    Tel: "+ 605 366 8888 Ext-143",
                    //    Mobile: "+60165200339",
                    //    Fax: "+ 605 366 88800",
                    //    Street: "Plot 9A,Lorong Bemban 1",
                    //    City: "Batu Gajah",
                    //    State: "Perak",
                    //    Zip: "31000",
                    //    Country: "Sweden",
                    //    CountryID: 31,
                    //    Region: "EUROPE (EU)",
                    //    RegionID: 1,
                    //    Currency: "MYR",
                    //    CurrencyID: 1,
                    //    Unit: "SI",
                    //    UnitID: 1,
                    //    Language: "ENGLISH",
                    //    LanguageID: 1,
                    //    CompanyLogo: ''
                    //};
                    //DataCollectionSharedService.UpdateAccountInfo(AccountInfo);
                    //DataCollectionSharedService.GetCompanyLogo(LoginCode, AccountInfo.Username);
                    //DataCollectionSharedService.UpdateLocaleCode();
                    //DataCollectionSharedService.FetchALLSelectionData(AccountInfo.UserID, AccountInfo.Username, LoginCode, AccountInfo.RegionID, AccountInfo.LanguageID);
                    ////Development-END
                    //Server-START
                    //passed
                    var AccountInfo = null;
                    var jData = {};
                    jData.pLoginCode = {};
                    jData.pLoginCode.LoginCode = LoginCode;
                    $http({
                        url: DataCollectionSharedService.ServerDomain + "RetrieveAccountInfo",
                        method: "POST",
                        data: JSON.stringify(jData),
                        cache: false,
                        responseType: "json"
                    })
                    .then(function (response) {
                        //success
                        if (response.data != undefined) {
                            console.log(response.data);
                            var info = response.data;
                            AccountInfo = {
                                LoginCode: LoginCode,
                                UserID: info.ID,
                                Username: info.Username,
                                Email: info.Email,
                                FirstName: info.FirstName,
                                LastName: info.LastName,
                                FullName: info.FullName,
                                Company: info.Company,
                                Department: info.Department,
                                Designation: info.Designation,
                                Tel: info.Tel,
                                Mobile: info.Mobile,
                                Fax: info.Fax,
                                Street: info.Street,
                                City: info.City,
                                State: info.State,
                                Zip: info.Zip,
                                Country: info.Country,
                                CountryID: info.CountryID,
                                Region: info.Region,
                                RegionID: info.RegionID,
                                Currency: info.Currency,
                                CurrencyID: info.CurrencyID,
                                Unit: info.Unit,
                                UnitID: info.UnitID,
                                Language: info.Language,
                                LanguageID: info.LanguageID,
                                CompanyLogo: ''
                            };
                            DataCollectionSharedService.UpdateAccountInfo(AccountInfo);
                            DataCollectionSharedService.GetCompanyLogo(LoginCode, AccountInfo.Username);
                            DataCollectionSharedService.UpdateLocaleCode();
                            DataCollectionSharedService.FetchALLSelectionData(AccountInfo.UserID, AccountInfo.Username, LoginCode, AccountInfo.RegionID, AccountInfo.LanguageID);
                          
                        } else {
                            FailSignIn(true);
                        }
                    },
                    function (response) {
                        //fail
                        console.log(response.status);
                        FailSignIn(true);
                        });
                    //Server-END
                },
                function () {
                    //failed
                    FailSignIn(false);
                });
        }
    }

    //    function ClosePopup(msg) {
    //        generalFunctions.toast(msg);
    //        generalFunctions.ClosePopup("popupLogin");
    //    }

    function ResetUserInfo() {
        LoginCode = "";
        AccountInfo = undefined;
        $scope.login = {
            emailID: "",
            password: ""
        };
        DataCollectionSharedService.UpdateAccountInfo(AccountInfo);
        //$scope.$apply();
    }

    function AccountInfoElement(title, value) {
        return {
            title: title,
            value: value
        };
    }

    $scope.$on("OpenAccountInfoEvent", function () {
        OpenAccountInfo();
    });

    function OpenAccountInfo() {
        var info = DataCollectionSharedService.AccountInfo;
        if (info != undefined) {
            $scope.infoDetails = [
                AccountInfoElement("Email", info.Email),
                AccountInfoElement("Name", info.FullName),
                AccountInfoElement("Designation / Title", info.Designation),
                AccountInfoElement("Company Name", info.Company),
                AccountInfoElement("Department", info.Department),
                AccountInfoElement("Telephone no", info.Tel),
                AccountInfoElement("Mobile no", info.Mobile),
                AccountInfoElement("Fax no", info.Fax)
            ];
            //$scope.$apply();
            generalFunctions.OpenPopup("popupAccountInfo");
        }
    }

    function AccountInfoElement(title, value) {
        return {
            title: title,
            value: value
        };
    }

    var signOut = false;
    $scope.$on("PerformLogoutEvent", function () {
        $scope.SignOut();
    });

    $scope.SignOut = function () {
        if (signOut == false) {
            signOut = true;
            var info = DataCollectionSharedService.AccountInfo;
            if (info != undefined) {
                var confirmMsg = $filter('translate')("Confirm to sign out now?");
                if (confirm(confirmMsg) == true) {
                    generalFunctions.ShowLoading("Signing Out...");
                    var jData = {};
                    jData.pLoginCode = {};
                    jData.pLoginCode.LoginCode = info.LoginCode;
                    $http({
                        url: DataCollectionSharedService.ServerDomain + "SignOut",
                        method: "POST",
                        data: JSON.stringify(jData),
                        cache: false,
                        responseType: "json"
                    })
                    .then(function (response) {
                        //success
                        console.log(response);
                        SignOutSuccess();
                    },
                    function (response) {
                        //fail
                        console.log(response.status);
                        SignOutSuccess();
                    });
                }
            }
        }
    }

    function SignOutSuccess() {
        signOut = false;
        ClosePopupAccountInfo("Sign out successfully!");
        generalFunctions.ShowSplashScreen(100);
        setTimeout(function () {
            PerformLogin();
        }, 200);
    }

    function ClosePopupAccountInfo(msg) {
        generalFunctions.HideLoading();
        generalFunctions.toast(msg);
        generalFunctions.ClosePopup("popupAccountInfo");
        ResetUserInfo();
    }

    $scope.$on("UpdateCompanyLogoEvent", function () {
        $scope.CompanyLogo = DataCollectionSharedService.AccountInfo.CompanyLogo;
        //$scope.$apply();
    });

    $scope.ChangeLogo = function () {
        generalFunctions.ClosePopup("popupAccountInfo");
        setTimeout(function () {
            DataCollectionSharedService.TriggerChangeCompanyLogoEvent("Account");
        }, 1);
    }

    $scope.RemoveLogo = function () {
        DataCollectionSharedService.RemoveCompanyLogo();
    }


    $scope.$on("OpenAccountInfoPopupEvent", function () {
        OpenAccountInfo();
    });

});