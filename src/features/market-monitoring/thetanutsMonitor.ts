import type {
  OptionBookOrder,
  RFQQuote,
  MarketState,
} from '../../types';

/**
 * Real-time market data simulation
 * In production, this would connect to live Thetanuts contracts via WebSocket/Subgraph
 */
type MarketStateListener = (state: MarketState) => void;

class ThetanutsMarketMonitor {
  private state: MarketState;
  private listeners: Set<MarketStateListener>;
  private intervalId: number | null;

  // Historical data for pattern detection
  private ivHistory: number[] = [];
  private skewHistory: number[] = [];
  private yieldHistory: number[] = [];

  constructor() {
    this.state = this.getInitialState();
    this.listeners = new Set();
    this.intervalId = null;
  }

  private getInitialState(): MarketState {
    return {
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
    };
  }

  // Subscribe to market updates
  subscribe(callback: MarketStateListener): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Start monitoring (simulates WebSocket connection)
  start(): void {
    if (this.intervalId) return;

    // Initial snapshot
    this.generateSnapshot();

    // Update every 2 seconds (real-time feel)
    this.intervalId = window.setInterval(() => {
      this.generateSnapshot();
      this.notifyListeners();
    }, 2000);
  }

  // Stop monitoring
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Get current state
  getState(): MarketState {
    return this.state;
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback(this.state));
  }

  // Generate market snapshot (simulates Thetanuts on-chain state)
  private generateSnapshot(): void {
    const assets = ['ETH', 'BTC', 'SOL'];
    const asset = assets[Math.floor(Math.random() * assets.length)];

    // Simulate spot price with realistic movement
    const basePrices = { ETH: 3000, BTC: 42000, SOL: 100 };
    const spotPrice = this.simulatePriceMovement(basePrices[asset as keyof typeof basePrices]);

    // Generate OptionBook orders
    const orders = this.generateOptionBookOrders(asset, spotPrice);

    // Calculate IV surface
    const atmVol = 0.35 + Math.random() * 0.3; // 35-65% IV
    const skew25 = (Math.random() - 0.5) * 0.2; // -10% to +10% skew

    // Update historical data
    this.ivHistory.push(atmVol);
    this.skewHistory.push(skew25);
    if (this.ivHistory.length > 100) this.ivHistory.shift();
    if (this.skewHistory.length > 100) this.skewHistory.shift();

    // Create snapshot
    this.state.optionBook = {
      asset,
      spotPrice,
      orders,
      liquidityDepth: {
        calls: orders.filter((o) => o.type === 'call').reduce((sum, o) => sum + o.size, 0),
        puts: orders.filter((o) => o.type === 'put').reduce((sum, o) => sum + o.size, 0),
      },
      ivSurface: {
        atm: atmVol,
        skew25,
        termStructure: [atmVol, atmVol * 1.05, atmVol * 1.1, atmVol * 1.15],
      },
      timestamp: new Date(),
    };

    // Oracle update
    this.state.oracle = {
      asset,
      price: spotPrice,
      twap: spotPrice * (1 + (Math.random() - 0.5) * 0.001), // Small TWAP deviation
      volatility: atmVol,
      timestamp: new Date(),
    };

    // Update regime
    this.updateRegime(atmVol, skew25);

    this.state.lastUpdate = new Date();
  }

  private simulatePriceMovement(basePrice: number): number {
    const change = (Math.random() - 0.5) * 0.02; // +/- 1% per update
    const prevPrice = this.state.oracle?.price || basePrice;
    return prevPrice * (1 + change);
  }

  private generateOptionBookOrders(asset: string, spotPrice: number): OptionBookOrder[] {
    const orders: OptionBookOrder[] = [];
    const strikes = [
      spotPrice * 0.95,
      spotPrice * 0.975,
      spotPrice,
      spotPrice * 1.025,
      spotPrice * 1.05,
    ];
    const expiries = [
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    ];

    let orderId = 0;
    strikes.forEach((strike) => {
      expiries.forEach((expiry) => {
        const iv = this.state.optionBook?.ivSurface.atm || 0.4;
        const timeToExpiry = (expiry.getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000);

        ['call', 'put'].forEach((type) => {
          const moneyness = type === 'call' ? spotPrice - strike : strike - spotPrice;
          const timeValue = iv * Math.sqrt(timeToExpiry) * spotPrice * 0.4;
          const basePrice = Math.max(0, moneyness) + timeValue;

          // Bid (with size)
          orders.push({
            id: `${asset}-${type}-${strike}-${expiry.getTime()}-bid`,
            asset,
            strike,
            expiry,
            type: type as 'call' | 'put',
            side: 'bid',
            price: basePrice * 0.99,
            size: Math.floor(50 + Math.random() * 200),
            iv,
            timestamp: new Date(),
          });

          // Ask (with size)
          orders.push({
            id: `${asset}-${type}-${strike}-${expiry.getTime()}-ask`,
            asset,
            strike,
            expiry,
            type: type as 'call' | 'put',
            side: 'ask',
            price: basePrice * 1.01,
            size: Math.floor(50 + Math.random() * 200),
            iv,
            timestamp: new Date(),
          });

          orderId++;
        });
      });
    });

    return orders;
  }

  private updateRegime(atmVol: number, _skew25: number): void {
    // Volatility regime
    if (atmVol < 0.25) this.state.regime.volatility = 'low';
    else if (atmVol < 0.40) this.state.regime.volatility = 'normal';
    else if (atmVol < 0.60) this.state.regime.volatility = 'elevated';
    else this.state.regime.volatility = 'extreme';

    // Trend (based on recent price movement)
    const recentPrices = this.ivHistory.slice(-10);
    if (recentPrices.length >= 2) {
      const trend = recentPrices[recentPrices.length - 1] - recentPrices[0];
      if (trend > 0.02) this.state.regime.trend = 'bullish';
      else if (trend < -0.02) this.state.regime.trend = 'bearish';
      else this.state.regime.trend = 'neutral';
    }

    // Liquidity (based on OptionBook depth)
    const callsDepth = this.state.optionBook?.liquidityDepth.calls || 0;
    const putsDepth = this.state.optionBook?.liquidityDepth.puts || 0;
    const totalDepth = callsDepth + putsDepth;
    if (totalDepth < 500) this.state.regime.liquidity = 'thin';
    else if (totalDepth < 1500) this.state.regime.liquidity = 'normal';
    else this.state.regime.liquidity = 'deep';
  }

  // Get historical data for pattern detection
  getIVHistory(): number[] {
    return [...this.ivHistory];
  }

  getSkewHistory(): number[] {
    return [...this.skewHistory];
  }

  getYieldHistory(): number[] {
    return [...this.yieldHistory];
  }

  // Simulate RFQ quote request
  async requestRFQ(strategy: any): Promise<RFQQuote> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const notional = strategy.legs[0]?.size || 1000;
    const basePrice = notional * 0.02; // 2% of notional

    return {
      id: crypto.randomUUID(),
      strategy,
      price: basePrice * (1 + Math.random() * 0.01),
      validUntil: new Date(Date.now() + 5 * 60 * 1000),
      size: notional,
      timestamp: new Date(),
    };
  }
}

// Singleton instance
export const thetanutsMarketMonitor = new ThetanutsMarketMonitor();
