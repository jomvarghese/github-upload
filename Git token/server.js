import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.GITHUB_TOKEN;

const GITHUB_API_URL = 'https://api.github.com/repos/jomvarghese/github-upload/contents/WorkSpace/';

async function uploadFileToGithub(fileName, fileContent) {
    const url = `${GITHUB_API_URL}${fileName}?ref=master`;
    const headers = {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    };

    // Check if file already exists
    const getFileUrl = `${GITHUB_API_URL}${fileName}`;
    let sha = null;

    try {
        // Fetch the file from GitHub to get the current sha if it exists
        const response = await fetch(getFileUrl, { headers });

        if (response.ok) {
            // If the file exists, get the sha from the response
            const fileData = await response.json();
            sha = fileData.sha;
            console.log(`File exists, sha: ${sha}`);
        } else {
            console.log(`File does not exist, will create a new file.`);
        }
    } catch (error) {
        console.error(`Error fetching file: ${error.message}`);
    }

    const data = {
        message: `Add ${fileName} to WorkSpace`,
        content: Buffer.from(fileContent).toString('base64'),
    };

    // If sha exists, we need to pass it in the request body to update the file
    if (sha) {
        data.sha = sha;
    }

    try {
        // Send the PUT request to GitHub API
        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(`File uploaded successfully: ${result.content.html_url}`);
        } else {
            console.log(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Example usage: Upload a file named 'test.txt' with content 'Hello, World!'
uploadFileToGithub('test.txt', 'Hello, World!');
