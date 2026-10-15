import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  Zap, 
  Layers, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Filter,
  Info,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, ProductPriceLive } from '../../types';

interface PerformanceDashboardProps {
  currentUser: UserAccount;
  livePrices?: ProductPriceLive[];
  onOpenFeed?: () => void;
}

interface DailyPerformance {
  date: string;
  dayShort: string;
  volume: number; // Daily volume in USD
  cumulativeVolume: number;
  savings: number; // Daily arbitrage savings in USD
  cumulativeSavings: number;
  appleSavings: number;
  samsungSavings: number;
  macbookSavings: number;
  deals: number;
}

// 30-day realistic historical dataset for B2B Electronics Trading (Sept 15 - Oct 14)
const RAW_30_DAYS_DATA: Omit<DailyPerformance, 'cumulativeVolume' | 'cumulativeSavings'>[] = [
  { date: '15 Sep', dayShort: '15', volume: 92400, savings: 7400, appleSavings: 4800, samsungSavings: 1800, macbookSavings: 800, deals: 3 },
  { date: '16 Sep', dayShort: '16', volume: 104500, savings: 8600, appleSavings: 5400, samsungSavings: 2100, macbookSavings: 1100, deals: 4 },
  { date: '17 Sep', dayShort: '17', volume: 118200, savings: 9900, appleSavings: 6200, samsungSavings: 2400, macbookSavings: 1300, deals: 4 },
  { date: '18 Sep', dayShort: '18', volume: 98000, savings: 7900, appleSavings: 5100, samsungSavings: 1900, macbookSavings: 900, deals: 3 },
  { date: '19 Sep', dayShort: '19', volume: 125600, savings: 10400, appleSavings: 6800, samsungSavings: 2500, macbookSavings: 1100, deals: 5 },
  { date: '20 Sep', dayShort: '20', volume: 84000, savings: 6800, appleSavings: 4200, samsungSavings: 1800, macbookSavings: 800, deals: 2 },
  { date: '21 Sep', dayShort: '21', volume: 76000, savings: 6100, appleSavings: 3900, samsungSavings: 1500, macbookSavings: 700, deals: 2 },
  { date: '22 Sep', dayShort: '22', volume: 138000, savings: 11500, appleSavings: 7400, samsungSavings: 2800, macbookSavings: 1300, deals: 5 },
  { date: '23 Sep', dayShort: '23', volume: 145000, savings: 12100, appleSavings: 7800, samsungSavings: 2900, macbookSavings: 1400, deals: 5 },
  { date: '24 Sep', dayShort: '24', volume: 156800, savings: 13200, appleSavings: 8500, samsungSavings: 3100, macbookSavings: 1600, deals: 6 },
  { date: '25 Sep', dayShort: '25', volume: 168400, savings: 14100, appleSavings: 9100, samsungSavings: 3400, macbookSavings: 1600, deals: 6 },
  { date: '26 Sep', dayShort: '26', volume: 172000, savings: 14600, appleSavings: 9400, samsungSavings: 3500, macbookSavings: 1700, deals: 6 },
  { date: '27 Sep', dayShort: '27', volume: 112000, savings: 9200, appleSavings: 5900, samsungSavings: 2200, macbookSavings: 1100, deals: 4 },
  { date: '28 Sep', dayShort: '28', volume: 95000, savings: 7800, appleSavings: 4900, samsungSavings: 1900, macbookSavings: 1000, deals: 3 },
  { date: '29 Sep', dayShort: '29', volume: 164000, savings: 13800, appleSavings: 8900, samsungSavings: 3300, macbookSavings: 1600, deals: 5 },
  { date: '30 Sep', dayShort: '30', volume: 182500, savings: 15300, appleSavings: 9800, samsungSavings: 3700, macbookSavings: 1800, deals: 7 },
  { date: '01 Oct', dayShort: '01', volume: 194000, savings: 16200, appleSavings: 10400, samsungSavings: 3900, macbookSavings: 1900, deals: 7 },
  { date: '02 Oct', dayShort: '02', volume: 178000, savings: 14900, appleSavings: 9500, samsungSavings: 3600, macbookSavings: 1800, deals: 6 },
  { date: '03 Oct', dayShort: '03', volume: 189500, savings: 15800, appleSavings: 10100, samsungSavings: 3800, macbookSavings: 1900, deals: 7 },
  { date: '04 Oct', dayShort: '04', volume: 124000, savings: 10200, appleSavings: 6500, samsungSavings: 2500, macbookSavings: 1200, deals: 4 },
  { date: '05 Oct', dayShort: '05', volume: 108000, savings: 8900, appleSavings: 5700, samsungSavings: 2100, macbookSavings: 1100, deals: 3 },
  { date: '06 Oct', dayShort: '06', volume: 198000, savings: 16600, appleSavings: 10600, samsungSavings: 4100, macbookSavings: 1900, deals: 7 },
  { date: '07 Oct', dayShort: '07', volume: 210500, savings: 17800, appleSavings: 11400, samsungSavings: 4300, macbookSavings: 2100, deals: 8 },
  { date: '08 Oct', dayShort: '08', volume: 192000, savings: 15900, appleSavings: 10200, samsungSavings: 3900, macbookSavings: 1800, deals: 6 },
  { date: '09 Oct', dayShort: '09', volume: 224000, savings: 18900, appleSavings: 12100, samsungSavings: 4500, macbookSavings: 2300, deals: 8 },
  { date: '10 Oct', dayShort: '10', volume: 142000, savings: 11800, appleSavings: 7600, samsungSavings: 2800, macbookSavings: 1400, deals: 5 },
  { date: '11 Oct', dayShort: '11', volume: 119000, savings: 9700, appleSavings: 6200, samsungSavings: 2300, macbookSavings: 1200, deals: 4 },
  { date: '12 Oct', dayShort: '12', volume: 238000, savings: 20100, appleSavings: 12900, samsungSavings: 4800, macbookSavings: 2400, deals: 9 },
  { date: '13 Oct', dayShort: '13', volume: 251000, savings: 21400, appleSavings: 13700, samsungSavings: 5200, macbookSavings: 2500, deals: 9 },
  { date: '14 Oct', dayShort: 'Hoy', volume: 268950, savings: 23120, appleSavings: 14800, samsungSavings: 5620, macbookSavings: 2700, deals: 10 },
];

// Precompute cumulative totals
let runVolume = 0;
let runSavings = 0;
const FULL_PERFORMANCE_DATA: DailyPerformance[] = RAW_30_DAYS_DATA.map(item => {
  runVolume += item.volume;
  runSavings += item.savings;
  return {
    ...item,
    cumulativeVolume: runVolume,
    cumulativeSavings: runSavings,
  };
});

const ARBITRAGE_HIGHLIGHTS = [
  {
    id: 'arb-1',
    model: 'iPhone 16 Pro Max 256GB',
    qty: 250,
    hubBuy: 'Hong Kong Port (HKG)',
    hubSell: 'Miami Free Trade Zone',
    buyPrice: 995,
    sellPrice: 1058,
    grossSaving: 15750,
    roiPct: 6.3,
    date: 'Ayer'
  },
  {
    id: 'arb-2',
    model: 'Samsung Galaxy S24 Ultra 512GB',
    qty: 180,
    hubBuy: 'Dubai DAFZA',
    hubSell: 'Rotterdam Hub',
    buyPrice: 810,
    sellPrice: 875,
    grossSaving: 11700,
    roiPct: 8.0,
    date: '12 Oct'
  },
  {
    id: 'arb-3',
    model: 'MacBook Pro 14" M3 Pro 512GB',
    qty: 60,
    hubBuy: 'US California Bulk',
    hubSell: 'São Paulo Import Hub',
    buyPrice: 1620,
    sellPrice: 1790,
    grossSaving: 10200,
    roiPct: 10.5,
    date: '09 Oct'
  }
];

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  currentUser,
  onOpenFeed
}) => {
  const [timeRange, setTimeRange] = useState<'30d' | '14d' | '7d'>('30d');
  const [activeMetric, setActiveMetric] = useState<'all' | 'volume' | 'savings'>('all');
  const [volumeViewType, setVolumeViewType] = useState<'cumulative' | 'daily'>('cumulative');

  // Filter dataset by selected time range
  const filteredData = useMemo(() => {
    if (timeRange === '7d') return FULL_PERFORMANCE_DATA.slice(-7);
    if (timeRange === '14d') return FULL_PERFORMANCE_DATA.slice(-14);
    return FULL_PERFORMANCE_DATA;
  }, [timeRange]);

  // Aggregate stats
  const totalVolume = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.volume, 0);
  }, [filteredData]);

  const totalSavings = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.savings, 0);
  }, [filteredData]);

  const totalDeals = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.deals, 0);
  }, [filteredData]);

  const totalAppleSavings = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.appleSavings, 0);
  }, [filteredData]);

  const totalSamsungSavings = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.samsungSavings, 0);
  }, [filteredData]);

  const totalMacBookSavings = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.macbookSavings, 0);
  }, [filteredData]);

  const savingsRate = ((totalSavings / totalVolume) * 100).toFixed(1);

  // Custom tooltips for Vorteq Dark theme
  const VolumeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = filteredData.find(d => d.date === label || d.dayShort === label);
      return (
        <div className="bg-[#0B192C]/95 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1 backdrop-blur-md min-w-[180px]">
          <div className="text-slate-400 font-mono text-[10px] pb-1 border-b border-slate-800 flex justify-between">
            <span>{dataPoint?.date || label}</span>
            <span className="text-[#00B074] font-bold">{dataPoint?.deals} lotes cerrados</span>
          </div>
          <div className="flex justify-between items-center text-white font-mono pt-1">
            <span className="text-slate-300">Volumen Diario:</span>
            <span className="font-bold text-cyan-400">${dataPoint?.volume.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between items-center text-white font-mono">
            <span className="text-slate-300">Acumulado 30D:</span>
            <span className="font-bold text-[#00B074]">${dataPoint?.cumulativeVolume.toLocaleString()} USD</span>
          </div>
          <div className="flex justify-between items-center text-white font-mono pt-1 border-t border-slate-800/80">
            <span className="text-emerald-350">Ahorro Arbitraje:</span>
            <span className="font-bold text-emerald-400">+${dataPoint?.savings.toLocaleString()} USD</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const SavingsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = filteredData.find(d => d.date === label || d.dayShort === label);
      return (
        <div className="bg-[#0B192C]/95 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-md min-w-[200px]">
          <div className="text-slate-400 font-mono text-[10px] pb-1 border-b border-slate-800 flex justify-between">
            <span>{dataPoint?.date || label}</span>
            <span className="text-[#00B074] font-bold">Total: +${dataPoint?.savings.toLocaleString()} USD</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between text-slate-200">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00B074]" />  iPhone / iPad:
              </span>
              <span className="font-bold text-[#00B074]">${dataPoint?.appleSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-200">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Samsung Galaxy:
              </span>
              <span className="font-bold text-cyan-400">${dataPoint?.samsungSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-200">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> MacBooks M-Series:
              </span>
              <span className="font-bold text-purple-400">${dataPoint?.macbookSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & TIMEFRAME SELECTOR                       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-[#0B192C] via-[#091424] to-[#040911] border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00B074]/15 border border-[#00B074]/40 text-[#00B074] flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">Performance & Arbitraje</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00B074]/20 text-[#00B074] border border-[#00B074]/40 text-[9px] font-mono font-bold">
                  LIVE 30D
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Crecimiento histórico de volumen y ahorro neto mayorista
              </p>
            </div>
          </div>
        </div>

        {/* Time range filter pills */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-mono text-slate-400">Rango:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                timeRange === '7d' 
                  ? 'bg-[#00B074] text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                timeRange === '14d' 
                  ? 'bg-[#00B074] text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14 Días
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                timeRange === '30d' 
                  ? 'bg-[#00B074] text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Días
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PRIMARY STATS HERO (VOLUME & ARBITRAGE SAVINGS)       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Total Trade Volume */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-1.5 shadow-md relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-cyan-500/5 absolute -right-6 -bottom-6 pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Volumen Transado
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">
              +38.4%
            </span>
          </div>
          <div className="text-lg font-black text-white font-mono tracking-tight">
            ${(totalVolume / 1_000_000).toFixed(2)}M <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {totalDeals} transacciones liquidadas
          </div>
        </div>

        {/* Card 2: Total Arbitrage Savings */}
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-3.5 space-y-1.5 shadow-md relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-emerald-950/20">
          <div className="w-20 h-20 rounded-full bg-[#00B074]/10 absolute -right-6 -bottom-6 pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold flex items-center gap-1">
              <PiggyBank className="w-3.5 h-3.5 text-[#00B074]" /> Ahorro Arbitraje
            </span>
            <span className="text-[10px] font-mono text-[#00B074] font-bold bg-[#00B074]/15 px-1.5 py-0.2 rounded border border-[#00B074]/30">
              {savingsRate}%
            </span>
          </div>
          <div className="text-lg font-black text-[#00B074] font-mono tracking-tight">
            ${(totalSavings / 1_000).toFixed(1)}k <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Ganancia directa retenida
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CHART 1: HISTORICAL TRADE VOLUME GROWTH (RECHARTS)    */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Crecimiento de Volumen de Negociación
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Evolución comercial en los últimos {timeRange === '7d' ? '7' : timeRange === '14d' ? '14' : '30'} días
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            <button
              onClick={() => setVolumeViewType('cumulative')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                volumeViewType === 'cumulative' 
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Acumulado
            </button>
            <button
              onClick={() => setVolumeViewType('daily')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                volumeViewType === 'daily' 
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diario
            </button>
          </div>
        </div>

        {/* Recharts Area/Bar Volume Component */}
        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeCumulativeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45}/>
                  <stop offset="95%" stopColor="#0B192C" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="volumeDailyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B074" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#00B074" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                interval={timeRange === '30d' ? 4 : timeRange === '14d' ? 2 : 0}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<VolumeTooltip />} />
              {volumeViewType === 'cumulative' ? (
                <Area 
                  type="monotone" 
                  dataKey="cumulativeVolume" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#volumeCumulativeGrad)" 
                />
              ) : (
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#00B074" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#volumeDailyGrad)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Footnote Metric */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Pico más alto:</span>
            <strong className="text-white">$268,950 USD (Hoy)</strong>
          </div>
          <div className="text-emerald-400 font-bold">
            Promedio: ${(totalVolume / filteredData.length).toFixed(0)}/día
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. CHART 2: ARBITRAGE SAVINGS ACHIEVED (RECHARTS)         */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-[#00B074]" />
              Ahorro Total por Arbitraje en Lotes
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Spread mayorista capturado vs precios estándar de mercado
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[#00B074] border border-emerald-500/30 text-[10px] font-mono font-bold">
            +${(totalSavings).toLocaleString()} USD
          </span>
        </div>

        {/* Stacked Recharts Bars: Apple, Samsung, MacBook */}
        <div className="h-56 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                interval={timeRange === '30d' ? 4 : timeRange === '14d' ? 2 : 0}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<SavingsTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={28}
                formatter={(val) => {
                  if (val === 'appleSavings') return <span className="text-[10px] text-slate-300 font-mono"> iPhone</span>;
                  if (val === 'samsungSavings') return <span className="text-[10px] text-slate-300 font-mono">Samsung</span>;
                  if (val === 'macbookSavings') return <span className="text-[10px] text-slate-300 font-mono">MacBook</span>;
                  return val;
                }}
              />
              <Bar dataKey="appleSavings" stackId="savings" fill="#00B074" radius={[0, 0, 0, 0]} />
              <Bar dataKey="samsungSavings" stackId="savings" fill="#06b6d4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="macbookSavings" stackId="savings" fill="#a855f7" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Contribution Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-0.5 text-center">
            <span className="text-slate-400 block"> Apple</span>
            <span className="text-[#00B074] font-bold block">${(totalAppleSavings / 1000).toFixed(1)}k</span>
            <span className="text-[9px] text-slate-500 font-medium">({((totalAppleSavings / totalSavings) * 100).toFixed(0)}%)</span>
          </div>

          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-0.5 text-center">
            <span className="text-slate-400 block">Samsung</span>
            <span className="text-cyan-400 font-bold block">${(totalSamsungSavings / 1000).toFixed(1)}k</span>
            <span className="text-[9px] text-slate-500 font-medium">({((totalSamsungSavings / totalSavings) * 100).toFixed(0)}%)</span>
          </div>

          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-0.5 text-center">
            <span className="text-slate-400 block">MacBook</span>
            <span className="text-purple-400 font-bold block">${(totalMacBookSavings / 1000).toFixed(1)}k</span>
            <span className="text-[9px] text-slate-500 font-medium">({((totalMacBookSavings / totalSavings) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. TOP ARBITRAGE LIQUIDATIONS LOG (30 DAYS)              */}
      {/* ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Mayores Casos de Éxito en Arbitraje
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Últimos 30 días</span>
        </div>

        <div className="space-y-2">
          {ARBITRAGE_HIGHLIGHTS.map((arb) => (
            <div 
              key={arb.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074]" />
                  {arb.model}
                </span>
                <span className="text-xs font-mono font-bold text-[#00B074]">
                  +${arb.grossSaving.toLocaleString()} USD
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{arb.qty} unidades · {arb.hubBuy} ➔ {arb.hubSell}</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                  +{arb.roiPct}% Spread
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-1">
                <span>Comprado: ${arb.buyPrice} USD | Liquidado: ${arb.sellPrice} USD</span>
                <span>{arb.date}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenFeed}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Explorar Lotes Actuales en Piso Mayorista</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
