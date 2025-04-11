const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

const PORT = 3000;

// Map CSV file paths to operation types
const csvFiles = {
  char: './data/CharOperationsJava.csv',
  string: './data/StringOperationsJava.csv',
  stringbuilder: './data/StringBuilderOperationsJava.csv',
  array: './data/ArrayOperationsJava.csv',
};

// Endpoint to serve data with example usage
app.get('/data/:type', (req, res) => {
  const type = req.params.type.toLowerCase();
  const csvFilePath = csvFiles[type];

  if (!csvFilePath) {
    return res.status(400).json({ error: 'Invalid operation type' });
  }

  const results = [];
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      // Add an exampleUsage column in CSV if not already added
      row['Example Usage'] = row['Example Usage'] || 'No example available'; // Handle if example is not provided in CSV
      results.push(row);
    })
    .on('end', () => res.json(results))
    .on('error', (err) => res.status(500).json({ error: err.message }));
});

// Serve static files
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
