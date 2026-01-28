import { Settings } from 'lucide-react';
import { usePulseStore } from '../../store/pulseStore';

export default function ProfilePage() {
  const { mastery, preferences, updatePreferences } = usePulseStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>
          <p className="text-gray-400">Manage your Pulse preferences</p>
        </div>

        {/* Mastery Summary */}
        <div className="border border-white/10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Mastery Score</h2>
              <p className="text-emerald-300">
                Top {mastery.percentile.toFixed(0)} percentile • Rank #{mastery.rank.toLocaleString()}
              </p>
            </div>
            <div className="text-6xl font-bold text-white">{mastery.score.toFixed(1)}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 border border-white/10 rounded-xl bg-slate-800/40">
              <div className="text-3xl font-bold text-white">{mastery.performance30d.totalTrades}</div>
              <div className="text-sm text-gray-400 mt-2">Total Trades</div>
            </div>
            <div className="text-center p-4 border border-white/10 rounded-xl bg-slate-800/40">
              <div className="text-3xl font-bold text-emerald-400">{Math.round(mastery.winRate * 100)}%</div>
              <div className="text-sm text-gray-400 mt-2">Win Rate</div>
            </div>
            <div className="text-center p-4 border border-white/10 rounded-xl bg-slate-800/40">
              <div className="text-3xl font-bold text-white">{mastery.currentStreak}</div>
              <div className="text-sm text-gray-400 mt-2">Current Streak</div>
            </div>
            <div className="text-center p-4 border border-white/10 rounded-xl bg-slate-800/40">
              <div className="text-3xl font-bold text-white">${mastery.performance30d.totalPnL.toFixed(0)}</div>
              <div className="text-sm text-gray-400 mt-2">Total P&L</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Preferences</h3>
          </div>

          <div className="space-y-8">
            {/* Risk Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Max Risk Per Trade: <span className="text-emerald-400 font-semibold">${preferences.maxRiskPerTrade}</span>
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={preferences.maxRiskPerTrade}
                onChange={(e) => updatePreferences({ maxRiskPerTrade: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>$50 (Conservative)</span>
                <span>$1000 (Aggressive)</span>
              </div>
            </div>

            {/* Max Position Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Max Position Size: <span className="text-emerald-400 font-semibold">${preferences.maxPositionSize}</span>
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={preferences.maxPositionSize}
                onChange={(e) => updatePreferences({ maxPositionSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>$100</span>
                <span>$5000</span>
              </div>
            </div>

            {/* Urgency Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Minimum Urgency Level to Show
              </label>
              <select
                value={preferences.urgencyThreshold}
                onChange={(e) => updatePreferences({ urgencyThreshold: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="critical" className="bg-slate-800">Critical only (most urgent)</option>
                <option value="high" className="bg-slate-800">High and above</option>
                <option value="medium" className="bg-slate-800">Medium and above (recommended)</option>
                <option value="low" className="bg-slate-800">All opportunities</option>
              </select>
            </div>

            {/* Enabled Assets */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Traded Assets
              </label>
              <div className="space-y-3">
                {['ETH', 'BTC', 'SOL'].map((asset) => (
                  <label
                    key={asset}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-slate-800/40 hover:bg-slate-800/60 hover:border-emerald-500/30 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.enabledAssets.includes(asset)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updatePreferences({
                            enabledAssets: [...preferences.enabledAssets, asset],
                          });
                        } else {
                          updatePreferences({
                            enabledAssets: preferences.enabledAssets.filter((a: string) => a !== asset),
                          });
                        }
                      }}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <span className="text-white font-medium">{asset}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
