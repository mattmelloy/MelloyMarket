import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { LineChart, HelpCircle, ExternalLink } from 'lucide-react';
import PlayerForm from './components/PlayerForm';
import Leaderboard from './components/Leaderboard';

function App() {
  const handleHowToPlay = () => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
        <button 
          onClick={() => toast.dismiss(t.id)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Play Melloy Market Match</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Game Conditions</h3>
            <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
              <ul className="list-disc list-inside space-y-2">
                <li>Game Period: 1 December to 31 December</li>
                <li>Starting Portfolio Value: $100,000 AUD</li>
                <li>Share Trade Costs: Not Included</li>
                <li>Goal: Maximize portfolio value by end of period</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
            <p className="text-gray-600">
              To participate in Melloy Market Match, you'll need to track your stock portfolio using a trading app.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Recommended Trading App</h3>
            <div className="grid gap-4">
              <a 
                href="https://apps.apple.com/au/app/delta-investment-tracker/id1288676542" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>Delta (iOS)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">How to Update Your Portfolio</h3>
            <p className="text-gray-600">
              1. Track your total portfolio value in your chosen trading app
              2. Enter your name and current portfolio value in the form
              3. Compete with others on the leaderboard!
            </p>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LineChart className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-bold text-gray-800">Melloy Market Match</h1>
        </div>
        <button 
          onClick={handleHowToPlay}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span>How to Play</span>
        </button>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex space-x-8">
        <PlayerForm />
        <Leaderboard />
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
