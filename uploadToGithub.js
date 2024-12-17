// Function to upload a file to GitHub repository
async function uploadFileToGithub(file, filePath) {
  console.log('Starting file upload...');

  const fileContent = await readFile(file);  // Read the file (base64 encode)

  // Send file data to the backend to upload to GitHub
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileContent, filePath }),
    });

    const responseData = await response.json();
    console.log('GitHub API response:', responseData);

    if (response.ok) {
      alert('File uploaded successfully!');
    } else {
      alert(`Error uploading file: ${responseData.message}`);
    }
  } catch (error) {
    alert('Error uploading file: ' + error.message);
    console.error('Error:', error);
  }
}

// Helper function to read file content and encode it in Base64
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(btoa(reader.result));  // Base64 encode the text content
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);  // Read text files
  });
}

// Attach event listener to the "Upload" button
document.getElementById('upload-button').addEventListener('click', () => {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];  // Get the selected file

  if (file) {
    const filePathWithName = `WorkSpace/${file.name}`;  // Specify file path in the repo
    uploadFileToGithub(file, filePathWithName);  // Call the function to upload the file
  } else {
    alert('Please select a file to upload!');
  }
});
