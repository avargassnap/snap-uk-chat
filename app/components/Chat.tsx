'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Smile, Paperclip, MessageCircle } from 'lucide-react';
import Image from 'next/image';
const SnapFinanceChat = () => {
  const [messages, setMessages] = useState<Array<{id: number; text: string; sender: string; timestamp: string; isTyping?: boolean}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState('initial');
  const [customerData, setCustomerData] = useState({
    isReturning: null as boolean | null,
    name: '',
    email: '',
    phone: ''
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    (messagesEndRef.current as HTMLDivElement | null)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting matching the image
    setTimeout(() => {
      addBotMessage("Hello, how are you doing?");
      setTimeout(() => {
        addBotMessage("I'm doing well, thank you! How can I help you today?");
        setTimeout(() => {
          showReturningCustomerQuestion();
        }, 1000);
      }, 1500);
    }, 500);
  }, []);

  const addBotMessage = (text: string, isTyping = false) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyping
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const showReturningCustomerQuestion = () => {
    setCurrentStep('returning_customer');
    addBotMessage("Are you a returning customer?", false);
  };

  const handleReturningCustomer = (isReturning: boolean) => {
    addUserMessage(isReturning ? "Yes" : "No");
    setCustomerData(prev => ({ ...prev, isReturning }));
    
    if (isReturning) {
      setCurrentStep('collect_info');
      setTimeout(() => {
        addBotMessage("Great! I'll need some information to assist you better. What's your full name?");
      }, 500);
    } else {
      setCurrentStep('general_chat');
      setTimeout(() => {
        addBotMessage("No problem! I'm here to help with any questions you might have about Snap Finance. What would you like to know?");
      }, 500);
    }
  };

  const handleInfoCollection = (value: string) => {
    addUserMessage(value);
    
    if (currentStep === 'collect_info' && !customerData.name) {
      setCustomerData(prev => ({ ...prev, name: value }));
      setTimeout(() => {
        addBotMessage("Thank you! What's your email address?");
      }, 500);
    } else if (currentStep === 'collect_info' && !customerData.email) {
      setCustomerData(prev => ({ ...prev, email: value }));
      setTimeout(() => {
        addBotMessage("Perfect! And what's your phone number?");
      }, 500);
    } else if (currentStep === 'collect_info' && !customerData.phone) {
      setCustomerData(prev => ({ ...prev, phone: value }));
      setCurrentStep('customer_options');
      setTimeout(() => {
        addBotMessage(`Thank you ${customerData.name}! I have all your information. How can I assist you today?`);
      }, 500);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (currentStep === 'collect_info') {
      handleInfoCollection(inputValue);
    } else {
      addUserMessage(inputValue);
      
      setTimeout(() => {
        const responses = [
          "I understand your question. Let me help you with that.",
          "That's a great question! I'm here to assist you with your Snap Finance needs.",
          "I can help you with that. Is there anything specific you'd like to know?",
          "Thank you for reaching out. I'm processing your request."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addBotMessage(randomResponse);
      }, 1000);
    }

    setInputValue('');
  };

  const handleQuickAction = (action: string) => {
    addUserMessage(action);
    
    setTimeout(() => {
      if (action === "Add payments to calendar") {
        addBotMessage("I'll help you add your payment dates to your calendar. Let me set that up for you.");
      } else if (action === "Talk with a human") {
        addBotMessage("I'm connecting you with one of our customer service representatives. Please hold on for a moment.");
      }
    }, 500);
  };

  const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Floating chat button when minimized
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#113655] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out hover:scale-105 flex items-center justify-center group hover:cursor-pointer"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-all duration-300" />
          <span className="ml-2 text-sm font-medium hidden group-hover:block transition-all duration-300">Chat with us</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-full max-w-sm bg-white rounded-none shadow-lg overflow-hidden rounded-xl animate-slide-up" style={{maxWidth: '400px'}}>
        {/* Header */}
        <div className="bg-[#113655] text-white p-6 pt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="snap finance" width={110} height={110} />
            </div>
            <button 
              onClick={() => setIsMinimized(true)}
              className="text-white p-1 bg-gray-500 rounded-full hover:cursor-pointer p-2 hover:bg-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm leading-relaxed ml-2 mb-8">
            Chat with our AI assistant and take action over your loans.
          </p>
        </div>

        {/* Messages */}
        <div className="h-100 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start max-w-xs">
                {message.sender === 'bot' && (
                  <div className="flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Image src="/bot-avatar.png" alt="snap finance" width={32} height={32} className="rounded-full" />
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm ${
                  message.sender === 'user' 
                    ? 'bg-[#6c5ce7] text-white rounded-br-sm' 
                    : 'bg-[#2d3748] text-white rounded-bl-sm'
                }`}>
                  {message.isTyping ? (
                    <div className="flex space-x-1 py-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Yes/No buttons */}
          {currentStep === 'returning_customer' && (
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => handleReturningCustomer(true)}
                className="px-6 py-2 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Yes
              </button>
              <button
                onClick={() => handleReturningCustomer(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                No
              </button>
            </div>
          )}

          {/* Quick action buttons */}
          {currentStep === 'customer_options' && (
            <div className="space-y-2 mt-4">
              <button
                onClick={() => handleQuickAction("Add payments to calendar")}
                className="w-full px-4 py-3 bg-[#2d3748] text-white rounded-lg text-sm hover:opacity-90 transition-opacity text-left"
              >
                Add payments to calendar
              </button>
              <button
                onClick={() => handleQuickAction("Talk with a human")}
                className="w-full px-4 py-3 bg-[#2d3748] text-white rounded-lg text-sm hover:opacity-90 transition-opacity text-left"
              >
                Talk with a human
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#113655] p-4">
          <div className="flex items-center space-x-3">
            <button className="text-white hover:opacity-70">
              <Smile size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Reply ..."
                className="w-full px-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
            <button className="text-white hover:opacity-70">
              <Paperclip size={18} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="w-10 h-10 bg-[#67B25F] text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnapFinanceChat;