import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, BarChart3, Layers, Info } from 'lucide-react';

interface DayDemand {
  day: string;
  date: string;
  Apple: number;
  Samsung: number;
  Xiaomi: number;
  total: number;
}

const DEMAND_DATA_7_DAYS: DayDemand[] = [
  { day: 'Jue', date: '08 Oct', Apple: 1420, Samsung: 980, Xiaomi: 560, total: 2960 },
  { day: 'Vie', date: '09 Oct', Apple: 1680, Samsung: 1120, Xiaomi: 640, total: 3440 },
  { day: 'Sáb', date: '10 Oct', Apple: 1250, Samsung: 890, Xiaomi: 510, total: 2650 },
  { day: 'Dom', date: '11 Oct', Apple: 1100, Samsung: 780, Xiaomi: 490, total: 2370 },
  { day: 'Lun', date: '12 Oct', Apple: 1890, Samsung: 1310, Xiaomi: 720, total: 3920 },
  { day: 'Mar', date: '13 Oct', Apple: 2040, Samsung: 1420, Xiaomi: 810, total: 4270 },
  { day: 'Mié', date: 'Hoy', Apple: 2210, Samsung: 1540, Xiaomi: 890, total: 4640 },
];

export const BrandDemandChart: React.FC = () => {
  const [chartMode, setChartMode] = useState<'grouped' | 'stacked'>('grouped');
  const [activeBrand, setActiveBrand] = useState<'all' | 'Apple' | 'Samsung' | 'Xiaomi'>('all');

  // Calculate totals and leaders
  const totalApple = DEMAND_DATA_7_DAYS.reduce((acc, curr) => acc + curr.Apple, 0);
  const totalSamsung = DEMAND_DATA_7_DAYS.reduce((acc, curr) => acc + curr.Samsung, 0);
  const totalXiaomi = DEMAND_DATA_7_DAYS.reduce((acc, curr) => acc + curr.Xiaomi, 0);
  const grandTotal = totalApple + totalSamsung + totalXiaomi;

  const applePct = ((totalApple / grandTotal) * 100).toFixed(1);
  const samsungPct = ((totalSamsung / grandTotal) * 100).toFixed(1);
  const xiaomiPct = ((totalXiaomi / grandTotal) * 100).toFixed(1);

  // Custom high-contrast tooltip styled for Vorteq B2B dark UI
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = DEMAND_DATA_7_DAYS.find((d) => d.day === label);
      return (
        <div className="bg-[#0B192C] border border-slate-700/90 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[170px] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1 font-mono">
            <span className="font-bold text-white">{dataPoint ? `${dataPoint.day} (${dataPoint.date})` : label}</span>
            <span className="text-[#00B074] font-bold">
              {dataPoint ? `${dataPoint.total.toLocaleString()} uds` : ''}
            </span>
          </div>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-slate-100">
                {entry.value.toLocaleString()} <span className="text-[10px] text-slate-400 font-sans">uds</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4">
      <div className="bg-gradient-to-br from-[#0B192C] via-[#091424] to-[#060D18] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Header with Title and Mode Switcher */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-[#00B074]/15 border border-[#00B074]/30 text-[#00B074]">
                <BarChart3 className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Demanda Mayorista (Últimos 7 Días)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Volumen de órdenes y cotizaciones solicitadas por marca
            </p>
          </div>

          {/* Grouped vs Stacked pill */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[10px] font-semibold shrink-0">
            <button
              onClick={() => setChartMode('grouped')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                chartMode === 'grouped'
                  ? 'bg-[#00B074] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Barras
            </button>
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                chartMode === 'stacked'
                  ? 'bg-[#00B074] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Apiladas
            </button>
          </div>
        </div>

        {/* Quick Brand Summary KPI Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            onClick={() => setActiveBrand(activeBrand === 'Apple' ? 'all' : 'Apple')}
            className={`p-2 rounded-xl border transition-all text-left cursor-pointer ${
              activeBrand === 'Apple'
                ? 'bg-[#38BDF8]/15 border-[#38BDF8] shadow-sm'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span className="flex items-center gap-1 text-slate-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                Apple
              </span>
              <span className="font-mono text-[#38BDF8] font-bold">{applePct}%</span>
            </div>
            <div className="text-sm font-black text-white font-mono mt-1">
              {totalApple.toLocaleString()}
            </div>
            <span className="text-[9px] text-emerald-400 font-mono block">+18.5% sem.</span>
          </button>

          <button
            onClick={() => setActiveBrand(activeBrand === 'Samsung' ? 'all' : 'Samsung')}
            className={`p-2 rounded-xl border transition-all text-left cursor-pointer ${
              activeBrand === 'Samsung'
                ? 'bg-[#818CF8]/15 border-[#818CF8] shadow-sm'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span className="flex items-center gap-1 text-slate-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
                Samsung
              </span>
              <span className="font-mono text-[#818CF8] font-bold">{samsungPct}%</span>
            </div>
            <div className="text-sm font-black text-white font-mono mt-1">
              {totalSamsung.toLocaleString()}
            </div>
            <span className="text-[9px] text-emerald-400 font-mono block">+9.2% sem.</span>
          </button>

          <button
            onClick={() => setActiveBrand(activeBrand === 'Xiaomi' ? 'all' : 'Xiaomi')}
            className={`p-2 rounded-xl border transition-all text-left cursor-pointer ${
              activeBrand === 'Xiaomi'
                ? 'bg-[#F97316]/15 border-[#F97316] shadow-sm'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span className="flex items-center gap-1 text-slate-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                Xiaomi
              </span>
              <span className="font-mono text-[#F97316] font-bold">{xiaomiPct}%</span>
            </div>
            <div className="text-sm font-black text-white font-mono mt-1">
              {totalXiaomi.toLocaleString()}
            </div>
            <span className="text-[9px] text-[#00B074] font-mono block font-bold">+24.1% sem.</span>
          </button>
        </div>

        {/* Recharts BarChart Interactive Viewport */}
        <div className="w-full h-56 relative pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DEMAND_DATA_7_DAYS}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#1E293B" 
                opacity={0.7} 
              />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={26}
                formatter={(val) => (
                  <span className="text-[11px] text-slate-300 font-medium mr-2">
                    {val}
                  </span>
                )}
              />

              {(activeBrand === 'all' || activeBrand === 'Apple') && (
                <Bar 
                  dataKey="Apple" 
                  name="Apple"
                  fill="#38BDF8" 
                  stackId={chartMode === 'stacked' ? 'a' : undefined}
                  radius={chartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]} 
                />
              )}

              {(activeBrand === 'all' || activeBrand === 'Samsung') && (
                <Bar 
                  dataKey="Samsung" 
                  name="Samsung"
                  fill="#818CF8" 
                  stackId={chartMode === 'stacked' ? 'a' : undefined}
                  radius={chartMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]} 
                />
              )}

              {(activeBrand === 'all' || activeBrand === 'Xiaomi') && (
                <Bar 
                  dataKey="Xiaomi" 
                  name="Xiaomi"
                  fill="#F97316" 
                  stackId={chartMode === 'stacked' ? 'a' : undefined}
                  radius={chartMode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]} 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Market Trend Insight footer */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800 text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-[#00B074]" />
            <span>Tendencia: <strong className="text-white font-semibold">Demanda en pico récord hoy</strong></span>
          </span>
          <span className="font-mono text-[#00B074] font-bold">
            Total 7D: {grandTotal.toLocaleString()} uds
          </span>
        </div>
      </div>
    </div>
  );
};
