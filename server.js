const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

dotenv.config(); // Load .env file

const app = express();
const port = 3000;

app.use(express.json());  // Parse JSON requests
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public' directory

const repoOwner = 'jomvarghese';  // GitHub username
const repoName = 'github-upload';  // GitHub repo name
const myToken = process.env.GITHUB_TOKEN;  // GitHub token from .env

app.post('/upload', async (req, res) => {
  const { fileContent, filePath } = req.body;
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  const headers = {
    Authorization: `Bearer ${myToken}`,
    'Content-Type': 'application/json',
  };

  const data = {
    message: 'Uploading file to GitHub',
    content: fileContent,  // Base64 encoded file content
    branch: 'master',
  };

  try {
    const response = await axios.put(url, data, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file to GitHub', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
