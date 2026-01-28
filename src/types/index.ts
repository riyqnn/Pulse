// ============================================================================
// PULSE - Real-Time Options Intelligence Layer
// ============================================================================

// ============================================================================
// CORE TYPES
// ============================================================================

export type MarketCondition =
  | 'volatility_expansion'
  | 'volatility_crush'
  | 'skew_anomaly'
  | 'yield_opportunity'
  | 'hedge_signal'
  | 'momentum_play'
  | 'arbitrage';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';
export type StrategyType = 'single_leg' | 'spread' | 'combo';

// ============================================================================
// REAL-TIME MARKET DATA (Thetanuts Integration)
// ============================================================================

export interface OptionBookOrder {
  id: string;
  asset: string;
  strike: number;
  expiry: Date;
  type: 'call' | 'put';
  side: 'bid' | 'ask';
  price: number;
  size: number;
  iv: number;
  timestamp: Date;
}

export interface OptionBookSnapshot {
  asset: string;
  spotPrice: number;
  orders: OptionBookOrder[];
  liquidityDepth: {
    calls: number;
    puts: number;
  };
  ivSurface: {
    atm: number;
    skew25: number; // IV skew at 25 delta
    termStructure: number[]; // IV by expiry
  };
  timestamp: Date;
}

export interface RFQQuote {
  id: string;
  strategy: OptionsStrategy;
  price: number;
  validUntil: Date;
  size: number;
  timestamp: Date;
}

export interface OracleUpdate {
  asset: string;
  price: number;
  twap: number;
  volatility: number;
  timestamp: Date;
}

// ============================================================================
// OPPORTUNITY DETECTION
// ============================================================================

export interface DetectedOpportunity {
  id: string;
  type: MarketCondition;
  confidence: number; // 0-1
  urgency: UrgencyLevel;
  detectedAt: Date;
  expiresAt: Date;

  // Market data that triggered detection
  triggers: {
    ivChange?: number; // percentage change
    skewDeviation?: number; // standard deviations from mean
    yieldAboveBaseline?: number; // percentage above normal
    liquidityDrain?: number; // reduction in book depth
    competitivePressure?: number; // bot activity score
  };

  // The strategy to execute
  strategy: OptionsStrategy;

  // AI interpretation (populated by AI layer)
  interpretation?: PromptInterpretation;
}

export interface OptionsStrategy {
  type: StrategyType;
  legs: {
    instrument: string; // e.g., "ETH $3200 Call"
    side: 'buy' | 'sell';
    size: number;
    strike?: number;
    expiry?: Date;
  }[];
  maxGain: number;
  maxLoss: number;
  breakeven: number[];
  estimatedCost: number;
  estimatedDuration?: string; // e.g., "2-3 days"
}

// ============================================================================
// AI INTERPRETATION LAYER
// ============================================================================

export interface PromptInterpretation {
  title: string; // e.g., "Generate 2.8% this week"
  whyNow: string; // e.g., "Markets are calm. Buyers are paying 40% above normal..."
  riskExplanation: string; // Plain English
  outcomeExplanation: string; // What happens in different scenarios
  urgencyReason: string; // Why the time limit
  suggestedAction: string; // Button label, e.g., "SELL $112 OF PREMIUM"

  // Calculated metrics
  timeValue?: number; // Minutes remaining
  fillProbability?: number; // 0-1 based on OptionBook depth
  competitionLevel?: number; // Other users/bots watching this
}

// ============================================================================
// PROMPT (User-Facing)
// ============================================================================

export interface PulsePrompt extends DetectedOpportunity {
  // UI state
  viewed: boolean;
  executed: boolean;
  executionTimestamp?: Date;

  // Execution result (if executed)
  result?: {
    txHash: string;
    actualPrice: number;
    fees: number;
    slippage: number;
  };

  // Performance tracking
  performance?: {
    currentValue: number;
    unrealizedPnL: number;
    realizedPnL?: number;
    expiredAt?: Date;
  };
}

// ============================================================================
// USER MASTERY & REPUTATION
// ============================================================================

export interface MasteryMetrics {
  score: number; // 0-10
  percentile: number; // 0-100
  rank: number; // Global rank

  // Components
  winRate: number; // Percentage of profitable trades
  executionSpeed: number; // Average seconds to execute
  consistency: number; // Low variance score
  yieldOptimization: number; // Captured vs. available premium

  // Strengths & weaknesses
  strengths: MarketCondition[];
  weaknesses: MarketCondition[];

  // 30-day performance
  performance30d: {
    totalTrades: number;
    profitableTrades: number;
    totalPnL: number;
    avgPnLPerTrade: number;
    bestTrade: number;
    worstTrade: number;
  };

  // Streak
  currentStreak: number; // Consecutive wins
  longestStreak: number;
}

export interface Trade {
  id: string;
  promptId: string;
  strategy: OptionsStrategy;
  executedAt: Date;
  executionSpeed: number; // Seconds from detection to execution

  // Execution details
  txHash: string;
  price: number;
  fees: number;

  // Outcome
  outcome?: {
    settledAt: Date;
    pnl: number;
    returnPercentage: number;
  };

  // Skill metrics
  skillSignals: {
    reactedQuickly: boolean; // Top quartile speed
    capturedOpportunity: boolean; // Better than average fill
    managedRisk: boolean; // Within expected parameters
  };
}

// ============================================================================
// THETANUTS INTEGRATION
// ============================================================================

export interface ThetanutsContractAddresses {
  optionBook: string;
  optionFactory: string;
  oracle: string;
  settlement: string;
}

export interface ExecutionPlan {
  contract: string;
  method: string;
  params: unknown[];
  estimatedGas: string;
  priceImpact: number;
  slippageTolerance: number;
}

// ============================================================================
// MARKET MONITORING STATE
// ============================================================================

export interface MarketState {
  // Current snapshots
  optionBook: OptionBookSnapshot | null;
  latestRFQ: RFQQuote | null;
  oracle: OracleUpdate | null;

  // Active opportunities
  activeOpportunities: DetectedOpportunity[];

  // Market regime
  regime: {
    volatility: 'low' | 'normal' | 'elevated' | 'extreme';
    trend: 'bearish' | 'neutral' | 'bullish';
    liquidity: 'thin' | 'normal' | 'deep';
  };

  lastUpdate: Date;
}

// ============================================================================
// USER PREFERENCES (No AI-driven personalization)
// ============================================================================

export interface UserPreferences {
  // Notification settings
  notifyOnUrgency: UrgencyLevel[];

  // Risk tolerance (for filtering, NOT for personalization)
  maxRiskPerTrade: number;
  maxPositionSize: number;

  // Asset preferences
  enabledAssets: string[]; // ['ETH', 'BTC', 'SOL']

  // Strategy preferences
  enabledStrategies: MarketCondition[];

  // Display settings
  displayCurrency: 'USD' | 'ETH' | 'BTC';
  urgencyThreshold: UrgencyLevel; // Don't show prompts below this
}

// ============================================================================
// ANALYTICS (For institutional data product)
// ============================================================================

export interface RetailSentiment {
  timestamp: Date;
  asset: string;

  // What retail traders are doing
  actionDistribution: {
    buyingCalls: number;
    buyingPuts: number;
    sellingCalls: number;
    sellingPuts: number;
  };

  // Which prompts are most popular
  hotOpportunities: {
    opportunityType: MarketCondition;
    executionCount: number;
    avgExecutionSpeed: number;
  }[];

  // Aggregate performance
  avgWinRate: number;
  avgPnL: number;
}
