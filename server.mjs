import express from 'express';
import fetch from 'node-fetch'; // Import using ESM
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env
dotenv.config();

// Initialize express
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Setup Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// GitHub repository details
const repoOwner = 'jomvarghese';
const repoName = 'github-upload';
const myToken = process.env.GITHUB_TOKEN;  // Token is now securely loaded from .env

// Endpoint to upload a file to GitHub
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Read the file content and encode it in base64
  const fileContent = await readFile(file);

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.originalname}`;

  const headers = {
    'Authorization': `Bearer ${myToken}`,
    'Content-Type': 'application/json',
  };

  const data = {
    message: 'Uploading file to Workspace folder',
    content: fileContent,
    branch: 'master',
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (response.ok) {
      res.json({ message: 'File uploaded successfully', data: responseData });
    } else {
      res.status(400).json({ message: responseData.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

// Helper function to read file content and base64 encode it
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, (err, data) => {
      if (err) return reject(err);
      resolve(data.toString('base64'));
    });
  });
}

// Serve the frontend HTML page
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
