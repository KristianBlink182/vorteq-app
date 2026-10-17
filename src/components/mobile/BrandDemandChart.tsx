import React, { useState } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Totals & Shares
  const totalApple = DEMAND_DATA_7_DAYS.reduce((acc, curr) => acc + curr.Apple, 0);
  const totalSamsung = DEMAND_DATA_7_DAYS.reduce((acc, curr) => acc + curr.Samsung, 0);
  const totalXiaomi = DEMAND_DATA_7_DAYS.reduce((acc, curr) => acc + curr.Xiaomi, 0);
  const grandTotal = totalApple + totalSamsung + totalXiaomi;

  const applePct = ((totalApple / grandTotal) * 100).toFixed(1);
  const samsungPct = ((totalSamsung / grandTotal) * 100).toFixed(1);
  const xiaomiPct = ((totalXiaomi / grandTotal) * 100).toFixed(1);

  // SVG Chart Dimensions
  const svgWidth = 360;
  const svgHeight = 180;
  const padLeft = 32;
  const padRight = 12;
  const padTop = 15;
  const padBottom = 25;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Max value calculation
  const maxVal = chartMode === 'stacked'
    ? Math.max(...DEMAND_DATA_7_DAYS.map(d => {
        let sum = 0;
        if (activeBrand === 'all' || activeBrand === 'Apple') sum += d.Apple;
        if (activeBrand === 'all' || activeBrand === 'Samsung') sum += d.Samsung;
        if (activeBrand === 'all' || activeBrand === 'Xiaomi') sum += d.Xiaomi;
        return sum;
      })) * 1.15
    : Math.max(...DEMAND_DATA_7_DAYS.map(d => Math.max(
        activeBrand === 'all' || activeBrand === 'Apple' ? d.Apple : 0,
        activeBrand === 'all' || activeBrand === 'Samsung' ? d.Samsung : 0,
        activeBrand === 'all' || activeBrand === 'Xiaomi' ? d.Xiaomi : 0
      ))) * 1.15;

  const yTicks = [0, Math.round(maxVal / 2), Math.round(maxVal)];
  const colWidth = chartW / DEMAND_DATA_7_DAYS.length;

  const hoveredData = hoveredIdx !== null ? DEMAND_DATA_7_DAYS[hoveredIdx] : null;

  return (
    <div className="px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Header with Title and Mode Switcher */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-[#E6F7F0] border border-[#00B074]/30 text-[#008A5B]">
                <BarChart3 className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-bold text-[#0B192C] uppercase tracking-wider">
                Demanda Mayorista (Últimos 7 Días)
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Volumen de órdenes y cotizaciones solicitadas por marca
            </p>
          </div>

          {/* Grouped vs Stacked pill */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setChartMode('grouped')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold ${
                chartMode === 'grouped'
                  ? 'bg-white text-[#0B192C] shadow-xs'
                  : 'text-slate-500 hover:text-[#0B192C]'
              }`}
            >
              Barras
            </button>
            <button
              type="button"
              onClick={() => setChartMode('stacked')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold ${
                chartMode === 'stacked'
                  ? 'bg-white text-[#0B192C] shadow-xs'
                  : 'text-slate-500 hover:text-[#0B192C]'
              }`}
            >
              Apiladas
            </button>
          </div>
        </div>

        {/* Quick Brand Summary KPI Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            type="button"
            onClick={() => setActiveBrand(activeBrand === 'Apple' ? 'all' : 'Apple')}
            className={`p-2 rounded-xl border transition-all text-left cursor-pointer ${
              activeBrand === 'Apple'
                ? 'bg-sky-50 border-sky-400 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1 text-[#0B192C] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                Apple
              </span>
              <span className="font-mono text-sky-700 font-bold">{applePct}%</span>
            </div>
            <div className="text-sm font-black text-[#0B192C] font-mono mt-1">
              {totalApple.toLocaleString()}
            </div>
            <span className="text-[9px] text-[#008A5B] font-mono block font-bold">+18.5% sem.</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveBrand(activeBrand === 'Samsung' ? 'all' : 'Samsung')}
            className={`p-2 rounded-xl border transition-all text-left cursor-pointer ${
              activeBrand === 'Samsung'
                ? 'bg-indigo-50 border-indigo-400 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1 text-[#0B192C] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                Samsung
              </span>
              <span className="font-mono text-indigo-700 font-bold">{samsungPct}%</span>
            </div>
            <div className="text-sm font-black text-[#0B192C] font-mono mt-1">
              {totalSamsung.toLocaleString()}
            </div>
            <span className="text-[9px] text-[#008A5B] font-mono block font-bold">+9.2% sem.</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveBrand(activeBrand === 'Xiaomi' ? 'all' : 'Xiaomi')}
            className={`p-2 rounded-xl border transition-all text-left cursor-pointer ${
              activeBrand === 'Xiaomi'
                ? 'bg-orange-50 border-orange-400 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1 text-[#0B192C] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                Xiaomi
              </span>
              <span className="font-mono text-orange-700 font-bold">{xiaomiPct}%</span>
            </div>
            <div className="text-sm font-black text-[#0B192C] font-mono mt-1">
              {totalXiaomi.toLocaleString()}
            </div>
            <span className="text-[9px] text-[#008A5B] font-mono block font-bold">+24.1% sem.</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[11px] pt-1">
          {(activeBrand === 'all' || activeBrand === 'Apple') && (
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0284C7]" /> Apple
            </span>
          )}
          {(activeBrand === 'all' || activeBrand === 'Samsung') && (
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4F46E5]" /> Samsung
            </span>
          )}
          {(activeBrand === 'all' || activeBrand === 'Xiaomi') && (
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EA580C]" /> Xiaomi
            </span>
          )}
        </div>

        {/* High-Performance SVG Chart */}
        <div className="relative w-full pt-1">
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-48 select-none overflow-visible"
          >
            {/* Horizontal Grid lines & Y-axis labels */}
            {yTicks.map((tick, i) => {
              const y = padTop + chartH - (tick / maxVal) * chartH;
              return (
                <g key={i}>
                  <line 
                    x1={padLeft} 
                    y1={y} 
                    x2={padLeft + chartW} 
                    y2={y} 
                    stroke="#E2E8F0" 
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text 
                    x={padLeft - 4} 
                    y={y + 3} 
                    textAnchor="end" 
                    fill="#94A3B8" 
                    fontSize="9" 
                    fontFamily="monospace"
                  >
                    {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
                  </text>
                </g>
              );
            })}

            {/* Base axis line */}
            <line 
              x1={padLeft} 
              y1={padTop + chartH} 
              x2={padLeft + chartW} 
              y2={padTop + chartH} 
              stroke="#CBD5E1" 
              strokeWidth="1" 
            />

            {/* Bars */}
            {DEMAND_DATA_7_DAYS.map((d, idx) => {
              const colX = padLeft + idx * colWidth;
              const isHov = hoveredIdx === idx;

              if (chartMode === 'grouped') {
                const brands: { key: 'Apple' | 'Samsung' | 'Xiaomi'; val: number; color: string }[] = [];
                if (activeBrand === 'all' || activeBrand === 'Apple') brands.push({ key: 'Apple', val: d.Apple, color: '#0284C7' });
                if (activeBrand === 'all' || activeBrand === 'Samsung') brands.push({ key: 'Samsung', val: d.Samsung, color: '#4F46E5' });
                if (activeBrand === 'all' || activeBrand === 'Xiaomi') brands.push({ key: 'Xiaomi', val: d.Xiaomi, color: '#EA580C' });

                const barWidth = Math.max(4, (colWidth - 8) / brands.length - 2);

                return (
                  <g 
                    key={d.day}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => setHoveredIdx(hoveredIdx === idx ? null : idx)}
                    className="cursor-pointer"
                  >
                    {/* Hover column background */}
                    {isHov && (
                      <rect
                        x={colX + 2}
                        y={padTop}
                        width={colWidth - 4}
                        height={chartH}
                        fill="#00B074"
                        fillOpacity="0.08"
                        rx="4"
                      />
                    )}

                    {brands.map((b, bIdx) => {
                      const barH = (b.val / maxVal) * chartH;
                      const barX = colX + 4 + bIdx * (barWidth + 2);
                      const barY = padTop + chartH - barH;
                      return (
                        <rect
                          key={b.key}
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={Math.max(2, barH)}
                          fill={b.color}
                          rx="2"
                          opacity={isHov ? 1 : 0.88}
                        />
                      );
                    })}

                    {/* X-axis Label */}
                    <text
                      x={colX + colWidth / 2}
                      y={padTop + chartH + 16}
                      textAnchor="middle"
                      fill={isHov ? '#0B192C' : '#64748B'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight={isHov ? 'bold' : 'normal'}
                    >
                      {d.day}
                    </text>
                  </g>
                );
              }

              // Stacked Mode
              const showApple = activeBrand === 'all' || activeBrand === 'Apple';
              const showSamsung = activeBrand === 'all' || activeBrand === 'Samsung';
              const showXiaomi = activeBrand === 'all' || activeBrand === 'Xiaomi';

              const hApple = showApple ? (d.Apple / maxVal) * chartH : 0;
              const hSamsung = showSamsung ? (d.Samsung / maxVal) * chartH : 0;
              const hXiaomi = showXiaomi ? (d.Xiaomi / maxVal) * chartH : 0;

              const barW = Math.max(10, colWidth - 14);
              const barX = colX + (colWidth - barW) / 2;

              let currentY = padTop + chartH;

              const yApple = currentY - hApple;
              currentY -= hApple;

              const ySamsung = currentY - hSamsung;
              currentY -= hSamsung;

              const yXiaomi = currentY - hXiaomi;

              return (
                <g 
                  key={d.day}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setHoveredIdx(hoveredIdx === idx ? null : idx)}
                  className="cursor-pointer"
                >
                  {isHov && (
                    <rect
                      x={colX + 2}
                      y={padTop}
                      width={colWidth - 4}
                      height={chartH}
                      fill="#00B074"
                      fillOpacity="0.08"
                      rx="4"
                    />
                  )}

                  {showApple && hApple > 0 && (
                    <rect
                      x={barX}
                      y={yApple}
                      width={barW}
                      height={hApple}
                      fill="#0284C7"
                      rx="1"
                    />
                  )}
                  {showSamsung && hSamsung > 0 && (
                    <rect
                      x={barX}
                      y={ySamsung}
                      width={barW}
                      height={hSamsung}
                      fill="#4F46E5"
                      rx="1"
                    />
                  )}
                  {showXiaomi && hXiaomi > 0 && (
                    <rect
                      x={barX}
                      y={yXiaomi}
                      width={barW}
                      height={hXiaomi}
                      fill="#EA580C"
                      rx="2"
                    />
                  )}

                  {/* X-axis Label */}
                  <text
                    x={colX + colWidth / 2}
                    y={padTop + chartH + 16}
                    textAnchor="middle"
                    fill={isHov ? '#0B192C' : '#64748B'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isHov ? 'bold' : 'normal'}
                  >
                    {d.day}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredData && (
            <div className="mt-2 bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs space-y-1.5 transition-all text-[#0B192C]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1 font-mono">
                <span className="font-bold text-[#0B192C]">{hoveredData.day} ({hoveredData.date})</span>
                <span className="text-[#008A5B] font-bold">{hoveredData.total.toLocaleString()} uds total</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-0.5">
                <div className="flex items-center gap-1.5 font-medium text-sky-700">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Apple: <strong>{hoveredData.Apple.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-indigo-700">
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                  <span>Samsung: <strong>{hoveredData.Samsung.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-orange-700">
                  <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                  <span>Xiaomi: <strong>{hoveredData.Xiaomi.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Market Trend Insight footer */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-600">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#008A5B]" />
            <span>Tendencia: <strong className="text-[#0B192C] font-semibold">Demanda en pico récord hoy</strong></span>
          </span>
          <span className="font-mono text-[#008A5B] font-bold">
            Total 7D: {grandTotal.toLocaleString()} uds
          </span>
        </div>
      </div>
    </div>
  );
};
