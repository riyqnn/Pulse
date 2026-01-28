import type {
  DetectedOpportunity,
  MarketState,
  UrgencyLevel,
} from '../../types';
import { thetanutsMarketMonitor } from '../market-monitoring/thetanutsMonitor';

/**
 * Opportunity Detection Engine
 * Analyzes real-time Thetanuts market data and identifies trading opportunities
 */
type OpportunityListener = (opportunities: DetectedOpportunity[]) => void;

class OpportunityDetector {
  private detectedOpportunities: Map<string, DetectedOpportunity>;
  private listeners: Set<OpportunityListener>;

  constructor() {
    this.detectedOpportunities = new Map();
    this.listeners = new Set();
  }

  // Subscribe to new opportunities
  subscribe(callback: OpportunityListener): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Analyze market state and detect opportunities
  analyze(marketState: MarketState): void {
    const newOpportunities: DetectedOpportunity[] = [];

    if (!marketState.optionBook) {
      return;
    }

    // Run all detection patterns
    newOpportunities.push(...this.detectVolatilityCrush(marketState));
    newOpportunities.push(...this.detectSkewAnomaly(marketState));
    newOpportunities.push(...this.detectYieldOpportunity(marketState));
    newOpportunities.push(...this.detectHedgeSignal(marketState));
    newOpportunities.push(...this.detectMomentumPlay(marketState));

    // Update active opportunities
    this.updateOpportunities(newOpportunities);

    // Notify listeners
    this.notifyListeners();
  }

  private updateOpportunities(newOpportunities: DetectedOpportunity[]): void {
    const now = new Date();

    // Remove expired opportunities
    for (const [id, opp] of this.detectedOpportunities) {
      if (opp.expiresAt < now) {
        this.detectedOpportunities.delete(id);
      }
    }

    // Add new opportunities (avoid duplicates)
    for (const opp of newOpportunities) {
      const isDuplicate = Array.from(this.detectedOpportunities.values()).some(
        (existing) =>
          existing.type === opp.type &&
          existing.strategy.legs[0].instrument === opp.strategy.legs[0].instrument &&
          Math.abs(existing.expiresAt.getTime() - opp.expiresAt.getTime()) < 60000
      );

      if (!isDuplicate) {
        this.detectedOpportunities.set(opp.id, opp);
      }
    }
  }

  private notifyListeners(): void {
    const opportunities = Array.from(this.detectedOpportunities.values());
    this.listeners.forEach((callback) => callback(opportunities));
  }

  // Get current opportunities
  getOpportunities(): DetectedOpportunity[] {
    return Array.from(this.detectedOpportunities.values()).sort((a, b) => {
      // Sort by urgency
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  }

  // ============================================================================
  // DETECTION PATTERNS
  // ============================================================================

  private detectVolatilityCrush(marketState: MarketState): DetectedOpportunity[] {
    const opportunities: DetectedOpportunity[] = [];
    const ivHistory = thetanutsMarketMonitor.getIVHistory();

    if (ivHistory.length < 5) return opportunities;

    // Detect IV dropping (volatility crush setup)
    const recentIV = ivHistory.slice(-5);
    const ivChange = (recentIV[4] - recentIV[0]) / recentIV[0];

    if (ivChange < -0.1) {
      // IV dropped more than 10% - volatility crush imminent
      const optionBook = marketState.optionBook!;
      const spotPrice = optionBook.spotPrice;

      opportunities.push({
        id: crypto.randomUUID(),
        type: 'volatility_crush',
        confidence: 0.8,
        urgency: this.calculateUrgency(ivChange, 'high'),
        detectedAt: new Date(),
        expiresAt: new Date(Date.now() + 8 * 60 * 1000), // 8 minutes
        triggers: {
          ivChange: ivChange * 100, // percentage
          competitivePressure: 0.6, // Others might spot this
        },
        strategy: {
          type: 'single_leg',
          legs: [{
            instrument: `${optionBook.asset} $${spotPrice.toFixed(0)} Call`,
            side: 'sell',
            size: 1000,
            strike: spotPrice,
            expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          }],
          maxGain: 120,
          maxLoss: 50,
          breakeven: [spotPrice + 120],
          estimatedCost: 0,
          estimatedDuration: '7 days',
        },
      });
    }

    return opportunities;
  }

  private detectSkewAnomaly(marketState: MarketState): DetectedOpportunity[] {
    const opportunities: DetectedOpportunity[] = [];
    const skewHistory = thetanutsMarketMonitor.getSkewHistory();

    if (skewHistory.length < 20) return opportunities;

    // Calculate mean and std dev of skew
    const mean = skewHistory.reduce((sum, val) => sum + val, 0) / skewHistory.length;
    const variance = skewHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / skewHistory.length;
    const stdDev = Math.sqrt(variance);

    const currentSkew = marketState.optionBook!.ivSurface.skew25;
    const deviation = (currentSkew - mean) / stdDev;

    // Skew anomaly: >2 standard deviations from mean
    if (Math.abs(deviation) > 2) {
      const optionBook = marketState.optionBook!;
      const spotPrice = optionBook.spotPrice;

      opportunities.push({
        id: crypto.randomUUID(),
        type: 'skew_anomaly',
        confidence: Math.min(0.95, 0.6 + Math.abs(deviation) * 0.15),
        urgency: deviation < -3 ? 'critical' : 'high',
        detectedAt: new Date(),
        expiresAt: new Date(Date.now() + 12 * 60 * 1000), // 12 minutes
        triggers: {
          skewDeviation: deviation,
          competitivePressure: Math.abs(deviation) > 3 ? 0.9 : 0.5,
        },
        strategy: {
          type: 'spread',
          legs: [
            {
              instrument: `${optionBook.asset} $${(spotPrice * 1.05).toFixed(0)} Call`,
              side: 'buy',
              size: 500,
              strike: spotPrice * 1.05,
              expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
            {
              instrument: `${optionBook.asset} $${(spotPrice * 1.1).toFixed(0)} Call`,
              side: 'sell',
              size: 500,
              strike: spotPrice * 1.1,
              expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
          ],
          maxGain: 230,
          maxLoss: 50,
          breakeven: [spotPrice * 1.05, spotPrice * 1.1],
          estimatedCost: 50,
          estimatedDuration: '14 days',
        },
      });
    }

    return opportunities;
  }

  private detectYieldOpportunity(marketState: MarketState): DetectedOpportunity[] {
    const opportunities: DetectedOpportunity[] = [];
    const optionBook = marketState.optionBook!;
    const spotPrice = optionBook.spotPrice;

    // Find ATM call options
    const atmCalls = optionBook.orders.filter(
      (o) => o.type === 'call' && o.side === 'bid' &&
               Math.abs(o.strike - spotPrice) / spotPrice < 0.02
    );

    if (atmCalls.length === 0) return opportunities;

    // Calculate yield (premium as % of notional)
    const bestYield = atmCalls.reduce((best, option) => {
      const yield_ = (option.price * option.size) / (option.strike * option.size);
      return yield_ > best.yield ? { yield: yield_, option } : best;
    }, { yield: 0, option: atmCalls[0] });

    // Baseline yield (historical average ~2%)
    const baselineYield = 0.02;
    const yieldAboveBaseline = (bestYield.yield - baselineYield) / baselineYield;

    if (yieldAboveBaseline > 0.3) {
      // Yield is 30%+ above normal
      opportunities.push({
        id: crypto.randomUUID(),
        type: 'yield_opportunity',
        confidence: 0.85,
        urgency: yieldAboveBaseline > 0.7 ? 'high' : 'medium',
        detectedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        triggers: {
          yieldAboveBaseline: yieldAboveBaseline * 100,
          liquidityDrain: Math.random() * 0.3, // Simulating liquidity reducing
        },
        strategy: {
          type: 'single_leg',
          legs: [{
            instrument: `${optionBook.asset} $${bestYield.option.strike.toFixed(0)} Call`,
            side: 'sell',
            size: 1000,
            strike: bestYield.option.strike,
            expiry: bestYield.option.expiry,
          }],
          maxGain: Math.round(bestYield.option.price * bestYield.option.size),
          maxLoss: Math.round((bestYield.option.strike - spotPrice) * 1000),
          breakeven: [bestYield.option.strike + bestYield.option.price * bestYield.option.size / 1000],
          estimatedCost: 0,
          estimatedDuration: '7 days',
        },
      });
    }

    return opportunities;
  }

  private detectHedgeSignal(marketState: MarketState): DetectedOpportunity[] {
    const opportunities: DetectedOpportunity[] = [];
    const optionBook = marketState.optionBook!;

    // Check if market is bearish (regime)
    if (marketState.regime.trend !== 'bearish' && marketState.regime.volatility !== 'elevated') {
      return opportunities;
    }

    // Find cheap OTM puts for hedging
    const otmPuts = optionBook.orders.filter(
      (o) => o.type === 'put' && o.side === 'ask' && o.strike < optionBook.spotPrice * 0.95
    );

    if (otmPuts.length === 0) return opportunities;

    const cheapestPut = otmPuts.reduce((cheapest, option) =>
      option.price < cheapest.price ? option : cheapest
    );

    opportunities.push({
      id: crypto.randomUUID(),
      type: 'hedge_signal',
      confidence: 0.75,
      urgency: marketState.regime.volatility === 'extreme' ? 'critical' : 'high',
      detectedAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes - hedges are urgent
      triggers: {
        competitivePressure: 0.7, // Others looking to hedge too
      },
      strategy: {
        type: 'single_leg',
        legs: [{
          instrument: `${optionBook.asset} $${cheapestPut.strike.toFixed(0)} Put`,
          side: 'buy',
          size: 1000,
          strike: cheapestPut.strike,
          expiry: cheapestPut.expiry,
        }],
        maxGain: 999999, // Theoretically unlimited
        maxLoss: Math.round(cheapestPut.price * cheapestPut.size),
        breakeven: [cheapestPut.strike - cheapestPut.price * cheapestPut.size / 1000],
        estimatedCost: Math.round(cheapestPut.price * cheapestPut.size),
        estimatedDuration: '7-14 days',
      },
    });

    return opportunities;
  }

  private detectMomentumPlay(marketState: MarketState): DetectedOpportunity[] {
    const opportunities: DetectedOpportunity[] = [];
    const optionBook = marketState.optionBook!;

    // Bullish trend + low volatility = momentum setup
    if (marketState.regime.trend !== 'bullish' || marketState.regime.volatility !== 'low') {
      return opportunities;
    }

    const spotPrice = optionBook.spotPrice;

    opportunities.push({
      id: crypto.randomUUID(),
      type: 'momentum_play',
      confidence: 0.7,
      urgency: 'medium',
      detectedAt: new Date(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
      triggers: {
        competitivePressure: 0.4,
      },
      strategy: {
        type: 'single_leg',
        legs: [{
          instrument: `${optionBook.asset} $${(spotPrice * 1.05).toFixed(0)} Call`,
          side: 'buy',
          size: 500,
          strike: spotPrice * 1.05,
          expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        }],
        maxGain: 999999,
        maxLoss: Math.round(spotPrice * 0.05 * 500),
        breakeven: [spotPrice * 1.05 + 50], // Simplified
        estimatedCost: 150,
        estimatedDuration: '14 days',
      },
    });

    return opportunities;
  }

  private calculateUrgency(magnitude: number, baseLevel: 'low' | 'medium' | 'high'): UrgencyLevel {
    if (Math.abs(magnitude) > 0.3) return 'critical';
    if (Math.abs(magnitude) > 0.2) return 'high';
    if (Math.abs(magnitude) > 0.1) return baseLevel === 'high' ? 'medium' : 'low';
    return 'low';
  }
}

// Singleton instance
export const opportunityDetector = new OpportunityDetector();
