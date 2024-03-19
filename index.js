const express = require('express');
const app = express();
const PORT = 3000;

const fs = require('fs').promises;
const path = require('path');

// Define paths to JSON files
const eventFilePath = path.join(__dirname, '/data/event.json');
const moodFilePath = path.join(__dirname, '/data/mood.json');

let eventData;
let moodData;

async function loadData() {
  try {
    eventData = JSON.parse(await fs.readFile(eventFilePath, 'utf8'));
    moodData = JSON.parse(await fs.readFile(moodFilePath, 'utf8'));
    console.log('Data loaded successfully.');
  } catch (error) {
    console.error('Error loading data:', error);
    // Exit the server if data loading fails
    process.exit(1);
  }
}

// Load data on server start
loadData();

// Define API endpoint
app.get('/api/data', (req, res) => {
  const { type } = req.query;

  if (!type || (type !== 'event' && type !== 'mood')) {
    return res.status(400).json({ error: 'Invalid or missing type parameter' });
  }

  const data = type === 'event' ? eventData : moodData;
  if (!data) {
    return res.status(500).json({ error: 'Data not loaded' });
  }

  res.json(data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
