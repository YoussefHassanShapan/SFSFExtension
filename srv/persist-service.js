const cds = require('@sap/cds');
const multer = require('multer');
const xlsx = require('xlsx');

module.exports = cds.service.impl(async function () {
  const { EmployeeTime } = this.entities;

  this.on('addEmployeeTime', async (req) => {
    return await INSERT.into(EmployeeTime).entries(req.data);
  });
  const xlsx = require('xlsx');

  this.on('uploadExcel', async (req) => {
    try {
      const base64 = req.data.data;
      const buffer = Buffer.from(base64, 'base64');
      const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true }); // <== this enables date parsing
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRecords = xlsx.utils.sheet_to_json(sheet, { raw: false }); // parses formatted strings
  
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
  
