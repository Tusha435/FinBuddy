from flask import Blueprint, request, jsonify
from database import get_db
import uuid
from datetime import datetime

users_bp = Blueprint('users', __name__)

@users_bp.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        db = get_db()
        user_list = []
        
        if isinstance(db, dict):
            # Fallback storage
            users = db['users']
        else:
            # MongoDB
            users = list(db.users.find({}))
        
        for user in users:
            user_list.append({
                "user_id": user['user_id'],
                "age_bracket": user['age_bracket'],
                "status": user['status'],
                "monthly_income_range": user['monthly_income_range'],
                "created_at": user['created_at'].isoformat() if isinstance(user['created_at'], datetime) else user['created_at']
            })
        
        return jsonify({"users": user_list})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@users_bp.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        db = get_db()
        
        if isinstance(db, dict):
            # Fallback storage
            user = next((u for u in db['users'] if u['user_id'] == user_id), None)
        else:
            # MongoDB
            user = db.users.find_one({"user_id": user_id})
        
        if not user:
            return jsonify({"error": "User not found", "status": "error"}), 404
        
        return jsonify({
            "user_id": user['user_id'],
            "age_bracket": user['age_bracket'],
            "status": user['status'],
            "monthly_income_range": user['monthly_income_range'],
            "created_at": user['created_at'].isoformat() if isinstance(user['created_at'], datetime) else user['created_at']
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@users_bp.route('/api/user', methods=['POST'])
def create_user():
    try:
        db = get_db()
        data = request.get_json()
        user_id = str(uuid.uuid4())
        
        user_data = {
            "user_id": user_id,
            "age_bracket": data.get('age_bracket'),
            "status": data.get('status'),
            "monthly_income_range": data.get('monthly_income_range'),
            "name": data.get('name', f"User_{user_id[:8]}"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        if isinstance(db, dict):
            # Fallback storage
            db['users'].append(user_data)
        else:
            # MongoDB
            db.users.insert_one(user_data)
        
        # Remove MongoDB ObjectId for JSON serialization
        user_response = {k: v for k, v in user_data.items() if k != '_id'}
        return jsonify({"user_id": user_id, "status": "created", "user": user_response})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@users_bp.route('/api/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        db = get_db()
        data = request.get_json()
        
        update_data = {
            "age_bracket": data.get('age_bracket'),
            "status": data.get('status'),
            "monthly_income_range": data.get('monthly_income_range'),
            "name": data.get('name'),
            "updated_at": datetime.utcnow()
        }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        if isinstance(db, dict):
            # Fallback storage
            for i, user in enumerate(db['users']):
                if user['user_id'] == user_id:
                    db['users'][i].update(update_data)
                    return jsonify({"status": "updated", "user": db['users'][i]})
            return jsonify({"error": "User not found", "status": "error"}), 404
        else:
            # MongoDB
            result = db.users.update_one(
                {"user_id": user_id}, 
                {"$set": update_data}
            )
            if result.matched_count == 0:
                return jsonify({"error": "User not found", "status": "error"}), 404
            
            updated_user = db.users.find_one({"user_id": user_id})
            # Remove MongoDB ObjectId for JSON serialization
            user_response = {k: v for k, v in updated_user.items() if k != '_id'} if updated_user else None
            return jsonify({"status": "updated", "user": user_response})
            
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@users_bp.route('/api/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        db = get_db()
        
        if isinstance(db, dict):
            # Fallback storage
            original_count = len(db['users'])
            db['users'] = [u for u in db['users'] if u['user_id'] != user_id]
            
            if len(db['users']) == original_count:
                return jsonify({"error": "User not found", "status": "error"}), 404
            
            # Also delete user's goals and learning progress
            db['goals'] = [g for g in db['goals'] if g['user_id'] != user_id]
            db['learning_progress'] = [l for l in db['learning_progress'] if l['user_id'] != user_id]
            
        else:
            # MongoDB
            result = db.users.delete_one({"user_id": user_id})
            if result.deleted_count == 0:
                return jsonify({"error": "User not found", "status": "error"}), 404
            
            # Also delete user's related data
            db.goals.delete_many({"user_id": user_id})
            db.learning_progress.delete_many({"user_id": user_id})
        
        return jsonify({"status": "deleted", "user_id": user_id})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500