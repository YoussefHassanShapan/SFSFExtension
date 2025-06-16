const cds = require('@sap/cds');
const xlsx = require('xlsx');
const { randomBytes } = require('crypto'); 

module.exports = cds.service.impl(async function () {
const { EmployeeTime } = this.entities;

  // this.on('addEmployeeTime', async (req) => {
  //   return await INSERT.into(EmployeeTime).entries(req.data);
  // });

  this.on('addEmployeeTime', async (req) => {
    const {
      userId,
      timeType,
      approvalStatus,
      startDate,
      endDate
    } = req.data;
  
    // === Validation ===
    if (!startDate || !endDate) {
      return req.error(400, 'Both startDate and endDate are required.');
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (isNaN(start) || isNaN(end)) {
      return req.error(400, 'Invalid date format.');
    }
  
    if (end < start) {
      return req.error(400, 'endDate cannot be before startDate.');
    }
  
    // Generate externalCode before checking it
    const externalCode = randomBytes(16).toString('hex');
  
    const exists = await SELECT.one.from(EmployeeTime).where({ externalCode });
    if (exists) {
      return req.error(400, `An entry with externalCode "${externalCode}" already exists.`);
    }
  
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.floor((end - start) / millisecondsPerDay) + 1;
    const hours = days * 8;
  
    const result = await INSERT.into(EmployeeTime).entries({
      externalCode,
      userId,
      timeType,
      approvalStatus,
      startDate,
      endDate,
      quantityInDays: days,
      quantityInHours: hours,
      createdDateTime: new Date().toISOString(),
      lastModifiedDateTime: new Date().toISOString()
    });
  
    return result;
  });
  
  this.on('uploadExcel', async (req) => {
    try {
      const base64 = req.data.data;
      const buffer = Buffer.from(base64, 'base64');
      const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true }); 
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRecords = xlsx.utils.sheet_to_json(sheet, { raw: false }); 
  
      const records = rawRecords.map(record => {
        return {
          ...record,
          startDate: record.startDate ? new Date(record.startDate).toISOString().split('T')[0] : null,
          endDate: record.endDate ? new Date(record.endDate).toISOString().split('T')[0] : null
        };
      });
  
      await cds.tx(req).run(INSERT.into(EmployeeTime).entries(records));
      const inserted = await cds.tx(req).run(SELECT.from(EmployeeTime));
      console.log("Inserted records:", inserted);
  
      return records;
    } catch (err) {
      console.error('Upload failed:', err.message);
      req.error(500, 'Failed to process the uploaded file.');
    }
  });
      
  });
  
