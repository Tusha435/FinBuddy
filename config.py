import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'finbuddy-secret-key')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    PORT = int(os.getenv('PORT', 5000))
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    DEBUG = FLASK_ENV == 'development'
    
    # Static folder configuration
    STATIC_FOLDER = 'frontend/build'
    STATIC_URL_PATH = ''