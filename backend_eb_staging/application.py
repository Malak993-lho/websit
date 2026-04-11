"""
WSGI entry for AWS Elastic Beanstalk and Gunicorn.
"""
from app import create_app

application = create_app()
