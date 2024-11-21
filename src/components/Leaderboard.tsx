import React, { useEffect, useState } from 'react';
import { Trophy, TrendingDown, TrendingUp, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Player } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('current_value', { ascending: false });
    
    if (data) setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();

    const subscription = supabase
      .channel('players_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        fetchPlayers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleDeletePlayer = async (playerId: string, playerName: string) => {
    // Confirmation toast with custom styling and actions
    toast.custom((t) => (
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex items-center justify-center mb-4">
          <Trash2 className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-bold text-center mb-2">Delete Player Data</h3>
        <p className="text-gray-600 text-center mb-4">
          Are you sure you want to delete {playerName}'s data? This action cannot be undone.
        </p>
        <p className="text-red-500 text-center text-sm mb-4">
          Please only delete your own data.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                const { error } = await supabase
                  .from('players')
                  .delete()
                  .eq('id', playerId);

                if (error) throw error;

                toast.dismiss(t.id);
                toast.success(`${playerName}'s data removed`);
                fetchPlayers();
              } catch (error) {
                toast.error('Failed to delete player');
                console.error(error);
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getValueChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(2);
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {players.map((player, index) => {
          const valueChange = getValueChange(player.current_value, player.previous_value);
          
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 ${
                index !== players.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`
                  w-8 h-8 flex items-center justify-center rounded-full
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-600'}
                  font-semibold
                `}>
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">{player.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(player.last_updated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatValue(player.current_value)}
                  </div>
                  {valueChange && (
                    <div className={`flex items-center text-sm ${
                      parseFloat(valueChange) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(valueChange) >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(parseFloat(valueChange))}%
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleDeletePlayer(player.id, player.name)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete player data"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
