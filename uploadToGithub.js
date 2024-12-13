const accessToken = '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';
const repoOwner = 'jomvarghese';
const repoName = 'github-upload';
const filePath = 'WorkSpace/filename.ext'; // Path in the repo

// Function to upload file to GitHub repository
async function uploadFileToGithub(file) {
  const fileContent = await readFile(file); // Read the file (whether text or binary)

  // GitHub API URL
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const data = {
    message: 'Uploading file to Workspace folder', // commit message
    content: btoa(fileContent), // Base64 encoded file content
    branch: 'main', // You can change this to a different branch if needed
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data), // Send data in JSON format
    });

    const responseData = await response.json();

    if (response.ok) {
      alert('File uploaded successfully!');
      console.log('File uploaded successfully:', responseData);
    } else {
      alert('Error uploading file: ' + responseData.message);
      console.error('Error uploading file:', responseData);
    }
  } catch (error) {
    alert('Error: ' + error);
    console.error('Error:', error);
  }
}

// Helper function to read file from the file input
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Choose the appropriate read method based on file type
    if (file.type.startsWith('text')) {
      reader.onload = () => resolve(reader.result);  // Read as text for text-based files
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      reader.onload = () => resolve(reader.result);  // Read as DataURL for binary files
      reader.onerror = reject;
      reader.readAsDataURL(file);
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