import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function PlayerForm() {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRefreshPrompt, setShowRefreshPrompt] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    setLoading(true);
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) throw new Error('Invalid value');

      const { data: existingPlayer } = await supabase
        .from('players')
        .select()
        .eq('name', name)
        .single();

      if (existingPlayer) {
        const { error } = await supabase
          .from('players')
          .update({
            current_value: numericValue,
            previous_value: existingPlayer.current_value,
            last_updated: new Date().toISOString(),
          })
          .eq('name', name);

        if (error) throw error;
        toast.success('Portfolio updated!');
      } else {
        const { error } = await supabase
          .from('players')
          .insert([
            {
              name,
              current_value: numericValue,
              last_updated: new Date().toISOString(),
            },
          ]);

        if (error) throw error;
        toast.success('Player added!');
      }

      setShowRefreshPrompt(true);
      setName('');
      setValue('');
    } catch (error) {
      toast.error('Something went wrong!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-800">Update Portfolio</h2>
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Player Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
          Portfolio Value ($)
        </label>
        <input
          type="number"
          id="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter portfolio value"
          min="0"
          step="0.01"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Update Portfolio'}
      </button>

      {showRefreshPrompt && (
        <p className="text-center text-yellow-600 mt-2">
          Please refresh the page to update the leaderboard
        </p>
      )}
    </form>
  );
}
