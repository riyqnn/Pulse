import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PulsePrompt,
  MasteryMetrics,
  Trade,
  UserPreferences,
  MarketState,
  DetectedOpportunity,
  UrgencyLevel,
} from '../types';
import { promptInterpreter } from '../features/ai-interpreter/promptInterpreter';

interface PulseStore {
  // Real-time prompts
  activePrompts: PulsePrompt[];
  promptHistory: PulsePrompt[];

  // User preferences
  preferences: UserPreferences;

  // Mastery & performance
  trades: Trade[];
  mastery: MasteryMetrics;

  // Market state
  marketState: MarketState;

  // Actions
  setMarketState: (state: MarketState) => void;
  addPrompt: (opportunity: DetectedOpportunity) => Promise<void>;
  executePrompt: (promptId: string) => Promise<void>;
  markPromptViewed: (promptId: string) => void;
  removeExpiredPrompts: () => void;
  updateTrade: (tradeId: string, outcome: Trade['outcome']) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  recalculateMastery: () => void;
}

const defaultMastery: MasteryMetrics = {
  score: 5.0,
  percentile: 50,
  rank: 1000000,
  winRate: 0,
  executionSpeed: 0,
  consistency: 0,
  yieldOptimization: 0,
  strengths: [],
  weaknesses: [],
  performance30d: {
    totalTrades: 0,
    profitableTrades: 0,
    totalPnL: 0,
    avgPnLPerTrade: 0,
    bestTrade: 0,
    worstTrade: 0,
  },
  currentStreak: 0,
  longestStreak: 0,
};

const defaultPreferences: UserPreferences = {
  notifyOnUrgency: ['critical', 'high'],
  maxRiskPerTrade: 500,
  maxPositionSize: 1000,
  enabledAssets: ['ETH', 'BTC', 'SOL'],
  enabledStrategies: [
    'yield_opportunity',
    'hedge_signal',
    'volatility_crush',
    'skew_anomaly',
  ],
  displayCurrency: 'USD',
  urgencyThreshold: 'medium',
};

export const usePulseStore = create<PulseStore>()(
  persist(
    (set, get) => ({
      activePrompts: [],
      promptHistory: [],
      preferences: defaultPreferences,
      trades: [],
      mastery: defaultMastery,
      marketState: {
        optionBook: null,
        latestRFQ: null,
        oracle: null,
        activeOpportunities: [],
        regime: {
          volatility: 'normal',
          trend: 'neutral',
          liquidity: 'normal',
        },
        lastUpdate: new Date(),
      },

      setMarketState: (state) => set({ marketState: state }),

      addPrompt: async (opportunity) => {
        // Check if prompt already exists
        const exists = get().activePrompts.some(
          (p) =>
            p.type === opportunity.type &&
            p.strategy.legs[0].instrument === opportunity.strategy.legs[0].instrument
        );

        if (exists) return;

        // Generate AI interpretation
        const interpretation = await promptInterpreter.interpret(opportunity);

        const prompt: PulsePrompt = {
          ...opportunity,
          interpretation,
          viewed: false,
          executed: false,
        };

        set((state) => ({
          activePrompts: [...state.activePrompts, prompt].sort((a, b) => {
            const urgencyOrder: Record<UrgencyLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
          }),
        }));
      },

      executePrompt: async (promptId) => {
        const prompt = get().activePrompts.find((p) => p.id === promptId);
        if (!prompt) return;

        const executionSpeed = (Date.now() - prompt.detectedAt.getTime()) / 1000;

        // Simulate execution
        await new Promise((resolve) => setTimeout(resolve, 500));

        const trade: Trade = {
          id: crypto.randomUUID(),
          promptId,
          strategy: prompt.strategy,
          executedAt: new Date(),
          executionSpeed,
          txHash: '0x' + Math.random().toString(16).slice(2, 66),
          price: prompt.strategy.estimatedCost || prompt.strategy.maxGain,
          fees: Math.round(prompt.strategy.maxGain * 0.001),
          skillSignals: {
            reactedQuickly: executionSpeed < 10,
            capturedOpportunity: Math.random() > 0.5,
            managedRisk: Math.random() > 0.4,
          },
        };

        set((state) => ({
          activePrompts: state.activePrompts.map((p) =>
            p.id === promptId
              ? { ...p, executed: true, executionTimestamp: new Date() }
              : p
          ),
          trades: [...state.trades, trade],
        }));

        // Simulate settlement after 30 seconds (for demo)
        setTimeout(() => {
          const pnl = (Math.random() - 0.4) * prompt.strategy.maxGain;
          get().updateTrade(trade.id, {
            settledAt: new Date(),
            pnl,
            returnPercentage: (pnl / (prompt.strategy.estimatedCost || 100)) * 100,
          });
        }, 30000);

        get().recalculateMastery();
      },

      markPromptViewed: (promptId) => {
        set((state) => ({
          activePrompts: state.activePrompts.map((p) =>
            p.id === promptId ? { ...p, viewed: true } : p
          ),
        }));
      },

      removeExpiredPrompts: () => {
        const now = new Date();
        set((state) => {
          const expired = state.activePrompts.filter((p) => p.expiresAt < now);
          return {
            promptHistory: [...state.promptHistory, ...expired],
            activePrompts: state.activePrompts.filter((p) => p.expiresAt >= now),
          };
        });
      },

      updateTrade: (tradeId, outcome) => {
        set((state) => ({
          trades: state.trades.map((t) =>
            t.id === tradeId ? { ...t, outcome } : t
          ),
        }));
        get().recalculateMastery();
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      recalculateMastery: () => {
        const trades = get().trades.filter((t) => t.outcome);
        const profitableTrades = trades.filter((t) => (t.outcome?.pnl || 0) > 0);

        const winRate = trades.length > 0 ? profitableTrades.length / trades.length : 0;
        const avgSpeed = trades.reduce((sum, t) => sum + t.executionSpeed, 0) / trades.length || 0;
        const totalPnL = trades.reduce((sum, t) => sum + (t.outcome?.pnl || 0), 0);

        // Calculate consistency (inverse of variance)
        const pnls = trades.map((t) => t.outcome?.pnl || 0);
        const variance = pnls.length > 1
          ? pnls.reduce((sum, pnl) => sum + Math.pow(pnl - totalPnL / trades.length, 2), 0) / (trades.length - 1)
          : 0;
        const consistency = Math.max(0, 1 - variance / 10000); // Normalize to 0-1

        // Calculate streak
        const sortedTrades = [...trades].sort((a, b) =>
          (a.executedAt.getTime() - b.executedAt.getTime())
        );
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        sortedTrades.forEach((t) => {
          if ((t.outcome?.pnl || 0) > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        });
        currentStreak = tempStreak;

        // Calculate mastery score
        const score = (
          (winRate * 0.4) +
          (1 - Math.min(avgSpeed / 30, 1)) * 0.3 +
          consistency * 0.2 +
          (totalPnL / 1000) * 0.1
        ) * 10;

        set({
          mastery: {
            ...get().mastery,
            score: Math.max(0, Math.min(10, score)),
            winRate,
            executionSpeed: avgSpeed,
            consistency,
            yieldOptimization: 0, // TODO: Calculate from captured vs available
            performance30d: {
              totalTrades: trades.length,
              profitableTrades: profitableTrades.length,
              totalPnL,
              avgPnLPerTrade: trades.length > 0 ? totalPnL / trades.length : 0,
              bestTrade: Math.max(...pnls),
              worstTrade: Math.min(...pnls),
            },
            currentStreak,
            longestStreak,
          },
        });
      },
    }),
    {
      name: 'pulse-store',
      partialize: (state) => ({
        preferences: state.preferences,
        trades: state.trades,
        mastery: state.mastery,
        promptHistory: state.promptHistory.slice(-100), // Keep last 100
      }),
    }
  )
);
