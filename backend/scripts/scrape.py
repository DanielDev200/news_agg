import logging
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from backend.scripts.scraper_functions import insert_article, check_article_exists, update_days_found

# Configure logging
logging.basicConfig(
    filename='scrape.log',  # Log to a file named 'scrape.log'
    level=logging.INFO,      # Set log level to INFO
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
    datefmt='%Y-%m-%d %H:%M:%S'
)

def scrape_articles(url, title_element, title_class):
    logging.info(f"Starting to scrape URL: {url}")
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = articles = soup.find_all(title_element, class_=title_class)

        for article in articles:
            a_tag = article.find('a')

            if a_tag:
                title = a_tag.text.strip()
                link = a_tag['href']

                article_data = {
                    'source': url,
                    'scraped': True,
                    'api': False,
                    'title': title,
                    'url': link,
                    'img': None,
                    'category': 'General',
                    'first_scraped': datetime.now().date(),
                    'days_found': 1,
                    'city_identifier': 'Long Beach',
                    'county_identifier': 'Los Angeles',
                    'state_identifier': 'CA',
                    'national_identifier': 'USA',
                    'special_identifier': None
                }

                if check_article_exists(title, link):
                    update_days_found(title, link)
                else:
                    insert_article(article_data)
    else:
        logging.error(f"Error fetching the page: {response.status_code}")

scrape_articles('https://longbeachize.com/', 'h3', 'entry-title')
scrape_articles('https://lbpost.com/', 'h2', 'entry-title')
logging.info(f"Fetch Complete")