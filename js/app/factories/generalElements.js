"use strict";

app.factory("generalElements", function (generalFunctions) {
    return {
        ProjectInfoElement: function () {
            return {
                id: generalFunctions.uuid.new(),
                Mode: "",
                Customer: {
                    Name: "",
                    Contact: "",
                    ContactTitle: "",
                    Street: "",
                    City: "",
                    State: "",
                    Zip: "",
                    Country: "",
                    ContactPhone: "",
                    ContactEmail: "",
                },
                Site: {
                    Site: "",
                    Location: "",
                    Building: "",
                    Ahu: ""
                },
                Rep: {
                    Name: "",
                    Street: "",
                    City: "",
                    State: "",
                    Zip: "",
                    Country: ""
                },
                PrepareBy: {
                    Name: "",
                    Title: "",
                    Tel: "",
                    Fax: "",
                    Mobile: "",
                    Email: ""
                }
            };
        },
        measurementUnitElement: function (unitID) {
            switch (unitID) {
                case 1:
                    return {
                        unit: "SI",
                        unitId: 1,
                        airFlow: "m3/h",
                        dimension: "m",
                        area: "m2",
                        volume: "m3",
                        temperature: "°C"
                    };
                    break;
                case 2:
                    return {
                        unit: "US",
                        unitId: 2,
                        airFlow: "CFM",
                        dimension: "ft",
                        area: "ft2",
                        volume: "ft3",
                        temperature: "°F"
                    };
                    break;
            }
        },
        folderFileElement: function (type,id,name,parentId,path,totalChild,totalFile,desc,serverDb) {
            return {
                category: type,
                id: id,
                name: name,
                parentId: parentId,
                path:path,
                totalChild: totalChild,
                totalFile: totalFile,
                desc: desc,
                serverDb: serverDb
            };
        },
        SessionTimeOut: function () {
            return {
                TimeOut: false,
                Msg: "",
                URL:""
            };
        }
    };
});