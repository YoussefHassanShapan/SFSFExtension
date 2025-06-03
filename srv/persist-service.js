const cds = require('@sap/cds');
const multer = require('multer');
const xlsx = require('xlsx');

const upload = multer({ storage: multer.memoryStorage() });
module.exports = cds.service.impl(async function () {
  const { EmployeeTime } = this.entities;

  this.on('addEmployeeTime', async (req) => {
    return await INSERT.into(EmployeeTime).entries(req.data);
  });

  this.post('/uploadExcel', upload.single('file'), async (req, res) => {
    try {
      const { buffer, originalname } = req.file;
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const records = xlsx.utils.sheet_to_json(sheet);

      const db = await cds.connect.to('db'); // connect to CAP DB
      const { EmployeeTime } = db.entities;

      const result = [];

      for (const record of records) {
        try {
          await INSERT.into(EmployeeTime).entries(record);
          result.push({ externalCode: record.externalCode || '', status: 'Success', error: '' });
        } catch (e) {
          result.push({ externalCode: record.externalCode || '', status: 'Failed', error: e.message });
        }
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Upload failed', details: err.message });
    }
  });
  this.on('importExcel', async (req) => {
    return 'Please upload via /uploadExcel using form-data with a file field';
  });
  
});
