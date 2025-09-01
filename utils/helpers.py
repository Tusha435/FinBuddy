import random
from datetime import datetime, timedelta

def get_income_multiplier(income_range):
    multipliers = {
        '0-5k': 0.3,
        '5k-15k': 0.7,
        '15k-30k': 1.0,
        '30k-50k': 1.5,
        '50k+': 2.0
    }
    return multipliers.get(income_range, 1.0)

def get_category_multiplier(category):
    multipliers = {
        'Food': 0.25,
        'Rent': 0.35,
        'Transport': 0.15,
        'Entertainment': 0.10,
        'Utilities': 0.08,
        'Healthcare': 0.05,
        'Shopping': 0.02
    }
    return multipliers.get(category, 0.1)

def get_seasonal_factor(category, month):
    # Festival season adjustments
    if category == 'Shopping' and month in [10, 11]:  # Diwali season
        return 2.0
    elif category == 'Entertainment' and month in [12, 1]:  # New Year
        return 1.5
    elif category == 'Food' and month in [10, 11, 12]:  # Festival season
        return 1.3
    return 1.0

def get_category_color(category):
    colors = {
        'Food': '#10B981',
        'Rent': '#F59E0B',
        'Transport': '#3B82F6',
        'Entertainment': '#8B5CF6',
        'Utilities': '#06B6D4',
        'Healthcare': '#EF4444',
        'Shopping': '#F97316'
    }
    return colors.get(category, '#6B7280')

def get_investment_allocation(inv_type):
    allocations = {
        'Mutual Funds': 0.40,
        'PPF': 0.25,
        'FD': 0.15,
        'Gold ETF': 0.12,
        'Stocks': 0.08
    }
    return allocations.get(inv_type, 0.1)

def get_investment_growth_rate(inv_type):
    growth_rates = {
        'Mutual Funds': 0.12,
        'PPF': 0.08,
        'FD': 0.06,
        'Gold ETF': 0.08,
        'Stocks': 0.15
    }
    return growth_rates.get(inv_type, 0.08)

def get_investment_volatility(inv_type):
    volatility = {
        'Mutual Funds': 0.15,
        'PPF': 0.02,
        'FD': 0.01,
        'Gold ETF': 0.12,
        'Stocks': 0.25
    }
    return volatility.get(inv_type, 0.1)

def get_investment_color(inv_type):
    colors = {
        'Mutual Funds': '#3B82F6',
        'PPF': '#10B981',
        'FD': '#F59E0B',
        'Gold ETF': '#FBBF24',
        'Stocks': '#8B5CF6'
    }
    return colors.get(inv_type, '#6B7280')

def calculate_financial_health_score(user, goals):
    # Simple scoring algorithm
    score = 50  # Base score
    
    # Goal completion rate
    if goals:
        completion_rate = sum(goal.get('current_amount', 0) for goal in goals) / sum(goal.get('target_amount', 1) for goal in goals)
        score += min(completion_rate * 30, 30)
    
    # Age factor (younger = higher potential)
    age_bracket = user.get('age_bracket', '19-22')
    if age_bracket == '16-18':
        score += 10
    elif age_bracket == '19-22':
        score += 5
    
    # Status factor
    if user.get('status') == 'professional':
        score += 10
    elif user.get('status') == 'student':
        score += 5
    
    return min(score, 100)

def generate_recommendations(user, goals):
    recommendations = []
    
    income_range = user.get('monthly_income_range', '15k-30k')
    status = user.get('status', 'student')
    
    if len(goals) == 0:
        recommendations.append("🎯 Start by setting your first financial goal to create a clear roadmap")
    
    if income_range in ['0-5k', '5k-15k']:
        recommendations.append("💡 Focus on building an emergency fund of ₹10,000 first")
        recommendations.append("📱 Use digital payment apps to track expenses automatically")
    
    if status == 'student':
        recommendations.append("🎓 Take advantage of student bank accounts with zero balance requirements")
        recommendations.append("📚 Start learning about mutual funds and SIPs now")
    
    recommendations.append("🏦 Consider opening a PPF account for long-term tax-free savings")
    
    return recommendations

def assess_financial_risk(user, goals):
    risk_factors = []
    risk_level = "Low"
    
    total_goals = len(goals)
    income_range = user.get('monthly_income_range', '15k-30k')
    
    if total_goals == 0:
        risk_factors.append("No financial goals set")
        risk_level = "Medium"
    
    if income_range in ['0-5k', '5k-15k']:
        risk_factors.append("Low income range - limited emergency buffer")
        risk_level = "High"
    
    return {
        "level": risk_level,
        "factors": risk_factors,
        "mitigation_tips": [
            "Build emergency fund gradually",
            "Diversify income sources",
            "Start with small SIP amounts"
        ]
    }

def get_market_insights_for_user(user):
    return {
        "equity_outlook": "Positive - Indian equity markets showing strong fundamentals",
        "interest_rates": "RBI repo rate at 6.5% - good time for debt investments",
        "inflation_impact": "Current inflation at 5.2% - maintain equity allocation",
        "sector_recommendations": ["Technology", "Healthcare", "Financial Services"]
    }

def get_tax_optimization_suggestions(user):
    return {
        "section_80c_remaining": "₹1,50,000",
        "elss_suggestion": "Start SIP of ₹12,500/month in ELSS funds",
        "ppf_optimization": "Contribute ₹12,500/month to maximize PPF benefits",
        "health_insurance_deduction": "Claim ₹25,000 under Section 80D"
    }

def compare_with_peers(user, goals):
    age_bracket = user.get('age_bracket', '19-22')
    status = user.get('status', 'student')
    
    return {
        "savings_vs_peers": "15% above average",
        "goal_count_vs_peers": "Similar to peers",
        "investment_diversification": "Below average - consider adding more asset classes",
        "peer_group": f"{status.title()} aged {age_bracket}"
    }