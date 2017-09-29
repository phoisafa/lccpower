"use strict";

app.factory("generalFunctions", function ($filter) {
    return {
        msgBox: function (title, msg, type) {
            msg = $filter('translate')(msg);
            title = $filter('translate')(title);
            switch (type) {
                case "info":
                    $.msgBox({
                        title: title,
                        content: msg,
                        type: "info"
                    });
                    break;
                case "error":
                    $.msgBox({
                        title: title,
                        content: msg,
                        type: "error"
                    });
                    break;
            }
        },
        toast: function (msg, duration, timeout) {
            msg = $filter('translate')(msg);
            if (duration == undefined) {
                duration = 400;
            }
            if (timeout == undefined) {
                timeout = 0;
            }
            setTimeout(function () {
                $("<div class='ui-loader ui-overlay-shadow ui-body-a ui-corner-all'><h3>" + msg + "</h3></div>")
                    .css({
                        display: "block",
                        opacity: 0.90,
                        position: "fixed",
                        padding: "7px",
                        "text-align": "center",
                        width: "270px",
                        left: ($(window).width() - 270) / 2,
                        top: $(window).height() / 2
                    })
                    .appendTo($.mobile.pageContainer).delay(1500)
                    .fadeOut(duration, function () {
                        //setTimeout(function () {
                        $(this).remove();
                        //}, timeout);

                    });
            }, timeout);
        },
        uuid: {
            new: function () {
                function _p8(s) {
                    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
                }
                return _p8() + _p8(true) + _p8(true) + _p8();
            },
            empty: function () {
                return '00000000-0000-0000-0000-000000000000';
            }
        },
        TodayDate: function () {
            var dateString = $.datepicker.formatDate("mm/dd/yy", new Date());
            return dateString;
        },
        ChangePage: function (ID, transitionStyle, allowSamePageTransition) {
            $.mobile.changePage("#" + ID, { transition: transitionStyle, changeHash: true, allowSamePageTransition: allowSamePageTransition });
        },
        ChangePageMenu: function (pageName, PageMenu) {
            var selectedMenu = undefined;
            for (var i = 0; i < PageMenu.length; i++) {
                var menu = PageMenu[i];
                if (menu.name == pageName) {
                    menu.theme = "b";
                    selectedMenu = menu;
                } else {
                    menu.theme = "c";
                }
            }
            $(".ulColPages").each(function () {
                $(this).find("li").each(function () {
                    var anc = $(this).find("a");
                    anc.removeClass("ui-btn-c ui-btn-b ui-btn-j");
                    //anc.removeClass("ui-btn-b");
                    //anc.removeClass("ui-btn-j");
                    if (selectedMenu != undefined) {
                        if (anc.text() == $filter('translate')(selectedMenu.title)) {
                            anc.addClass("ui-btn-b");
                        } else {
                            anc.addClass("ui-btn-c");
                        }
                    } else {
                        anc.addClass("ui-btn-c");
                    }
                });
            });
        },
        ChangeEditAbleComboBoxSelection: function (SelectionText, ComboBoxID, Refresh, ForceUpdate, need2ReturnValue) {
            var val = "";
            var listItems = $(".es-list #" + ComboBoxID + " li");
            listItems.each(function (idx, li) {
                if ($(li).val() == SelectionText) {
                    $("#" + ComboBoxID).val(optionVal);
                    if (Refresh == true) {
                        setTimeout(function () {
                            try {
                                $("#" + ComboBoxID).selectmenu("refresh");
                            } catch (err) { }
                        }, 100);
                    }
                    if (need2ReturnValue == true) {
                        return val;
                    }
                }
            });
        },
        RemoveInvalidIOptionComboBoxSelection: function (ComboBoxID) {
            $("#" + ComboBoxID + " option").each(function () {
                var optionVal = $(this).val();
                if ((optionVal == "?") || (optionVal.indexOf("?") > -1)) {
                    $(this).remove();
                }
            });
        },
        ChangeComboBoxSelection: function (SelectionText, ComboBoxID, Refresh, ForceUpdate, need2ReturnValue) {
            var val = "";
            var consistInvalidOption = false;
            $("#" + ComboBoxID + " option").each(function () {
                var optionVal = $(this).val();
                if ((optionVal == "?") || (optionVal.indexOf("?") > -1)) {
                    $(this).remove();
                    consistInvalidOption = true;
                }
            });
            if (ForceUpdate == true) {
                consistInvalidOption = true;
            }
            if (consistInvalidOption == true) {
                $("#" + ComboBoxID + " option").each(function () {
                    var optionStr = $(this).text();
                    var optionVal = $(this).val();
                    if (optionStr == SelectionText) {
                        $("#" + ComboBoxID).val(optionVal);
                        if (Refresh == true) {
                            setTimeout(function () {
                                try {
                                    $("#" + ComboBoxID).selectmenu("refresh");
                                } catch (err) { }
                            }, 1);
                        }
                        if (need2ReturnValue == true) {
                            return val;
                        }
                    }
                });
            }
        },
        GenerateSelectionPopupHTML: function (listItem) {
            var strHTML = "<div class='ui-content' style='min-width: 150px; max-height:200px; margin-left: -15px; margin-right: -15px; margin-bottom: -10px; margin-top: -11px'><ul class='ui-listview'>";
            for (var i = 0; i < listItem.length; i++) {
                strHTML += "<li><a src='#' class='ui-btn' style='float: none; font-size: 13px; font-weight: bold;'>" + listItem[i] + "</a></li>";
            }
            strHTML += "</ul></div>";
            return strHTML;
        },
        OnlyNum: function (val) {
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            }
            return parseFloat(val);
        },
        RetrieveValueForSelectedCombo: function (list, seletedText) {
            var cond = false;
            var val = 0;
            if (seletedText != undefined) {
                seletedText = jQuery.trim(seletedText);
                if (seletedText != "") {
                    if (list != undefined) {
                        if (list.length > 0) {
                            cond = true;
                        }
                    }
                }
            }
            if (cond == true) {
                for (var i = 0; i < list.length; i++) {
                    if (jQuery.trim(list[i].name) == seletedText) {
                        val = list[i].value;
                        break;
                    }
                }
            }
            return val;
        },
        AreaUnitConversion: function (val, convertToUnit) {
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 0.09290304);
                } else {
                    val = (val * 0.09290304);
                }
            }
            return Math.round(parseFloat(val));
        },
        VolumeUnitConversion: function (val, convertToUnit) {
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 0.0283168466);
                } else {
                    val = (val * 0.0283168466);
                }
            }
            return Math.round(parseFloat(val));
        },
        AirFlowUnitConversion: function (val, convertToUnit) {
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 1.7);
                    val = parseFloat(val).toFixed(1);
                } else {
                    val = (val * 1.7);
                    //val = Math.round(parseFloat(val));
                    val = parseFloat(val).toFixed(1);
                }
            }
            val = this.OnlyNum(val);
            return val;
        },
        DimensionUnitConversion: function (val, convertToUnit) {
            // mm to inch
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 25.4);
                    val = parseFloat(val).toFixed(2);
                } else {
                    val = (val * 25.4);
                    val = Math.round(parseFloat(val));
                }
            }
            val = this.OnlyNum(val);
            return val;
        },
        DimensionFTUnitConversion: function (val, convertToUnit) {
            // m to ft
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 0.305);
                    val = parseFloat(val).toFixed(2);
                } else {
                    val = (val * 0.305);
                    val = Math.round(parseFloat(val));
                }
            }
            val = this.OnlyNum(val);
            return val;
        },
        ParticleConcUnitConversion: function (val, convertToUnit) {
            var factor = (1 / Math.pow(0.305, 3));
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / factor);
                } else {
                    val = (val * factor);
                }
            }
            val = Math.round(parseFloat(val));
            val = this.OnlyNum(val);
            return val;
        },
        TemperatureUnitConversion: function (val, convertToUnit) {
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                //if (convertToUnit == "US") {
                //    val = (9 / 5) * val + 32;
                //} else {
                //    val = (5 / 9) * (val - 32);
                //}
                if (convertToUnit == "US") {
                    val = (9 / 5) * val;
                } else {
                    val = (5 / 9) * val;
                }
            }
            //val = Math.round(parseFloat(val));
            val = parseFloat(val);
            if (convertToUnit == "US") {
                val = val.toFixed(1);
            } else {
                val = val.toFixed(2);
            }
            val = this.OnlyNum(val);
            return val;
        },
        PressureDropUnitConversion: function (val, convertToUnit) {
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 249.174);
                    val = parseFloat(val).toFixed(2);
                } else {
                    val = (val * 249.174);
                    val = Math.round(parseFloat(val));
                }
            }
            val = this.OnlyNum(val);
            return val;
        },
        VelocityUnitConversion: function (val, convertToUnit) {
            // m/s to FPM
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 0.00508333333333333);
                    val = parseFloat(val).toFixed(1);
                } else {
                    val = (val * 0.00508333333333333);
                    val = Math.round(parseFloat(val));
                }
            }
            val = this.OnlyNum(val);
            return val;
        },
        Velocity2UnitConversion: function (val, convertToUnit) {
            // cm/s to FPM
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                if (convertToUnit == "US") {
                    val = (val / 0.508333333333333);
                    val = parseFloat(val).toFixed(1);
                } else {
                    val = (val * 0.508333333333333);
                    val = parseFloat(val).toFixed(3);
                }
            }
            val = this.OnlyNum(val);
            return val;
        },
        FormatMeasurementUnit: function (unit) {
            unit.airFlow = unit.airFlow.replace("3", "3".sup());
            unit.particleConc = unit.particleConc.replace("3", "3".sup());
            unit.airflowPerSec = unit.airflowPerSec.replace("3", "3".sup());
            unit.media = unit.media.replace("2", "2".sup());
            return unit;
        },
        ShowLoading: function (msg) {
            msg = $filter('translate')(msg);
            $.mobile.loading("show", { text: msg, textVisible: true, theme: "a", html: "" });
        },
        HideLoading: function () {
            $.mobile.loading("hide");
        },
        HideSplashScreen: function (delay) {
            setTimeout(function () {
                $("#divSplash").addClass("ng-hide");
            }, delay);
        },
        ShowSplashScreen: function (delay) {
            setTimeout(function () {
                $("#divSplash").removeClass("ng-hide");
            }, delay);
        },
        OpenPopup: function (ID, transitionStyle) {
            $("#" + ID).popup("open", { transition: transitionStyle });
        },
        ClosePopup: function (ID) {
            $("#" + ID).popup("close");
        },
        GetContentHeight: function () {
            var header = $.mobile.activePage.find("div[data-role='header']:visible");
            var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
            var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
            var viewport_height = $(window).height();

            var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
            if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
                content_height -= (content.outerHeight() - content.height());
            }
            return content_height;
        },
        RefreshRadioButton: function (rdb, checked) {
            $("#" + rdb).prop("checked", checked).checkboxradio("refresh");
        },
        FillInComboSelectionList: function (list, fillUpDefaultValue, isTab) {
            var selectionList = { list: [], defaultValue: "", defaultId: 0, defaultImage: "" }
            for (var i = 0; i < list.length; i++) {
                var itm = {};
                if (isTab == true) {
                    itm = { id: list[i].ID, name: list[i].Display, value: list[i].Value, extraValue: list[i].ExtraValue, image: list[i].Picture, active: false, disabled: false };
                } else {
                    itm = { id: list[i].ID, name: list[i].Display, value: list[i].Value, extraValue: list[i].ExtraValue, image: list[i].Picture };
                }
                if (fillUpDefaultValue == true) {
                    if (list[i].IsDefaultValue == true) {
                        selectionList.defaultValue = list[i].Display
                        selectionList.defaultId = list[i].ID
                        selectionList.defaultImage = list[i].Picture
                        if (isTab == true) {
                            itm.active = true;
                        }
                    } else {
                        if (isTab == true) {
                            itm.active = false;
                        }
                    }
                }
                //if (fillUpDefaultValue == true) {
                //    if (list[i].IsDefaultValue == true) {
                //        if (isTab == true) {
                //            selectionList.defaultValue = list[i].Value
                //            selectionList.defaultId = list[i].ID
                //            selectionList.defaultImage = list[i].Picture
                //            itm.active = true;
                //        } else {
                //            selectionList.defaultValue = list[i].Display
                //            selectionList.defaultId = list[i].ID
                //            selectionList.defaultImage = list[i].Picture
                //        }
                //    } else {
                //        if (isTab == true) {
                //            itm.active = false;
                //        }
                //    }
                //}
                selectionList.list.push(itm);
            }
            return selectionList;
        },
        GetCurrentPageIndex: function (PageMenu, CurrentPageName) {
            var index = 0;
            for (var i = 0; i < PageMenu.length; i++) {
                var menu = PageMenu[i];
                if (menu.name == CurrentPageName) {
                    index = i;
                }
            }
            return index;
        },
        SwitchPopupWithFunctionParameter: function (sourceElement, destinationElement, backToSourceWhenClose) {
            this.ClosePopup(sourceElement);
            $("#" + destinationElement)
                .enhanceWithin().popup()
                .bind({
                    popupafterclose: function (event, ui) {
                        if (backToSourceWhenClose == true) {
                            $("#" + sourceElement).popup("open");
                        }
                    }
                })
            //setTimeout(function () {
            $("#" + destinationElement).popup("open");
            //}, 100);
        },
        GetUserLocale: function () {
            var language = window.navigator.userLanguage || window.navigator.language;
            var locale = undefined;
            if (language.indexOf("-") > 0) {
                locale = language.split('-')[1].toLowerCase();
            } else {
                locale = language.toLowerCase();
            }
            //locale = "sv";
            //console.log("user locale:" + locale);
            var isUSLocale = false;
            var decimalPoint = ",";
            var testVal = 0.1;
            var str = testVal.toLocaleString(locale);
            if (str.indexOf(".") > 0) {
                decimalPoint = ".";
                isUSLocale = true;
            }
            //console.log("isUSLocale(decimalPointIs=" + decimalPoint + ")=" + isUSLocale);
            if (isUSLocale == true) {
                locale = "us";
            } else {
                locale = "sv";
            }
            //console.log("switch user locale to:" + locale);
            return locale;
        },
        GetNumberLocale: function (val, checkBigInteger, decimalPoints) {
            if (val != undefined && val != "") {
                var format = this.GetLocaleFormat(val, checkBigInteger, decimalPoints);
                if (format != undefined) {
                    return format.displayValue;
                } else {
                    return val;
                }
            } else {
                return val;
            }
        },
        GetNumber: function (val, checkBigInteger, decimalPoints) {
            if (val != undefined && val != "") {
                var format = this.GetLocaleFormat(val, checkBigInteger, decimalPoints);
                if (format != undefined) {
                    return format.returnValue;
                } else {
                    return this.OnlyNum(val);
                }
            } else {
                return 0;
            }
        },
        ConvertToNumber: function (val) {
            if (val != undefined && val != "") {
                var tmp = this.OnlyNum(val);
                if (tmp > 0) {
                    return tmp;
                } else {
                    return this.GetNumber(val);
                }
            } else {
                return 0;
            }
        },
        GetLocaleFormat: function (val, checkBigInteger, decimalPoints) {
            var format = { isUSLocale: false, decimalPoint: "", numberSeparater: "", returnValue: val, displayValue: val };
            var locale = this.GetUserLocale();
            //var byPassCheckBigInteger = false;
            //if (checkBigInteger == false) {
            //    byPassCheckBigInteger = true;
            //}
            var isUSLocale = false;
            var decimalPoint = ",";
            var testVal = 0.1;
            var str = testVal.toLocaleString(locale);
            if (str.indexOf(".") > 0) {
                decimalPoint = ".";
                isUSLocale = true;
            }
            var numberSeparater = String.fromCharCode(160);
            testVal = 1000;
            str = testVal.toLocaleString(locale);
            if (str.indexOf(",") > 0) {
                numberSeparater = ",";
            } else {
                if (str.indexOf(".") > 0) {
                    numberSeparater = ".";
                }
            }
            val = val.toString();
            //if (byPassCheckBigInteger == false) {
            if (val.indexOf(numberSeparater) > 0 && val.charAt(0) != "0") {
                while (val.indexOf(numberSeparater) > 0) {
                    val = val.replace(numberSeparater, "")
                }
            }
            //}
            if (isUSLocale == false) {
                if (decimalPoint == ",") {
                    while (val.indexOf(decimalPoint) > 0) {
                        val = val.replace(".", "").replace(",", ".");
                    }
                }
            }
            val = val.replace(String.fromCharCode(8722), "-")
            val = parseFloat(val);
            var display = val.toString();
            //if (display.indexOf(".") > 0) {
            //    if (isUSLocale == false) {
            //        display = display.replace(".", ",");
            //    }
            //} else {
            //    var tmplocale = "us";
            //    if (isUSLocale == false) {
            //        tmplocale = "sv";
            //    }
            //    display = val.toLocaleString(locale);
            //}
            var tmplocale = "us";
            if (isUSLocale == false) {
                tmplocale = "sv";
            }
            display = val.toLocaleString(tmplocale);
            if (this.OnlyNum(decimalPoints) > 0) {
                display = val.toLocaleString(tmplocale, { minimumFractionDigits: decimalPoints });
            }
            format = { isUSLocale: isUSLocale, decimalPoint: decimalPoint, numberSeparater: numberSeparater, returnValue: val, displayValue: display };
            return format;

        },
        CalculatePercent: function (val, total) {
            var result = 0;
            val = this.OnlyNum(val);
            total = this.OnlyNum(total);
            if (val > 0 && total > 0) {
                result = (val * 100) / total;
            }
            return parseFloat(result);
        },
        GetStageName: function (stage) {
            var display = ""
            switch (stage) {
                case 1:
                    display = "1st Stage";
                    break;
                case 2:
                    display = "2nd Stage";
                    break;
                case 3:
                    display = "3rd Stage";
                    break;
            }
            return $filter('translate')(display);
        },
        UpdateSelectionList: function (ul, ary, hiddenValue, fillupValue, value) {
            var cond = false;
            if (ul != undefined && ary != undefined) {
                if (ul != "") {
                    if (ary.length > 0) {
                        cond = true;
                    }
                }
            }
            if (cond == true) {
                $('#ul' + ul).empty();
                if (hiddenValue == true) {
                } else {
                    for (var i = 0; i < ary.length; i++) {
                        var val = ary[i];
                        if (jQuery.isNumeric(val) == false) {
                            val = 0;
                        }
                        $('#ul' + ul).append('<li class="ng-binding ng-scope ng-animate selected" value=' + val + ' >' + val.toLocaleString(locale) + '</li>');
                    }
                }
                var list = $('#ul' + ul)
                list.find('li').each(function () {
                    $(this).on('mousemove', function () {
                        list.find('.selected').removeClass('selected');
                        $(this).addClass('selected');
                    });
                    $(this).click(function () {
                        var isUSLocale = false;
                        var decimalPoint = ",";
                        var testVal = 0.1;
                        var str = testVal.toLocaleString(locale);
                        if (str.indexOf(".") > 0) {
                            decimalPoint = ".";
                            isUSLocale = true;
                        }
                        var numberSeparater = String.fromCharCode(160);
                        testVal = 1000;
                        str = testVal.toLocaleString(locale);
                        if (str.indexOf(",") > 0) {
                            numberSeparater = ",";
                        } else {
                            if (str.indexOf(".") > 0) {
                                numberSeparater = ".";
                            }
                        }
                        //var val = $(this)[0].textContent;
                        var val = $(this).attr('value');
                        if (jQuery.isNumeric(val) == false) {
                            val = 0;
                        } else {
                            val = parseFloat(val);
                            //if (val.indexOf(numberSeparater) > 0 && val.charAt(0) != "0") {
                            //    while (val.indexOf(numberSeparater) > 0) {
                            //        val = val.replace(numberSeparater, "")
                            //    }
                            //}
                            //if (isUSLocale == false) {
                            //    if (decimalPoint == ",") {
                            //        while (val.indexOf(decimalPoint) > 0) {
                            //            val = val.replace(".", "").replace(",", ".");
                            //        }
                            //    }
                            //}
                            ////if (($(this).text().indexOf(".") > 0) || ($(this).text().indexOf(",") > 0)) {
                            ////    val = $(this).text();
                            ////    if (isUSLocale == false) {
                            ////        if (decimalPoint == ",") {
                            ////            while (val.indexOf(decimalPoint) > 0) {
                            ////                val = val.replace(".", "").replace(",", ".");
                            ////            }
                            ////        }
                            ////        while (val.indexOf(" ") > 0) {
                            ////            val = val.replace(" ", "");
                            ////        }
                            ////    } else {
                            ////        if (decimalPoint == ".") {
                            ////            while (val.indexOf(",") > 0) {
                            ////                val = val.replace(",", "");
                            ////            }
                            ////        }
                            ////    }
                            ////}
                        }
                        //val = jQuery.trim(val);
                        //if (jQuery.isNumeric(val) == false) {
                        //    val = 0;
                        //}
                        //val = parseFloat(val);
                        //val = val.toLocaleString(locale);
                        $("#cbo" + ul + "Value").val(val);
                        $("#cbo" + ul + "Value").trigger('input');
                        var tmplocale = "us";
                        if (isUSLocale == false) {
                            tmplocale = "sv";
                        }
                        val = val.toLocaleString(tmplocale);
                        $("#cbo" + ul).val(val);
                    });
                });
                list.mouseenter(function () {
                    list.find('li.selected').removeClass('selected');
                });
                if (fillupValue == true) {
                    if (value != undefined) {
                        $("#cbo" + ul + "Value").val(value);
                        $("#cbo" + ul + "Value").trigger('input');
                        var isUSLocale = false;
                        var decimalPoint = ",";
                        var testVal = 0.1;
                        var str = testVal.toLocaleString(locale);
                        if (str.indexOf(".") > 0) {
                            decimalPoint = ".";
                            isUSLocale = true;
                        }
                        var tmplocale = "us";
                        if (isUSLocale == false) {
                            tmplocale = "sv";
                        }
                        value = value.toLocaleString(tmplocale);
                        //value = value.toLocaleString();
                        $("#cbo" + ul).val(value);
                    }
                }
            }
        },
        AssignValueToControl: function (controlName, value) {
            var testVal = 0.1;
            var str = testVal.toLocaleString(locale);
            if (str.indexOf(".") > 0) {
                decimalPoint = ".";
                isUSLocale = true;
            }
            var tmplocale = "us";
            if (isUSLocale == false) {
                tmplocale = "sv";
            }
            //$("#" + controlName + 'Value').val($("<div>").html(value).text());
            //value = value.toLocaleString(tmplocale);
            //$("#" + controlName).val($("<div>").html(value).text());
            $("#" + controlName + 'Value').val($("<div>").html(value).text());
        },
        GetURLParameterByName: function (name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        SetCookie: function (cname, cvalue) {
            document.cookie = cname + "=" + cvalue
        },
        GetCookie: function (cname, cvalue) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        CheckCookie: function (cname, cvalue) {
            var value = this.GetCookie(cname);
            return value;
        },
        DeleteAllCookie: function () {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        },
        CustomisedReLoginAlert: function () {
            $.msgBox({
                title: ($filter('translate')("Expire Session")),
                content: (($filter('translate')("Your session has expired, you are require to login again!"))),
                type: 'alert',
                success: function (result) {
                    window.location = 'http://localhost:54300/index.html'; //development
                    //window.location = 'https://cfss.camfil.net/LCCPower/index.html'; //server
                }
            });
        },
        EnergyUnitConversion: function (val, fromUnit,toUnit,decimals) {
            val = jQuery.trim(val);
            if (jQuery.isNumeric(val) == false) {
                val = 0;
            } else {
                //1.Convert all to joule
                switch (fromUnit) {
                    case "J":
                        val = val;
                        break;
                    case "kJ":
                        val = val * 1000; //1 kJ = 1000 J
                        break;
                    case "Btu":
                        val = val * 1055; //1 BTU = 1055 J
                        break;
                    case "MJ":
                        val = val * 1000; //1 MJ = 1000 kJ
                        val = val * 1000; //1 kJ = 1000 J
                        break;
                    case "MMBtu":
                        val = val * 1000000;  //1 MMBTU = 1000000 BTU
                        val = val * 1055; //1 BTU = 1055 J
                        break;
                    case "Mcf":
                        val = val * 1.027; //1 mcf = 1.027MMBTU
                        val = val * 1000000;  //1 MMBTU = 1000000 BTU
                        val = val * 1055; //1 BTU = 1055 J
                        break;
                }
                //2.Convert joule to specific energy unit
                switch (toUnit) {
                    case "J":
                        val = val;
                        break;
                    case "kJ":
                        val = val / 1000; //1 kJ = 1000 J
                        break;
                    case "Btu":
                        val = val / 1055; //1 BTU = 1055 J
                        break;
                    case "MJ":
                        val = val / 1000; //1 kJ = 1000 J
                        val = val / 1000; //1 MJ = 1000 kJ
                        break;
                    case "MMBtu":
                        val = val / 1055; //1 BTU = 1055 J
                        val = val / 1000000;  //1 MMBTU = 1000000 BTU
                        break;
                    case "Mcf":
                        val = val * 1055; //1 BTU = 1055 J
                        val = val * 1000000;  //1 MMBTU = 1000000 BTU
                        val = val * 1.027; //1 mcf = 1.027MMBTU
                        break;
                }
                decimals = this.OnlyNum(decimals);
                val = this.GetNumber(val.toFixed(decimals));
            }
            return parseFloat(val);
        },



    };
});