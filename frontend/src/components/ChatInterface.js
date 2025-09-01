import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader } from 'lucide-react';

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hi there! 👋 I'm your FinBuddy AI coach. I'm here to help you with financial planning, savings strategies, and achieving your dreams. What would you like to know about?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: inputMessage,
        user_context: {
          age_bracket: user.age_bracket,
          status: user.status,
          monthly_income_range: user.monthly_income_range,
          // Enhanced financial context for better AI responses
          financial_profile: user.financialContext ? {
            total_goals: user.financialContext.goals,
            total_savings: user.financialContext.totalSavings,
            total_targets: user.financialContext.totalTargets,
            progress_percentage: user.financialContext.progressPercentage,
            financial_health_score: user.financialContext.financialHealthScore,
            savings_rate: user.financialContext.savingsRate,
            risk_level: user.financialContext.riskLevel,
            has_financial_data: user.financialContext.goals > 0
          } : {
            has_financial_data: false,
            is_new_user: true
          }
        }
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const quickQuestions = [
    "How can I start saving money effectively?",
    "What's the 50-30-20 budgeting rule?",
    "How do I build an emergency fund?",
    "What are the best saving strategies for students?",
    "How much should I save each month?",
    "Tips for avoiding unnecessary expenses?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Financial Coach 🤖</h1>
        <p className="text-gray-600">Get personalized financial advice and guidance</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-100 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">FinBuddy AI Coach</p>
              <p className="text-sm text-gray-500">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gray-900 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'bot' && (
                    <Bot className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-gray-700" />
                  <Loader className="h-4 w-4 text-gray-700 animate-spin" />
                  <span className="text-sm text-gray-500">FinBuddy is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick questions to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about financial planning..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-400 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Be specific about your goals and situation for better advice!
          </p>
        </form>
      </div>

      {/* Features Info */}
      <div className="mt-6 bg-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">What I can help you with:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900 mb-1">💰 Budgeting & Saving</p>
            <p className="text-gray-600">Learn effective budgeting techniques and saving strategies</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">🎯 Goal Planning</p>
            <p className="text-gray-600">Create actionable plans for your financial dreams</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">📚 Financial Education</p>
            <p className="text-gray-600">Understand investment basics and money management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;