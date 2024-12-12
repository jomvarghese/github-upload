import fetch from 'node-fetch';
import fs from 'fs';

const GITHUB_TOKEN = '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';
const REPO_OWNER = 'jomvarghese';
const REPO_NAME = 'jomvarghese/js_workflow';
const FILE_PATH = 'path/in/repo/example.js'; // Path in the repo
const LOCAL_FILE_PATH = './example.js'; // Local file to upload
const COMMIT_MESSAGE = 'Upload example.js';

async function uploadFileToGitHub() {
  const content = fs.readFileSync(LOCAL_FILE_PATH, 'utf8');
  const encodedContent = Buffer.from(content).toString('base64');

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: COMMIT_MESSAGE,
      content: encodedContent,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('File uploaded successfully:', data);
  } else {
    console.error('Failed to upload file:', await response.text());
  }
}

uploadFileToGitHub().catch(console.error);
