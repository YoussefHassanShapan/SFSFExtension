sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'calendar/calendar/test/integration/FirstJourney',
		'calendar/calendar/test/integration/pages/EmployeeTimeList',
		'calendar/calendar/test/integration/pages/EmployeeTimeObjectPage'
    ],
    function(JourneyRunner, opaJourney, EmployeeTimeList, EmployeeTimeObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('calendar/calendar') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheEmployeeTimeList: EmployeeTimeList,
					onTheEmployeeTimeObjectPage: EmployeeTimeObjectPage
                }
            },
            opaJourney.run
        );
    }
);