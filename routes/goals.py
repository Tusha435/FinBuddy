from flask import Blueprint, request, jsonify
from database import get_db
import uuid
from datetime import datetime

goals_bp = Blueprint('goals', __name__)

def create_savings_plan(dream_cost, current_savings, timeline_months, monthly_income):
    remaining_amount = dream_cost - current_savings
    monthly_target = remaining_amount / timeline_months if timeline_months > 0 else 0
    
    savings_rate = (monthly_target / monthly_income) * 100 if monthly_income > 0 else 0
    
    milestones = []
    for i in range(1, timeline_months + 1):
        milestone_amount = current_savings + (monthly_target * i)
        milestones.append({
            "month": i,
            "target_amount": milestone_amount,
            "monthly_saving": monthly_target
        })
    
    return {
        "monthly_target": monthly_target,
        "savings_rate_percentage": savings_rate,
        "total_months": timeline_months,
        "milestones": milestones,
        "feasibility": "Easy" if savings_rate < 20 else "Challenging" if savings_rate < 40 else "Very Difficult"
    }

@goals_bp.route('/api/goals', methods=['POST'])
def create_goal():
    try:
        db = get_db()
        data = request.get_json()
        user_id = data.get('user_id')
        
        savings_plan = create_savings_plan(
            data.get('target_amount', 0),
            data.get('current_amount', 0),
            data.get('timeline_months', 12),
            data.get('monthly_income', 0)
        )
        
        goal_data = {
            "goal_id": str(uuid.uuid4()),
            "user_id": user_id,
            "dream": data.get('dream'),
            "target_amount": data.get('target_amount'),
            "current_amount": data.get('current_amount', 0),
            "timeline_months": data.get('timeline_months'),
            "created_at": datetime.utcnow()
        }
        
        if isinstance(db, dict):
            # Fallback storage
            db['goals'].append(goal_data)
        else:
            # MongoDB
            db.goals.insert_one(goal_data)
        
        return jsonify({
            "goal_id": goal_data['goal_id'],
            "savings_plan": savings_plan,
            "status": "created"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@goals_bp.route('/api/goals/<user_id>', methods=['GET'])
def get_user_goals(user_id):
    try:
        db = get_db()
        goal_list = []
        
        if isinstance(db, dict):
            # Fallback storage
            goals = [g for g in db['goals'] if g['user_id'] == user_id]
        else:
            # MongoDB
            goals = list(db.goals.find({"user_id": user_id}))
        
        for goal in goals:
            goal_list.append({
                "id": goal.get('goal_id', goal.get('_id')),
                "dream": goal['dream'],
                "target_amount": goal['target_amount'],
                "current_amount": goal['current_amount'],
                "timeline_months": goal['timeline_months'],
                "progress_percentage": (goal['current_amount'] / goal['target_amount']) * 100 if goal['target_amount'] > 0 else 0
            })
        
        return jsonify({"goals": goal_list})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@goals_bp.route('/api/emergency-fund', methods=['POST'])
def calculate_emergency_fund():
    try:
        data = request.get_json()
        monthly_expenses = data.get('monthly_expenses', 0)
        target_months = data.get('target_months', 6)
        current_savings = data.get('current_savings', 0)
        
        target_amount = monthly_expenses * target_months
        remaining_amount = max(0, target_amount - current_savings)
        
        risk_level = "Low" if current_savings >= target_amount else "High" if current_savings < target_amount * 0.3 else "Medium"
        
        return jsonify({
            "target_amount": target_amount,
            "current_amount": current_savings,
            "remaining_amount": remaining_amount,
            "progress_percentage": (current_savings / target_amount) * 100 if target_amount > 0 else 0,
            "risk_level": risk_level,
            "monthly_target": remaining_amount / 12 if remaining_amount > 0 else 0
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500