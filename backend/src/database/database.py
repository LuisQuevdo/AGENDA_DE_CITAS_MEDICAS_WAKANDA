import psycopg2
from psycopg2 import DatabaseError
from decouple import config
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_connection():
    try:
        connection = psycopg2.connect(
            host=config('PGSQL_HOST'),
            user=config('PGSQL_USER'),
            password=config('PGSQL_PASSWORD'),
            database=config('PGSQL_DATABASE'),
        )
        return connection
    except DatabaseError as ex:
        logger.error(f"Error connecting to the database: {ex}")
        return None