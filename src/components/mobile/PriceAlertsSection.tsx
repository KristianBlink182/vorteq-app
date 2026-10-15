import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  Sliders, 
  Sparkles, 
  Send, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  X,
  Volume2
} from 'lucide-react';
import { PriceAlert, ProductPriceLive, UserAccount } from '../../types';

interface PriceAlertsSectionProps {
  currentUser: UserAccount;
  livePrices: ProductPriceLive[];
}

const STORAGE_KEY = 'vorteq_b2b_price_alerts';

const AVAILABLE_MODELS = [
  { brand: 'Apple' as const, model: 'iPhone 16 Pro Max 256GB', defaultTarget: 1020, category: 'iPhone' },
  { brand: 'Apple' as const, model: 'iPhone 16 Pro 128GB', defaultTarget: 940, category: 'iPhone' },
  { brand: 'Apple' as const, model: 'iPhone 15 128GB (Caja Sellada)', defaultTarget: 580, category: 'iPhone' },
  { brand: 'Apple' as const, model: 'iPhone 15 Pro Max 256GB', defaultTarget: 890, category: 'iPhone' },
  { brand: 'Samsung' as const, model: 'Samsung Galaxy S24 Ultra 512GB', defaultTarget: 850, category: 'Samsung' },
  { brand: 'Samsung' as const, model: 'Samsung Galaxy S24+ 256GB', defaultTarget: 710, category: 'Samsung' },
  { brand: 'Samsung' as const, model: 'Samsung Galaxy Z Fold 5 512GB', defaultTarget: 1050, category: 'Samsung' },
  { brand: 'MacBook' as const, model: 'MacBook Pro 14" M3 Pro 512GB', defaultTarget: 1720, category: 'MacBook' },
  { brand: 'MacBook' as const, model: 'MacBook Air 15" M3 256GB', defaultTarget: 1150, category: 'MacBook' },
  { brand: 'MacBook' as const, model: 'MacBook Air 13" M2 256GB', defaultTarget: 840, category: 'MacBook' },
];

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    brand: 'Apple',
    model: 'iPhone 16 Pro Max 256GB',
    targetPriceUSD: 1030,
    condition: 'below_target',
    notifyEmail: true,
    notifyPush: true,
    emailAddress: 'admin@vorteqb2b.com',
    isActive: true,
    createdAt: '14 Oct 2026',
    lastTriggered: 'Hoy a las 11:20 AM'
  },
  {
    id: 'alert-2',
    brand: 'Samsung',
    model: 'Samsung Galaxy S24 Ultra 512GB',
    targetPriceUSD: 870,
    condition: 'percent_drop',
    percentDrop: 2.5,
    notifyEmail: true,
    notifyPush: true,
    emailAddress: 'admin@vorteqb2b.com',
    isActive: true,
    createdAt: '12 Oct 2026'
  },
  {
    id: 'alert-3',
    brand: 'MacBook',
    model: 'MacBook Pro 14" M3 Pro 512GB',
    targetPriceUSD: 1750,
    condition: 'below_target',
    notifyEmail: false,
    notifyPush: true,
    emailAddress: 'admin@vorteqb2b.com',
    isActive: true,
    createdAt: '10 Oct 2026'
  }
];

export const PriceAlertsSection: React.FC<PriceAlertsSectionProps> = ({
  currentUser,
  livePrices
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_ALERTS.map(a => ({
      ...a,
      emailAddress: currentUser.email || a.emailAddress
    }));
  });

  const [isAdding, setIsAdding] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<'Apple' | 'Samsung' | 'MacBook'>('Apple');
  const [selectedModel, setSelectedModel] = useState<string>('iPhone 16 Pro Max 256GB');
  const [targetPrice, setTargetPrice] = useState<number>(1020);
  const [condition, setCondition] = useState<'below_target' | 'percent_drop' | 'any_change'>('below_target');
  const [percentDrop, setPercentDrop] = useState<number>(3);
  const [notifyPush, setNotifyPush] = useState<boolean>(true);
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [emailAddress, setEmailAddress] = useState<string>(currentUser.email || '');

  // Simulation toast/banner
  const [activeSimulation, setActiveSimulation] = useState<{
    model: string;
    message: string;
    channel: 'push' | 'email';
    price: number;
    dropPct: number;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }, [alerts]);

  // When brand changes in form, update selected model and target price
  const handleBrandChange = (brand: 'Apple' | 'Samsung' | 'MacBook') => {
    setSelectedBrand(brand);
    const firstForBrand = AVAILABLE_MODELS.find(m => m.brand === brand);
    if (firstForBrand) {
      setSelectedModel(firstForBrand.model);
      setTargetPrice(firstForBrand.defaultTarget);
    }
  };

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    const found = AVAILABLE_MODELS.find(m => m.model === modelName);
    if (found) {
      setTargetPrice(found.defaultTarget);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyPush && !notifyEmail) {
      alert('Selecciona al menos un canal de notificación (Push o Email)');
      return;
    }

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      brand: selectedBrand,
      model: selectedModel,
      targetPriceUSD: Number(targetPrice),
      condition,
      percentDrop: condition === 'percent_drop' ? Number(percentDrop) : undefined,
      notifyPush,
      notifyEmail,
      emailAddress: emailAddress.trim() || currentUser.email,
      isActive: true,
      createdAt: 'Hoy'
    };

    setAlerts([newAlert, ...alerts]);
    setIsAdding(false);
  };

  const toggleAlertStatus = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id === id));
  };

  const triggerTestSimulation = (alertItem: PriceAlert) => {
    const liveMatch = livePrices.find(p => p.model.toLowerCase().includes(alertItem.model.toLowerCase()) || alertItem.model.toLowerCase().includes(p.model.toLowerCase()));
    const currentPrice = liveMatch ? liveMatch.currentPriceUSD : alertItem.targetPriceUSD - 15;
    const diff = alertItem.targetPriceUSD - currentPrice;
    const drop = diff > 0 ? ((diff / alertItem.targetPriceUSD) * 100).toFixed(1) : '2.8';

    setActiveSimulation({
      model: alertItem.model,
      price: currentPrice,
      dropPct: parseFloat(drop),
      channel: alertItem.notifyPush ? 'push' : 'email',
      message: `¡Oportunidad de Arbitraje! El precio spot de ${alertItem.model} cayó a $${currentPrice.toLocaleString()} USD (por debajo de tu objetivo de $${alertItem.targetPriceUSD.toLocaleString()} USD).`
    });

    // Auto dismiss simulation after 6 seconds
    setTimeout(() => {
      setActiveSimulation(null);
    }, 6000);
  };

  // Helper to find current price from live feed
  const getLivePrice = (modelName: string) => {
    const match = livePrices.find(p => p.model.toLowerCase().includes(modelName.toLowerCase()) || modelName.toLowerCase().includes(p.model.toLowerCase()));
    return match?.currentPriceUSD;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
      {/* Simulation banner */}
      {activeSimulation && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950 via-[#0B192C] to-slate-900 border border-[#00B074]/60 text-white shadow-2xl animate-bounce-short relative">
          <button 
            onClick={() => setActiveSimulation(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00B074] text-white flex items-center justify-center shrink-0 shadow-md">
              <Bell className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-[#00B074] uppercase border border-emerald-500/30">
                  {activeSimulation.channel === 'push' ? '📲 Alerta Push Recibida' : '📧 Correo Enviado'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Ahora mismo</span>
              </div>
              <p className="text-xs font-semibold text-slate-100 leading-snug">
                {activeSimulation.message}
              </p>
              <div className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Descuento del {activeSimulation.dropPct}% vs precio objetivo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00B074]/15 border border-[#00B074]/30 text-[#00B074] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              Alertas de Precio en Vivo
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#00B074]/20 text-[#00B074] border border-[#00B074]/40 font-mono">
                {alerts.filter(a => a.isActive).length} Activas
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Notificaciones instantáneas por Push o Email para iPhone, Samsung y MacBooks.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#00B074] hover:bg-[#009b66] text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          {isAdding ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'Cerrar' : 'Nueva'}</span>
        </button>
      </div>

      {/* New Alert Form */}
      {isAdding && (
        <form onSubmit={handleCreateAlert} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00B074]" />
              Configurar Nueva Regla de Alerta
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Spot Market Trigger</span>
          </div>

          {/* 1. Brand Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              1. Selecciona la Marca
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Apple', 'Samsung', 'MacBook'] as const).map(brand => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleBrandChange(brand)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    selectedBrand === brand
                      ? 'bg-[#00B074]/20 text-[#00B074] border-[#00B074]/50 shadow-xs'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {brand === 'Apple' ? ' iPhone' : brand === 'Samsung' ? 'Samsung' : '💻 MacBook'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Specific Model Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              2. Modelo Específico
            </label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00B074]"
            >
              {AVAILABLE_MODELS.filter(m => m.brand === selectedBrand).map(m => {
                const live = getLivePrice(m.model);
                return (
                  <option key={m.model} value={m.model}>
                    {m.model} {live ? `(Spot actual: $${live} USD)` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 3. Trigger Condition & Target */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                3. Condición de Disparo
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00B074]"
              >
                <option value="below_target">Precio cae debajo de ($)</option>
                <option value="percent_drop">Baja más de (%) en 24h</option>
                <option value="any_change">Cualquier cambio de precio</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {condition === 'percent_drop' ? 'Porcentaje de caída' : 'Precio Objetivo ($ USD)'}
              </label>
              <div className="relative">
                {condition === 'percent_drop' ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="30"
                      value={percentDrop}
                      onChange={(e) => setPercentDrop(Number(e.target.value))}
                      className="w-full pl-3 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#00B074]"
                    />
                    <span className="absolute right-3 text-xs text-slate-400 font-mono">%</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="absolute left-3 text-xs text-slate-400 font-mono">$</span>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Notification Channels (Push & Email) */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <label className="text-[11px] font-semibold text-slate-300 block">
              4. Canales de Notificación
            </label>

            <div className="grid grid-cols-2 gap-2">
              {/* Push Toggle */}
              <div 
                onClick={() => setNotifyPush(!notifyPush)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  notifyPush 
                    ? 'bg-[#00B074]/15 border-[#00B074]/40 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#00B074]" />
                  <div>
                    <div className="text-xs font-bold">Push Móvil</div>
                    <div className="text-[10px] text-slate-400">Al instante</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  notifyPush ? 'bg-[#00B074] border-[#00B074] text-white' : 'border-slate-600'
                }`}>
                  {notifyPush && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Email Toggle */}
              <div 
                onClick={() => setNotifyEmail(!notifyEmail)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  notifyEmail 
                    ? 'bg-[#00B074]/15 border-[#00B074]/40 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold">Email B2B</div>
                    <div className="text-[10px] text-slate-400">Resumen detallado</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  notifyEmail ? 'bg-[#00B074] border-[#00B074] text-white' : 'border-slate-600'
                }`}>
                  {notifyEmail && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            {notifyEmail && (
              <div className="pt-1">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="tu-correo@empresa.com"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#00B074]"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#00B074] hover:bg-[#009b66] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Guardar Alerta
            </button>
          </div>
        </form>
      )}

      {/* Active Alerts List */}
      <div className="space-y-2.5">
        {alerts.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-400">No tienes alertas de precio configuradas.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-[#00B074] font-bold hover:underline"
            >
              + Crear tu primera alerta para iPhone, Samsung o MacBook
            </button>
          </div>
        ) : (
          alerts.map(item => {
            const livePrice = getLivePrice(item.model);
            const isNearTarget = livePrice && item.condition === 'below_target' && (livePrice <= item.targetPriceUSD + 20);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.isActive 
                    ? 'bg-slate-950/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        item.brand === 'Apple' 
                          ? 'bg-slate-800 text-slate-200' 
                          : item.brand === 'Samsung' 
                          ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        {item.brand}
                      </span>
                      <h5 className="text-xs font-bold text-white truncate max-w-[200px]">
                        {item.model}
                      </h5>
                    </div>

                    {/* Condition details */}
                    <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap font-mono">
                      <span>
                        Objetivo: <strong className="text-[#00B074]">${item.targetPriceUSD.toLocaleString()} USD</strong>
                      </span>
                      {livePrice && (
                        <span className="text-slate-400">
                          (Spot actual: <span className="text-white">${livePrice}</span>)
                        </span>
                      )}
                      {item.percentDrop && (
                        <span className="text-amber-400 font-semibold">
                          (-{item.percentDrop}% en 24h)
                        </span>
                      )}
                    </div>

                    {/* Channels and status badges */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        {item.notifyPush && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            <Smartphone className="w-3 h-3 text-[#00B074]" /> Push
                          </span>
                        )}
                        {item.notifyEmail && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300 truncate max-w-[140px]" title={item.emailAddress}>
                            <Mail className="w-3 h-3 text-cyan-400" /> {item.emailAddress.split('@')[0]}
                          </span>
                        )}
                      </div>

                      {item.lastTriggered && (
                        <span className="text-[9px] text-emerald-400 font-mono">
                          ✓ Activada {item.lastTriggered}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Test simulation button */}
                    <button
                      type="button"
                      title="Simular disparo de alerta en vivo"
                      onClick={() => triggerTestSimulation(item)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-[#00B074]/20 border border-slate-800 hover:border-[#00B074]/40 text-slate-300 hover:text-[#00B074] text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-[#00B074]" />
                      <span>Probar</span>
                    </button>

                    {/* Switch active toggle */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isActive}
                      onClick={() => toggleAlertStatus(item.id)}
                      className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        item.isActive ? 'bg-[#00B074]' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                        item.isActive ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteAlert(item.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Eliminar alerta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isNearTarget && item.isActive && (
                  <div className="mt-2 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg font-mono">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      ¡Precio spot a sólo ${(livePrice! - item.targetPriceUSD)} de tu umbral!
                    </span>
                    <span className="font-bold">Monitoreando</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Preset Fast Actions */}
      <div className="pt-1 border-t border-slate-800/80">
        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 tracking-wider">
          Plantillas Rápidas B2B (1 Clic)
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedBrand('Apple');
              setSelectedModel('iPhone 16 Pro Max 256GB');
              setTargetPrice(1020);
              setIsAdding(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-[#00B074]/40 text-slate-300 text-[10px] font-mono whitespace-nowrap cursor-pointer transition-colors"
          >
             iPhone 16 Pro Max &lt; $1,020
          </button>
          <button
            onClick={() => {
              setSelectedBrand('Samsung');
              setSelectedModel('Samsung Galaxy S24 Ultra 512GB');
              setTargetPrice(860);
              setIsAdding(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-[#00B074]/40 text-slate-300 text-[10px] font-mono whitespace-nowrap cursor-pointer transition-colors"
          >
            Samsung S24 Ultra &lt; $860
          </button>
          <button
            onClick={() => {
              setSelectedBrand('MacBook');
              setSelectedModel('MacBook Pro 14" M3 Pro 512GB');
              setTargetPrice(1720);
              setIsAdding(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-[#00B074]/40 text-slate-300 text-[10px] font-mono whitespace-nowrap cursor-pointer transition-colors"
          >
            💻 MacBook Pro M3 &lt; $1,720
          </button>
        </div>
      </div>
    </div>
  );
};
