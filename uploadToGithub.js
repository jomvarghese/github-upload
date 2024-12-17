require('dotenv').config();  // Ensure the .env file is loaded properly

// GitHub repository details
const repoOwner = 'jomvarghese';  // Replace with your GitHub username
const repoName = 'github-upload';  // Replace with your repository name
const myToken = process.env.GITHUB_TOKEN;  // GitHub token loaded from .env file

console.log('Token:', myToken);  // Log token to check if it's loaded correctly

// Function to upload a file to GitHub repository
async function uploadFileToGithub(file, filePath) {
  console.log('Starting file upload...');  // Log when upload begins

  const fileContent = await readFile(file);  // Read the file (base64 encode)

  // GitHub API URL for uploading file
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  // Headers for GitHub API
  const headers = {
    'Authorization': `Bearer ${myToken}`,
    'Content-Type': 'application/json',
  };

  const data = {
    message: 'Uploading file to Workspace folder',  // Commit message
    content: fileContent,  // Base64 encoded file content
    branch: 'master',  // Use the correct branch name (e.g., 'main')
  };

  try {
    console.log('Sending request to GitHub API...');  // Log before sending request
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),  // Send data as JSON
    });

    const responseData = await response.json();
    console.log('GitHub API response:', responseData);  // Log the full response from GitHub

    if (response.ok) {
      alert('File uploaded successfully!');
      console.log('File uploaded successfully:', responseData);
    } else {
      alert(`Error uploading file: ${responseData.message}`);
      console.error('Error uploading file:', responseData);
    }
  } catch (error) {
    alert('Error: ' + error.message);
    console.error('Error:', error);
  }
}

// Helper function to read file content and encode it in Base64
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // If the file is a text file, read it as text
    if (file.type.startsWith('text')) {
      reader.onload = () => resolve(btoa(reader.result));  // Base64 encode the text content
      reader.onerror = (err) => {
        console.error('File read error:', err);
        reject(err);
      };
      reader.readAsText(file);  // Read text files
    } else {
      // For binary files (like images, PDFs, etc.), read as DataURL
      reader.onload = () => {
        // Extract base64 part from DataURL (remove prefix like 'data:image/png;base64,')
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);  // Return only the base64 content
      };
      reader.onerror = (err) => {
        console.error('File read error:', err);
        reject(err);
      };
      reader.readAsDataURL(file);  // Read binary files
    }
  });
}

// Attach event listener to the "Upload" button
document.getElementById('upload-button').addEventListener('click', () => {
  console.log('Upload button clicked');  // Log to ensure click event is being triggered

  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];  // Get the selected file

  if (file) {
    console.log('File selected:', file);  // Log the selected file
    const filePathWithName = `WorkSpace/${file.name}`;  // Specify file path in the repo
    uploadFileToGithub(file, filePathWithName);  // Call the function to upload the file
  } else {
    alert('Please select a file to upload!');
    console.log('No file selected!');
  }
});
