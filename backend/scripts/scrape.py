import requests
from bs4 import BeautifulSoup
from datetime import datetime
from backend.scripts.scraper_functions import insert_article, check_article_exists, update_days_found, log_article_summary
from backend.logging_config import logger

def scrape_articles(url, title_element, title_class):
    logger.info(f"Starting URL: {url}")
    response = requests.get(url)

    if response.status_code == 200:
        logger.info(f"Successfully fetched URL: {url}")
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.find_all(title_element, class_=title_class)
        
        logger.info(f"Total articles found on {url}: {len(articles)}")

        new_articles = []  # List to store new articles
        existing_articles_count = 0  # Counter for existing articles

        for article in articles:
            a_tag = article.find('a')

            if a_tag:
                title = a_tag.text.strip()
                link = a_tag['href']

                # Check if the article already exists in the database
                if check_article_exists(title, link):
                    existing_articles_count += 1
                    update_days_found(title, link)
                else:
                    # Insert new article
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
                    insert_article(article_data)
                    
                    # Add to new articles list
                    new_articles.append(title)
        
        # Log summary information
        log_article_summary(url, new_articles, existing_articles_count)

    else:
        logger.error(f"Error fetching the page: {response.status_code}")

logger.info(f"Starting scrape job at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
scrape_articles('https://longbeachize.com/', 'h3', 'entry-title')
scrape_articles('https://lbpost.com/', 'h2', 'entry-title')
logger.info(f"Fetch Complete")