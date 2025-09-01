import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Target, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const GoalPlanner = ({ user }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [savingsPlan, setSavingsPlan] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const goalData = {
        user_id: user.user_id,
        dream: data.dream,
        target_amount: parseFloat(data.target_amount),
        current_amount: parseFloat(data.current_amount || 0),
        timeline_months: parseInt(data.timeline_months),
        monthly_income: parseFloat(data.monthly_income || 0)
      };

      const response = await axios.post('http://localhost:5000/api/goals', goalData);
      setSavingsPlan(response.data.savings_plan);
      reset();
    } catch (error) {
      console.error('Failed to create goal:', error);
      alert('Failed to create goal. Please try again.');
    }
    setLoading(false);
  };

  const getFeasibilityColor = (feasibility) => {
    switch (feasibility) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Challenging': return 'text-yellow-600 bg-yellow-100';
      case 'Very Difficult': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dream Goal Planner 🎯</h1>
        <p className="text-gray-600">Turn your dreams into achievable savings plans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Your Goal</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your dream? ✨
              </label>
              <input
                type="text"
                {...register('dream', { required: 'Please enter your dream' })}
                placeholder="e.g., Laptop, Travel, Bike"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              />
              {errors.dream && (
                <p className="text-red-500 text-sm mt-1">{errors.dream.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount (₹)
              </label>
              <input
                type="number"
                {...register('target_amount', { 
                  required: 'Please enter target amount',
                  min: { value: 1, message: 'Amount must be greater than 0' }
                })}
                placeholder="80000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              />
              {errors.target_amount && (
                <p className="text-red-500 text-sm mt-1">{errors.target_amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Savings (₹)
              </label>
              <input
                type="number"
                {...register('current_amount')}
                placeholder="15000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline (months)
              </label>
              <input
                type="number"
                {...register('timeline_months', { 
                  required: 'Please enter timeline',
                  min: { value: 1, message: 'Timeline must be at least 1 month' }
                })}
                placeholder="12"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              />
              {errors.timeline_months && (
                <p className="text-red-500 text-sm mt-1">{errors.timeline_months.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income (₹) - Optional
              </label>
              <input
                type="number"
                {...register('monthly_income')}
                placeholder="25000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Plan...' : 'Create Savings Plan'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          {savingsPlan ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Savings Plan 📊</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-gray-800" />
                    <div>
                      <p className="text-sm text-gray-600">Monthly Target</p>
                      <p className="text-2xl font-bold text-gray-900">₹{savingsPlan.monthly_target.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-gray-800" />
                    <div>
                      <p className="text-sm text-gray-600">Savings Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{savingsPlan.savings_rate_percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-gray-800" />
                    <div>
                      <p className="text-sm text-gray-600">Timeline</p>
                      <p className="text-2xl font-bold text-gray-900">{savingsPlan.total_months} months</p>
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${getFeasibilityColor(savingsPlan.feasibility)}`}>
                  <p className="font-semibold">Feasibility: {savingsPlan.feasibility}</p>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Milestone Tracker</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {savingsPlan.milestones.slice(0, 6).map((milestone) => (
                      <div key={milestone.month} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Month {milestone.month}</span>
                        <span className="text-sm font-medium text-gray-900">₹{milestone.target_amount.toFixed(0)}</span>
                      </div>
                    ))}
                    {savingsPlan.milestones.length > 6 && (
                      <p className="text-xs text-gray-500 text-center">...and {savingsPlan.milestones.length - 6} more months</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tips:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Set up automatic transfers to save consistently</li>
                    <li>• Review and adjust your plan monthly</li>
                    <li>• Celebrate reaching each milestone!</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Create a goal to see your personalized savings plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;