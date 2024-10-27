import logging

# Configure logging
logging.basicConfig(
    filename='scrape.log',  # Log to a file named 'scrape.log'
    level=logging.INFO,      # Set log level to INFO
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Optional: Define a logger instance that can be used across modules
logger = logging.getLogger(__name__)