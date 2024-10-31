import os
import mysql.connector
import logging
from mysql.connector import Error
from dotenv import load_dotenv

logging.basicConfig(
    filename='scrape.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

env_path = os.path.join(os.path.dirname(__file__), '../../.env')

load_dotenv(env_path)

if os.getenv('ENV') == 'development':
    load_dotenv(env_path)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            port=os.getenv('MYSQL_PORT', 3306),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE')
        )

        return connection
    except Error as e:
        logging.error(f"Error connecting to the database: {e}")
        return None



