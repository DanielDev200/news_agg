from db_config import get_db_connection

def insert_article(data):
    connection = get_db_connection()
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
    connection.commit()  # Save the changes
    cursor.close()
    connection.close()

def check_article_exists(title, link):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT COUNT(*) FROM articles WHERE title = %s AND url = %s"
    cursor.execute(query, (title, link))
    result = cursor.fetchone()
    
    cursor.close()
    connection.close()

    return result[0] > 0  # Return True if count > 0

def update_days_found(title, link):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        UPDATE articles
        SET days_found = days_found + 1
        WHERE title = %s AND url = %s
    """
    cursor.execute(query, (title, link))
    connection.commit()
    
    cursor.close()
    connection.close()