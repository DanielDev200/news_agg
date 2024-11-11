import requests
import csv
import os

# Your API key
api_key = 'db3f5e2c9f264893b1d1747120e07181'

# Define the NewsAPI endpoint
url = 'https://newsapi.org/v2/top-headlines'

# Parameters for the API request
params = {
    'country': 'us',      # Fetch headlines from the US
    'category': 'business', # Category of news
    'apiKey': api_key
}

# Send the request
response = requests.get(url, params=params)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Convert the response to JSON
    data = response.json()

    # Specify the CSV file to append data to
    csv_file = 'news_results.csv'

    # Check if the file exists to determine if we need to write headers
    file_exists = os.path.isfile(csv_file)

    # Open the CSV file in append mode ('a' means append)
    with open(csv_file, 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)

        # Write the header row only if the file doesn't exist yet
        if not file_exists:
            writer.writerow(['Title', 'Source', 'URL'])

        # Write each article's details to the CSV file
        for article in data['articles']:
            writer.writerow([article['title'], article['source']['name'], article['url']])

    print(f"Results successfully appended to '{csv_file}'!")
else:
    print(f"Error: {response.status_code} - {response.text}")