import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Edit3, Trash2, User, ChevronDown } from 'lucide-react';

const UserManager = ({ currentUser, onUserSwitch }) => {
  const [users, setUsers] = useState([]);
  const [usersFinancialData, setUsersFinancialData] = useState({});
  const [showUserList, setShowUserList] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [financialDataLoading, setFinancialDataLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    age_bracket: '',
    status: '',
    monthly_income_range: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update financial data when current user changes
  useEffect(() => {
    if (currentUser && currentUser.user_id && users.length > 0) {
      // Refresh financial data for all users when current user changes
      fetchUsersFinancialData(users);
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data.users);
      await fetchUsersFinancialData(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchUsersFinancialData = async (usersList) => {
    setFinancialDataLoading(true);
    const financialData = {};
    
    for (const user of usersList) {
      try {
        // Fetch goals for each user
        const goalsResponse = await axios.get(`http://localhost:5000/api/goals/${user.user_id}`);
        const goals = goalsResponse.data.goals || [];
        
        // Calculate key metrics
        const totalSavings = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
        const totalTargets = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
        const progressPercentage = totalTargets > 0 ? Math.round((totalSavings / totalTargets) * 100) : 0;
        
        // Try to fetch insights (may not be available for all users)
        let insights = null;
        try {
          const insightsResponse = await axios.get(`http://localhost:5000/api/analytics/insights/${user.user_id}`);
          insights = insightsResponse.data;
        } catch (error) {
          // Insights not available, skip
        }
        
        financialData[user.user_id] = {
          goals: goals.length,
          totalSavings,
          totalTargets,
          progressPercentage,
          financialHealthScore: insights?.financial_health_score || null,
          savingsRate: insights?.savings_rate || null,
          riskLevel: insights?.risk_assessment?.level || null
        };
      } catch (error) {
        console.error(`Failed to fetch financial data for user ${user.user_id}:`, error);
        financialData[user.user_id] = {
          goals: 0,
          totalSavings: 0,
          totalTargets: 0,
          progressPercentage: 0,
          financialHealthScore: null,
          savingsRate: null,
          riskLevel: null
        };
      }
    }
    
    setUsersFinancialData(financialData);
    setFinancialDataLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/user', newUser);
      const createdUser = { ...newUser, user_id: response.data.user_id };
      setUsers([...users, createdUser]);
      
      // Initialize empty financial data for new user
      setUsersFinancialData(prev => ({
        ...prev,
        [createdUser.user_id]: {
          goals: 0,
          totalSavings: 0,
          totalTargets: 0,
          progressPercentage: 0,
          financialHealthScore: null,
          savingsRate: null,
          riskLevel: null
        }
      }));
      
      setNewUser({ age_bracket: '', status: '', monthly_income_range: '' });
      setShowCreateForm(false);
      
      // Enhanced user context with financial data for AI
      const enhancedUser = {
        ...createdUser,
        financialContext: {
          goals: 0,
          totalSavings: 0,
          totalTargets: 0,
          progressPercentage: 0,
          financialHealthScore: null,
          savingsRate: null,
          riskLevel: null
        }
      };
      onUserSwitch(enhancedUser);
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Please try again.');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure? This will delete all user data including goals.')) {
      try {
        await axios.delete(`http://localhost:5000/api/user/${userId}`);
        setUsers(users.filter(user => user.user_id !== userId));
        if (currentUser.user_id === userId && users.length > 1) {
          const remainingUser = users.find(user => user.user_id !== userId);
          onUserSwitch(remainingUser);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className="relative">
      {/* Current User Display */}
      <div 
        className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500 rounded-lg cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
        onClick={() => setShowUserList(!showUserList)}
      >
        <div className="bg-white/20 p-2 rounded-lg shadow-sm">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">
            {currentUser.status === 'student' ? 'Student' : currentUser.status === 'professional' ? 'Professional' : 'Job Seeker'}
          </p>
          <p className="text-xs text-indigo-100">
            {currentUser.age_bracket} • {currentUser.monthly_income_range}
          </p>
          {usersFinancialData[currentUser.user_id] && (
            <div className="mt-1 flex flex-wrap gap-1 text-xs">
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                {usersFinancialData[currentUser.user_id].goals} goals
              </span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                ₹{usersFinancialData[currentUser.user_id].totalSavings.toLocaleString()}
              </span>
              {usersFinancialData[currentUser.user_id].progressPercentage > 0 && (
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
                  {usersFinancialData[currentUser.user_id].progressPercentage}% progress
                </span>
              )}
            </div>
          )}
        </div>
        <div className="bg-white/10 p-1 rounded group-hover:bg-white/20 transition-all duration-200">
          <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${showUserList ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* User List Dropdown */}
      {showUserList && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-indigo-200/50 z-50  min-w-[320px]">          {financialDataLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="text-indigo-600 text-sm flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                Loading financial data...
              </div>
            </div>
          )}
          <div className="p-4 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-indigo-900 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Switch User</span>
              </h3>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg hover-lift"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {users.map((user, index) => (
              <div
                key={user.user_id}
                className={`p-3 border-b border-indigo-50 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 flex items-center justify-between  ${
                  currentUser.user_id === user.user_id ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-l-indigo-500' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  // Enhanced user context with financial data for AI
                  const enhancedUser = {
                    ...user,
                    financialContext: usersFinancialData[user.user_id] || {}
                  };
                  onUserSwitch(enhancedUser);
                  setShowUserList(false);
                }}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-indigo-900">
                      {user.status === 'student' ? 'Student' : user.status === 'professional' ? 'Professional' : 'Job Seeker'}
                    </p>
                    {usersFinancialData[user.user_id]?.financialHealthScore && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        usersFinancialData[user.user_id].financialHealthScore >= 80 ? 'bg-green-100 text-green-800' :
                        usersFinancialData[user.user_id].financialHealthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {usersFinancialData[user.user_id].financialHealthScore}/100
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-indigo-600 mb-2">
                    {user.age_bracket} • {user.monthly_income_range}
                  </p>
                  {usersFinancialData[user.user_id] && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-indigo-700">
                        <span className="font-medium">{usersFinancialData[user.user_id].goals} Goals</span>
                        <span className="font-medium">₹{usersFinancialData[user.user_id].totalSavings.toLocaleString()}</span>
                      </div>
                      {usersFinancialData[user.user_id].totalTargets > 0 && (
                        <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(usersFinancialData[user.user_id].progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      )}
                      <div className="flex gap-1 flex-wrap mt-1">
                        {usersFinancialData[user.user_id].progressPercentage > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            {usersFinancialData[user.user_id].progressPercentage}%
                          </span>
                        )}
                        {usersFinancialData[user.user_id].riskLevel && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            usersFinancialData[user.user_id].riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                            usersFinancialData[user.user_id].riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {usersFinancialData[user.user_id].riskLevel} Risk
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.user_id);
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200 p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Create New User Form */}
          {showCreateForm && (
            <div className="p-4 border-t border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 ">
              <h4 className="font-medium text-indigo-900 mb-3">Create New User</h4>
              <form onSubmit={handleCreateUser} className="space-y-3">
                <select
                  value={newUser.age_bracket}
                  onChange={(e) => setNewUser({...newUser, age_bracket: e.target.value})}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  required
                >
                  <option value="">Select Age Group</option>
                  <option value="16-18">16-18 years</option>
                  <option value="19-22">19-22 years</option>
                  <option value="23-25">23-25 years</option>
                </select>

                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="student">Student</option>
                  <option value="professional">Working Professional</option>
                  <option value="job-seeker">Job Seeker</option>
                </select>

                <select
                  value={newUser.monthly_income_range}
                  onChange={(e) => setNewUser({...newUser, monthly_income_range: e.target.value})}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  required
                >
                  <option value="">Select Income Range</option>
                  <option value="0-5k">₹0 - ₹5,000</option>
                  <option value="5k-15k">₹5,000 - ₹15,000</option>
                  <option value="15k-30k">₹15,000 - ₹30,000</option>
                  <option value="30k-50k">₹30,000 - ₹50,000</option>
                  <option value="50k+">₹50,000+</option>
                </select>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManager;