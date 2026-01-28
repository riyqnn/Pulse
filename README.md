<div align="center">

  # <img src="/logo.png" alt="Pulse Logo" width="40" height="40" style="vertical-align: middle;"> Pulse

  ### *Volatility Has a Pattern.*

  **Real-time intelligence layer for onchain options markets**

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-7.2-646CFF)](https://vite.dev/)

  [Features](#-features) • [How It Works](#-how-it-works) • [Installation](#-installation) • [Development](#-development)

</div>

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" width="24" /> The Problem

Crypto options markets have matured fast. Onchain options volume now reaches **billions in monthly notional**, and protocols like **Thetanuts** already provide the core infrastructure: strikes, expiries, vaults, and yield strategies.

From a technical standpoint, the market works. **The problem is not access — it is reaction time.**

<div align="center">

```
IV shifts 5-15% within minutes
Skew imbalances appear and disappear in under 30 seconds
Yield opportunities are arbitraged away in seconds
```

</div>

### The Human Disadvantage

For human traders, this creates a **structural disadvantage**: by the time they analyze the data, the opportunity is already gone.

Today, traders are forced to manually interpret **fragmented signals**:

- IV charts in one tab
- Skew tables in another
- Price action and yield metrics elsewhere

This cognitive load makes consistent, real-time decision-making **almost impossible**, even for experienced traders.

Protocols like Thetanuts expose raw options primitives, but they **do not explain what matters right now**. Traders see data, not decisions. As a result, most users either react too late or avoid options entirely due to complexity and timing risk.

---

## <img src="https://cdn-icons-png.flaticon.com/512/599/599506.png" width="24" /> The Solution

**Pulse** acts as a real-time intelligence layer on top of Thetanuts.

Instead of asking users to analyze charts and Greeks, Pulse continuously monitors live onchain options data and detects **statistically meaningful deviations** — not surface-level price movement.

### What Users See

When an opportunity appears, users see a **clear, time-bound signal** — not abstract metrics:

- <img src="https://img.icons8.com/fluency/24/000000/flash.png" width="18" /> **Volatility Crush Alerts**
- <img src="https://img.icons8.com/fluency/24/000000/line-chart.png" width="18" /> **Mispriced Options Signals**
- <img src="https://img.icons8.com/fluency/24/000000/money.png" width="18" /> **Yield Anomalies**
- <img src="https://img.icons8.com/fluency/24/000000/trend-up.png" width="18" /> **Momentum-Based Setups**

All already filtered, timed, and **executable through Thetanuts**.

> **Pulse does not make users learn options first.**
> **It allows them to act correctly before the market reprices.**

---

## <img src="https://cdn-icons-png.flaticon.com/512/921/921356.png" width="24" /> Why Onchain?

This problem only exists onchain because:

- <img src="https://img.icons8.com/color/24/000000/database.png" width="18" /> **Data is public and composable**
- <img src="https://img.icons8.com/color/24/000000/unlock.png" width="18" /> **Execution is permissionless**
- <img src="https://img.icons8.com/color/24/000000/rocket.png" width="18" /> **Settlement is instant**

---

## <img src="https://cdn-icons-png.flaticon.com/512/3069/3069172.png" width="24" /> Features

| Feature | Description |
|---------|-------------|
| <img src="https://img.icons8.com/fluency/20/000000/monitor.png" /> **Real-Time Monitoring** | Continuous onchain data monitoring with sub-second updates |
| <img src="https://img.icons8.com/fluency/20/000000/radar.png" /> **Opportunity Detection** | Statistically-driven anomaly detection in IV, skew, and yield |
| <img src="https://img.icons8.com/fluency/20/000000/alarm-clock.png" /> **Time-Bound Signals** | Every signal includes expiration timing for actionable decisions |
| <img src="https://img.icons8.com/fluency/20/000000/dashboard.png" /> **Unified Dashboard** | All signals in one place — no more tab switching |
| <img src="https://img.icons8.com/fluency/20/000000/settings.png" /> **Mastery Tracking** | Track your trading performance and improvement over time |
| <img src="https://img.icons8.com/fluency/20/000000/integration-api.png" width="20" /> **Thetanuts Integration** | Direct execution through connected DeFi protocols |

---

## <img src="https://cdn-icons-png.flaticon.com/512/1067/1067566.png" width="24" /> Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 7
- **Styling**: Tailwind CSS 4
- **State**: Zustand (persisted store)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Build**: Rolldown (ultra-fast bundler)
- **Animations**: GSAP

---

## <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" width="24" /> Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pulse.git
cd pulse

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" width="24" /> Project Structure

```
pulse/
├── src/
│   ├── components/
│   │   └── pulse/           # Reusable Pulse components
│   ├── features/            # Business logic modules
│   │   ├── market-monitoring/
│   │   └── detection/
│   ├── pages/               # Route components
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helper functions
├── public/
│   └── logo.png             # Pulse logo
└── index.html
```

---

## <img src="https://cdn-icons-png.flaticon.com/512/1055/1055689.png" width="24" /> Philosophy

**Pulse doesn't replace traders.**

It removes the latency between market behavior and human action.

---

## <img src="https://cdn-icons-png.flaticon.com/512/1067/1067352.png" width="24" /> License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

  **Built with ⚡ by traders who hate latency**

  [Star ⭐](https://github.com/yourusername/pulse) • [Watch 👁️](https://github.com/yourusername/pulse) • [Fork 🍴](https://github.com/yourusername/pulse/fork)

</div>
