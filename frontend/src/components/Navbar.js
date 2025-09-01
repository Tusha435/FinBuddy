import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Shield, MessageCircle, BarChart3 } from 'lucide-react';

const Navbar = ({ user, userManager }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/goals', icon: Target, label: 'Dream Goals' },
    { path: '/emergency-fund', icon: Shield, label: 'Emergency Fund' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/chat', icon: MessageCircle, label: 'AI Coach' }
  ];

  return (
    <nav className="glass-card backdrop-blur-md bg-white/90 shadow-lg border-b border-white/20 sticky top-0 z-50 animate-slideInFromLeft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 animate-bounceIn">
            <div className="text-2xl font-bold gradient-text animate-float">FinBuddy</div>
            {userManager}
          </div>
          
          <div className="flex space-x-1 animate-slideInFromRight">
            {navItems.map(({ path, icon: Icon, label }, index) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover-glow animate-fadeIn ${
                  location.pathname === path
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-indigo-700 hover:bg-indigo-50'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <Icon size={18} className="animate-float" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;