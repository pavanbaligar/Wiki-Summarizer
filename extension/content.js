// Detect when the page has finished loading
window.addEventListener('load', function() {
    if (window.location.hostname.includes('wikipedia.org')) {
        // Send the URL to background script for processing
        fetchSummary(window.location.href);
    }
});

function fetchSummary(url) {
    // Send a POST request to the Flask API with the Wikipedia URL
    fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        if (data.summarized_content) {
            showSummaryPopup(data.summarized_content);  // Call the popup function here
        } else {
            showError("Unable to summarize this page.");
        }
    })
    .catch(error => {
        showError("An error occurred while fetching the summary.");
    });
}

// Show the summary in a popup
function showSummaryPopup(summary) {
    const summaryBox = document.createElement("div");
    summaryBox.id = "summaryPopup";
    summaryBox.style.position = "fixed";  // Fixed position to float on top of page
    summaryBox.style.top = "20px";
    summaryBox.style.right = "20px";
    summaryBox.style.width = "300px";
    summaryBox.style.maxHeight = "400px";  // Set max height for the popup
    summaryBox.style.padding = "20px";
    summaryBox.style.backgroundColor = "#f7e1e1";  // Light maroon background
    summaryBox.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    summaryBox.style.borderRadius = "8px";
    summaryBox.style.zIndex = "9999";  // Ensure it stays on top of other page elements
    summaryBox.style.fontFamily = "Arial, sans-serif";

    // Create a container for the summary text
    const summaryContent = document.createElement("div");
    summaryContent.style.maxHeight = "300px";  // Limit the height of the summary container
    summaryContent.style.overflowY = "auto";  // Allow vertical scrolling if content exceeds the height
    summaryContent.innerHTML = `<h3 style="color: #5b2a4d;">Summary:</h3><p style="color: #5b2a4d;">${summary}</p>`;  // Light maroon text color

    // Add the summary content to the popup
    summaryBox.appendChild(summaryContent);

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.id = "closeSummaryButton";
    closeButton.style.marginTop = "10px";  // Space between summary and button
    closeButton.style.backgroundColor = "#5b2a4d";  // Light maroon button
    closeButton.style.color = "#fff";  // White text for contrast
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.padding = "8px 12px";
    closeButton.style.cursor = "pointer";
    summaryBox.appendChild(closeButton);

    document.body.appendChild(summaryBox);  // Append the popup to the body

    // Close the popup when the button is clicked
    document.getElementById("closeSummaryButton").addEventListener("click", function() {
        document.body.removeChild(summaryBox);  // Remove the popup from the page
    });
}

// Display error message
function showError(message) {
    const errorBox = document.createElement("div");
    errorBox.style.position = "fixed";
    errorBox.style.top = "20px";
    errorBox.style.right = "20px";
    errorBox.style.width = "300px";
    errorBox.style.padding = "20px";
    errorBox.style.backgroundColor = "#f8d7da";
    errorBox.style.color = "#721c24";
    errorBox.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    errorBox.style.borderRadius = "8px";
    errorBox.style.zIndex = "9999";
    errorBox.style.fontFamily = "Arial, sans-serif";
    
    errorBox.innerHTML = `
        <h3>Error:</h3>
        <p>${message}</p>
        <button id="closeErrorButton">Close</button>
    `;
    
    document.body.appendChild(errorBox);

    // Add close button functionality
    document.getElementById("closeErrorButton").addEventListener("click", function() {
        document.body.removeChild(errorBox);
    });
}