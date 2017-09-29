"use strict";

app.factory("lccFunctions", function (generalFunctions) {
    return {
        GetPageMenu: function () {
            return [
                { name: "pageProjectInfo", title: "Project Information", theme: "b", showPrevButton: false, showNextButton: true, active: true },
                { name: "pageGasTurbine", title: "Gas Turbine", theme: "c", showPrevButton: true, showNextButton: true, active: true },
                { name: "pageRunningCond", title: "Running Conditions", theme: "c", showPrevButton: true, showNextButton: true, active: true },
                { name: "pageSolutionsToCompare", title: "Solutions to compare", theme: "c", showPrevButton: true, showNextButton: true, active: true },
                { name: "pageCostsRates", title: "Costs / Rates", theme: "c", showPrevButton: true, showNextButton: true, active: true },
                { name: "pageResults", title: "Results", theme: "c", showPrevButton: true, showNextButton: true, active: true },
                { name: "pageComparison", title: "Results Comparison", theme: "c", showPrevButton: true, showNextButton: false, active: true }
            ];
        },
        CalculateHeatRatekJperkWh: function (vHeatRate) {
            var heatRate = generalFunctions.GetNumber(vHeatRate, false);
            return parseFloat(heatRate * 1.055);
        },
        CalculateOutput: function (vISOBaseRating) {
            var isoBaseRating = generalFunctions.GetNumber(vISOBaseRating, false);
            return parseFloat(isoBaseRating * 0.001);
        },
        CalculateAirFlow: function (vMassFlow, vAirDensity) {
            var massFlow = generalFunctions.GetNumber(vMassFlow, false);
            var airDensity = generalFunctions.GetNumber(vAirDensity, false);
            var airFlow = parseInt(massFlow * (0.453592 * 3600) / airDensity);
            if (isNaN(airFlow) == true) {
                airFlow = 0;
            }
            return airFlow;
        },
        CalculateNoOfFilter: function (vMassFlow, vAirDensity,vAirFlow) {
            var massFlow = generalFunctions.GetNumber(vMassFlow, false);
            var airDensity = generalFunctions.GetNumber(vAirDensity, false);
            var airFlow = generalFunctions.GetNumber(vAirFlow, false);
            if (massFlow > 0 && airDensity > 0 && airFlow > 0) {
                return parseInt((massFlow * (0.453592 * 3600) / airDensity) / airFlow);
            } else {
                return 1;
            }
        }

    }
});