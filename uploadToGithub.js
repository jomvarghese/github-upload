const accessToken = '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';
const repoOwner = 'jomvarghese';
const repoName = 'github-upload';
const filePath = 'WorkSpace/filename.txt'; // Path in the repo

async function uploadFileToGithub(file) {
  const fileContent = await readFile(file);

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
  
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  const data = {
    message: 'Uploading file to Workspace folder', // commit message
    content: btoa(fileContent), // File content encoded in Base64
    branch: 'main' // You can change this to a different branch if needed
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('File uploaded successfully:', responseData);
    } else {
      console.error('Error uploading file:', responseData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Helper function to read file from the file input
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file); // For text files, adjust for other types (like images) if needed
  });
}

// Example usage with an HTML file input
document.getElementById('file-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadFileToGithub(file);
  }
});