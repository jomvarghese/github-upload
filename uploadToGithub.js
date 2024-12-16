const accessToken = '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';
const repoOwner = 'jomvarghese';
const repoName = 'github-upload';

// Function to upload a file to GitHub repository
async function uploadFileToGithub(file, filePath) {
  const fileContent = await readFile(file); // Read the file (whether text or binary)

  // GitHub API URL
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const data = {
    message: 'Uploading file to Workspace folder', // commit message
    content: fileContent, // Base64 encoded file content
    branch: 'master', // You can change this to a different branch if needed
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
    
    // If the file is a text file, read it as text
    if (file.type.startsWith('text')) {
      reader.onload = () => resolve(btoa(reader.result));  // Read as base64 for text files
      reader.onerror = reject;
      reader.readAsText(file);  // For text files
    } else {
      // For binary files (like images, pdfs, etc.), read as DataURL
      reader.onload = () => {
        // Extract base64 part from DataURL (if binary content)
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);  // Return only the base64 content
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);  // For binary files
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
