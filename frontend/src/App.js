import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GoalPlanner from './components/GoalPlanner';
import EmergencyFund from './components/EmergencyFund';
import ChatInterface from './components/ChatInterface';
import Charts from './components/Charts';
import Navbar from './components/Navbar';
import UserSetup from './components/UserSetup';
import UserManager from './components/UserManager';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('finbuddy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleUserCreated = (userData) => {
    setUser(userData);
    localStorage.setItem('finbuddy_user', JSON.stringify(userData));
  };

  const handleUserSwitch = (userData) => {
    setUser(userData);
    localStorage.setItem('finbuddy_user', JSON.stringify(userData));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <div className="text-xl font-semibold text-white animate-pulse">Loading FinBuddy...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <UserSetup onUserCreated={handleUserCreated} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 animate-pulse animation-delay-1000"></div>
        </div>
        
        <Navbar user={user} userManager={<UserManager currentUser={user} onUserSwitch={handleUserSwitch} />} />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="animate-fadeIn">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/goals" element={<GoalPlanner user={user} />} />
              <Route path="/emergency-fund" element={<EmergencyFund user={user} />} />
              <Route path="/chat" element={<ChatInterface user={user} />} />
              <Route path="/analytics" element={<Charts user={user} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
