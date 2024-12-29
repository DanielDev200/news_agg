import requests
import os
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from datetime import datetime, timedelta
from backend.scraping.scripts.scraper_functions import (
    insert_article,
    check_article_exists,
    update_days_found,
    log_article_summary,
    is_article_relevant
)
from backend.scraping.logging_config import logger
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('NEWS_API_KEY')

if not API_KEY:
    raise ValueError("API key for The News API is not set. Please configure the NEWS_API_KEY environment variable.")

def fetch_news_api_articles(page):
    """Fetch articles from The News API."""
    logger.info(f"---- Starting articles News API fetch ----")
    url = 'https://api.thenewsapi.com/v1/news/top'
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')

    params = {
        'api_token': API_KEY,
        'locale': 'us',
        'categories': 'general,science,business,tech,politics',
        'exclude_categories': 'entertainment,sports,travel,health',
        'exclude_domains': 'benzinga.com,breitbart.com,rt.com',
        'language': 'en',
        'published_on': yesterday,
        'limit': 25,
        'page': page
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        if 'data' in data:
            articles = data['data']
            logger.info(f"Fetched {len(articles)} articles from The News API")
            return articles
        else:
            logger.warning("No articles found in response from The News API.")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching articles from The News API: {e}")
        return []

def save_news_api_articles(articles):
    """Saves relevant articles to the database."""
    new_articles = []
    existing_articles_count = 0

    for article in articles:
        if is_article_relevant(article):
            title = article['title']
            article_url = article['url']
            parsed_url = urlparse(article_url)
            source = f"{parsed_url.scheme}://{parsed_url.netloc}"

            if check_article_exists(title, article_url):
                existing_articles_count += 1
                update_days_found(title, article_url)
            else:
                article_data = {
                    'source': source,
                    'scraped': False,
                    'api': True,
                    'title': title,
                    'url': article_url,
                    'img': None,
                    'category': None,
                    'sourced': datetime.now().date(),
                    'days_found': 1,
                    'city_identifier': None,
                    'county_identifier': None,
                    'state_identifier': None,
                    'national_identifier': 'USA',
                    'special_identifier': None
                }
                insert_article(article_data)
                new_articles.append(title)

        else:
            logger.info(f"Article skipped: {article['title']}")

    log_article_summary("The News API", new_articles, existing_articles_count)


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
                        'category': None,
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


def process_news_api_articles():
    """Orchestrates the fetching, filtering, and saving of news articles."""
    for page in range(1, 5):  # Iterate through pages 1 to 4
        articles = fetch_news_api_articles(page)
    
        if articles:
            save_news_api_articles(articles)
        else:
            logger.info("No articles to process.")

logger.info(f"<<<<--- Starting articles fetch at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} --->>>>")
scrape_articles('https://longbeachize.com/', 'h3', 'entry-title')
scrape_articles('https://lbpost.com/', 'h2', 'entry-title')
scrape_articles('https://lbwatchdog.com/', 'h3', 'is-title')
process_news_api_articles()
logger.info(f"Fetch Complete")
