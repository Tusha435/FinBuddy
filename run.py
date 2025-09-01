#!/usr/bin/env python3
"""
FinBuddy Application Launcher
This script handles both development and production modes
"""

import os
import subprocess
import sys
from pathlib import Path

def build_frontend():
    """Build React frontend for production"""
    frontend_path = Path("frontend")
    
    if not frontend_path.exists():
        print("❌ Frontend directory not found!")
        return False
    
    print("🔨 Building React frontend...")
    try:
        # Change to frontend directory and run build
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=frontend_path,
            check=True,
            capture_output=True,
            text=True
        )
        print("✅ Frontend built successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend build failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import pymongo
        import openai
        import langchain
        print("✅ All Python dependencies are available")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Run: pip install -r requirements.txt")
        return False

def main():
    """Main function to run the application"""
    print("🚀 Starting FinBuddy Application...")
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check if this is production mode
    mode = os.getenv('FLASK_ENV', 'development')
    
    if mode == 'production' or '--build' in sys.argv:
        print("📦 Production mode - building frontend...")
        if not build_frontend():
            print("⚠️  Frontend build failed, but continuing with backend...")
    
    # Import and run the Flask app
    try:
        from app import app, init_db
        
        print("🔧 Initializing database...")
        init_db()
        
        print("🌐 Starting Flask server...")
        print("📊 Dashboard available at: http://localhost:5000")
        print("🔌 API endpoints available at: http://localhost:5000/api/")
        print("\n💡 To stop the server, press Ctrl+C")
        
        # Run the app
        port = int(os.getenv('PORT', 5000))
        debug = mode == 'development'
        
        app.run(
            debug=debug,
            host='0.0.0.0',
            port=port,
            use_reloader=False  # Avoid double startup in debug mode
        )
        
    except Exception as e:
        print(f"❌ Failed to start application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()