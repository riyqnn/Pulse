import { useEffect, useState } from 'react';
import { Zap, Activity, TrendingUp, Clock } from 'lucide-react';
import { usePulseStore } from '../../store/pulseStore';
import { thetanutsMarketMonitor } from '../../features/market-monitoring/thetanutsMonitor';
import { opportunityDetector } from '../../features/detection/opportunityDetector';
import PulseCard from '../../components/pulse/PulseCard';

export default function PulseFeedPage() {
  const { activePrompts, setMarketState, addPrompt, removeExpiredPrompts, mastery, marketState } = usePulseStore();
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Start real-time market monitoring
    thetanutsMarketMonitor.start();
    setIsMonitoring(true);

    // Subscribe to market updates
    const unsubscribeMarket = thetanutsMarketMonitor.subscribe((state) => {
      setMarketState(state);

      // Detect opportunities
      opportunityDetector.analyze(state);
    });

    // Subscribe to new opportunities
    const unsubscribeOpportunities = opportunityDetector.subscribe(async (opportunities) => {
      // Add AI interpretation to each new opportunity
      for (const opp of opportunities) {
        await addPrompt(opp);
      }
    });

    // Cleanup expired prompts every minute
    const cleanupInterval = setInterval(() => {
      removeExpiredPrompts();
    }, 60000);

    return () => {
      thetanutsMarketMonitor.stop();
      unsubscribeMarket();
      unsubscribeOpportunities();
      clearInterval(cleanupInterval);
    };
  }, [setMarketState, addPrompt, removeExpiredPrompts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Pulse Feed</h1>
              <p className="text-gray-400">Real-time options intelligence from Thetanuts</p>
            </div>
            {isMonitoring && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold text-sm">Monitoring Live</span>
              </div>
            )}
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">Active Opportunities</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {activePrompts.length}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">Your Mastery</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400">
                {mastery.score.toFixed(1)}
              </div>
            </div>
            <div className="border border-white/10 rounded-xl bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">Win Rate</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {Math.round(mastery.winRate * 100)}%
              </div>
            </div>
          </div>

          {/* Market Regime */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="px-4 py-2 rounded-lg bg-slate-800/40 border border-white/10 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">
                Volatility: <span className="font-semibold text-white capitalize">{marketState.regime?.volatility || 'normal'}</span>
              </span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-slate-800/40 border border-white/10 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-gray-300">
                Trend: <span className="font-semibold text-white capitalize">{marketState.regime?.trend || 'neutral'}</span>
              </span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-slate-800/40 border border-white/10 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">
                Updated: <span className="font-semibold text-white">Just now</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Prompts */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Live Opportunities
        </h2>

        {activePrompts.length === 0 ? (
          <div className="border border-white/10 rounded-2xl bg-slate-900/60 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Scanning for opportunities...</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Our detection engine is analyzing Thetanuts OptionBook, RFQ flow, and oracle updates.
              <br />
              Opportunities will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePrompts.map((prompt) => (
              <PulseCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
