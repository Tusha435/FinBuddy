from pymongo import MongoClient
from config import Config

client = None
db = None

def init_db():
    global client, db
    try:
        mongodb_uri = Config.MONGODB_URI
        client = MongoClient(mongodb_uri)
        db = client['finbuddy']
        
        # Test connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully!")
        
        # Create indexes for better performance
        db.users.create_index("user_id", unique=True)
        db.goals.create_index("user_id")
        db.learning_progress.create_index("user_id")
        
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        print("Using local fallback - consider setting up MongoDB Atlas")
        # Fallback to in-memory storage for development
        db = {
            'users': [],
            'goals': [],
            'learning_progress': []
        }

def get_db():
    return db