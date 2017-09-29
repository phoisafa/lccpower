var app = angular.module("CFSS", ['ngSanitize', 'ngAnimate', 'ngTouch', 'ui.bootstrap', 'ngFileUpload', 'pascalprecht.translate'])
//app.config(['$compileProvider', function ($compileProvider) {
//    $compileProvider.debugInfoEnabled(false);
//}]);
app.config(function ($translateProvider) {
    //$translateProvider.translations('en', {
    //    "PROJECT_NAME": "Project Name",
    //    "REPORT_DATE": "Report Date"
    //});
    //$translateProvider.translations('sv', {
    //    "PROJECT_NAME": "Projektnamn",
    //    "REPORT_DATE": "Rapportdatum"
    //});
    //var ServerURL = "https://cfss.camfil.net/LCCPower"; //server
    var ServerURL = "http://localhost:54300/"; //developement
    $translateProvider
                 .useStaticFilesLoader({
                     prefix: ServerURL + '/languages/lang-',
                     suffix: '.json'
                 })
                 .registerAvailableLanguageKeys(['en'], {
                     'en-*': 'en'
                 })
                 .preferredLanguage('en')
                 .fallbackLanguage('en');
     $translateProvider.preferredLanguage('en');
});
app.run(function ($templateCache, generalFunctions, DataCollectionSharedService, GeneralSharedServices) {
    $(document).bind("mobileinit", function () {
        $.mobile.defaultDialogTransition = "none";
        $.mobile.defaultPageTransition = "none";
    });
    DataCollectionSharedService.UpdateLoadingPageFlag(true);
    $("#divSplash").css("width", $(window).width() + "px");
    $("#divSplash").css("height", $(window).height() + "px");
    $("#popupLogin").enhanceWithin().popup();
    $("#pnlOptions").panel();
    $("#pnlOptions").trigger("create");
    $("#popupAccountInfo").enhanceWithin().popup();
    $("#popupUploadFile").enhanceWithin().popup();
    $("#popupTurbineList").enhanceWithin().popup();
    $("#popupChart").enhanceWithin().popup();
    setTimeout(function () {
        $("#pnlOptions").panel({
            open: function (event, ui) {
                GeneralSharedServices.RefreshOptionsPanel();
            }
        });
        $("#pageProjectInfo").find("div.divColPages").each(function () {
            $(this).css("height", function () {
                var content_height = generalFunctions.GetContentHeight();
                return content_height + 36;
            });
        });
        $("#pageLoadCalculation").find("div.divColPages").each(function () {
            $(this).css("height", function () {
                var content_height = generalFunctions.GetContentHeight();
                return content_height + 36;
            });
        });
    }, 100);
    $(document).on("pageshow", "div[data-role='page'][id^='page']", function (e) {
        var content_height = generalFunctions.GetContentHeight();
        var addHeight = 36;
        $("div.divColPages").css("height", function () {
            return content_height + addHeight;
        });
        $("#ulRecentProjectList").css("height", function () {
            return content_height - 310;
        });
        $("#ulProjectList").css("height", function () {
            return content_height - 310;
        });
    });
    generalFunctions.ShowLoading("Application is loading...");
    setTimeout(function () {
        generalFunctions.HideLoading();
        DataCollectionSharedService.PerformLogin();
        DataCollectionSharedService.UpdateLoadingPageFlag(false);
    }, 2500);
});
