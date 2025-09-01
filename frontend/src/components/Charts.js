import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { Filter, TrendingUp, PieChart, BarChart3, Activity, Target, Brain, Shield } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = ({ user, goals = [] }) => {
  const [selectedChart, setSelectedChart] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('6months');
  const [chartData, setChartData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [userInsights, setUserInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasValidData, setHasValidData] = useState(false);
  const [userGoals, setUserGoals] = useState([]);
  
  useEffect(() => {
    if (user && user.user_id) {
      validateUserData();
    }
  }, [user, selectedChart, timeFilter]);

  const validateUserData = async () => {
    try {
      // First, fetch user's goals to validate if they have data
      const goalsResponse = await axios.get(`http://localhost:5000/api/goals/${user.user_id}`);
      const userGoalsList = goalsResponse.data.goals || [];
      setUserGoals(userGoalsList);
      
      const totalSavings = userGoalsList.reduce((sum, goal) => sum + goal.current_amount, 0);
      const totalTargets = userGoalsList.reduce((sum, goal) => sum + goal.target_amount, 0);
      
      // Check if user has meaningful financial data
      const hasData = userGoalsList.length > 0 && (totalSavings > 0 || totalTargets > 0);
      setHasValidData(hasData);
      
      if (hasData) {
        fetchChartData();
        fetchForecastData();
        fetchUserInsights();
      }
    } catch (error) {
      console.error('Failed to validate user data:', error);
      setHasValidData(false);
    }
  };

  const fetchChartData = async () => {
    if (!hasValidData) return;
    
    setLoading(true);
    try {
      const chartType = getChartTypeForSelected();
      const response = await axios.get(`http://localhost:5000/api/analytics/time-series/${user.user_id}`, {
        params: {
          period: timeFilter,
          type: chartType
        }
      });
      
      // Round financial data before setting
      const roundedData = roundChartData(response.data);
      setChartData(roundedData);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      setChartData(null);
    }
    setLoading(false);
  };

  const fetchForecastData = async () => {
    if (!hasValidData) return;
    
    try {
      const forecastType = selectedChart === 'forecast' ? 'savings_projection' : 'goal_achievement';
      const response = await axios.get(`http://localhost:5000/api/analytics/forecast/${user.user_id}`, {
        params: {
          period: timeFilter === '3months' ? '1year' : '2years',
          type: forecastType
        }
      });
      
      // Round forecast data
      const roundedData = roundChartData(response.data);
      setForecastData(roundedData);
    } catch (error) {
      console.error('Failed to fetch forecast data:', error);
      setForecastData(null);
    }
  };

  const fetchUserInsights = async () => {
    if (!hasValidData) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/analytics/insights/${user.user_id}`);
      const insights = response.data;
      
      // Round numerical values in insights
      if (insights) {
        if (insights.financial_health_score) {
          insights.financial_health_score = Math.round(insights.financial_health_score);
        }
      }
      
      setUserInsights(insights);
    } catch (error) {
      console.error('Failed to fetch user insights:', error);
      setUserInsights(null);
    }
  };

  // Utility function to round financial values
  const roundFinancialValue = (value) => {
    if (typeof value !== 'number') return value;
    
    // Round to nearest rupee for values >= 1
    if (Math.abs(value) >= 1) {
      return Math.round(value);
    }
    
    // For values < 1, round to 2 decimal places
    return Math.round(value * 100) / 100;
  };
  
  // Round all numerical data in chart datasets
  const roundChartData = (data) => {
    if (!data || !data.datasets) return data;
    
    const roundedData = { ...data };
    roundedData.datasets = data.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data ? dataset.data.map(value => roundFinancialValue(value)) : dataset.data
    }));
    
    return roundedData;
  };
  
  const getChartTypeForSelected = () => {
    switch(selectedChart) {
      case 'expenses':
        return 'expenses';
      case 'investments':
        return 'investments';
      case 'savings':
        return 'savings';
      default:
        return 'savings';
    }
  };

  // Sample data for comprehensive Indian financial metrics
  const monthlyExpenseData = {
    labels: ['Food & Groceries', 'Rent', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping'],
    datasets: [{
      label: 'Monthly Expenses (₹)',
      data: [8000, 15000, 3000, 4000, 2000, 2500, 5000],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)'
      ],
      borderWidth: 2
    }]
  };

  // Pareto Chart for 80-20 Rule Analysis
  const paretoData = {
    labels: ['Rent', 'Food', 'Shopping', 'Entertainment', 'Transport', 'Utilities', 'Healthcare'],
    datasets: [
      {
        type: 'bar',
        label: 'Amount (₹)',
        data: [15000, 8000, 5000, 4000, 3000, 2000, 2500],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Cumulative %',
        data: [38.5, 59, 71.8, 82.1, 89.7, 94.9, 100],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };

  // Investment Portfolio Distribution
  const portfolioData = {
    labels: ['Equity Mutual Funds', 'PPF', 'Fixed Deposits', 'Emergency Fund', 'Gold ETF', 'ELSS', 'Crypto'],
    datasets: [{
      data: [35, 20, 15, 15, 8, 5, 2],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Savings Growth Timeline (Lollipop-style)
  const savingsGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Savings (₹)',
      data: [5000, 7000, 4000, 8000, 6000, 9000, 7500, 8500, 6500, 9500, 8000, 10000],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
      pointRadius: 8,
      pointHoverRadius: 12,
      borderWidth: 3,
      fill: false,
      tension: 0.4
    }]
  };

  // Financial Health Gauge (using Doughnut as gauge)
  const financialHealthData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [{
      data: [75, 15, 8, 2], // Current score: 75%
      backgroundColor: [
        '#4CAF50',
        '#FFC107',
        '#FF9800',
        '#F44336'
      ],
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  // SIP Performance Comparison
  const sipComparisonData = {
    labels: ['Axis Bluechip', 'HDFC Top 100', 'SBI Large Cap', 'ICICI Pru Bluechip', 'Mirae Asset Large Cap'],
    datasets: [{
      label: '3-Year Returns (%)',
      data: [14.5, 13.2, 12.8, 13.8, 14.1],
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const paretoOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '80-20 Rule: Expense Analysis'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Cumulative %'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  const renderSelectedChart = () => {
    if (loading) {
      return (
        <div className="glass-card rounded-2xl p-8 text-center animate-pulse">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-indigo-600 loading-dots">Loading analytics</p>
        </div>
      );
    }

    switch(selectedChart) {
      case 'expenses':
        return (
          <div className="glass-card rounded-2xl p-6 hover-lift hover-glow animate-fadeIn">
            <h3 className="text-xl font-semibold gradient-text mb-4 animate-float">💰 Expense Analysis - {timeFilter.toUpperCase()}</h3>
            <div className="h-96">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                  <span className="text-indigo-600">Loading expense data...</span>
                </div>
              ) : chartData && chartData.datasets && chartData.datasets.length > 0 ? (
                chartData.datasets.length > 1 ? 
                  <Bar data={chartData} options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {position: 'right'}}}} /> :
                  <Doughnut data={chartData} options={chartOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                  <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center">No expense data available for this period.<br/>
                    <span className="text-sm">Add some goals and savings to see insights!</span>
                  </p>
                </div>
              )}
            </div>
            {chartData && chartData.insights && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700">{chartData.insights}</p>
              </div>
            )}
          </div>
        );

      case 'investments':
        return (
          <div className="glass-card rounded-2xl p-6 hover-lift hover-glow animate-fadeIn">
            <h3 className="text-xl font-semibold gradient-text mb-4 animate-float">📈 Investment Portfolio - {timeFilter.toUpperCase()}</h3>
            <div className="h-96">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                  <span className="text-indigo-600">Loading investment data...</span>
                </div>
              ) : chartData && chartData.datasets && chartData.datasets.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                  <TrendingUp className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center">No investment data available for this period.<br/>
                    <span className="text-sm">Start investing to see portfolio insights!</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'savings':
        return (
          <div className="glass-card rounded-2xl p-6 hover-lift hover-glow animate-fadeIn">
            <h3 className="text-xl font-semibold gradient-text mb-4 animate-float">🎯 Savings Growth - {timeFilter.toUpperCase()}</h3>
            <div className="h-96">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                  <span className="text-indigo-600">Loading savings data...</span>
                </div>
              ) : chartData && chartData.datasets && chartData.datasets.length > 0 ? (
                <Line data={chartData} options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Amount (₹)'
                      }
                    }
                  }
                }} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                  <Target className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center">No savings data available for this period.<br/>
                    <span className="text-sm">Add savings to your goals to see growth trends!</span>
                  </p>
                </div>
              )}
            </div>
            {chartData && chartData.datasets && chartData.datasets[0] && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Growth Trend: {chartData.datasets[0].trend || 'Upward'}</span>
                  </div>
                  <div className="text-green-700 font-medium">
                    Rate: {chartData.datasets[0].growth_rate || '8.5%'}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'forecast':
        return (
          <div className="glass-card rounded-2xl p-6 hover-lift hover-glow animate-fadeIn">
            <h3 className="text-xl font-semibold gradient-text mb-4 animate-float">🔮 Future Projections - Next 2 Years</h3>
            <div className="h-96">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                  <span className="text-indigo-600">Generating forecast...</span>
                </div>
              ) : forecastData && forecastData.datasets && forecastData.datasets.length > 0 ? (
                <Line 
                  data={forecastData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        title: {
                          display: true,
                          text: 'Projected Amount (₹)'
                        }
                      }
                    },
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        position: 'top'
                      }
                    }
                  }} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                  <Brain className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center">Unable to generate forecast.<br/>
                    <span className="text-sm">Need more savings history for predictions!</span>
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-medium">Conservative</p>
                <p className="text-blue-800 font-semibold">12% Annual Return</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 font-medium">Optimistic</p>
                <p className="text-green-800 font-semibold">15% Annual Return</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg border border-red-200">
                <p className="text-xs text-red-600 font-medium">Pessimistic</p>
                <p className="text-red-800 font-semibold">8% Annual Return</p>
              </div>
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="glass-card rounded-2xl p-6 hover-lift hover-glow animate-fadeIn">
            <h3 className="text-xl font-semibold gradient-text mb-4 animate-float">🏥 Financial Health Dashboard</h3>
            <div className="h-80 relative">
              <Doughnut data={financialHealthData} options={gaugeOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <div className="text-4xl font-bold text-green-600">
                    {userInsights ? userInsights.financial_health_score : 75}
                  </div>
                  <div className="text-sm text-gray-600">Health Score</div>
                </div>
              </div>
            </div>
            {userInsights && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-purple-800 font-semibold">Savings Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{userInsights.savings_rate}</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-semibold">Goal Completion</p>
                  <p className="text-2xl font-bold text-orange-900">{userInsights.goal_completion_rate}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'pareto':
        return (
          <div className="glass-card rounded-2xl p-6 hover-lift hover-glow animate-fadeIn">
            <h3 className="text-xl font-semibold gradient-text mb-4 animate-float">📊 Pareto Analysis - 80/20 Rule</h3>
            <div className="h-96">
              <Bar data={paretoData} options={paretoOptions} />
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 font-medium text-sm">
                💡 80% of your expenses come from just 20% of categories. Focus on optimizing rent and food expenses for maximum impact.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            <div className="glass-card rounded-2xl p-6 hover-lift hover-glow">
              <h3 className="text-lg font-semibold gradient-text mb-4 animate-float">💰 Goal Progress Overview</h3>
              <div className="h-64">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                    <span className="text-indigo-600">Loading overview...</span>
                  </div>
                ) : userGoals && userGoals.length > 0 ? (
                  <div className="space-y-3">
                    {userGoals.slice(0, 3).map((goal, index) => (
                      <div key={goal.id || index} className="bg-white/60 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-indigo-900 text-sm">{goal.dream}</h4>
                          <span className="text-xs text-indigo-600">₹{roundFinancialValue(goal.target_amount).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-indigo-100 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(goal.progress_percentage || 0, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-indigo-700 mt-1">{Math.round(goal.progress_percentage || 0)}% complete</p>
                      </div>
                    ))}
                    {userGoals.length > 3 && (
                      <p className="text-xs text-indigo-600 text-center">+{userGoals.length - 3} more goals</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                    <Target className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-center">No goals created yet.<br/>
                      <span className="text-sm">Create your first goal to see progress!</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6 hover-lift hover-glow">
              <h3 className="text-lg font-semibold gradient-text mb-4 animate-float">🏥 Financial Health</h3>
              <div className="h-64 relative">
                {userInsights ? (
                  <>
                    <Doughnut data={{
                      labels: ['Excellent', 'Good', 'Average', 'Poor'],
                      datasets: [{
                        data: [userInsights.financial_health_score, 100 - userInsights.financial_health_score, 0, 0],
                        backgroundColor: ['#4CAF50', '#E0E0E0', '#FFC107', '#F44336'],
                        borderWidth: 0,
                        cutout: '70%'
                      }]
                    }} options={gaugeOptions} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center animate-pulse">
                        <div className="text-3xl font-bold text-green-600">
                          {userInsights.financial_health_score}
                        </div>
                        <div className="text-xs text-gray-600">Health Score</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-indigo-600">
                    <Activity className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-center">Health score calculating...<br/>
                      <span className="text-sm">Add financial data to get insights!</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  // Render no-data state if user doesn't have sufficient financial data
  const renderNoDataState = () => {
    const totalSavings = userGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
    const totalTargets = userGoals.reduce((sum, goal) => sum + goal.target_amount, 0);
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-bounceIn">
          <h1 className="text-4xl font-bold gradient-text mb-2 animate-float">Financial Analytics 📊</h1>
          <p className="text-indigo-700 text-lg animate-fadeIn animation-delay-1000">Get insights when you have financial data</p>
        </div>
        
        <div className="glass-card rounded-2xl p-8 text-center animate-slideInFromLeft">
          <div className="mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 animate-bounce">
              <BarChart3 className="h-12 w-12 text-white mx-auto" />
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-4">No Financial Data Available</h2>
            <p className="text-indigo-700 mb-6 max-w-2xl mx-auto">
              To view your financial analytics and insights, you need to add some financial goals and savings data first.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900 mb-1">Goals: {userGoals.length}</h3>
              <p className="text-sm text-blue-700">Financial goals created</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 mb-1">Savings: ₹{roundFinancialValue(totalSavings).toLocaleString()}</h3>
              <p className="text-sm text-green-700">Current savings amount</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900 mb-1">Targets: ₹{roundFinancialValue(totalTargets).toLocaleString()}</h3>
              <p className="text-sm text-purple-700">Total target amounts</p>
            </div>
          </div>
          
          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-indigo-900">🚀 Get Started:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/goals" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover-lift"
              >
                <Target className="h-5 w-5 inline mr-2" />
                Create Goals
              </a>
              
              <a 
                href="/emergency-fund" 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover-lift"
              >
                <Shield className="h-5 w-5 inline mr-2" />
                Emergency Fund
              </a>
            </div>
            
            <p className="text-sm text-indigo-600 mt-4">
              💡 Once you add goals and savings data, beautiful charts and insights will appear here!
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // Show no-data state if user doesn't have meaningful financial data
  if (!hasValidData) {
    return renderNoDataState();
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-bounceIn">
        <h1 className="text-4xl font-bold gradient-text mb-2 animate-float">Financial Analytics 📊</h1>
        <p className="text-indigo-700 text-lg animate-fadeIn animation-delay-1000">Comprehensive insights into your financial health</p>
      </div>

      {/* Filter Controls */}
      <div className="glass-card rounded-2xl p-6 mb-8 animate-slideInFromLeft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-500 p-2 rounded-full animate-pulse">
                <Filter className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-indigo-800">Chart Type:</span>
            </div>
            <select 
              value={selectedChart} 
              onChange={(e) => setSelectedChart(e.target.value)}
              className="px-4 py-2 bg-white/60 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover-glow transition-all backdrop-blur-sm"
            >
              <option value="overview">📊 Overview</option>
              <option value="expenses">💰 Expense Analysis</option>
              <option value="savings">🎯 Savings Growth</option>
              <option value="investments">📈 Investment Portfolio</option>
              <option value="forecast">🔮 Future Predictions</option>
              <option value="health">🏥 Financial Health</option>
              <option value="pareto">📋 Pareto Analysis</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-indigo-800">Time Period:</span>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 bg-white/60 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover-glow transition-all backdrop-blur-sm"
            >
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
              <option value="2years">2 Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="mb-8">
        {renderSelectedChart()}
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Best Performing</p>
              <p className="text-lg font-bold text-green-900">Axis Bluechip Fund</p>
              <p className="text-sm text-green-700">14.5% annual return</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <PieChart className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Top Expense</p>
              <p className="text-lg font-bold text-blue-900">Rent</p>
              <p className="text-sm text-blue-700">38.5% of total expenses</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Savings Rate</p>
              <p className="text-lg font-bold text-purple-900">18.5%</p>
              <p className="text-sm text-purple-700">Above Indian average</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Insights and Recommendations */}
      {userInsights && (
        <div className="mt-8 space-y-6 animate-slideInFromLeft">
          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover-lift">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-3 rounded-full animate-pulse">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Financial Health</p>
                  <p className="text-2xl font-bold text-green-900">{userInsights.financial_health_score}/100</p>
                  <p className="text-xs text-green-700">
                    {userInsights.financial_health_score >= 80 ? 'Excellent' : 
                     userInsights.financial_health_score >= 60 ? 'Good' : 
                     userInsights.financial_health_score >= 40 ? 'Average' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 hover-lift">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-3 rounded-full animate-pulse animation-delay-1000">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">vs Peers</p>
                  <p className="text-lg font-bold text-blue-900">{userInsights.benchmark_comparison.savings_vs_peers}</p>
                  <p className="text-xs text-blue-700">Savings Performance</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover-lift">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-3 rounded-full animate-pulse animation-delay-2000">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Risk Level</p>
                  <p className="text-lg font-bold text-purple-900">{userInsights.risk_assessment.level}</p>
                  <p className="text-xs text-purple-700">Financial Risk</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="glass-card rounded-2xl p-6 bg-white/80">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full animate-pulse">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold gradient-text animate-float">🤖 AI-Powered Recommendations</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userInsights.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-white/60 rounded-xl p-4 border border-indigo-200 hover-lift animate-fadeIn" style={{animationDelay: `${index * 200}ms`}}>
                  <p className="text-sm text-indigo-800 font-medium">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="glass-card rounded-2xl p-6 bg-white/80">
            <h3 className="text-xl font-semibold gradient-text mb-6 animate-float">📈 Market Insights & Tax Optimization</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-indigo-900 mb-3">🏛️ Market Outlook</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">{userInsights.market_insights.equity_outlook}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">{userInsights.market_insights.interest_rates}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">{userInsights.market_insights.inflation_impact}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-purple-900 mb-3">💰 Tax Optimization</h4>
                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-600 font-medium">Section 80C Remaining</p>
                    <p className="text-purple-800 font-semibold">{userInsights.tax_optimization.section_80c_remaining}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <p className="text-xs text-indigo-600 font-medium">ELSS Suggestion</p>
                    <p className="text-indigo-800 text-sm">{userInsights.tax_optimization.elss_suggestion}</p>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                    <p className="text-xs text-teal-600 font-medium">PPF Optimization</p>
                    <p className="text-teal-800 text-sm">{userInsights.tax_optimization.ppf_optimization}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;