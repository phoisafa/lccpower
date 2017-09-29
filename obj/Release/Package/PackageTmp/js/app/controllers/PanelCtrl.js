"use strict";

app.controller("PanelCtrl", function ($scope, $filter, generalFunctions, generalElements, DataCollectionSharedService, GeneralSharedServices, lccFunctions) {
    var strAnonymous = "Sign In";
    $scope.LoginName = strAnonymous;
    $scope.folderList = undefined;
    $scope.currentFolder = undefined;
    $scope.Action = "";
    $scope.updateFolderInfoBack2Server = [];
    $scope.newFolderName = "";
    $scope.FolderNameTitle = "";
    $scope.Title = "";
    $scope.Project = {};
    $scope.recentProjectList = [];
    $scope.projectList = [];
    $scope.triggerFromPopupSave = false;
    $scope.files = undefined;
    $scope.strSearch = $filter('translate')("SEARCH");
    $scope.aboutAppFlag = false;
    $scope.uploadFilePopupTitle = "";
    var OpenFromOptions = false;

    var PageMenu = lccFunctions.GetPageMenu();


    $scope.setPlaceholder = function (data) {
        $scope.strSearch = $filter('translate')(data);
    };

    $scope.$on("AccountInfoUpdatedEvent", function () {
        if (DataCollectionSharedService.AccountInfo != undefined) {
            $scope.LoginName = DataCollectionSharedService.AccountInfo.FullName;
        } else {
            $scope.LoginName = strAnonymous;
        }
        //$scope.$apply();
    });


    $scope.ShowSignInDialog = function () {
        if (DataCollectionSharedService.AccountInfo == undefined) {
            DataCollectionSharedService.PerformLogin();
        } else {
            GeneralSharedServices.OpenAccountInfo();
        }
    }


    $scope.NavigateToInformationPage = function () {
        var url = DataCollectionSharedService.CFSSDomainURL + 'ApplicationInformation_View.aspx?OnlineApp=1&ApplicationID=' + DataCollectionSharedService.ApplicationID + '&AccessCode=' + DataCollectionSharedService.AccountInfo.LoginCode;
        window.open(url);
    }

    $scope.TriggerUploadFileClick = function (ele) {
        setTimeout(function () {
            $("#fileToUpload").trigger('click');
        }, 10);
    }

    $scope.filesChanged = function (element) {
        $scope.files = element.files;
        //$scope.$apply();
        uploadFile();
    }

    function uploadFile() {
        generalFunctions.ClosePopup("popupUploadFile");
        generalFunctions.ShowLoading("Uploading...");
        DataCollectionSharedService.UploadFileToServer($scope.files);
    }

    function TriggerOpenPopupUploadFile() {
        $("#popupUploadFile")
            .enhanceWithin().popup()
            .bind({
                popupafteropen: function (event, ui) {
                    $("#divFileUpload div").removeClass("ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset");
                }
            })
        setTimeout(function () {
            generalFunctions.OpenPopup("popupUploadFile");
        }, 100)
    }

    $scope.$on("ChangeCompanyLogoEvent", function () {
        $scope.uploadFilePopupTitle = $filter('translate')("Upload logo");
        //$scope.$apply();
        setTimeout(function () {
            TriggerOpenPopupUploadFile();
        }, 10);
    });

});