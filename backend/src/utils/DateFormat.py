from datetime import datetime
from typing import Union

class DateFormat:
    """
    Utility class for handling date formatting and parsing in the medical application.
    Provides consistent date handling across all modules.
    """
    
    # Standard date formats used in the application
    DB_FORMAT = '%Y-%m-%d'               # Database format (e.g., 2023-12-25)
    DISPLAY_FORMAT = '%d/%m/%Y'          # Display format (e.g., 25/12/2023)
    DATETIME_DB_FORMAT = '%Y-%m-%d %H:%M:%S'  # For datetime in database
    TIMESTAMP_FORMAT = '%Y%m%d_%H%M%S'   # For filenames/logs
    
    @classmethod
    def string_to_date(cls, date_string: str, format: str = None) -> datetime.date:
        """
        Convert a string to a date object.
        
        Args:
            date_string: The date string to parse
            format: The format string (defaults to DB_FORMAT)
            
        Returns:
            datetime.date object
            
        Raises:
            ValueError: If the string cannot be parsed
        """
        fmt = format or cls.DB_FORMAT
        return datetime.strptime(date_string, fmt).date()
    
    @classmethod
    def date_to_string(cls, date_obj: Union[datetime.date, datetime], format: str = None) -> str:
        """
        Convert a date object to a formatted string.
        
        Args:
            date_obj: The date to format (date or datetime object)
            format: The format string (defaults to DISPLAY_FORMAT)
            
        Returns:
            Formatted date string
        """
        fmt = format or cls.DISPLAY_FORMAT
        return date_obj.strftime(fmt)
    
    @classmethod
    def string_to_datetime(cls, datetime_string: str, format: str = None) -> datetime:
        """
        Convert a string to a datetime object.
        
        Args:
            datetime_string: The datetime string to parse
            format: The format string (defaults to DATETIME_DB_FORMAT)
            
        Returns:
            datetime object
        """
        fmt = format or cls.DATETIME_DB_FORMAT
        return datetime.strptime(datetime_string, fmt)
    
    @classmethod
    def datetime_to_string(cls, datetime_obj: datetime, format: str = None) -> str:
        """
        Convert a datetime object to a formatted string.
        
        Args:
            datetime_obj: The datetime to format
            format: The format string (defaults to DATETIME_DB_FORMAT)
            
        Returns:
            Formatted datetime string
        """
        fmt = format or cls.DATETIME_DB_FORMAT
        return datetime_obj.strftime(fmt)
    
    @classmethod
    def get_current_date(cls, format: str = None) -> str:
        """
        Get current date as formatted string.
        
        Args:
            format: The format string (defaults to DB_FORMAT)
            
        Returns:
            Current date as string
        """
        fmt = format or cls.DB_FORMAT
        return datetime.now().strftime(fmt)
    
    @classmethod
    def get_current_datetime(cls, format: str = None) -> str:
        """
        Get current datetime as formatted string.
        
        Args:
            format: The format string (defaults to DATETIME_DB_FORMAT)
            
        Returns:
            Current datetime as string
        """
        fmt = format or cls.DATETIME_DB_FORMAT
        return datetime.now().strftime(fmt)
    
    @classmethod
    def is_valid_date(cls, date_string: str, format: str = None) -> bool:
        """
        Check if a date string is valid according to the specified format.
        
        Args:
            date_string: The date string to validate
            format: The format string (defaults to DB_FORMAT)
            
        Returns:
            True if valid, False otherwise
        """
        fmt = format or cls.DB_FORMAT
        try:
            datetime.strptime(date_string, fmt)
            return True
        except ValueError:
            return False
    
    @classmethod
    def convert_format(cls, date_string: str, from_format: str, to_format: str) -> str:
        """
        Convert a date string from one format to another.
        
        Args:
            date_string: The date string to convert
            from_format: The current format of the date string
            to_format: The desired output format
            
        Returns:
            Date string in new format
            
        Raises:
            ValueError: If the input string doesn't match from_format
        """
        date_obj = datetime.strptime(date_string, from_format)
        return date_obj.strftime(to_format)