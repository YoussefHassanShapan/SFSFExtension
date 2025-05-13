const cds = require('@sap/cds','@Common.numericSeverity')
module.exports = async (srv) => {
    const ECPersonalInformation = await cds.connect.to('ECPersonalInformation')
    const ECTimeOff = await cds.connect.to('ECTimeOff')

    const { PerPersonal , TimeType,TimeAccount} = srv.entities

    srv.on(['READ'], PerPersonal, async (req) => {
        //Work around that's no longer needed in CAP 5.6 and higher
/*          if (req.query.SELECT.from.ref[0].where){
            req.query.SELECT.from.ref[0].where[6].val += 'T00:00:00'
        }  */
        let PerPersonalQuery = SELECT.from(req.query.SELECT.from)
            .limit(req.query.SELECT.limit)
        if (req.query.SELECT.where) {
            PerPersonalQuery.where(req.query.SELECT.where)
        }
        if (req.query.SELECT.orderBy) {
            PerPersonalQuery.orderBy(req.query.SELECT.orderBy)
        }

        let personal = await ECPersonalInformation.tx(req).send({
            query: PerPersonalQuery,
            headers: {
                APIKey: process.env.APIKey
            }
        })
        let personals = []
        if (Array.isArray(personal)){
            personals = personal
        }else {personals[0] = personal}

        const getExtensionData = personals.map(async (item) => {
            const data = await SELECT.from(PerPersonal).where({ id: item.id })
            if (data[0]) {
                item.middelName = data[0].middelName
            } else {
                item.middelName = null
            }
            return item
        })
        const personalsWithExtension = await Promise.all(getExtensionData)
        if (req.query.SELECT.count) {
            if (personalsWithExtension.length < 30) { personalsWithExtension['$count'] = personalsWithExtension.length } else { personalsWithExtension['$count'] = 1_000 }
        }
        return personalsWithExtension
    })

     // TimeType 
 srv.on('READ', TimeType, async (req) => {
    let TimeTypeQuery = SELECT.from(req.query.SELECT.from)
        .limit(req.query.SELECT.limit);

    if (req.query.SELECT.where) {
        TimeTypeQuery.where(req.query.SELECT.where);
    }
    if (req.query.SELECT.orderBy) {
        TimeTypeQuery.orderBy(req.query.SELECT.orderBy);
    }

    const timetypes = await ECTimeOff.tx(req).send({
        query: TimeTypeQuery,
        headers: { APIKey: process.env.APIKey }
    });

    let timetypeList = Array.isArray(timetypes) ? timetypes : [timetypes];

    const getExtensionData = timetypeList.map(async (item) => {
        // Simulate adding a local extension field (e.g., customLabel)
        item.customLabel = null; // or some computed logic
        return item;
    });

    const timetypesWithExtension = await Promise.all(getExtensionData);

    if (req.query.SELECT.count) {
        timetypesWithExtension['$count'] =
            timetypesWithExtension.length < 30 ? timetypesWithExtension.length : 1000;
    }

    return timetypesWithExtension;
});

 // TimeAccount
 // TimeAccount (Refactored)
 srv.on('READ', TimeAccount, async (req) => {
    try {
        // Create the query payload for TimeAccount (like the others)
        const timeAccountQuery = {
            SELECT: req.query.SELECT
        };

        // Adjust request to use POST method for external service (if GET isn't supported)
        const timeAccounts = await ECTimeOff.tx(req).send({
            method: 'POST', // Use POST request instead of GET
            query: timeAccountQuery,
            headers: {
                APIKey: process.env.APIKey
            }
        });

        // Ensure the response is always an array
        let timeAccountList = Array.isArray(timeAccounts) ? timeAccounts : [timeAccounts];

        // If required, you can add custom fields or extensions here
        const getExtensionData = timeAccountList.map(async (item) => {
            item.customLabel = null; // Add logic for custom fields
            return item;
        });

        // Wait for all extension data to be processed
        const timeAccountsWithExtension = await Promise.all(getExtensionData);

        // Handle the $count if requested
        if (req.query.SELECT.count) {
            timeAccountsWithExtension['$count'] = (timeAccountsWithExtension.length < 30) ? timeAccountsWithExtension.length : 1000;
        }

        return timeAccountsWithExtension;
    } catch (error) {
        console.error('Error fetching TimeAccount:', error);
        req.error(500, `Failed to fetch TimeAccount: ${error.message}`);
    }

    
});



}