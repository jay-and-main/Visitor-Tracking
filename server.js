const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets Configuration
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Initialize Google Sheets
const serviceAccountAuth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function initializeSheet() {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[0];

    // Check if headers exist, if not create them
    await sheet.loadHeaderRow();
    if (!sheet.headerValues || sheet.headerValues.length === 0) {
      await sheet.setHeaderRow([
        'Date',
        'Name',
        'Company',
        'ID Number',
        'In Time',
        'Purpose',
        'Out Time',
        'Approval Person',
        'Contact',
        'Status'
      ]);
    }

    return sheet;
  } catch (error) {
    console.error('Error initializing sheet:', error);
    throw error;
  }
}

// API Routes

// Add new visitor entry
app.post('/api/visitors', async (req, res) => {
  try {
    const {
      date,
      name,
      company,
      idNumber,
      inTime,
      purpose,
      outTime,
      approvalPerson,
      contact
    } = req.body;

    // Validation
    if (!date || !name || !company || !idNumber || !inTime || !purpose || !approvalPerson || !contact) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['date', 'name', 'company', 'idNumber', 'inTime', 'purpose', 'approvalPerson', 'contact']
      });
    }

    const sheet = await initializeSheet();

    // Add row to Google Sheets
    const newRow = await sheet.addRow({
      'Date': date,
      'Name': name,
      'Company': company,
      'ID Number': idNumber,
      'In Time': inTime,
      'Purpose': purpose,
      'Out Time': outTime || '',
      'Approval Person': approvalPerson,
      'Contact': contact,
      'Status': outTime ? 'Checked Out' : 'Checked In'
    });

    res.status(201).json({
      success: true,
      message: 'Visitor entry added successfully',
      data: {
        rowNumber: newRow.rowNumber,
        ...req.body
      }
    });

  } catch (error) {
    console.error('Error adding visitor:', error);
    res.status(500).json({
      error: 'Failed to add visitor entry',
      details: error.message
    });
  }
});

// Update visitor checkout time
app.patch('/api/visitors/:idNumber/checkout', async (req, res) => {
  try {
    const { idNumber } = req.params;
    const { outTime } = req.body;

    if (!outTime) {
      return res.status(400).json({ error: 'Out time is required' });
    }

    const sheet = await initializeSheet();
    await sheet.loadCells();

    const rows = await sheet.getRows();
    const visitorRow = rows.find(row => row.get('ID Number') === idNumber && !row.get('Out Time'));

    if (!visitorRow) {
      return res.status(404).json({ error: 'Active visitor not found with this ID' });
    }

    visitorRow.set('Out Time', outTime);
    visitorRow.set('Status', 'Checked Out');
    await visitorRow.save();

    res.json({
      success: true,
      message: 'Visitor checked out successfully',
      data: {
        idNumber,
        outTime,
        status: 'Checked Out'
      }
    });

  } catch (error) {
    console.error('Error updating checkout:', error);
    res.status(500).json({
      error: 'Failed to update checkout time',
      details: error.message
    });
  }
});

// Update any visitor entry fields
app.patch('/api/visitors/:idNumber', async (req, res) => {
  try {
    const { idNumber } = req.params;
    const updates = req.body;
    if (!idNumber) {
      return res.status(400).json({ error: 'ID Number is required' });
    }
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No update fields provided' });
    }
    const sheet = await initializeSheet();
    await sheet.loadCells();
    const rows = await sheet.getRows();
    // Find the most recent entry for this ID Number
    const visitorRow = rows.reverse().find(row => row.get('ID Number') === idNumber);
    if (!visitorRow) {
      return res.status(404).json({ error: 'Visitor not found with this ID' });
    }
    // Update fields
    const allowedFields = ['Date', 'Name', 'Company', 'ID Number', 'In Time', 'Purpose', 'Out Time', 'Approval Person', 'Contact', 'Status'];
    Object.entries(updates).forEach(([key, value]) => {
      // Map camelCase to header case if needed
      const headerKey = allowedFields.find(f => f.replace(/\s/g, '').toLowerCase() === key.replace(/\s/g, '').toLowerCase());
      if (headerKey && value !== undefined) {
        visitorRow.set(headerKey, value);
      }
    });
    await visitorRow.save();
    res.json({
      success: true,
      message: 'Visitor entry updated successfully',
      data: updates
    });
  } catch (error) {
    console.error('Error updating visitor:', error);
    res.status(500).json({
      error: 'Failed to update visitor entry',
      details: error.message
    });
  }
});

// Get all visitors
app.get('/api/visitors', async (req, res) => {
  try {
    const sheet = await initializeSheet();
    const rows = await sheet.getRows();

    const visitors = rows.map(row => ({
      date: row.get('Date'),
      name: row.get('Name'),
      company: row.get('Company'),
      idNumber: row.get('ID Number'),
      inTime: row.get('In Time'),
      purpose: row.get('Purpose'),
      outTime: row.get('Out Time'),
      approvalPerson: row.get('Approval Person'),
      contact: row.get('Contact'),
      status: row.get('Status')
    }));

    res.json({
      success: true,
      data: visitors
    });

  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({
      error: 'Failed to fetch visitors',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;