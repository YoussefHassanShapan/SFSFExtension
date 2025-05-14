const cds = require('@sap/cds','@Common.numericSeverity')
module.exports = async (srv) => {
    const ECPersonalInformation = await cds.connect.to('ECPersonalInformation')
    const ECTimeOff = await cds.connect.to('ECTimeOff')

    const { PerPersonal , TimeType,TimeAccount,EmployeeTime } = srv.entities
    
  // Shared date formatting function for Edm.DateTime
  const toODataDate = (val) => {
    const date = new Date(val);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format for ${val}`);
    }
    return `/Date(${date.getTime()})/`; // Format as /Date(<ticks>)/, e.g., /Date(1747267200000)/
};


srv.on('CREATE', EmployeeTime, async (req) => {
    try {
        const allowedFields = [
            'externalCode',
            'userId',
            'timeType',
            'startDate',
            'endDate',
            'approvalStatus',
            'quantityInHours',
             'userIdNav'
        ];
        const mandatoryFields = ['externalCode', 'userId', 'timeType', 'startDate', 'endDate'];

        // Create payload with allowed fields
        const payload = {};
        for (const field of allowedFields) {
            if (req.data[field] !== undefined) {
                payload[field] = req.data[field];
            }
        }

        // Validate mandatory fields
        for (const field of mandatoryFields) {
            if (!payload[field]) {
                throw new Error(`Missing mandatory field: ${field}`);
            }
        }

        // Add timeTypeNav (required navigation property)
        payload.timeTypeNav = {
            externalCode: payload.timeType // Link to TimeType entity
        };

        // Convert date fields to SuccessFactors format (/Date(<ticks>)/)
        for (const dateField of ['startDate', 'endDate', 'createdDateTime', 'lastModifiedDateTime']) {
            if (payload[dateField]) {
                payload[dateField] = toODataDate(payload[dateField]);
            }
        }

        // Set default values for createdBy and lastModifiedBy
        // payload.createdBy = payload.createdBy || 'admin';
        // payload.lastModifiedBy = payload.lastModifiedBy || 'admin';

        // Validate navigation properties
        if (!payload.timeTypeNav.externalCode) {
            throw new Error('Missing timeTypeNav.externalCode');
        }

        // Log the payload for debugging
        console.log('EmployeeTime CREATE payload:', JSON.stringify(payload, null, 2));

        // Send POST request to SuccessFactors
        const created = await ECTimeOff.tx(req).send({
            method: 'POST',
            path: 'EmployeeTime',
            data: payload,
            headers: {
                APIKey: process.env.APIKey
            }
        });

        return created;
    } catch (err) {
        console.error('CREATE EmployeeTime failed:', {
            message: err.message,
            stack: err.stack,
            response: err.response ? err.response.data : null
        });
        req.error(err.response?.status || 500, `Failed to create EmployeeTime: ${err.message}`);
    }
});
    srv.on('READ', EmployeeTime, async (req) => {
        try {
            const employeeTimeQuery = {
                SELECT: req.query.SELECT
            };

            const employeeTimes = await ECTimeOff.tx(req).send({
                method: 'POST',
                query: employeeTimeQuery,
                headers: {
                    APIKey: process.env.APIKey
                }
            });

            let list = Array.isArray(employeeTimes) ? employeeTimes : [employeeTimes];

            const withExtension = list.map(async (item) => {
                item.customLabel = null; // Add custom field logic here if needed
                return item;
            });

            const result = await Promise.all(withExtension);

            if (req.query.SELECT.count) {
                result['$count'] = (result.length < 30) ? result.length : 1000;
            }

            return result;
        } catch (err) {
            console.error('Error fetching EmployeeTime:', err.message);
            req.error(500, `Failed to fetch EmployeeTime: ${err.message}`);
        }
    });


    srv.on(['READ'], PerPersonal, async (req) => {
      
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

// CREATE handler for TimeType
 srv.on('CREATE', TimeType, async (req) => {
    console.log(req);
    debugger
    try {
      const created = await ECTimeOff.tx(req).send({
        method: 'POST',
        path: 'TimeType', 
        data: req.data,
        headers: {
          APIKey: process.env.APIKey
        }
      });

      return created;
    } catch (err) {
      console.error('CREATE TimeType failed:', err);
      req.error(500, `Failed to create TimeType: ${err.message}`);
    }
  });
 // TimeAccount
 srv.on('READ', TimeAccount, async (req) => {
    try {
        // Create the query payload for TimeAccount (like the others)
        const timeAccountQuery = {
            SELECT: req.query.SELECT
        };

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

srv.on('CREATE', TimeAccount, async (req) => {
    try {
      const payload = { ...req.data };
  
      const toODataDate = (val) => `/Date(${new Date(val).getTime()})/`;
  
      for (const dateField of [
        'startDate',
        'endDate',
        'bookingStartDate',
        'bookingEndDate',
        'mdfSystemEffectiveStartDate',
        'mdfSystemEffectiveEndDate'
      ]) {
        if (payload[dateField]) {
          payload[dateField] = toODataDate(payload[dateField]);
        }
      }
  
      // also convert nested date fields if needed
      if (payload.userIdNav?.startDate) {
        payload.userIdNav.startDate = toODataDate(payload.userIdNav.startDate);
      }
  
      const result = await ECTimeOff.tx(req).send({
        method: 'POST',
        path: 'TimeAccount',
        data: payload,
        headers: {
          APIKey: process.env.APIKey
        }
      });
  
      return result;
    } catch (err) {
      console.error('CREATE TimeAccount failed:', err.message);
      req.error(500, `Failed to create TimeAccount: ${err.message}`);
    }
  });
  

}