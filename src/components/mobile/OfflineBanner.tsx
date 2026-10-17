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
      className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 shadow-xs animate-in fade-in slide-in-from-top-1"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-200/60 text-amber-800 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">Modo Offline Activo</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-200/80 text-amber-900 rounded font-semibold">
                Sin Internet
              </span>
            </div>
            <div className="text-[11px] text-amber-800/90 truncate">
              {stats.cachedOffersCount} lotes disponibles desde tu dispositivo.
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {stats.isSimulatedOffline ? (
            <button
              onClick={() => onToggleSimulatedOffline(false)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer shadow-xs"
            >
              Reconectar
            </button>
          ) : (
            <button
              onClick={onForceRefreshCache}
              className="p-1.5 bg-white hover:bg-slate-100 text-amber-800 border border-amber-200 rounded-lg transition-colors cursor-pointer"
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
    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            stats.effectiveOffline 
              ? 'bg-amber-50 text-amber-600 border-amber-200' 
              : 'bg-emerald-50 text-[#00B074] border-emerald-200'
          }`}>
            {stats.effectiveOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Estado de Conexión</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                stats.effectiveOffline 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {stats.effectiveOffline ? 'OFFLINE' : 'ONLINE'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {stats.effectiveOffline 
                ? 'Operando con datos guardados en caché local' 
                : 'Conectado a la red mayorista Vorteq en tiempo real'}
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
            stats.isSimulatedOffline ? 'bg-amber-500' : 'bg-slate-300'
          }`}
          title={stats.isSimulatedOffline ? 'Desactivar simulación offline' : 'Simular corte de internet'}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
              stats.isSimulatedOffline ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Cache Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-[10px] flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-600" />
            <span>Lotes en Caché Local</span>
          </div>
          <div className="text-slate-900 font-bold text-sm mt-0.5">
            {stats.cachedOffersCount} ofertas
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Disponibles sin red</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-[10px] flex items-center gap-1">
            <Database className="w-3 h-3 text-[#00B074]" />
            <span>Mensajes Guardados</span>
          </div>
          <div className="text-slate-900 font-bold text-sm mt-0.5">
            {stats.totalMessagesCount} msgs ({stats.cachedChatsCount} chats)
          </div>
          <span className="text-[10px] text-cyan-700 font-medium">Borradores listos</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Última sincronización: <strong className="text-slate-700 font-medium">{stats.lastSyncTime}</strong></span>
        <button
          onClick={onForceRefreshCache}
          className="text-[#00B074] hover:text-[#009963] font-bold flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Sincronizar</span>
        </button>
      </div>
    </div>
  );
};
