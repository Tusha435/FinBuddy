from flask import Blueprint, request, jsonify
from database import get_db
from datetime import datetime, timedelta
import random
import numpy as np
from utils.helpers import (
    get_income_multiplier, get_category_multiplier, get_seasonal_factor,
    get_category_color, get_investment_allocation, get_investment_growth_rate,
    get_investment_volatility, get_investment_color, calculate_financial_health_score,
    generate_recommendations, assess_financial_risk, get_market_insights_for_user,
    get_tax_optimization_suggestions, compare_with_peers
)

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/analytics/time-series/<user_id>', methods=['GET'])
def get_time_series_data(user_id):
    try:
        time_period = request.args.get('period', '1year')
        chart_type = request.args.get('type', 'savings')
        
        # Generate realistic time series data based on user's goals and profile
        db = get_db()
        if isinstance(db, dict):
            user_goals = [g for g in db['goals'] if g['user_id'] == user_id]
            user = next((u for u in db['users'] if u['user_id'] == user_id), None)
        else:
            user_goals = list(db.goals.find({"user_id": user_id}))
            user = db.users.find_one({"user_id": user_id})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Generate time series based on period
        data = generate_time_series_data(user, user_goals, time_period, chart_type)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/api/analytics/forecast/<user_id>', methods=['GET'])
def get_forecast_data(user_id):
    try:
        time_period = request.args.get('period', '2years')
        forecast_type = request.args.get('type', 'savings_projection')
        
        db = get_db()
        if isinstance(db, dict):
            user_goals = [g for g in db['goals'] if g['user_id'] == user_id]
            user = next((u for u in db['users'] if u['user_id'] == user_id), None)
        else:
            user_goals = list(db.goals.find({"user_id": user_id}))
            user = db.users.find_one({"user_id": user_id})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        forecast_data = generate_forecast_data(user, user_goals, time_period, forecast_type)
        
        return jsonify(forecast_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/api/analytics/insights/<user_id>', methods=['GET'])
def get_user_insights(user_id):
    try:
        db = get_db()
        if isinstance(db, dict):
            user_goals = [g for g in db['goals'] if g['user_id'] == user_id]
            user = next((u for u in db['users'] if u['user_id'] == user_id), None)
        else:
            user_goals = list(db.goals.find({"user_id": user_id}))
            user = db.users.find_one({"user_id": user_id})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        insights = generate_user_insights(user, user_goals)
        
        return jsonify(insights)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_time_series_data(user, goals, period, chart_type):
    """Generate realistic time series data for different periods and chart types"""
    
    # Determine date range based on period
    end_date = datetime.now()
    if period == '3months':
        start_date = end_date - timedelta(days=90)
        date_format = '%Y-%m-%d'
        interval_days = 7  # Weekly data
    elif period == '6months':
        start_date = end_date - timedelta(days=180)
        date_format = '%Y-%m-%d'
        interval_days = 14  # Bi-weekly data
    elif period == '1year':
        start_date = end_date - timedelta(days=365)
        date_format = '%Y-%m'
        interval_days = 30  # Monthly data
    elif period == '2years':
        start_date = end_date - timedelta(days=730)
        date_format = '%Y-%m'
        interval_days = 30  # Monthly data
    else:
        start_date = end_date - timedelta(days=365)
        date_format = '%Y-%m'
        interval_days = 30
    
    # Generate date labels
    dates = []
    current_date = start_date
    while current_date <= end_date:
        dates.append(current_date.strftime(date_format))
        current_date += timedelta(days=interval_days)
    
    # Base amounts based on user profile
    income_multiplier = get_income_multiplier(user.get('monthly_income_range', '15k-30k'))
    
    if chart_type == 'savings':
        # Savings growth with realistic patterns
        base_savings = 1000 * income_multiplier
        growth_rate = 0.08 + random.uniform(-0.02, 0.02)  # 6-10% monthly growth
        
        values = []
        current_value = base_savings
        for i, date in enumerate(dates):
            # Add seasonal variations (higher savings in festival months)
            seasonal_factor = 1.2 if current_date.month in [10, 11, 3, 4] else 1.0
            monthly_growth = current_value * growth_rate * seasonal_factor
            noise = random.uniform(-0.1, 0.1) * monthly_growth
            current_value += monthly_growth + noise
            values.append(max(0, round(current_value)))
            current_date = start_date + timedelta(days=interval_days * i)
        
        return {
            "labels": dates,
            "datasets": [{
                "label": "Savings Amount (₹)",
                "data": values,
                "trend": "upward",
                "growth_rate": f"{growth_rate*100:.1f}%"
            }]
        }
    
    elif chart_type == 'expenses':
        # Monthly expenses with variations
        base_expenses = 15000 * income_multiplier
        
        categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping']
        datasets = []
        
        for category in categories:
            values = []
            category_base = base_expenses * get_category_multiplier(category)
            
            for i, date in enumerate(dates):
                current_date = start_date + timedelta(days=interval_days * i)
                # Seasonal variations for different categories
                seasonal_factor = get_seasonal_factor(category, current_date.month)
                monthly_expense = category_base * seasonal_factor
                noise = random.uniform(-0.15, 0.15) * monthly_expense
                values.append(max(0, round(monthly_expense + noise)))
            
            datasets.append({
                "label": category,
                "data": values,
                "backgroundColor": get_category_color(category)
            })
        
        return {
            "labels": dates,
            "datasets": datasets
        }
    
    elif chart_type == 'investments':
        # Investment portfolio performance
        investment_types = ['Mutual Funds', 'PPF', 'FD', 'Gold ETF', 'Stocks']
        datasets = []
        
        total_investment = 50000 * income_multiplier
        
        for inv_type in investment_types:
            values = []
            type_allocation = get_investment_allocation(inv_type) * total_investment
            
            for i, date in enumerate(dates):
                # Different growth patterns for different investment types
                growth_rate = get_investment_growth_rate(inv_type)
                time_factor = i / len(dates)
                current_value = type_allocation * (1 + growth_rate * time_factor)
                
                # Add market volatility
                volatility = get_investment_volatility(inv_type)
                noise = random.uniform(-volatility, volatility) * current_value
                values.append(max(0, round(current_value + noise)))
            
            datasets.append({
                "label": inv_type,
                "data": values,
                "backgroundColor": get_investment_color(inv_type)
            })
        
        return {
            "labels": dates,
            "datasets": datasets
        }
    
    return {"labels": dates, "datasets": []}

def generate_forecast_data(user, goals, period, forecast_type):
    """Generate predictive forecasting data"""
    
    # Future date range
    start_date = datetime.now()
    if period == '6months':
        end_date = start_date + timedelta(days=180)
        interval_days = 7
    elif period == '1year':
        end_date = start_date + timedelta(days=365)
        interval_days = 14
    elif period == '2years':
        end_date = start_date + timedelta(days=730)
        interval_days = 30
    elif period == '5years':
        end_date = start_date + timedelta(days=1825)
        interval_days = 90
    else:
        end_date = start_date + timedelta(days=730)
        interval_days = 30
    
    dates = []
    current_date = start_date
    while current_date <= end_date:
        dates.append(current_date.strftime('%Y-%m'))
        current_date += timedelta(days=interval_days)
    
    income_multiplier = get_income_multiplier(user.get('monthly_income_range', '15k-30k'))
    
    if forecast_type == 'savings_projection':
        # Project savings growth based on current patterns
        current_savings = sum(goal.get('current_amount', 0) for goal in goals)
        monthly_savings_rate = 5000 * income_multiplier
        annual_growth_rate = 0.12  # 12% annual returns
        
        projections = []
        optimistic = []
        pessimistic = []
        
        for i, date in enumerate(dates):
            months = i + 1
            
            # Conservative projection
            base_projection = current_savings + (monthly_savings_rate * months)
            compound_growth = base_projection * ((1 + annual_growth_rate/12) ** months)
            projections.append(round(compound_growth))
            
            # Optimistic scenario (15% returns)
            optimistic_growth = base_projection * ((1 + 0.15/12) ** months)
            optimistic.append(round(optimistic_growth))
            
            # Pessimistic scenario (8% returns)
            pessimistic_growth = base_projection * ((1 + 0.08/12) ** months)
            pessimistic.append(round(pessimistic_growth))
        
        return {
            "labels": dates,
            "datasets": [
                {
                    "label": "Conservative Projection",
                    "data": projections,
                    "borderColor": "rgb(59, 130, 246)",
                    "backgroundColor": "rgba(59, 130, 246, 0.1)"
                },
                {
                    "label": "Optimistic Scenario",
                    "data": optimistic,
                    "borderColor": "rgb(34, 197, 94)",
                    "backgroundColor": "rgba(34, 197, 94, 0.1)"
                },
                {
                    "label": "Pessimistic Scenario", 
                    "data": pessimistic,
                    "borderColor": "rgb(239, 68, 68)",
                    "backgroundColor": "rgba(239, 68, 68, 0.1)"
                }
            ]
        }
    
    elif forecast_type == 'goal_achievement':
        # Project when goals will be achieved
        goal_projections = []
        
        for goal in goals:
            target = goal.get('target_amount', 0)
            current = goal.get('current_amount', 0)
            timeline = goal.get('timeline_months', 12)
            
            monthly_requirement = (target - current) / timeline
            achievement_dates = []
            amounts = []
            
            for i, date in enumerate(dates):
                months_elapsed = i + 1
                projected_amount = current + (monthly_requirement * months_elapsed)
                amounts.append(min(projected_amount, target))
                
                if projected_amount >= target and not achievement_dates:
                    achievement_dates.append(date)
            
            goal_projections.append({
                "goal": goal.get('dream', 'Unknown'),
                "target": target,
                "projected_completion": achievement_dates[0] if achievement_dates else "Beyond timeframe",
                "data": amounts
            })
        
        return {
            "labels": dates,
            "goal_projections": goal_projections
        }
    
    return {"labels": dates, "datasets": []}

def generate_user_insights(user, goals):
    """Generate AI-powered insights for the user"""
    
    total_goals = len(goals)
    total_target = sum(goal.get('target_amount', 0) for goal in goals)
    total_current = sum(goal.get('current_amount', 0) for goal in goals)
    completion_rate = (total_current / total_target * 100) if total_target > 0 else 0
    
    income_range = user.get('monthly_income_range', '15k-30k')
    age_bracket = user.get('age_bracket', '19-22')
    status = user.get('status', 'student')
    
    insights = {
        "financial_health_score": calculate_financial_health_score(user, goals),
        "savings_rate": f"{(total_current / 50000 * 100):.1f}%",  # Assuming 50k as base
        "goal_completion_rate": f"{completion_rate:.1f}%",
        "recommendations": generate_recommendations(user, goals),
        "risk_assessment": assess_financial_risk(user, goals),
        "market_insights": get_market_insights_for_user(user),
        "tax_optimization": get_tax_optimization_suggestions(user),
        "benchmark_comparison": compare_with_peers(user, goals)
    }
    
    return insights