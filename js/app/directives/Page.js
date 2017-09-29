"use strict";

app.directive("pageHeader", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/PageHeader.html?v=8",
        scope: {
            title: "@",
            abrv: "@",
            icon: "@",
            showPrevButton: "@",
            prevButtonOnClick: "&",
            showNextButton: "@",
            nextButtonOnClick: "&",
            optionButtonOnClick: "&"
        }
    };
});

app.directive("pageMenu", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/PageMenu.html?v=8",
        scope: true,
        controller: "PageMenuCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $(element).trigger("create");
            }, 1);
        }
    };
});

app.directive("pageProjectInfo", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/ProjectInfo.html?v=8"
    };
});

app.directive("pageTitle", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/PageTitle.html?v=8",
        scope: {
            title: "@",
            showAddButton: "@",
            addButtonHref: "@",
            buttonOnClick: "&",
            icon: "@",
            pageId: '@',
            showRadioButton: '@',
            iconDesc: '@'
        }
    };
});

app.directive("pageSectionTitle", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/PageSectionTitle.html?v=8",
        scope: {
            title: "@",
            theme: "@",
            showButton: "@",
            buttonStyle: "@",
            buttonHref: "@",
            buttonOnClick: "&",
            addSpace: "@",
            buttonDesc: "@"
        }
    };
});


app.directive("pageSectionSpace", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/PageSectionSpace.html?v=8"
    };
});



app.directive("panelOptions", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/panelOptions.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            $("#pnlOptions").panel();
            $("#pnlOptions").trigger("create");
        }
    };
});



app.directive("popupSave", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupSave.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupSave").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupSaveToDatabase", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupSaveToDatabase.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupSaveToDatabase").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupFolderAction", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupFolderAction.html?v=8",
        controller: "FolderCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupFolderAction").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupFolderName", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupFolderName.html?v=8",
        controller: "FolderCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupFolderName").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupSaveProject", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupSaveProject.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupSaveProject").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("pageLoadSavedRecord", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/LoadSavedRecord.html?v=8"
    };
});

app.directive("popupLoad", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupLoad.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupLoad").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupUploadFile", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupUploadFile.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupUploadFile").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupLanguages", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupLanguages.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupLanguages").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupAbout", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupAbout.html?v=8",
        controller: "PanelCtrl",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupAbout").enhanceWithin().popup();
            }, 1);
        }
    };
});

app.directive("popupTurbineList", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupTurbineList.html",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupTurbineList").enhanceWithin().popup();
            }, 1);
        }
    }
});

app.directive("pageFilter", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/pageFilter.html?v=8",
        controller: "FilterCtrl",
        scope: {
            page: "@"
        }
    };
});



app.directive("pageSystemTitle", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/PageSystemTitle.html?v=8",
        scope: {
            title: "@",
            page: "@",
            airflow: "@",
            airflowunit: "@",
            theme: "@",
            showButton: "@",
            buttonStyle: "@",
            buttonHref: "@",
            buttonOnClick: "&",
            addSpace: "@",
            bgcolor: "@"
        }
    };
});

app.directive("popupFilterList", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupFilterList.html",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupFilterList").enhanceWithin().popup();
            }, 1);
        }
    }
});

app.directive("pageSectionTitleWithSwitch", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/PageSectionTitleWithSwitch.html?v=8",
        scope: {
            page:"@",
            title: "@",
            theme: "@",
            status: "@",
            model: "@",
            defaultStatus: "@",
            buttonOnClick: "&"
        }
    };
});

app.directive("popupChart", function () {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/popupChart.html",
        link: function ($scope, element, attrs, controller) {
            setTimeout(function () {
                $("#popupChart").enhanceWithin().popup();
            }, 1);
        }
    }
});