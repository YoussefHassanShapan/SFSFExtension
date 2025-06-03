const { create } = require("@sap/cds");

sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'calendar.calendar',
            componentId: 'EmployeeTimeList',
            contextPath: '/EmployeeTime'
        },
        CustomPageDefinitions
    );
});