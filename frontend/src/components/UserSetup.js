import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const UserSetup = ({ onUserCreated }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/user', data);
      onUserCreated({ ...data, user_id: response.data.user_id });
    } catch (error) {
      console.error('User creation failed:', error);
      alert('Failed to create user. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-400/30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/20 animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="glass-card rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-bounceIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 animate-float">Welcome to FinBuddy! 🚀</h1>
          <p className="text-blue-100 animate-fadeIn animation-delay-1000">Let's personalize your financial journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-slideInFromLeft">
          <div className="animate-fadeIn animation-delay-1000">
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Age Group ✨
            </label>
            <select
              {...register('age_bracket', { required: 'Please select your age group' })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-white/50 transition-all backdrop-blur-sm"
            >
              <option value="" className="text-gray-800">Select Age Group</option>
              <option value="16-18" className="text-gray-800">16-18 years</option>
              <option value="19-22" className="text-gray-800">19-22 years</option>
              <option value="23-25" className="text-gray-800">23-25 years</option>
            </select>
            {errors.age_bracket && (
              <p className="text-pink-300 text-sm mt-1 animate-bounceIn">{errors.age_bracket.message}</p>
            )}
          </div>

          <div className="animate-fadeIn animation-delay-1000">
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Current Status 🎯
            </label>
            <select
              {...register('status', { required: 'Please select your status' })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-white/50 transition-all backdrop-blur-sm"
            >
              <option value="" className="text-gray-800">Select Status</option>
              <option value="student" className="text-gray-800">Student</option>
              <option value="professional" className="text-gray-800">Working Professional</option>
              <option value="job-seeker" className="text-gray-800">Job Seeker</option>
            </select>
            {errors.status && (
              <p className="text-pink-300 text-sm mt-1 animate-bounceIn">{errors.status.message}</p>
            )}
          </div>

          <div className="animate-fadeIn animation-delay-2000">
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Monthly Income Range (₹) 💰
            </label>
            <select
              {...register('monthly_income_range', { required: 'Please select income range' })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 hover:border-white/50 transition-all backdrop-blur-sm"
            >
              <option value="" className="text-gray-800">Select Income Range</option>
              <option value="0-5k" className="text-gray-800">₹0 - ₹5,000</option>
              <option value="5k-15k" className="text-gray-800">₹5,000 - ₹15,000</option>
              <option value="15k-30k" className="text-gray-800">₹15,000 - ₹30,000</option>
              <option value="30k-50k" className="text-gray-800">₹30,000 - ₹50,000</option>
              <option value="50k+" className="text-gray-800">₹50,000+</option>
            </select>
            {errors.monthly_income_range && (
              <p className="text-pink-300 text-sm mt-1 animate-bounceIn">{errors.monthly_income_range.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white py-4 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 animate-fadeIn animation-delay-3000"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span className="loading-dots">Setting up your profile</span>
              </span>
            ) : (
              'Start Your Financial Journey 🚀'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-blue-200 animate-fadeIn animation-delay-3000">
          <p>🔒 Your data is safe and private with us</p>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;