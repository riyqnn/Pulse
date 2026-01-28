import { Trophy, Target, Zap, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { usePulseStore } from '../../store/pulseStore';

export default function MasteryPage() {
  const { mastery, trades } = usePulseStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Your Mastery</h1>
          <p className="text-gray-400">Real skill metrics based on actual trading performance</p>
        </div>

        {/* Mastery Score */}
        <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Mastery Score</h2>
              <p className="text-gray-400">
                Top {mastery.percentile.toFixed(0)} percentile • Rank #{mastery.rank.toLocaleString()}
              </p>
            </div>
            <div className="px-8 py-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <div className="text-5xl font-bold text-white text-center">
                {mastery.score.toFixed(1)}
              </div>
              <div className="text-sm font-medium text-emerald-100 text-center mt-1">out of 10</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <Target className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Win Rate</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {Math.round(mastery.winRate * 100)}%
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Speed</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {mastery.executionSpeed.toFixed(1)}s
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Consistency</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {(mastery.consistency * 100).toFixed(0)}%
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <Trophy className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {mastery.currentStreak}
              </div>
            </div>
          </div>
        </div>

        {/* 30-Day Performance */}
        <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
          <h3 className="text-xl font-semibold text-white mb-6">30-Day Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="text-sm text-gray-400 mb-2">Total Trades</div>
              <div className="text-3xl font-bold text-white">
                {mastery.performance30d.totalTrades}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="text-sm text-gray-400 mb-2">Profitable Trades</div>
              <div className="text-3xl font-bold text-emerald-400">
                {mastery.performance30d.profitableTrades}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="text-sm text-gray-400 mb-2">Total P&L</div>
              <div className={`text-3xl font-bold flex items-center gap-2 ${
                mastery.performance30d.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {mastery.performance30d.totalPnL >= 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                ${Math.abs(mastery.performance30d.totalPnL).toFixed(0)}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="text-sm text-gray-400 mb-2">Avg P&L per Trade</div>
              <div className={`text-2xl font-bold ${
                mastery.performance30d.avgPnLPerTrade >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {mastery.performance30d.avgPnLPerTrade >= 0 ? '+' : ''}${mastery.performance30d.avgPnLPerTrade.toFixed(0)}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="text-sm text-gray-400 mb-2">Best Trade</div>
              <div className="text-2xl font-bold text-emerald-400">
                +${mastery.performance30d.bestTrade.toFixed(0)}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-5">
              <div className="text-sm text-gray-400 mb-2">Worst Trade</div>
              <div className="text-2xl font-bold text-red-400">
                ${mastery.performance30d.worstTrade.toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        {mastery.strengths.length > 0 && (
          <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" />
              Strengths
            </h3>
            <div className="flex flex-wrap gap-3">
              {mastery.strengths.map((strength: string) => (
                <span
                  key={strength}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                >
                  ✓ {strength.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {mastery.weaknesses.length > 0 && (
          <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Areas to Improve</h3>
            <div className="flex flex-wrap gap-3">
              {mastery.weaknesses.map((weakness: string) => (
                <span
                  key={weakness}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400"
                >
                  ⚠ {weakness.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Trade History */}
        {trades.length > 0 && (
          <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Trades</h3>
            <div className="space-y-3">
              {trades.slice(-10).reverse().map((trade) => (
                <div
                  key={trade.id}
                  className="border border-white/10 rounded-xl bg-slate-800/40 p-4 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1">
                        {trade.strategy.legs[0].side.toUpperCase()} {trade.strategy.legs[0].instrument}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(trade.executedAt).toLocaleDateString()} • {trade.executionSpeed.toFixed(1)}s to execute
                      </div>
                    </div>
                    <div className="text-right">
                      {trade.outcome ? (
                        <div className={`text-2xl font-bold flex items-center gap-2 ${
                          trade.outcome.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {trade.outcome.pnl >= 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                          ${Math.abs(trade.outcome.pnl).toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Pending settlement</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
