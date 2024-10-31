from backend.db.db_config import get_db_connection
from backend.logging_config import logger
from datetime import datetime

def log_article_summary(source, new_articles, existing_articles_count):
    logger.info(f"Existing articles found on {source}: {existing_articles_count}")

    if new_articles:
        logger.info(f"New articles found on {source}: {len(new_articles)}")
        
        truncated_titles = ' | '.join([' '.join(title.split()[:4]) + "..." for title in new_articles])
        logger.info(f"New articles: {truncated_titles}")
    else:
        logger.info(f"No new articles found on {source}")

def insert_article(data):
    try:
        connection = get_db_connection()
    except Exception as e:
        print(f"Failed to connect to the database: {e}")

    cursor = connection.cursor()

    sql = """
    INSERT INTO articles (source, scraped, api, title, url, img, category, first_scraped, days_found, city_identifier, county_identifier, state_identifier, national_identifier, special_identifier)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data['source']
        , data['scraped']
        , data['api']
        , data['title']
        , data['url']
        , data['img']
        , data['category']
        , data['first_scraped']
        , data['days_found']
        , data['city_identifier']
        , data['county_identifier']
        , data['state_identifier']
        , data['national_identifier']
        , data['special_identifier']
    )

    cursor.execute(sql, values)
    connection.commit()
    cursor.close()
    connection.close()

def check_article_exists(title, link):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT COUNT(*) FROM articles WHERE title = %s AND url = %s"
        cursor.execute(query, (title, link))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return result[0] > 0
    except Exception as e:
        logger.error(f"Error checking if article exists: {title}, {link}. Error: {e}")
        return False

def update_days_found(title, link):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        SELECT first_scraped FROM articles
        WHERE title = %s AND url = %s
    """
    cursor.execute(query, (title, link))
    result = cursor.fetchone()
    
    if result:
        first_scraped = result[0]
        
        today = datetime.now().date()
        days_passed = (today - first_scraped).days if (today - first_scraped).days > 0 else 1

        update_query = """
            UPDATE articles
            SET days_found = %s
            WHERE title = %s AND url = %s
        """
        cursor.execute(update_query, (days_passed, title, link))
        connection.commit()
    
    cursor.close()
    connection.close()