/**
* jQuery Editable Select
* by Indri Muska <indrimuska@gmail.com>
*
* Source on GitHub @ https://github.com/indrimuska/jquery-editable-select
*
* File: jquery.editable-select.js
*/

(function ($) {
    $.extend($.expr[':'], {
        nic: function (elem, i, match, array) {
            return !((elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0);
        }
    });
    $.fn.editableSelect = function (options) {
        var defaults = { filter: true, effect: 'default', duration: 'fast', onCreate: null, onShow: null, onHide: null, onSelect: null };
        var id = String(this.selector).replace("#cbo", "ul");
        var select = this.clone(), input = $('<input type="text">'), list = $('<ul  id="' + id + '"  class="es-list ' + this.selector + '">');
        options = $.extend({}, defaults, options);
        switch (options.effects) {
            case 'default': case 'fade': case 'slide': break;
            default: options.effects = 'default';
        }
        if (isNaN(options.duration) && options.duration == 'fast' && options.duration == 'slow') options.duration = 'fast';
        this.replaceWith(input);
        var EditableSelect = {
            init: function () {
                var isUSLocale = false;
                var decimalPoint = ",";
                var testVal = 0.1;
                var str = testVal.toLocaleString(locale);
                if (str.indexOf(".") > 0) {
                    decimalPoint = ".";
                    isUSLocale = true;
                }
                var es = this;
                es.copyAttributes(select, input);
                input.addClass('es-input');
                $(document.body).append(list);
                select.find('option').each(function () {
                    //var li = $('<li>');
                    //li.html($(this).text());
                    //li.val($(this).text());
                    //es.copyAttributes(this, li);
                    var val = $(this).text();
                    if (input.hasClass("isNumeric") == true) {
                        if (isUSLocale == false) {
                            if (decimalPoint == ",") {
                                while (val.indexOf(decimalPoint) > 0) {
                                    val = val.replace(".", "").replace(",", ".");
                                }
                            }
                        }
                    }
                    var li = '<li value="' + val + '" class="ng-binding ng-scope ng-animate">' + $(this).text() + '</li>';
                    list.append(li);
                    if ($(this).attr('selected')) input.val($(this).text());
                });
                input.on('focus input click', es.show);
                input.on("change", es.updateValue);
                $(document).click(function (event) {
                    if (!$(event.target).is(input) && !$(event.target).is(list)) es.hide();
                });
                es.initializeList();
                es.initializeEvents();
                if (options.onCreate) options.onCreate.call(this, input);
            },
            initializeList: function () {
                var es = this;
                list.find('li').each(function () {
                    $(this).on('mousemove', function () {
                        list.find('.selected').removeClass('selected');
                        $(this).addClass('selected');
                    });
                    $(this).click(function () { es.setField.call(this, es); });
                });
                list.mouseenter(function () {
                    list.find('li.selected').removeClass('selected');
                });
            },
            initializeEvents: function () {
                var es = this;
                input.bind('input keydown', function (event) {
                    switch (event.keyCode) {
                        case 40: // Down
                            es.show();
                            var visibles = list.find('li:visible'), selected = visibles.filter('li.selected');
                            list.find('.selected').removeClass('selected');
                            selected = visibles.eq(selected.size() > 0 ? visibles.index(selected) + 1 : 0);
                            selected = (selected.size() > 0 ? selected : list.find('li:visible:first')).addClass('selected');
                            es.scroll(selected, true);
                            break;
                        case 38: // Up
                            es.show();
                            var visibles = list.find('li:visible'), selected = visibles.filter('li.selected');
                            list.find('li.selected').removeClass('selected');
                            selected = visibles.eq(selected.size() > 0 ? visibles.index(selected) - 1 : -1);
                            (selected.size() > 0 ? selected : list.find('li:visible:last')).addClass('selected');
                            es.scroll(selected, false);
                            break;
                        case 13: // Enter
                        //if (list.is(':visible')) {
                        //    es.setField.call(list.find('li.selected'), es);
                        //    event.preventDefault();
                        //}
                        case 9:  // Tab
                        case 27: // Esc
                            es.hide();
                            break;
                        default:
                            if (input.hasClass("isNumeric") == true) {
                                //// Allow: backspace, delete, tab, escape, enter and .
                                //if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                                //    // Allow: Ctrl+A
                                //(event.keyCode == 65 && event.ctrlKey === true) ||
                                //    // Allow: Ctrl+C
                                //(event.keyCode == 67 && event.ctrlKey === true) ||
                                //    // Allow: Ctrl+X
                                //(event.keyCode == 88 && event.ctrlKey === true) ||
                                //    // Allow: home, end, left, right
                                //(event.keyCode >= 35 && event.keyCode <= 39)) {
                                //    // let it happen, don't do anything
                                //    return;
                                //}
                                var isUSLocale = false;
                                var testVal = 0.1;
                                var str = testVal.toLocaleString();
                                if (str.indexOf(".") > 0) {
                                    isUSLocale = true;
                                }
                                // Allow: backspace, delete, tab, escape, enter and .
                                if (isUSLocale == true) {
                                    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                                        // Allow: Ctrl+A
                                        (event.keyCode == 65 && event.ctrlKey === true) ||
                                        // Allow: Ctrl+C
                                        (event.keyCode == 67 && event.ctrlKey === true) ||
                                        // Allow: Ctrl+X
                                        (event.keyCode == 88 && event.ctrlKey === true) ||
                                        // Allow: home, end, left, right
                                        (event.keyCode >= 35 && event.keyCode <= 39)) {
                                        // let it happen, don't do anything
                                        if (event.keyCode == 190) {
                                            // prevent enter more than 1 decimal point (.)
                                            if ($("#" + input[0].id).val().indexOf(".") > -1) {
                                                event.preventDefault();
                                            } else {
                                                // let it happen, don't do anything
                                                return;
                                            }
                                        } else {
                                            // let it happen, don't do anything
                                            return;
                                        }
                                    }
                                } else {
                                    // Allow: backspace, delete, tab, escape, enter and ,
                                    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 188]) !== -1 ||
                                        // Allow: Ctrl+A
                                        (event.keyCode == 65 && event.ctrlKey === true) ||
                                        // Allow: Ctrl+C
                                        (event.keyCode == 67 && event.ctrlKey === true) ||
                                        // Allow: Ctrl+X
                                        (event.keyCode == 88 && event.ctrlKey === true) ||
                                        // Allow: home, end, left, right
                                        (event.keyCode >= 35 && event.keyCode <= 39)) {
                                        if (event.keyCode == 188) {
                                            // prevent enter more than 1 decimal point (,)
                                            if ($("#" + input[0].id).val().indexOf(",") > -1) {
                                                event.preventDefault();
                                            } else {
                                                // let it happen, don't do anything
                                                return;
                                            }
                                        } else {
                                            // let it happen, don't do anything
                                            return;
                                        }
                                    }
                                }
                                // Ensure that it is a number and stop the keypress
                                if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                                    event.preventDefault();
                                }
                            }
                            es.show();
                            break;
                    }
                });
            },
            show: function () {
                if (input.hasClass("input-disabled") == false) {  //do not show list when input field disabled/read-only
                    list.find('li').show();
                    list.css({ top: input.offset().top + input.outerHeight() - 1, left: input.offset().left, width: input.innerWidth() });
                    var hidden = options.filter ? list.find('li:nic(' + input.val() + ')').hide().size() : 0;
                    if (hidden == list.find('li').size()) list.hide();
                    else
                        switch (options.effects) {
                            case 'fade': list.fadeIn(options.duration); break;
                            case 'slide': list.slideDown(options.duration); break;
                            default: list.show(options.duration); break;
                        }
                    if (options.onShow) options.onShow.call(this, input);
                }
            },
            hide: function () {
                switch (options.effects) {
                    case 'fade': list.fadeOut(options.duration); break;
                    case 'slide': list.slideUp(options.duration); break;
                    default: list.hide(options.duration); break;
                }
                if (options.onHide) options.onHide.call(this, input);
            },
            scroll: function (selected, up) {
                var height = 0, index = list.find('li:visible').index(selected);
                list.find('li:visible').each(function (i, element) { if (i < index) height += $(element).outerHeight(); });
                if (height + selected.outerHeight() >= list.scrollTop() + list.outerHeight() || height <= list.scrollTop()) {
                    if (up) list.scrollTop(height + selected.outerHeight() - list.outerHeight());
                    else list.scrollTop(height);
                }
            },
            copyAttributes: function (from, to) {
                var attrs = $(from)[0].attributes;
                for (var i in attrs) $(to).attr(attrs[i].nodeName, attrs[i].nodeValue);
            },
            setField: function (es) {
                if (!$(this).is('li:visible')) return false;
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
                //var val = $(this).text();
                var val = $(this).attr('value');

                if (input.hasClass("isHiddenValue") == true) {
                    val = $(this).val();
                } else {
                    if (input.hasClass("isNumeric") == true) {
                        val = $(this).text();
                        if (val.indexOf(numberSeparater) > 0 && val.charAt(0) != "0") {
                            while (val.indexOf(numberSeparater) > 0) {
                                val = val.replace(numberSeparater, "")
                            }
                        }
                        if (isUSLocale == false) {
                            if (decimalPoint == ",") {
                                while (val.indexOf(decimalPoint) > 0) {
                                    val = val.replace(".", "").replace(",", ".");
                                }
                            }
                        }
                        while (val.indexOf(String.fromCharCode(160)) > 0) {
                            val = val.replace(String.fromCharCode(160), "");
                        }
                    }
                }
                var val_decimal = 0; //pinky to cater for more than 3 fraction         
                if (input.hasClass("isNumeric") == true) {
                    val = jQuery.trim(val);
                    if (jQuery.isNumeric(val) == false) {
                        val = 0;
                    }
                    val = parseFloat(val);
                    val_decimal = decimalPlaces(val); //pinky to cater for more than 3 fraction
                }
                //val = val.toLocaleString(locale, { minimumFractionDigits: val_decimal }); //pinky to cater for more than 3 fractions
                $("#" + input[0].id + "Value").val(val);
                $("#" + input[0].id + "Value").trigger('input');

                //  pinky to cater for more than 3 fractions   val = val.toLocaleString(tmplocale);

                //val = val.toLocaleString();
                //val = parseFloat($("#" + input[0].id + "Value").val()); PS Remove this 2017-06-12
                var tmplocale = "us";
                if (isUSLocale == false) {
                    tmplocale = "sv";
                }

                // Start Pinky to cater for NaN 23 Jan 2017
                if (isNaN(val) == true) {
                    val = "";
                }
                // Start Pinky to cater for NaN 23 Jan 2017

                val = val.toLocaleString(tmplocale, { minimumFractionDigits: val_decimal });
                input.val(val);

                es.hide();
                if (options.onSelect) options.onSelect.call(input, $(this));
            },
            updateValue: function (es) {
                // find decimal point and thousand separator symbol
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
                //new value
                var newValue = $("#" + input[0].id).val();
                val = newValue.toString();
                if (val.indexOf(numberSeparater) > 0 && val.charAt(0) != "0") {
                    while (val.indexOf(numberSeparater) > 0) {
                        val = val.replace(numberSeparater, "");
                    }
                }
                if (isUSLocale == false) {
                    if (decimalPoint == ",") {
                        while (val.indexOf(decimalPoint) > 0) {
                            val = val.replace(".", "").replace(",", ".");
                        }
                    }
                }
                while (val.indexOf(String.fromCharCode(160)) > 0) {
                    val = val.replace(String.fromCharCode(160), "");
                }
                newValue = val;
                //prev value
                var oldValue = $("#" + input[0].id + "Value").val();
                val = oldValue.toString();
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
                oldValue = val;
                if (newValue != oldValue) {
                    var val_decimal = 0;
                    if (input.hasClass("isNumeric") == true) {
                        newValue = jQuery.trim(newValue);
                        if (jQuery.isNumeric(newValue) == false) {
                            newValue = 0;
                        }
                        newValue = parseFloat(newValue);
                        val_decimal = decimalPlaces(newValue);
                        //PS Remove this 2017-06-12-START
                        //newValue = newValue.toLocaleString(locale, { minimumFractionDigits: val_decimal }); //pinky to cater for more than 3 fractions
                        $("#" + input[0].id + "Value").val(newValue);
                        $("#" + input[0].id + "Value").trigger('input');
                        //other controller / watch event trigger might change the input value
                        var valueFromInput = $("#" + input[0].id + "Value").val();
                        if (jQuery.isNumeric(valueFromInput) == false) {
                            valueFromInput = 0;
                        }
                        newValue = parseFloat(valueFromInput);
                        var tmplocale = "us";
                        if (isUSLocale == false) {
                            tmplocale = "sv";
                        }
                        newValue = newValue.toLocaleString(tmplocale, { minimumFractionDigits: val_decimal });
                        input.val(newValue);
                         //PS Remove this 2017-06-12-END
                        //var tmplocale = "us";
                        //if (isUSLocale == false) {
                        //    tmplocale = "sv";
                        //}
                        //newValue = newValue.toLocaleString(tmplocale, { minimumFractionDigits: val_decimal });
                        //input.val(newValue);
                        //input.trigger('input');

                    }
                }

            }
        };
        EditableSelect.init();
        return input;
    };
    decimalPlaces = function (num) { //pinky to cater for more than 3 fraction
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) { return 0; }
        return Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
            // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0));
    }

})(jQuery);
