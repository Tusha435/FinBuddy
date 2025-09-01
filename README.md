# FinBuddy 🚀
## AI-Powered Financial Literacy Platform for Young Indians

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-000000.svg)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248.svg)](https://www.mongodb.com/)

FinBuddy is a comprehensive financial literacy platform designed specifically for young Indians aged 16-25. It combines AI-powered guidance with sophisticated analytics to help users plan their financial future with India-specific investment options, government schemes, and cultural financial contexts.

## 🌟 Features

### 🎯 Core Functionality
- **Multi-User Management**: Create, switch, and manage multiple user profiles
- **Dream Goal Planning**: Set and track financial goals with AI-powered savings strategies
- **Emergency Fund Calculator**: Build safety nets based on Indian financial recommendations
- **AI Financial Coach**: Get personalized advice for Indian financial markets
- **Advanced Analytics**: Time-series forecasting with predictive modeling

### 📊 Analytics & Insights
- **Real-time Charts**: Interactive financial visualizations using Chart.js
- **Predictive Forecasting**: Multiple scenario analysis (Conservative, Optimistic, Pessimistic)
- **Historical Data**: Time-series analysis for 3 months to 2+ years
- **Investment Tracking**: Monitor mutual funds, PPF, stocks, gold ETF performance
- **Expense Categorization**: Smart categorization with seasonal adjustments

### 🇮🇳 India-Specific Features
- **Government Schemes**: PPF, ELSS, NPS, Sukanya Samriddhi Yojana integration
- **Tax Optimization**: Section 80C, 80D recommendations
- **Cultural Context**: Festival budgeting, joint family expenses
- **Local Investment Options**: NSE/BSE stocks, Indian mutual funds
- **Regional Banking**: Support for SBI, HDFC, ICICI and other Indian banks

## 🏗️ Architecture

### Technology Stack
```
Frontend (React 18)
├── Components/
│   ├── Dashboard.js         # Main dashboard with financial overview
│   ├── UserSetup.js         # Onboarding for new users
│   ├── UserManager.js       # Multi-user switching interface
│   ├── GoalPlanner.js       # Dream goal creation and tracking
│   ├── Charts.js            # Advanced analytics and forecasting
│   ├── EmergencyFund.js     # Emergency fund calculator
│   ├── ChatInterface.js     # AI-powered financial coach
│   └── Navbar.js            # Navigation with glassmorphism design
├── Styling/
│   └── App.css              # Custom animations and glassmorphism effects
└── Routing/
    └── React Router DOM     # SPA navigation

Backend (Flask + Python)
├── API Endpoints/
│   ├── /api/users           # User CRUD operations
│   ├── /api/goals           # Goal management
│   ├── /api/analytics/*     # Time-series and forecasting
│   ├── /api/chat            # AI coach integration
│   └── /api/emergency-fund  # Emergency fund calculations
├── AI Integration/
│   ├── OpenAI GPT          # Conversational AI coach
│   └── LangChain           # Memory and conversation management
├── Data Layer/
│   ├── MongoDB             # Primary database
│   └── Fallback Storage    # In-memory for development
└── Analytics Engine/
    ├── NumPy               # Mathematical computations
    ├── Time Series         # Historical data generation
    └── Monte Carlo         # Predictive modeling
```

### Database Schema
```
Users Collection:
{
  user_id: UUID,
  age_bracket: String,
  status: String,
  monthly_income_range: String,
  name: String,
  created_at: DateTime,
  updated_at: DateTime
}

Goals Collection:
{
  goal_id: UUID,
  user_id: UUID,
  dream: String,
  target_amount: Number,
  current_amount: Number,
  timeline_months: Number,
  created_at: DateTime
}

Learning Progress Collection:
{
  user_id: UUID,
  modules_completed: Array,
  quiz_scores: Object,
  learning_path: String
}
```

## 🚀 Getting Started

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **MongoDB 4.4+** (optional - fallback available)
- **OpenAI API Key** (optional - fallback responses available)

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/finbuddy.git
cd finbuddy
```

2. **Backend Setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Add your keys to .env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/finbuddy
```

3. **Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install
```

4. **Database Setup (Optional)**
```bash
# Start MongoDB (if using local installation)
mongod --dbpath /your/db/path

# MongoDB Atlas (Recommended)
# 1. Create account at https://cloud.mongodb.com
# 2. Create cluster and get connection string
# 3. Update MONGODB_URI in .env
```

### Running the Application

1. **Start Backend Server**
```bash
# In root directory
python app.py

# Server starts on http://localhost:5000
```

2. **Start Frontend Development Server**
```bash
# In frontend directory
npm start

# Development server starts on http://localhost:3000
```

3. **Production Build**
```bash
# Build React app
cd frontend && npm run build

# Flask will serve the built React app
```

## 📡 API Documentation

### User Management
```http
GET    /api/users              # Get all users
POST   /api/user               # Create new user
GET    /api/user/{user_id}     # Get specific user
PUT    /api/user/{user_id}     # Update user
DELETE /api/user/{user_id}     # Delete user (cascade)
```

### Goal Management
```http
POST /api/goals                # Create financial goal
GET  /api/goals/{user_id}      # Get user's goals
```

### Advanced Analytics
```http
GET /api/analytics/time-series/{user_id}
    ?period=3months|6months|1year|2years
    &type=savings|expenses|investments

GET /api/analytics/forecast/{user_id}
    ?period=6months|1year|2years|5years
    &type=savings_projection|goal_achievement

GET /api/analytics/insights/{user_id}
    # Returns AI-powered financial insights
```

### AI Chat Interface
```http
POST /api/chat
{
  "message": "How should I start investing?",
  "user_context": {
    "age_bracket": "19-22",
    "status": "student",
    "monthly_income_range": "5k-15k"
  }
}
```

## 🧮 Financial Modeling & Analytics

### Data Generation Algorithm

FinBuddy uses sophisticated algorithms to generate realistic financial trajectories:

#### 1. **Income-Based Scaling**
```python
income_multipliers = {
    '0-5k': 0.3,
    '5k-15k': 0.7,
    '15k-30k': 1.0,
    '30k-50k': 1.5,
    '50k+': 2.0
}
```

#### 2. **Expense Categorization** (Based on Indian household surveys)
```python
category_allocation = {
    'Food': 25%,      # ₹3,750 for ₹15k income
    'Rent': 35%,      # ₹5,250
    'Transport': 15%, # ₹2,250
    'Entertainment': 10%,
    'Utilities': 8%,
    'Healthcare': 5%,
    'Shopping': 2%
}
```

#### 3. **Seasonal Adjustments** (Indian Context)
```python
seasonal_factors = {
    'Shopping': {
        'October-November': 2.0x,  # Diwali season
        'March-April': 1.3x        # Wedding season
    },
    'Food': {
        'Festival months': 1.3x
    }
}
```

#### 4. **Investment Growth Modeling**
```python
investment_returns = {
    'Mutual Funds': 12% ± 15% volatility,
    'PPF': 8% ± 2% volatility,
    'FD': 6% ± 1% volatility,
    'Stocks': 15% ± 25% volatility,
    'Gold ETF': 8% ± 12% volatility
}
```

#### 5. **Predictive Forecasting**
Uses compound interest with Monte Carlo simulation:
```python
# Conservative Scenario (12% annual)
future_value = principal * (1 + 0.12/12)^months + monthly_sip

# Optimistic Scenario (15% annual)
optimistic_value = principal * (1 + 0.15/12)^months + monthly_sip

# Pessimistic Scenario (8% annual)
pessimistic_value = principal * (1 + 0.08/12)^months + monthly_sip
```

### Financial Health Score Calculation
```python
def calculate_financial_health_score(user, goals):
    base_score = 50
    
    # Goal completion rate (0-30 points)
    completion_rate = current_savings / target_savings
    score += min(completion_rate * 30, 30)
    
    # Age advantage (younger = higher potential)
    if age_bracket == '16-18': score += 10
    elif age_bracket == '19-22': score += 5
    
    # Employment status
    if status == 'professional': score += 10
    elif status == 'student': score += 5
    
    return min(score, 100)
```

## 🎨 Design System

### Glassmorphism UI Framework
- **Background**: Multi-layer gradient overlays
- **Glass Cards**: `backdrop-filter: blur()` with transparency
- **Color Palette**: Professional blue-purple-indigo gradients
- **Typography**: Inter font family with gradient text effects

### Animation System
```css
/* Custom keyframe animations */
@keyframes fadeIn, slideIn, bounceIn, float, pulse
@keyframes hover-lift, hover-glow

/* Staggered animation delays */
.animate-fadeIn { animation-delay: 0ms, 500ms, 1000ms... }
```

### Responsive Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`  
- Desktop: `> 1024px`

## 🧪 Testing

### Backend Testing
```bash
# Test API endpoints
curl -X POST -H "Content-Type: application/json" \
  -d '{"age_bracket":"19-22","status":"student","monthly_income_range":"5k-15k"}' \
  http://localhost:5000/api/user

# Test analytics endpoint
curl http://localhost:5000/api/analytics/time-series/USER_ID?period=1year&type=savings
```

### Frontend Testing
```bash
# Run React development server
npm start

# Build production bundle
npm run build

# Test build locally
npx serve -s build
```

## 🔒 Security & Privacy

### Data Protection
- **Local Storage**: User preferences only
- **API Security**: CORS enabled with proper headers
- **Data Encryption**: MongoDB connection with TLS
- **No Sensitive Data**: No bank credentials or real financial data stored

### Privacy Features
- **Anonymous Usage**: Users identified by UUID only
- **Data Deletion**: Complete user data removal on request
- **Local Fallback**: Works without external database
- **No Tracking**: No third-party analytics or tracking

## 🚀 Deployment

### Heroku Deployment
```bash
# Install Heroku CLI
# Create new Heroku app
heroku create finbuddy-app

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Deploy
git push heroku main
```

### Docker Deployment
```dockerfile
# Dockerfile example
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "app.py"]
```

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster (Free tier available)
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 🤖 AI Integration

### OpenAI GPT Integration
- **Model**: GPT-3.5/4 with financial domain expertise
- **Context**: Indian financial markets, government schemes
- **Memory**: Conversation history using LangChain
- **Fallback**: Comprehensive pre-written responses for 15+ financial topics

### AI Coach Features
```python
# Specialized financial advice areas
financial_expertise = [
    "Investment strategies for Indians",
    "Tax optimization (80C, 80D)",
    "Government schemes guidance",
    "Banking and savings advice",
    "Emergency fund planning",
    "Goal-based financial planning",
    "Cryptocurrency regulations in India",
    "Insurance recommendations"
]
```

## 📊 Analytics & Insights

### Financial Health Metrics
- **Savings Rate**: Current savings vs. income percentage
- **Goal Completion**: Progress towards financial dreams
- **Risk Assessment**: Portfolio diversification analysis
- **Peer Comparison**: Benchmarking against similar user profiles

### Market Insights Integration
- **Equity Outlook**: Indian stock market trends
- **Interest Rates**: RBI policy impacts
- **Inflation Adjustment**: Real returns calculation
- **Sector Recommendations**: Top-performing Indian sectors

## 🎯 Roadmap

### Phase 1: Core Platform ✅
- [x] Multi-user management
- [x] Goal planning and tracking  
- [x] AI-powered chat interface
- [x] Advanced analytics and forecasting
- [x] Emergency fund calculator

### Phase 2: Enhanced Features 🚧
- [ ] Expense tracking integration
- [ ] Real-time market data integration
- [ ] Educational modules and quizzes
- [ ] Social features (family sharing)
- [ ] Mobile app development

### Phase 3: Advanced Analytics 📋
- [ ] Machine learning for personalized recommendations
- [ ] Real bank integration (read-only)
- [ ] Automated expense categorization
- [ ] Advanced tax optimization
- [ ] Retirement planning calculator

## 🤝 Contributing

### Development Setup
```bash
# Fork the repository
git fork https://github.com/yourusername/finbuddy.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
python app.py  # Backend
npm start      # Frontend

# Submit pull request
git push origin feature/your-feature-name
```

### Contribution Guidelines
1. **Code Style**: Follow PEP 8 for Python, ESLint for JavaScript
2. **Documentation**: Update README for new features
3. **Testing**: Add tests for new functionality
4. **Indian Context**: Ensure features are relevant to Indian users
5. **Security**: No hardcoded secrets or sensitive data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Financial Research**: Based on NSSO household expenditure surveys
- **Government Data**: Official schemes and tax information from Government of India
- **Market Data**: Growth rates based on NSE/BSE historical performance
- **UI/UX Inspiration**: Modern fintech applications with Indian cultural context

## 📞 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contribution Guidelines](docs/contributing.md)

### Community
- **Issues**: [GitHub Issues](https://github.com/yourusername/finbuddy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/finbuddy/discussions)
- **Email**: support@finbuddy.ai

### Financial Disclaimer
FinBuddy is an educational tool designed to improve financial literacy. All recommendations are for informational purposes only and should not be considered as professional financial advice. Users should consult with qualified financial advisors for investment decisions.

---

**Made with ❤️ for Young India's Financial Future**

*Empowering the next generation of financially literate Indians through AI-powered guidance and culturally relevant financial education.*