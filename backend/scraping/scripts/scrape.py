import requests
from bs4 import BeautifulSoup
from datetime import datetime
from backend.scraping.scripts.scraper_functions import insert_article, check_article_exists, update_days_found, log_article_summary
from backend.scraping.logging_config import logger

def scrape_articles(url, title_element, title_class):
    logger.info(f"Starting URL: {url}")
    response = requests.get(url)

    if response.status_code == 200:
        logger.info(f"Successfully fetched URL: {url}")
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.find_all(title_element, class_=title_class)
        
        logger.info(f"Total articles found on {url}: {len(articles)}")

        new_articles = [] 
        existing_articles_count = 0

        for article in articles:
            a_tag = article.find('a')
            if not a_tag:
                a_tag = article.find_parent('a')

            if a_tag:
                title = article.text.strip()
                link = a_tag['href']

                if url in link:
                    article_url = link
                else:
                    article_url = url + link

                if check_article_exists(title, article_url):
                    existing_articles_count += 1
                    update_days_found(title, article_url)
                else:
                    article_data = {
                        'source': url,
                        'scraped': True,
                        'api': False,
                        'title': title,
                        'url': article_url,
                        'img': None,
                        'category': 'General',
                        'sourced': datetime.now().date(),
                        'days_found': 1,
                        'city_identifier': 'Long Beach',
                        'county_identifier': None,
                        'state_identifier': 'CA',
                        'national_identifier': None,
                        'special_identifier': None
                    }
                    insert_article(article_data)

                    new_articles.append(title)
                
        log_article_summary(url, new_articles, existing_articles_count)

    else:
        logger.error(f"Error fetching the page: {response.status_code}")

logger.info(f"Starting scrape job at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
scrape_articles('https://longbeachize.com/', 'h3', 'entry-title')
scrape_articles('https://lbpost.com/', 'h2', 'entry-title')
scrape_articles('https://lbwatchdog.com/', 'h3', 'is-title')
logger.info(f"Fetch Complete")
