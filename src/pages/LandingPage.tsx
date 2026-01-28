import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Activity, Shield, Zap, BarChart3, Target } from 'lucide-react';
import AnimatedBackground from '../components/three/AnimatedBackground';

export default function LandingPage() {
  const features = [
    {
      icon: Activity,
      title: 'Volatility Detection',
      description: 'Real-time IV tracking identifies crush and expansion opportunities before they disappear',
    },
    {
      icon: Shield,
      title: 'Skew Analysis',
      description: 'Spot mispriced calls and puts with statistical anomaly detection',
    },
    {
      icon: Sparkles,
      title: 'Yield Opportunities',
      description: 'Find premium selling opportunities above baseline market expectations',
    },
    {
      icon: Zap,
      title: 'Smart Urgency',
      description: 'Time-sensitive signals ranked by competitive pressure and opportunity window',
    },
    {
      icon: BarChart3,
      title: 'Regime Awareness',
      description: 'Context-aware detection adapts to market conditions',
    },
    {
      icon: Target,
      title: 'One-Click Execute',
      description: 'Execute directly to Thetanuts with pre-calculated risk parameters',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Pulse Logo"
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold text-white">Pulse</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Dashboard
            </a>
            <a href="#mastery" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Mastery
            </a>
          </div>

          <Link
            to="/pulse"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:scale-105 transition-transform"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Real-Time Options Intelligence</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight animate-slide-up">
            Trade Options with
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Precision
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay-1">
            Detect market opportunities in real-time. AI-powered detection engine identifies
            volatility anomalies, skew opportunities, and yield plays.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-2">
            <Link
              to="/pulse"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/30 transition-all">
              Watch Demo
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Intelligent
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                {' '}
                Detection
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time pattern recognition identifies 6 market conditions automatically
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/60 hover:border-emerald-500/30 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Live Pulse
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Feed
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Watch opportunities appear in real-time as market conditions shift. Each signal
                includes AI interpretation, risk metrics, and one-click execution.
              </p>
              <ul className="space-y-5">
                {[
                  'Real-time market regime tracking',
                  'Urgency-ranked opportunity cards',
                  'Countdown timers for expiring signals',
                  'Active opportunity counter',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dashboard preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-900/60 rounded-3xl p-8 border border-white/10">
                <div className="space-y-4">
                  {[
                    { type: 'Volatility Crush', urgency: 'critical', time: '5:42' },
                    { type: 'Skew Opportunity', urgency: 'high', time: '12:18' },
                    { type: 'Yield Signal', urgency: 'medium', time: '8:05' },
                  ].map((signal, i) => (
                    <div
                      key={i}
                      className="bg-slate-800/40 rounded-xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all hover:scale-105"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-semibold text-emerald-400">
                          {signal.type}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            signal.urgency === 'critical'
                              ? 'bg-red-500/20 text-red-400'
                              : signal.urgency === 'high'
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {signal.urgency.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        IV declining rapidly, premium selling opportunity
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live • {signal.time} remaining
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="mastery" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Win Rate', value: '67.3%', change: '+12%' },
                { label: 'Executions', value: '2.4s', change: 'avg' },
                { label: 'Consistency', value: '8.2/10', change: 'score' },
                { label: 'Profit', value: '+$4,230', change: '30d' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="group p-6 rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/60 hover:border-emerald-500/30 hover:scale-105 transition-all"
                >
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="text-3xl font-bold text-white mt-2 mb-1">{stat.value}</div>
                  <div className="text-xs text-emerald-400 font-medium">{stat.change}</div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Mastery
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Real skill metrics based on actual P&L performance. Track your execution speed,
                consistency, and strategy strengths over 30 days.
              </p>
              <ul className="space-y-5">
                {[
                  'Real P&L-based win rates',
                  'Execution speed percentiles',
                  '30-day performance breakdown',
                  'Strategy-specific insights',
                  'Win/loss streak tracking',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center border border-white/10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10" />

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to trade smarter?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join traders who are making data-driven decisions with real-time intelligence.
              </p>
              <Link
                to="/pulse"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:scale-105 transition-transform text-lg"
              >
                Launch Pulse
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 bg-slate-900/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Pulse Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-semibold text-white">Pulse</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 Pulse. Real-time options intelligence for professional traders.
          </p>
        </div>
      </footer>
    </div>
  );
}
