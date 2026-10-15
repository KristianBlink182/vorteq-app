import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Globe, 
  Smartphone, 
  Filter, 
  FileText, 
  Bookmark, 
  EyeOff,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Maximize2,
  Rocket,
  WifiOff,
  Store,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { UserAccount, TradeOffer, ProductPriceLive } from '../../types';
import { VorteqLogo } from '../common/VorteqLogo';
import { WholesaleDetailModal } from '../mobile/WholesaleDetailModal';
import { DeploymentGuideModal } from '../mobile/DeploymentGuideModal';
import { getOfflineCacheStats } from '../../services/offlineSync';

interface WebAppDashboardProps {
  currentUser: UserAccount;
  users: UserAccount[];
  offers: TradeOffer[];
  livePrices: ProductPriceLive[];
  onOpenCreateOffer: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminPanel: () => void;
  onSwitchToMobileApp: () => void;
  onSaveOfferToggle: (offerId: string) => void;
  onLogout?: () => void;
}

export const WebAppDashboard: React.FC<WebAppDashboardProps> = ({
  currentUser,
  users,
  offers,
  livePrices,
  onOpenCreateOffer,
  onOpenAuthModal,
  onOpenAdminPanel,
  onSwitchToMobileApp,
  onSaveOfferToggle,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'piso' | 'precios' | 'panel'>('piso');
  const [search, setSearch] = useState('');
  const [expandedOffer, setExpandedOffer] = useState<TradeOffer | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);

  const filteredOffers = offers.filter((o) => 
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.companyName.toLowerCase().includes(search.toLowerCase()) ||
    o.stockLocation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      {/* Top Banner with view switcher */}
      <div className="bg-[#0B192C] text-white px-6 py-2.5 flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <VorteqLogo size="sm" variant="full" theme="dark" animated={true} />
          <span className="text-slate-600">|</span>
          {getOfflineCacheStats().effectiveOffline ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono flex items-center gap-1.5 font-bold">
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Offline Activo (Mostrando {offers.length} lotes en LocalStorage)</span>
            </span>
          ) : (
            <span className="text-slate-300">Terminal Web Mayorista (Base de datos compartida en tiempo real)</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeployModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5 text-[#00B074]" />
            <span>Subir a TestFlight & Web</span>
          </button>

          <button
            onClick={onSwitchToMobileApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00B074] hover:bg-[#009663] text-white font-bold transition-all shadow-xs cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Ver Modo App Móvil (iOS / Android)</span>
          </button>
        </div>
      </div>

      {/* Main Web Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <VorteqLogo size="md" variant="full" theme="light" />

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('piso')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'piso' ? 'bg-white text-[#0B192C] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Piso de Ofertas ({offers.length})
            </button>
            <button
              onClick={() => setActiveTab('precios')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'precios' ? 'bg-white text-[#00B074] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#00B074]" />
              <span>Precios Live</span>
            </button>
            <button
              onClick={() => setActiveTab('panel')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'panel' ? 'bg-white text-[#0B192C] font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mi Panel de Control
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateOffer}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00B074] hover:bg-[#009663] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Oferta</span>
          </button>

          <button
            onClick={onOpenAdminPanel}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Panel Admin</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#0B192C] text-[#00B074] flex items-center justify-center text-[10px] font-bold">
                {currentUser.avatarText || 'VQ'}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800">{currentUser.fullName}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                    currentUser.accountType === 'vendor'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-cyan-100 text-cyan-800'
                  }`}>
                    {currentUser.accountType === 'vendor' ? 'VENDOR' : 'CUSTOMER'}
                  </span>
                </div>
              </div>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                title="Cerrar sesión y volver al login"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-6">
        {/* TAB 1: PISO DE OFERTAS WEB */}
        {activeTab === 'piso' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar modelo, stock o empresa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>

              <span className="text-xs text-slate-500 font-medium">
                {filteredOffers.length} lotes listados en el feed global
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-5">Tipo</th>
                    <th className="py-3 px-5">Dispositivo / Especificaciones</th>
                    <th className="py-3 px-5">Empresa Mayorista</th>
                    <th className="py-3 px-5">Ubicación Stock</th>
                    <th className="py-3 px-5 text-right">Cantidad</th>
                    <th className="py-3 px-5 text-right">Precio Unitario</th>
                    <th className="py-3 px-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOffers.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          o.type === 'vender'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {o.type === 'vender' ? 'VENDER' : 'COMPRAR'}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <div 
                          onClick={() => setExpandedOffer(o)}
                          className="font-bold text-slate-900 text-sm hover:text-[#00B074] cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{o.title}</span>
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{o.notes}</div>
                        {o.physicalCondition && (
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                            <span className="text-slate-600">📦 {o.physicalCondition.boxStatus.split('(')[0]}</span>
                            <span>·</span>
                            <span className="text-emerald-600 font-medium">🛡️ {o.physicalCondition.warrantyPeriod.split('(')[0]}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{o.companyName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{o.username}</div>
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap font-medium text-slate-700">
                        {o.stockLocationFlag} {o.stockLocation}
                      </td>

                      <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-800">
                        {o.quantity.toLocaleString()} pcs
                      </td>

                      <td className="py-3.5 px-5 text-right font-mono font-bold text-sm text-[#00B074]">
                        ${o.priceUSD} USD
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setExpandedOffer(o)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Maximize2 className="w-3 h-3 text-slate-500" />
                            <span>Expandir</span>
                          </button>

                          <a
                            href={`https://wa.me/${(o.phoneWhatsApp || '+34600112233').replace('+', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors inline-block"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRECIOS LIVE SPOT */}
        {activeTab === 'precios' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Precios Live de Electrónica Mayorista</h3>
              <p className="text-xs text-slate-500">
                Monitoreo continuo de cotizaciones spot para smartphones, laptops y consolas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {livePrices.map((item) => {
                const isPositive = item.change24hUSD >= 0;
                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-bold text-[#00B074] uppercase">
                          {item.brand} · {item.category}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{item.model}</h4>
                        <span className="text-xs text-slate-500">{item.specs}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.marketSentiment === 'Subiendo'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.marketSentiment}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Cotización Spot</span>
                        <span className="text-xl font-black font-mono text-slate-900">
                          ${item.currentPriceUSD.toLocaleString()} USD
                        </span>
                      </div>

                      <div className={`text-right font-mono font-bold text-xs ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isPositive ? `+$${item.change24hUSD}` : `-$${Math.abs(item.change24hUSD)}`}
                        <div className="text-[11px]">({item.change24hPct}%)</div>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 font-mono">
                      <span>Mín 24h: ${item.low24hUSD}</span>
                      <span>Máx 24h: ${item.high24hUSD}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MI PANEL DE CONTROL */}
        {activeTab === 'panel' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl font-bold text-lg text-white flex items-center justify-center ${
                  currentUser.accountType === 'vendor' ? 'bg-[#00B074]' : 'bg-[#0284c7]'
                }`}>
                  {currentUser.avatarText || 'US'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{currentUser.companyName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      currentUser.accountType === 'vendor'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                    }`}>
                      {currentUser.accountType === 'vendor' ? 'VENDOR (Proveedor Mayorista)' : 'CUSTOMER (Cliente B2B)'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {currentUser.fullName} · {currentUser.username} · {currentUser.countryFlag} {currentUser.country} · {currentUser.city || 'Almacén Central'}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      ✓ Empresa Verificada con KYC
                    </span>
                    {currentUser.taxId && (
                      <span className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono">
                        RUC / Tax ID: {currentUser.taxId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {currentUser.accountType === 'vendor' ? (
                  <button
                    onClick={onOpenCreateOffer}
                    className="px-4 py-2 bg-[#00B074] hover:bg-[#009663] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    + Publicar Nuevo Lote
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('piso')}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Explorar Catálogo Mayorista
                  </button>
                )}

                <button
                  onClick={onOpenAuthModal}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cambiar Cuenta
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                )}
              </div>
            </div>

            {/* Role Specific Details Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                Información Comercial del Perfil ({currentUser.accountType === 'vendor' ? 'Proveedor' : 'Comprador'})
              </h4>

              {currentUser.accountType === 'vendor' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Tipo de Vendedor</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{currentUser.vendorType || 'Distribuidor Oficial'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Capacidad de Suministro</span>
                    <span className="font-bold text-[#00B074] mt-0.5 block">{currentUser.vendorSupplyCapacity || '$100K - $500K USD/mes'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Pedido Mínimo (MOQ)</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{currentUser.vendorMoq || '10 unidades'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Garantía Ofrecida</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">{currentUser.vendorWarrantyTerms || '12 Meses Oficial AppleCare'}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Tipo de Negocio</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{currentUser.customerBusinessType || 'Tienda Retail'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Presupuesto Mensual</span>
                    <span className="font-bold text-cyan-700 mt-0.5 block">{currentUser.customerMonthlyBudget || '$20K - $100K USD'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Preferencia Logística</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{currentUser.customerDeliveryPref || 'Envío Express a Bodega'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Métodos de Pago</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {currentUser.customerPaymentMethods?.join(', ') || 'Transferencia SWIFT / USDT'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Ofertas Activas</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{currentUser.offersCount}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Suscriptores B2B</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{currentUser.subscribersCount}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Tamaño de Operaciones</span>
                <div className="text-2xl font-bold text-[#00B074] mt-1 font-mono">{currentUser.companySize}</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Wholesale Detail Modal for Web Terminal */}
      <WholesaleDetailModal
        offer={expandedOffer}
        isOpen={!!expandedOffer}
        onClose={() => setExpandedOffer(null)}
        onSaveToggle={onSaveOfferToggle}
        onStartChat={() => {
          onSwitchToMobileApp();
        }}
        users={users}
      />

      {/* Deployment Guide Modal */}
      <DeploymentGuideModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
      />
    </div>
  );
};
