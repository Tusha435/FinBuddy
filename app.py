from app_factory import create_app
from config import Config

# Create Flask app using factory pattern
app = create_app()

if __name__ == '__main__':
    port = Config.PORT
    debug = Config.DEBUG
    app.run(debug=debug, host='0.0.0.0', port=port)