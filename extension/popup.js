document.getElementById('summarizeButton').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;

    if (url) {
        // Fetch the summary from your Flask API
        fetch('http://127.0.0.1:5000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(data => {
            const summaryBox = document.getElementById('summaryBox');
            const errorMessage = document.getElementById('errorMessage');

            if (data.summarized_content) {
                summaryBox.innerText = data.summarized_content;
                errorMessage.textContent = ''; // Clear any error message
            } else if (data.error) {
                summaryBox.innerText = '';
                errorMessage.textContent = data.error;
            }
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = 'An error occurred while fetching the summary.';
        });
    } else {
        alert("Please enter a valid Wikipedia URL.");
    }
});
