require('dotenv').config();  // Make sure you are loading the .env file for the token

// GitHub repository details
const repoOwner = 'jomvarghese';  // Replace with your GitHub username
const repoName = 'github-upload';  // Replace with your repository name
const myToken = process.env.GITHUB_TOKEN;  // Load GitHub token from .env

console.log(myToken);  // Log token to confirm it is loaded correctly (for debugging purposes)

// Function to upload a file to GitHub repository
async function uploadFileToGithub(file, filePath) {
  const fileContent = await readFile(file);  // Read and encode the file content (base64)

  // GitHub API URL for uploading file
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  // Use the GitHub token in the Authorization header
  const headers = {
    'Authorization': `Bearer ${myToken}`,
    'Content-Type': 'application/json',
  };

  const data = {
    message: 'Uploading file to Workspace folder',  // Commit message
    content: fileContent,  // Base64 encoded file content
    branch: 'master',  // You can specify a different branch if needed
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),  // Send data as JSON
    });

    const responseData = await response.json();
    
    // Log detailed response for debugging
    console.log('GitHub API response:', responseData);

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
      reader.onerror = reject;
      reader.readAsText(file);  // Read text files
    } else {
      // For binary files (like images, PDFs, etc.), read as DataURL
      reader.onload = () => {
        // Extract base64 part from DataURL (remove prefix like 'data:image/png;base64,')
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);  // Return only the base64 content
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);  // Read binary files
    }
  });
}

// Attach event listener to the "Upload" button
document.getElementById('upload-button').addEventListener('click', () => {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0]; // Get the selected file

  if (file) {
    // Update filePath to include the selected file's name
    const filePathWithName = `WorkSpace/${file.name}`;
    uploadFileToGithub(file, filePathWithName); // Pass the file and filePath
  } else {
    alert('Please select a file to upload!');
  }
});
