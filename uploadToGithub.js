<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload File to GitHub</title>
</head>
<body>

    <h1>Upload File to GitHub</h1>
    
    <label for="fileUpload">Choose file to upload:</label>
    <input type="file" id="fileUpload" />
    <br><br>

    <button onclick="uploadFile()">Upload File</button>

    <div id="status"></div>

    <script>
        const GITHUB_API_URL = 'https://api.github.com/repos/jomvarghese/github-upload/contents/WorkSpace/'; // Update for WorkSpace folder
        const ACCESS_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN'; // Use your PAT here

        async function uploadFile() {
            const fileInput = document.getElementById('fileUpload');
            const file = fileInput.files[0];

            if (!file) {
                document.getElementById('status').innerText = 'Please select a file first.';
                return;
            }

            const fileName = file.name;
            const fileContent = await readFile(file);
            const encodedContent = btoa(fileContent); // Base64 encode the file content

            // Update URL to include 'master' branch
            const url = `${GITHUB_API_URL}${fileName}?ref=master`; // ref=master targets the master branch
            const headers = {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            };

            const data = {
                message: `Add ${fileName} to WorkSpace`, // Commit message
                content: encodedContent, // Base64 content of the file
            };

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    document.getElementById('status').innerText = `File uploaded successfully: ${result.content.html_url}`;
                } else {
                    document.getElementById('status').innerText = `Error: ${result.message}`;
                }
            } catch (error) {
                document.getElementById('status').innerText = `Error: ${error.message}`;
            }
        }

        function readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }
    </script>

</body>
</html>
