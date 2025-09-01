import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Shield, TrendingUp, Calendar, MessageCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${user.user_id}`);
      setGoals(response.data.goals);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
    setLoading(false);
  };

  const totalSavings = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalTargets = goals.reduce((sum, goal) => sum + goal.target_amount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-4xl font-bold gradient-text mb-2 ">
          Welcome back! 🎯
        </h1>
        <p className="text-indigo-700 text-lg  ">Here's your financial progress overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card rounded-2xl p-6 hover-lift hover-glow   bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Total Savings</p>
              <p className="text-3xl font-bold text-emerald-800 ">₹{totalSavings.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-full ">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift hover-glow   bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Dream Goals</p>
              <p className="text-3xl font-bold text-blue-800 ">{goals.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full  ">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift hover-glow   bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Targets</p>
              <p className="text-3xl font-bold text-purple-800 ">₹{totalTargets.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full  ">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift hover-glow   bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Progress</p>
              <p className="text-3xl font-bold text-orange-800 ">
                {totalTargets > 0 ? Math.round((totalSavings / totalTargets) * 100) : 0}%
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-full  ">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideInFromLeft">
        <div className="glass-card rounded-2xl p-6 hover-lift hover-glow bg-white/80 border-indigo-200">
          <h2 className="text-2xl font-semibold gradient-text mb-6 ">Active Goals</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-indigo-600 loading-dots">Loading goals</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 ">
              <Target className="h-16 w-16 text-indigo-400 mx-auto mb-4 " />
              <p className="text-indigo-600 mb-4">No goals yet. Start your financial journey!</p>
              <Link to="/goals" className="btn-primary inline-block text-white px-8 py-3 rounded-xl font-semibold">
                Create Your First Goal ✨
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={goal.id} className="bg-white/60 border border-indigo-200 rounded-xl p-4 hover-lift hover-glow " style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-indigo-900">{goal.dream}</h3>
                    <span className="text-sm text-indigo-600 font-medium bg-indigo-100 px-2 py-1 rounded-full">₹{goal.target_amount.toLocaleString()}</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-indigo-700 mb-1 font-medium">
                      <span>₹{goal.current_amount.toLocaleString()}</span>
                      <span>{Math.round(goal.progress_percentage)}%</span>
                    </div>
                    <div className="w-full bg-indigo-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out "
                        style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-indigo-600">{goal.timeline_months} months timeline ⏱️</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift hover-glow bg-white/80 border-purple-200 animate-slideInFromRight">
          <h2 className="text-2xl font-semibold gradient-text mb-6 ">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/goals" className="block w-full text-left p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover-lift hover-glow transition-all ">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 p-3 rounded-full ">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Create New Goal</p>
                  <p className="text-sm text-blue-600">Plan your next dream purchase 🎯</p>
                </div>
              </div>
            </Link>
            
            <Link to="/emergency-fund" className="block w-full text-left p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl hover-lift hover-glow transition-all  ">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500 p-3 rounded-full  ">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">Emergency Fund</p>
                  <p className="text-sm text-emerald-600">Build your financial safety net 🛡️</p>
                </div>
              </div>
            </Link>
            
            <Link to="/analytics" className="block w-full text-left p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl hover-lift hover-glow transition-all  ">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-500 p-3 rounded-full  ">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-purple-900">Financial Analytics</p>
                  <p className="text-sm text-purple-600">View detailed charts and insights 📊</p>
                </div>
              </div>
            </Link>
            
            <Link to="/chat" className="block w-full text-left p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl hover-lift hover-glow transition-all  ">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-500 p-3 rounded-full  ">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-orange-900">Chat with AI Coach</p>
                  <p className="text-sm text-orange-600">Get personalized advice 🤖</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;