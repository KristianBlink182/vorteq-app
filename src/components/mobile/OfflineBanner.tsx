import React from 'react';
import { WifiOff, Wifi, RefreshCw, Database, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { OfflineCacheStats } from '../../services/offlineSync';

interface OfflineBannerProps {
  stats: OfflineCacheStats;
  onToggleSimulatedOffline: (val: boolean) => void;
  onForceRefreshCache: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  stats,
  onToggleSimulatedOffline,
  onForceRefreshCache,
}) => {
  if (!stats.effectiveOffline) {
    return null;
  }

  return (
    <aside 
      aria-label="Alerta de conectividad"
      className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/40 px-3.5 py-2.5 text-xs text-amber-200 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">
                Modo Offline Activo
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 font-semibold">
                Sin Internet
              </span>
            </div>
            <div className="text-[11px] text-amber-300/80 truncate">
              {stats.cachedOffersCount} lotes y {stats.totalMessagesCount} mensajes disponibles desde la memoria local.
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {stats.isSimulatedOffline ? (
            <button
              onClick={() => onToggleSimulatedOffline(false)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors cursor-pointer shadow-xs"
            >
              Reconectar
            </button>
          ) : (
            <button
              onClick={onForceRefreshCache}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg transition-colors cursor-pointer"
              title="Comprobar conexión"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export const OfflineStatusCard: React.FC<OfflineBannerProps> = ({
  stats,
  onToggleSimulatedOffline,
  onForceRefreshCache,
}) => {
  return (
    <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            stats.effectiveOffline 
              ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' 
              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
          }`}>
            {stats.effectiveOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Estado de Conexión &amp; Modo Offline</span>
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold ${
                stats.effectiveOffline 
                  ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {stats.effectiveOffline ? 'OFFLINE' : 'ONLINE'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {stats.effectiveOffline 
                ? 'Operando con datos almacenados en LocalStorage' 
                : 'Conectado a la red de trading en tiempo real'}
            </p>
          </div>
        </div>

        {/* Switch for manual testing of offline mode */}
        <button
          type="button"
          role="switch"
          aria-checked={stats.isSimulatedOffline}
          onClick={() => onToggleSimulatedOffline(!stats.isSimulatedOffline)}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer focus:outline-none shrink-0 ${
            stats.isSimulatedOffline ? 'bg-amber-500' : 'bg-slate-700'
          }`}
          title={stats.isSimulatedOffline ? 'Desactivar simulación offline' : 'Simular corte de internet'}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
              stats.isSimulatedOffline ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Cache Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Lotes en Caché Local</span>
          </div>
          <div className="text-white font-mono font-bold text-sm mt-0.5">
            {stats.cachedOffersCount} ofertas
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">100% accesibles offline</span>
        </div>

        <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <div className="text-slate-400 text-[10px] flex items-center gap-1">
            <Database className="w-3 h-3 text-[#00B074]" />
            <span>Mensajes en LocalStorage</span>
          </div>
          <div className="text-white font-mono font-bold text-sm mt-0.5">
            {stats.totalMessagesCount} msgs ({stats.cachedChatsCount} chats)
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Lectura y borrador listos</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>Última sincronización: <strong className="text-slate-300 font-mono">{stats.lastSyncTime}</strong></span>
        <button
          onClick={onForceRefreshCache}
          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Sincronizar ahora</span>
        </button>
      </div>
    </div>
  );
};
