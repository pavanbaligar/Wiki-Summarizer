from flask import Flask, request, jsonify
from flask_cors import CORS  # For handling cross-origin requests
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Allow all origins

# Function to scrape content from Wikipedia page and summarize it
def get_wikipedia_summary(url):
    try:
        # Send a GET request to the Wikipedia page
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful (status code 200)
        
        # Parse the HTML content of the page
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the first paragraph from the Wikipedia page's content
        # You can modify this based on the structure of the page and what you want to extract
        paragraphs = soup.find_all('p')
        if paragraphs:
            # Combine first few paragraphs to create a summary (or use any other logic)
            summary = ' '.join([para.get_text() for para in paragraphs[:3]])
            return summary
        else:
            return "Summary not available"
    except requests.exceptions.RequestException as e:
        return f"Error fetching the page: {e}"

@app.route('/summarize', methods=['POST'])
def summarize():
    # Get the URL from the request body
    url = request.json.get('url')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    
    # Check if the URL is a Wikipedia URL
    if 'wikipedia.org' not in url:
        return jsonify({"error": "Only Wikipedia URLs are supported"}), 400
    
    # Get the summary from the Wikipedia page
    summary = get_wikipedia_summary(url)

    # Return the summarized content or error message
    return jsonify({"summarized_content": summary})

if __name__ == '__main__':
    app.run(debug=True)
