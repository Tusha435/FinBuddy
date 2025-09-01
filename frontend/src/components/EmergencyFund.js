import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Shield, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const EmergencyFund = ({ user }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [emergencyPlan, setEmergencyPlan] = useState(null);

  const watchedExpenses = watch('monthly_expenses', 0);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/emergency-fund', {
        monthly_expenses: parseFloat(data.monthly_expenses),
        target_months: parseInt(data.target_months || 6),
        current_savings: parseFloat(data.current_savings || 0)
      });
      setEmergencyPlan(response.data);
    } catch (error) {
      console.error('Failed to calculate emergency fund:', error);
      alert('Failed to calculate emergency fund. Please try again.');
    }
    setLoading(false);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'High': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return <CheckCircle className="h-5 w-5" />;
      case 'Medium': return <AlertCircle className="h-5 w-5" />;
      case 'High': return <AlertCircle className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Fund Calculator 🛡️</h1>
        <p className="text-gray-600">Build your financial safety net for unexpected situations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Calculate Your Emergency Fund</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Expenses (₹) *
              </label>
              <input
                type="number"
                {...register('monthly_expenses', { 
                  required: 'Please enter your monthly expenses',
                  min: { value: 1, message: 'Amount must be greater than 0' }
                })}
                placeholder="25000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              />
              {errors.monthly_expenses && (
                <p className="text-red-500 text-sm mt-1">{errors.monthly_expenses.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Include rent, food, utilities, transportation, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Coverage (months)
              </label>
              <select
                {...register('target_months')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              >
                <option value="3">3 months (Minimum)</option>
                <option value="6" selected>6 months (Recommended)</option>
                <option value="9">9 months (Conservative)</option>
                <option value="12">12 months (Very Safe)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">6 months is typically recommended for most people</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Emergency Savings (₹)
              </label>
              <input
                type="number"
                {...register('current_savings')}
                placeholder="50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">How much do you currently have saved for emergencies?</p>
            </div>

            {watchedExpenses > 0 && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Quick Preview:</strong> For ₹{parseFloat(watchedExpenses).toLocaleString()} monthly expenses, 
                  you'd need ₹{(parseFloat(watchedExpenses) * 6).toLocaleString()} for a 6-month emergency fund.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Emergency Fund'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">⚠️ Why Emergency Funds Matter:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Job loss or income reduction</li>
              <li>• Medical emergencies</li>
              <li>• Unexpected major repairs</li>
              <li>• Family emergencies</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          {emergencyPlan ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Emergency Fund Plan 📊</h2>
              
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border ${getRiskColor(emergencyPlan.risk_level)}`}>
                  <div className="flex items-center space-x-3">
                    {getRiskIcon(emergencyPlan.risk_level)}
                    <div>
                      <p className="font-semibold">Risk Level: {emergencyPlan.risk_level}</p>
                      <p className="text-sm">
                        {emergencyPlan.risk_level === 'Low' && 'Great job! You\'re well prepared for emergencies.'}
                        {emergencyPlan.risk_level === 'Medium' && 'You\'re on the right track, but could use more cushion.'}
                        {emergencyPlan.risk_level === 'High' && 'Priority: Build your emergency fund as soon as possible.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-6 w-6 text-gray-800" />
                      <div>
                        <p className="text-sm text-gray-600">Target Amount</p>
                        <p className="text-lg font-bold text-gray-900">₹{emergencyPlan.target_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6 text-gray-800" />
                      <div>
                        <p className="text-sm text-gray-600">Current Savings</p>
                        <p className="text-lg font-bold text-gray-900">₹{emergencyPlan.current_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(emergencyPlan.progress_percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        emergencyPlan.progress_percentage >= 100 ? 'bg-gray-900' :
                        emergencyPlan.progress_percentage >= 50 ? 'bg-gray-700' : 'bg-gray-500'
                      }`}
                      style={{ width: `${Math.min(emergencyPlan.progress_percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {emergencyPlan.remaining_amount > 0 && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">📈 Savings Strategy:</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Still needed:</strong> ₹{emergencyPlan.remaining_amount.toLocaleString()}</p>
                      <p><strong>Monthly target:</strong> ₹{emergencyPlan.monthly_target.toFixed(0)}</p>
                      <p><strong>Timeline:</strong> 12 months to complete</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">💡 Building Tips:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Start small - even ₹500/month helps</li>
                    <li>• Use high-yield savings account</li>
                    <li>• Automate your emergency savings</li>
                    <li>• Don't touch unless it's a real emergency</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🚨 What Counts as Emergency:</h3>
                  <div className="text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-medium mb-1">✅ Emergencies:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Job loss</li>
                          <li>• Medical bills</li>
                          <li>• Car/bike repairs</li>
                          <li>• Home repairs</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">❌ Not Emergencies:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Vacations</li>
                          <li>• New gadgets</li>
                          <li>• Shopping sales</li>
                          <li>• Parties</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Calculate your emergency fund to see your personalized plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyFund;