from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
import openai
from config import Config
from database import init_db, get_db
from routes.users import users_bp
from routes.goals import goals_bp
from routes.analytics import analytics_bp
from routes.chat import chat_bp, init_ai

def create_app():
    app = Flask(__name__, static_folder=Config.STATIC_FOLDER, static_url_path=Config.STATIC_URL_PATH)
    
    # Configure app
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Set OpenAI API key
    openai.api_key = Config.OPENAI_API_KEY
    
    # Initialize database
    init_db()
    
    # Initialize AI
    init_ai()
    
    # Register blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(goals_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(chat_bp)
    
    # Basic routes
    @app.route('/')
    def hello():
        return jsonify({
            "message": "FinBuddy: AI-Powered Financial Literacy Platform", 
            "version": "1.0",
            "status": "active"
        })

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "service": "FinBuddy"})

    @app.route('/api/debug/collections', methods=['GET'])
    def debug_collections():
        try:
            db = get_db()
            if isinstance(db, dict):
                return jsonify({
                    "storage_type": "fallback",
                    "users_count": len(db['users']),
                    "goals_count": len(db['goals']),
                    "learning_progress_count": len(db['learning_progress'])
                })
            else:
                return jsonify({
                    "storage_type": "mongodb",
                    "users_count": db.users.count_documents({}),
                    "goals_count": db.goals.count_documents({}),
                    "learning_progress_count": db.learning_progress.count_documents({})
                })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path):
        try:
            if path != "" and os.path.exists(app.static_folder + '/' + path):
                return send_from_directory(app.static_folder, path)
            else:
                return send_from_directory(app.static_folder, 'index.html')
        except:
            return jsonify({
                "message": "FinBuddy API is running!", 
                "frontend": "Build the React app first: cd frontend && npm run build",
                "version": "1.0"
            })
    
    return app