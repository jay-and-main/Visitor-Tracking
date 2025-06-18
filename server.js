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

    const sheet = doc.sheetsByIndex[0];

    // Try loading header row
    try {
      await sheet.loadHeaderRow();
    } catch (err) {
      if (err.message.includes('No values in the header row')) {
        console.warn('No header found, setting header row...');
        await sheet.setHeaderRow([
          'Date',
          'Name',
          'Company',
          'In Time',
          'Purpose',
          'Out Time',
          'Contact',
          'Status'
        ]);
      } else {
        throw err; // rethrow unexpected errors
      }
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
      inTime,
      purpose,
      outTime,
      contact
    } = req.body;

    // Validation (removed idNumber and approvalPerson)
    if (!date || !name || !company || !inTime || !purpose || !contact) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['date', 'name', 'company', 'inTime', 'purpose', 'contact']
      });
    }

    const sheet = await initializeSheet();

    // Add row to Google Sheets (using contact as unique identifier)
    const newRow = await sheet.addRow({
      'Date': date,
      'Name': name,
      'Company': company,
      'In Time': inTime,
      'Purpose': purpose,
      'Out Time': outTime || '',
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
app.patch('/api/visitors/:contact/checkout', async (req, res) => {
  try {
    const { contact } = req.params;
    const { outTime } = req.body;

    if (!outTime) {
      return res.status(400).json({ error: 'Out time is required' });
    }

    const sheet = await initializeSheet();
    await sheet.loadCells();

    // Find visitor row by unique contact and ensure Out Time is empty
    const rows = await sheet.getRows();
    const visitorRow = rows.find(row => row.get('Contact') === contact && !row.get('Out Time'));

    if (!visitorRow) {
      return res.status(404).json({ error: 'Active visitor not found with this contact' });
    }

    visitorRow.set('Out Time', outTime);
    visitorRow.set('Status', 'Checked Out');
    await visitorRow.save();

    res.json({
      success: true,
      message: 'Visitor checked out successfully',
      data: {
        contact,
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
app.patch('/api/visitors/:contact', async (req, res) => {
  try {
    const { contact } = req.params;
    const updates = req.body;
    if (!contact) {
      return res.status(400).json({ error: 'Contact is required' });
    }
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No update fields provided' });
    }
    const sheet = await initializeSheet();
    await sheet.loadCells();
    const rows = await sheet.getRows();
    // Find the visitor row with this contact
    const visitorRow = rows.reverse().find(row => row.get('Contact') === contact);
    if (!visitorRow) {
      return res.status(404).json({ error: 'Visitor not found with this contact' });
    }
    // Update fields (allowed fields updated)
    const allowedFields = ['Date', 'Name', 'Company', 'In Time', 'Purpose', 'Out Time', 'Contact', 'Status'];
    Object.entries(updates).forEach(([key, value]) => {
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
      inTime: row.get('In Time'),
      purpose: row.get('Purpose'),
      outTime: row.get('Out Time'),
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

// Get visitors from the current day minus 'n' days
app.get('/api/visitors/recent/:days', async (req, res) => {
  try {
    const { days } = req.params;
    const nDays = parseInt(days, 10);

    if (isNaN(nDays) || nDays < 0) {
      return res.status(400).json({ error: 'Invalid number of days' });
    }

    const sheet = await initializeSheet();
    const rows = await sheet.getRows();

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - nDays - 1); // Shift day by 1

    const visitors = rows.filter(row => {
      const rowDate = new Date(row.get('Date'));
      return rowDate >= startDate && rowDate <= today;
    }).map(row => ({
      date: row.get('Date'),
      name: row.get('Name'),
      company: row.get('Company'),
      inTime: row.get('In Time'),
      purpose: row.get('Purpose'),
      outTime: row.get('Out Time'),
      contact: row.get('Contact'),
      status: row.get('Status')
    }));

    res.status(200).json({
      success: true,
      data: visitors
    });

  } catch (error) {
    console.error('Error fetching recent visitors:', error);
    res.status(500).json({
      error: 'Failed to fetch recent visitors',
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