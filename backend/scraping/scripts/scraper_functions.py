from backend.db.db_config import get_db_connection
from backend.scraping.logging_config import logger
from datetime import datetime
import openai
import os

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
        logger.error(f"Failed to connect to the database: {e}")
        return

    cursor = connection.cursor()

    sql = """
    INSERT INTO articles (source, scraped, api, title, url, img, category, sourced, days_found, city_identifier, county_identifier, state_identifier, national_identifier, special_identifier)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data['source'],
        data['scraped'],
        data['api'],
        data['title'],
        data['url'],
        data['img'],
        data['category'],
        data['sourced'],
        data['days_found'],
        data['city_identifier'],
        data['county_identifier'],
        data['state_identifier'],
        data['national_identifier'],
        data['special_identifier']
    )

    try:
        cursor.execute(sql, values)
        connection.commit()
    except Exception as e:
        logger.error(f"Error inserting article: {data['title']}, {data['url']}. Error: {e}")
    finally:
        cursor.close()
        connection.close()

def check_article_exists(title, link):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT COUNT(*) FROM articles WHERE title = %s OR url = %s"
        cursor.execute(query, (title, link))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return result[0] > 0
    except Exception as e:
        logger.error(f"Error checking if article exists: {title}, {link}. Error: {e}")
        return False

def update_days_found(title, link):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            SELECT sourced FROM articles
            WHERE url = %s
        """
        cursor.execute(query, (link,))
        result = cursor.fetchone()

        if result:
            sourced = result[0]

            today = datetime.now()
            days_passed = (today - sourced).days if (today - sourced).days > 0 else 1

            update_query = """
                UPDATE articles
                SET days_found = %s
                WHERE url = %s
            """
            cursor.execute(update_query, (days_passed, link))
            connection.commit()

        cursor.close()
        connection.close()
    except Exception as e:
        logger.error(f"Error updating days found for article: {title}, {link}. Error: {e}")


def filter_articles_with_gpt(articles):
    """
    Filters articles using OpenAI GPT API based on custom criteria.
    """
    prompt = (
        "You are an assistant tasked with sorting news articles. "
        "Focus only on articles related to political, legislative, or financial topics. "
        "Exclude any articles about celebrities or entertainment. "
        "Here is the list of articles:\n\n"
    )
    for i, article in enumerate(articles, 1):
        prompt += f"{i}. Title: {article['title']}\n   Description: {article['description']}\n\n"

    prompt += "Return the numbers of articles that meet the criteria and include their titles."

    try:
        # Use the new OpenAI API syntax
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Replace with "gpt-3.5-turbo" if needed
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        # Access the content of the response
        filtered_response = response.choices[0].message['content']
        return filtered_response
    except openai.error.OpenAIError as e:
        raise RuntimeError(f"Error using OpenAI API: {e}")
