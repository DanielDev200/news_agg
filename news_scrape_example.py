import requests
from bs4 import BeautifulSoup
from datetime import datetime
import argparse


def scrape_lb_post():
    url = 'https://lbpost.com/'  # Replace with the actual URL

    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all articles on the page based on the h2 with class 'entry-title'
        articles = soup.find_all('h2', class_='entry-title')
         
        # Loop through each article and extract information
        for article in articles:
            # Find the anchor (a-tag) inside the h2 tag
            a_tag = article.find('a')
            
            if a_tag:
                title = a_tag.text.strip()  # Get the article title
                link = a_tag['href']  # Get the article link
                
                # Example: Print article title and link (assuming dates are irrelevant here)
                print(f"Source: {url}")
                print(f"Title: {title}")
                print(f"Link: {link}\n")
    else:
        print(f"Error fetching the page: {response.status_code}")

def scrape_longbeachize():
    url = 'https://longbeachize.com/'  # Replace with the actual URL

    response = requests.get(url)

    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all articles on the page based on the h2 with class 'entry-title'
        articles = soup.find_all('h3', class_='entry-title')

        for article in articles:
            a_tag = article.find('a')

            if a_tag:
                title = a_tag.text.strip()
                link = a_tag['href']

                print(f"Source: {url}")
                print(f"Title: {title}")
                print(f"Link: {link}\n")

# scrape_lb_post()
scrape_longbeachize()
scrape_lb_post()