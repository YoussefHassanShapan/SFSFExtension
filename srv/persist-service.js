const cds = require('@sap/cds');
const multer = require('multer');
const xlsx = require('xlsx');

module.exports = cds.service.impl(async function () {
  const { EmployeeTime } = this.entities;

  this.on('addEmployeeTime', async (req) => {
    return await INSERT.into(EmployeeTime).entries(req.data);
  });
  
    this.on('uploadExcel', async (req) => {
      try {
        const base64 = req.data.data;
        const buffer = Buffer.from(base64, 'base64');
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const records = xlsx.utils.sheet_to_json(sheet);
    
     var x =   await cds.tx(req).run(INSERT.into(EmployeeTime).entries(records));
    
        const inserted = await cds.tx(req).run(SELECT.from(EmployeeTime));
        console.log("Inserted records:", inserted);
    
        return records;
      } catch (err) {
        console.error('Upload failed:', err.message);
        req.error(500, 'Failed to process the uploaded file.');
      }
    });
    
  });
  
