const cds = require('@sap/cds');
const xlsx = require('xlsx');
const { randomBytes } = require('crypto'); 
function toISODate(date) {
  return date.toISOString().split('T')[0];
}
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
  
    const externalCode = randomBytes(16).toString('hex');
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const hours = days * 8;
  
    const entry = {
      externalCode,
      userId,
      timeType,
      approvalStatus,
      startDate: toISODate(start),
      endDate: toISODate(end),
      quantityInDays: days,
      quantityInHours: hours

    };
  
    try {
      const result = await INSERT.into(EmployeeTime).entries(entry);
      return result;
    } catch (err) {
      console.error('Insert failed:', err.message);
      return req.error(500, 'Failed to insert entry.');
    }
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
  
