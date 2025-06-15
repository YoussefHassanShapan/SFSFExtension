sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/date/UI5Date"
], function (Controller, JSONModel, MessageBox, UI5Date) {
    "use strict";

    return Controller.extend("calendarui.calendarui.controller.Page", {

        onInit: async function () {
            const calendarModel = new JSONModel({ startDate: new Date(), people: [] });
            this.getView().setModel(calendarModel, "calendar");

            const oPrimarySecondaryType = this.byId("primaryCalendarTypeSelect");
            oPrimarySecondaryType.setSelectedKey(this.byId("PC1").getPrimaryCalendarType());

            try {
                const response = await fetch("/odata/v4/catalog/CatalogService.EmployeeTime", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const peopleMap = {};

                data.value.forEach((entry) => {
                    const userId = entry.userId || "Unknown";

                    if (!peopleMap[userId]) {
                        peopleMap[userId] = {
                            name: userId,
                            role: entry.timeType || "",
                            pic: "sap-icon://employee",
                            appointments: []
                        };
                    }

                    if (entry.startDate && entry.endDate) {
                        peopleMap[userId].appointments.push({
                            start: new Date(entry.startDate),
                            end: new Date(entry.endDate),
                            title: entry.timeType || "No Title",
                            info: entry.comment || entry.approvalStatus || "",
                            type: "Type01",
                            tentative: false
                        });
                    }
                });

                calendarModel.setProperty("/people", Object.values(peopleMap));
            } catch (error) {
                console.error("Failed to fetch EmployeeTime data:", error);
                MessageBox.error("Failed to load calendar data.");
            }
        },

        handleAppointmentSelect: function (oEvent) {
            var oAppointment = oEvent.getParameter("appointment"),
                sSelected;
            if (oAppointment) {
                sSelected = oAppointment.getSelected() ? "selected" : "deselected";
                MessageBox.show("'" + oAppointment.getTitle() + "' " + sSelected + ". \n Selected appointments: " + this.byId("PC1").getSelectedAppointments().length);
            } else {
                var aAppointments = oEvent.getParameter("appointments");
                var sValue = aAppointments.length + " Appointments selected";
                MessageBox.show(sValue);
            }
        },

        handleSelectionFinish: function (oEvent) {
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            this.byId("PC1").setBuiltInViews(aSelectedKeys);
        },

        onCalendarTypeSelect: function (oEvent) {
            this.byId("PC1").setPrimaryCalendarType(oEvent.getParameters().selectedItem.getKey());
        },

        onCalendarSecondaryTypeSelect: function (oEvent) {
            var sKey = oEvent.getParameters().selectedItem.getKey();
            if (sKey === "None") {
                this.byId("PC1").setSecondaryCalendarType(undefined);
            } else {
                this.byId("PC1").setSecondaryCalendarType(sKey);
            }
        },

        handleRowHeaderPress: function (oEvent) {
            MessageBox.show("rowHeaderPressed on row: " + oEvent.getParameter("row").getId());
        }
    });
});
