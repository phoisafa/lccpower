"use strict";

app.factory("lccElements", function ($filter,generalFunctions,generalElements) {
    return {
        LccParamsElement: function () {
            return {
                id: generalFunctions.uuid.new(),
                projectName: "",
                reportDate: generalFunctions.TodayDate(),
                description: "",
                setting: this.SettingElement(),
                projectInfo: generalElements.ProjectInfoElement(),
                gasTurbine: this.GasTurbineElements(),
                runningCond: this.RunningCondElements(),
                filterSolutions: this.FilterSolutionsElements(),
                costsRates: this.CostRateElements(),
                compareSolutions: []
            };
        },
        SettingElement: function () {
            return {
                unit: this.MeasurementUnitElement(1),
                languageId: 0,
                currency: { name: "", id: 0 }
            }
        },
        MeasurementUnitElement: function (unitID) {
            switch (unitID) {
                case 1:
                    return {
                        unit: "SI",
                        unitId: 1,
                        length: "m",
                        airFlow: "m³/h",
                        velocity: "m/s",
                        velocity2: "cm/s",
                        dimension: "mm",
                        pressureDrop: "Pa",
                        pressureDrop2: "kPa",
                        media: "m²",
                        particleConc: "part/m³",
                        particlePerPerson: "part/s",
                        airChanges: "times/h",
                        airflowPerSec: "m³/s",
                        temperature: "°C",
                        heatRateEngine: "kJ",
                        fuelCost:"MJ"
                    };
                    break;
                case 2:
                    return {
                        unit: "US",
                        unitId: 2,
                        length: "ft",
                        airFlow: "CFM",
                        velocity: "FPM",
                        velocity2: "FPM",
                        dimension: "inch",
                        pressureDrop: "in wg",
                        pressureDrop2: "in wg",
                        media: "ft²",
                        particleConc: "part/ft³",
                        particlePerPerson: "part/s",
                        airChanges: "times/h",
                        airflowPerSec: "CFM",
                        temperature: "°F",
                        heatRateEngine: "Btu",
                        fuelCost: "MMBtu"
                    };
                    break;
            }
        },
        //GasTurbineElements: function () {
        //    return {
        //        manufacturerId: 0,
        //        manufacturer: "",
        //        modelId: 0,
        //        turbine: "",
        //        model: "",
        //        year: "",
        //        isoBaseRating: 0,
        //        heatRate: 0,
        //        pressRatio: 0,
        //        massFlow: 0,
        //        turbineSpeed: 0,
        //        turbineInletTemp: "",
        //        exhaustTemp: "",
        //        approximateWeight: "",
        //        approximate: "",
        //        airDensity: 0,
        //        comments: "",
        //        stopServiceFilter1: 0,
        //        stopServiceFilter2: 0,
        //        stopServiceFilter3: 0,
        //        downtimeFilterReplacement: 0,
        //        energySoldPrice: 0,
        //        priceIncrease: 0,
        //        output: 0,
        //        reductionOfOutput: 0,
        //        heatRateIncrease: 0,
        //        dPSystem: 0,
        //        heatRateOfEngine: 0,
        //        fuelCost: 0,
        //        timeOffFouledCompressorWashing: 0,
        //        fouledCompressorInterval: 0
        //    }
        //},
        GasTurbineElements: function () {
            return {
                manufacturerId: 0,
                manufacturer: "",
                modelId: 0,
                turbine: "",
                model: "",
                year: "",
                isoBaseRating: 0,
                heatRate: 0,
                pressRatio: 0,
                massFlow: 0,
                turbineSpeed: 0,
                turbineInletTemp: "",
                exhaustTemp: "",
                approximateWeight: "",
                approximate: "",
                airDensity: 0,
                comments: "",
                downtimeFilterReplacement: 0,
                energySoldPrice: 0,
                priceIncrease: 0,
                output: 0,
                reductionOfOutput: 0,
                heatRateIncrease: 0,
                dPSystem: 0,
                heatRateOfEngine: 0,
                heatRateOfEngineUnit:"kJ",
                fuelCost: 0,
                fuelCostUnit: "MJ",
                timeOffFouledCompressorWashing: 0,
                waterWashCost: 0,
                totalSystemAirflow: 0
            }
        },
        RunningCondElements: function () {
            return {
                fanSystemOperating: 8000,
                lccPeriod: 20,
                //totalSystemAirflow: 0,
                outdoorEnv: "OUTDOORENV",
                outdoorConc: {
                    id: 0,
                    display: "Small Town",
                    value: "0.01",
                    extraValue:""
                },
                turbineOperationTimeMode: "BASELOAD",
                timeBaseLoad: 100,
                timePartLoad: 0,
                majorMaintenanceInterval: 0
            };
        },
        FilterSolutionsElements: function () {
            return {
                totalSolution: 1,
                solutions: [
                    this.SolutionElements(1),
                    this.SolutionElements(2),
                    this.SolutionElements(3),
                    this.SolutionElements(4),
                    this.SolutionElements(5),
                    this.SolutionElements(6),
                    this.SolutionElements(7),
                    this.SolutionElements(8),
                    this.SolutionElements(9),
                    this.SolutionElements(10)
                ]
            }
        },
        SolutionElements: function (iSolution) {
            return {
                solution: iSolution,
                solutionName: "Solution " + iSolution,
                totalStage: 1,
                filterLifetimeCriteria: "TIMEBASE",
                filters: [
                    this.FilterElements(iSolution, 1),
                    this.FilterElements(iSolution, 2),
                    this.FilterElements(iSolution, 3)
                ],
                costsByStage: false,
                waterWashInterval: 0,
                stopServiceFilter1: 1,
                stopServiceFilter2: 1,
                stopServiceFilter3: 1,
            }
        },
        FilterElements: function (iSolution,iStage) {
            return {
                solution:iSolution,
                stage: iStage,
                //filter: this.assignFilter(),
                filterName: "",
                filterID: 0,
                filterGroupID: 0,
                filterTypeID: 0,
                filterAirFlow:0,
                exchangeValue: "",
                noOfFilter: "",
                price: "",
                costs: {
                    housing: "",
                    labor: "",
                    wasteHandling: ""
                }
            }
        },
        assignFilter: function () {
            return {
                filterGroup: "",
                filterGroupID: 0,
                filterType: "",
                filterTypeID: 0,
                filterName: "",
                filterID: 0,
                filterMedia: "",
                filterEffMedia: "",
                width: "",
                height: "",
                depth: "",
                noOfPocket: "",
                filterClass: "",
                filterEnergyClass: "",
                unitPrice: "",
                finalPressureDrop: "",
                filterPicture: "",
                pleatHeight: "",
                deepPleat: "",
                lPleat: "",
                pleat: "",
                delning: "",
                pleatType: "",
                medium: "",
                lockDimension: false,
                frameID: 0,
                frameName: "",
                gasketName: "",
                aFrame: "",
                bFrame: "",
                aGlue: "",
                bGlue: "",
                noOfFilterFaceVelocity: 0,
                airFlow:""
            };
        },
        CostRateElements: function () {
            return {
                filterPriceIncrease: 0,
                //advanceInput: 0,
                //costs: [
                //    this.CostElements(0, 1),
                //    this.CostElements(0, 2),
                //    this.CostElements(0, 3)
                //],
                laborCostIncrease: 0,
                wasteHandlingIncrease: 0,
                npvDiscountRate: 0
            }
        },
        CostElements: function (iSolution,iStage) {
            return {
                solution: iSolution,
                stage: iStage,
                housing: "",
                labor: "",
                wasteHandling: "",
                waterWash: ""
            }
        },
        dataEntriesFromServerElement: function () {
            return {
                General:undefined,
                GasTurbineGroup: undefined,
                FilterGroup:undefined,
                GasTurbine: undefined,
                RunningCond: undefined,
                SolutionToCompare: undefined
            }
        }
    };
});