const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf2html = require('pdf2html');  // You can replace this with any suitable package

const app = express();
const port = 5000;

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// API endpoint to handle bulk PDF uploads and conversion
app.post('/convert', upload.array('pdfs', 10), (req, res) => {
  const pdfFiles = req.files;

  if (!pdfFiles.length) {
    return res.status(400).send('No files uploaded');
  }

  const convertedHtmlFiles = [];

  pdfFiles.forEach((pdfFile) => {
    const pdfPath = pdfFile.path;
    const outputHtmlPath = `uploads/${pdfFile.filename}.html`;

    // Convert the PDF to HTML
    pdf2html.pdfToHtml(pdfPath, outputHtmlPath, (err, output) => {
      if (err) {
        return res.status(500).send(`Error converting PDF: ${err.message}`);
      }

      convertedHtmlFiles.push(outputHtmlPath);
      
      // Once all PDFs are converted, send back the file paths to the frontend
      if (convertedHtmlFiles.length === pdfFiles.length) {
        res.json({ files: convertedHtmlFiles });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
