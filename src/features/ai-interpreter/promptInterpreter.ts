import type {
  DetectedOpportunity,
  MarketCondition,
  PromptInterpretation,
} from '../../types';

/**
 * AI Interpretation Layer
 * Translates complex options data into plain English, user-friendly prompts
 * This is NOT a chatbot - it's a context generator
 */
class PromptInterpreter {
  // Interpret a detected opportunity and generate user-facing content
  async interpret(opportunity: DetectedOpportunity): Promise<PromptInterpretation> {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 300));

    const interpretations: Record<MarketCondition, () => PromptInterpretation> = {
      volatility_crush: () => this.interpretVolatilityCrush(opportunity),
      skew_anomaly: () => this.interpretSkewAnomaly(opportunity),
      yield_opportunity: () => this.interpretYieldOpportunity(opportunity),
      hedge_signal: () => this.interpretHedgeSignal(opportunity),
      momentum_play: () => this.interpretMomentumPlay(opportunity),
      volatility_expansion: () => this.interpretVolatilityExpansion(opportunity),
      arbitrage: () => this.interpretArbitrage(opportunity),
    };

    const interpreter = interpretations[opportunity.type];
    if (!interpreter) {
      return this.fallbackInterpretation(opportunity);
    }

    const interpretation = interpreter();

    // Add calculated metrics
    interpretation.timeValue = this.getMinutesRemaining(opportunity.expiresAt);
    interpretation.fillProbability = this.calculateFillProbability(opportunity);
    interpretation.competitionLevel = opportunity.triggers.competitivePressure || 0;

    return interpretation;
  }

  private interpretVolatilityCrush(opp: DetectedOpportunity): PromptInterpretation {
    const ivChange = Math.abs(opp.triggers.ivChange || 0);
    const premium = Math.round(opp.strategy.maxGain);

    return {
      title: `Earn $${premium} premium right now`,
      whyNow: `Volatility is dropping ${ivChange.toFixed(0)}%. Markets are calming down, which means option premiums are about to get cheaper. Sell now to capture the current high prices.`,
      riskExplanation: `You're agreeing to sell your ${opp.strategy.legs[0].instrument} at $${opp.strategy.legs[0].strike?.toFixed(0)} if requested. If price pumps above, you still sell at strike price (but keep the $${premium}).`,
      outcomeExplanation: `Best case: Price stays flat or drops → you keep $${premium}\nWorst case: Price pumps >${opp.strategy.legs[0].strike?.toFixed(0)} → you sell at strike (still keep $${premium})\nBreakeven: $${opp.strategy.breakeven[0]?.toFixed(0)}`,
      urgencyReason: `Volatility reverts quickly. This ${ivChange.toFixed(0)}% drop happened in minutes—prices will normalize within ${Math.round((opp.expiresAt.getTime() - Date.now()) / 60000)} minutes.`,
      suggestedAction: `SELL $${premium} OF PREMIUM`,
    };
  }

  private interpretSkewAnomaly(opp: DetectedOpportunity): PromptInterpretation {
    const deviation = opp.triggers.skewDeviation || 0;
    const isCheapUpside = deviation < 0;
    const direction = isCheapUpside ? 'cheap' : 'expensive';

    return {
      title: isCheapUpside ? 'Upside is unusually cheap right now' : 'Downside protection is expensive',
      whyNow: `Options are priced ${Math.abs(deviation).toFixed(1)} standard deviations from normal. ${isCheapUpside ? 'Calls' : 'Puts'} are ${direction} because the market is ${isCheapUpside ? 'underpricing bullish moves' : 'overpricing downside protection'}.`,
      riskExplanation: isCheapUpside
        ? `You're buying upside exposure for less than usual. If ${opp.strategy.legs[0].instrument} rallies, you profit. Max loss is capped at $${opp.strategy.maxLoss}.`
        : `You're selling expensive downside protection. If price stays stable, you keep the premium. Max loss is $${opp.strategy.maxLoss}.`,
      outcomeExplanation: `Max gain: $${opp.strategy.maxGain}\nMax loss: $${opp.strategy.maxLoss}\nThis is a defined-risk strategy with capped losses on both sides.`,
      urgencyReason: `${Math.abs(deviation) > 3 ? 'Rare market anomaly' : 'Skew normalizes quickly'}. ${opp.triggers.competitivePressure && opp.triggers.competitivePressure > 0.7 ? 'High bot activity—orderbook filling fast.' : ''}`,
      suggestedAction: isCheapUpside ? `BUY UPSIDE ($${opp.strategy.maxLoss} max risk)` : `SELL EXPENSIVE PUTS`,
    };
  }

  private interpretYieldOpportunity(opp: DetectedOpportunity): PromptInterpretation {
    const premium = opp.strategy.maxGain;
    const yieldPct = ((opp.triggers.yieldAboveBaseline || 0) + 1) * 100;

    return {
      title: `Generate ${yieldPct.toFixed(1)}% this week`,
      whyNow: `Markets are calm and buyers are paying ${yieldPct.toFixed(0)}% above normal for weekly upside exposure. You can sell them that upside and collect the premium.`,
      riskExplanation: `You're selling someone the right to buy ${opp.strategy.legs[0].instrument} from you at $${opp.strategy.legs[0].strike?.toFixed(0)}. If price doesn't move much, you keep the full premium.`,
      outcomeExplanation: `You receive $${premium} immediately (your wallet).\nIf price is below $${opp.strategy.breakeven[0]?.toFixed(0)} at expiry → you keep $${premium}\nIf price is above → you sell at strike (still keep $${premium} plus any appreciation)`,
      urgencyReason: `Premiums decay as time passes. Every minute you wait, you lose ~$${(premium / 100).toFixed(2)} of potential profit.`,
      suggestedAction: `SELL $${premium} OF PREMIUM`,
    };
  }

  private interpretHedgeSignal(opp: DetectedOpportunity): PromptInterpretation {
    const cost = opp.strategy.estimatedCost;
    const protectionLevel = Math.round((1 - (opp.strategy.legs[0].strike || 0) / 3000) * 100);

    return {
      title: `Protect downside for $${cost}`,
      whyNow: `Market is ${opp.triggers.competitivePressure && opp.triggers.competitivePressure > 0.7 ? 'volatile and' : ''} bearish. Downside protection is ${opp.urgency === 'critical' ? 'unusually' : ''} cheap right now—buy before volatility expands further.`,
      riskExplanation: `You're buying insurance on your portfolio. If ${opp.strategy.legs[0].instrument} drops below $${opp.strategy.legs[0].strike?.toFixed(0)}, your puts increase in value, offsetting losses.`,
      outcomeExplanation: `Cost: $${cost} for the option\nThis protects your portfolio from a ${protectionLevel}% drop.\nIf price stays flat or rises → option expires worthless (you lost $${cost})\nIf price crashes → your gains offset portfolio losses`,
      urgencyReason: opp.urgency === 'critical'
        ? 'Market is falling NOW. Every minute you wait, protection gets more expensive.'
        : 'Hedge before volatility expands. Option prices will rise as selling pressure increases.',
      suggestedAction: `PROTECT PORTFOLIO ($${cost})`,
    };
  }

  private interpretMomentumPlay(opp: DetectedOpportunity): PromptInterpretation {
    const cost = opp.strategy.estimatedCost;

    return {
      title: `Upside is cheap—pump incoming`,
      whyNow: `Market is bullish but volatility is low. Options are priced for stagnation, not momentum. If $${opp.strategy.legs[0].instrument?.split(' ')[0]} pumps, you profit significantly.`,
      riskExplanation: `You're buying ${opp.strategy.legs[0].instrument} for $${cost}. If price rallies, you profit. If it doesn't, you lose the $${cost}. This is directional exposure with defined risk.`,
      outcomeExplanation: `Max gain: Unlimited (theoretical)\nMax loss: $${cost} (if option expires worthless)\nBreakeven: $${opp.strategy.breakeven[0]?.toFixed(0)}\nBest case: Strong rally\nWorst case: Price stays flat or drops`,
      urgencyReason: `Momentum plays have limited windows. Once the move starts, option prices will increase (you'll pay more). Get in before the crowd.`,
      suggestedAction: `BUY UPSIDE ($${cost} max risk)`,
    };
  }

  private interpretVolatilityExpansion(opp: DetectedOpportunity): PromptInterpretation {
    return {
      title: `Volatility is exploding—profit either way`,
      whyNow: `Market volatility is expanding rapidly. Straddles profit from big moves in EITHER direction. Get in before the crowd bids up prices.`,
      riskExplanation: `You're buying both a call and a put at the same strike. If price moves significantly in either direction, one leg gains more than the other loses.`,
      outcomeExplanation: `Max gain: Unlimited\nMax loss: $${opp.strategy.maxLoss} (if price stays flat)\nBest case: Big move in either direction\nWorst case: Price stays at strike`,
      urgencyReason: `Volatility expansions attract fast money. Once retail and bots pile in, option prices will surge. Early entry = better pricing.`,
      suggestedAction: `BUY VOLATILITY PLAY`,
    };
  }

  private interpretArbitrage(opp: DetectedOpportunity): PromptInterpretation {
    const profit = opp.strategy.maxGain;

    return {
      title: `Risk-free $${profit} profit available`,
      whyNow: `Market inefficiency detected: same option priced differently across strikes/expiries. Lock in risk-free profit by executing both sides simultaneously.`,
      riskExplanation: `This is arbitrage—simultaneously buying and selling to lock in price difference. Zero directional risk.`,
      outcomeExplanation: `Guaranteed profit: $${profit}\nZero risk: Both sides offset each other\nRequires: Simultaneous execution via RFQ`,
      urgencyReason: `Arbitrage opportunities disappear in seconds. Other bots and traders will close this gap. Execute immediately.`,
      suggestedAction: `LOCK IN $${profit} PROFIT`,
    };
  }

  private fallbackInterpretation(opp: DetectedOpportunity): PromptInterpretation {
    return {
      title: `Trading opportunity available`,
      whyNow: 'Market conditions have created a favorable setup for this strategy.',
      riskExplanation: `Max gain: $${opp.strategy.maxGain}\nMax loss: $${opp.strategy.maxLoss}`,
      outcomeExplanation: `Breakeven: ${opp.strategy.breakeven.join(', ')}`,
      urgencyReason: 'Market conditions can change quickly. This opportunity has a limited window.',
      suggestedAction: 'EXECUTE TRADE',
    };
  }

  private getMinutesRemaining(expiresAt: Date): number {
    return Math.max(0, Math.round((expiresAt.getTime() - Date.now()) / 60000));
  }

  private calculateFillProbability(opp: DetectedOpportunity): number {
    // Base probability on urgency and competition
    let probability = 0.8;

    if (opp.urgency === 'critical') probability -= 0.2;
    if (opp.urgency === 'high') probability -= 0.1;

    if (opp.triggers.competitivePressure && opp.triggers.competitivePressure > 0.7) {
      probability -= 0.2;
    }

    if (opp.triggers.liquidityDrain && opp.triggers.liquidityDrain > 0.3) {
      probability -= 0.15;
    }

    return Math.max(0.1, Math.min(0.95, probability));
  }
}

// Singleton instance
export const promptInterpreter = new PromptInterpreter();
