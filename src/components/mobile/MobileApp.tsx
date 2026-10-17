import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  TrendingUp, 
  MessageSquare, 
  Menu, 
  Search, 
  QrCode, 
  Bell, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  EyeOff, 
  ChevronRight, 
  Share2, 
  MoreVertical, 
  Phone, 
  ShieldCheck, 
  Lock, 
  X, 
  Plus, 
  Copy, 
  Globe, 
  Settings, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  RefreshCw,
  Plane,
  Calculator,
  Sliders,
  CheckCircle2,
  Check,
  CheckCheck,
  Building2,
  Boxes,
  Compass,
  ArrowRight,
  Play,
  Layers,
  Sparkles,
  Activity,
  Send,
  Trash2,
  Database,
  RotateCcw,
  Maximize2,
  Rocket,
  WifiOff,
  Wifi,
  LogOut,
  Store,
  ShoppingBag
} from 'lucide-react';
import { UserAccount, TradeOffer, ProductPriceLive, FeaturedStory, ChatMessage } from '../../types';
import { VorteqLogo } from '../common/VorteqLogo';
import { BrandDemandChart } from './BrandDemandChart';
import { PriceAlertsSection } from './PriceAlertsSection';
import { PerformanceDashboard } from './PerformanceDashboard';
import { WholesaleDetailModal } from './WholesaleDetailModal';
import { VoiceSearchBar } from './VoiceSearchBar';
import { OfflineBanner, OfflineStatusCard } from './OfflineBanner';
import { 
  getOfflineCacheStats, 
  setSimulatedOfflineState, 
  updateLastSyncTimestamp, 
  queueOfflineMessage,
  OfflineCacheStats
} from '../../services/offlineSync';
import { 
  getStoredChatMessages, 
  saveChatMessages, 
  clearStoredChatMessages, 
  INITIAL_CHAT_MESSAGES 
} from '../../services/mockDatabase';

interface MobileAppProps {
  currentUser: UserAccount;
  users: UserAccount[];
  offers: TradeOffer[];
  livePrices: ProductPriceLive[];
  stories: FeaturedStory[];
  onOpenCreateOffer: () => void;
  onOpenAuthModal: () => void;
  onSaveOfferToggle: (offerId: string) => void;
  onIgnoreOfferToggle: (offerId: string) => void;
  onUpdatePrivacy: (hidePhone: boolean, hideArchived: boolean) => void;
  onLogout?: () => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({
  currentUser,
  users,
  offers,
  livePrices,
  stories,
  onOpenCreateOffer,
  onOpenAuthModal,
  onSaveOfferToggle,
  onIgnoreOfferToggle,
  onUpdatePrivacy,
  onLogout,
}) => {
  // Navigation tabs (Default: feed - Explorar Lotes Mayoristas)
  const [activeTab, setActiveTab] = useState<'inicio' | 'feed' | 'precios' | 'performance' | 'chat' | 'menu'>('feed');

  // Hamburger Drawer Menu State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<'vendor' | 'customer'>(currentUser.accountType || 'vendor');

  const handleToggleActiveRole = () => {
    const next = activeRole === 'vendor' ? 'customer' : 'vendor';
    setActiveRole(next);
    currentUser.accountType = next;
  };

  // Overlays / Modals
  const [selectedProfileUser, setSelectedProfileUser] = useState<UserAccount | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHub, setSelectedHub] = useState<string>('all');
  const [showOnlySaved, setShowOnlySaved] = useState<boolean>(false);
  const [expandedOffer, setExpandedOffer] = useState<TradeOffer | null>(null);

  // Offline Mode State & Metrics
  const [offlineStats, setOfflineStats] = useState<OfflineCacheStats>(() => getOfflineCacheStats());
  const [reconnectedToast, setReconnectedToast] = useState<boolean>(false);

  // Sync cache stats on mount and whenever network events fire
  useEffect(() => {
    updateLastSyncTimestamp();
    setOfflineStats(getOfflineCacheStats());

    const handleOnline = () => {
      setOfflineStats(getOfflineCacheStats());
      setReconnectedToast(true);
      setTimeout(() => setReconnectedToast(false), 3500);
    };

    const handleOffline = () => {
      setOfflineStats(getOfflineCacheStats());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleSimulatedOffline = (active: boolean) => {
    setSimulatedOfflineState(active);
    const updated = getOfflineCacheStats();
    setOfflineStats(updated);
    if (!active) {
      setReconnectedToast(true);
      setTimeout(() => setReconnectedToast(false), 3500);
    }
  };

  const handleForceRefreshCache = () => {
    updateLastSyncTimestamp();
    setOfflineStats(getOfflineCacheStats());
    setChatStatusNotice('Caché de lotes y mensajes sincronizado con éxito');
    setTimeout(() => setChatStatusNotice(null), 3000);
  };

  // Privacy modal settings state
  const [hidePhoneState, setHidePhoneState] = useState<boolean>(currentUser.hidePhone);
  const [hideArchivedState, setHideArchivedState] = useState<boolean>(currentUser.hideArchived);

  // Profile accordion states
  const [isValidationOpen, setIsValidationOpen] = useState(true);
  const [isExhibitionsOpen, setIsExhibitionsOpen] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Chat message state with localStorage persistence
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    return getStoredChatMessages(currentUser);
  });
  const [activeChatUser, setActiveChatUser] = useState<UserAccount | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const [isCounterpartyTyping, setIsCounterpartyTyping] = useState(false);
  const [chatStatusNotice, setChatStatusNotice] = useState<string | null>(null);

  // Sync chat messages to localStorage whenever modified
  useEffect(() => {
    saveChatMessages(chatMessages);
  }, [chatMessages]);

  // Scroll to bottom when new messages arrive or when opening a conversation
  useEffect(() => {
    if (activeChatUser) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, activeChatUser, chatMessages, isCounterpartyTyping]);

  // Quick negotiation chips for fast trade proposals
  const quickNegotiationChips = [
    '📦 ¿Tienen stock físico para entrega inmediata?',
    '💰 ¿Aceptan contraoferta de -3% sobre precio spot?',
    '✈️ ¿Condiciones de entrega EXW o FOB Miami?',
    '🛡️ Procedamos con depósito en Custodia Escrow Vorteq'
  ];

  // Send message handler with auto-reply simulation & persistent storage
  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend !== undefined ? textToSend : chatInputText).trim();
    if (!content || !activeChatUser) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderUsername: currentUser.username,
      senderName: currentUser.fullName,
      text: content,
      timestamp: timeStr,
      isMe: true,
    };

    const targetId = activeChatUser.id;
    const currentList = chatMessages[targetId] || [];
    const updatedMessages = {
      ...chatMessages,
      [targetId]: [...currentList, newMsg],
    };

    setChatMessages(updatedMessages);
    saveChatMessages(updatedMessages);
    setChatInputText('');

    // If offline, queue message and notify user without simulated server reply
    if (offlineStats.effectiveOffline) {
      queueOfflineMessage(targetId, newMsg);
      setChatStatusNotice('Mensaje guardado localmente en tu dispositivo (Modo Offline)');
      setTimeout(() => setChatStatusNotice(null), 3500);
      setOfflineStats(getOfflineCacheStats());
      return;
    }

    // Trigger typing simulation and simulated trade response when online
    setIsCounterpartyTyping(true);
    setTimeout(() => {
      setIsCounterpartyTyping(false);
      const responses = [
        `Confirmado por nuestro equipo de almacén. Tenemos el lote reservado para despacho inmediato con documentación completa.`,
        `Excelente propuesta. Te confirmo que podemos cerrar con un 10% de seña vía Custodia Escrow Vorteq.`,
        `Revisada la contraoferta. El margen es viable si cerramos hoy antes del corte de las 18:00 EST.`,
        `Perfecto, stock 100% inspeccionado con precintos originales. ¿Cuál es tu forwarder de preferencia en Miami o DAFZA?`
      ];
      const replyText = responses[Math.floor(Math.random() * responses.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const counterMsg: ChatMessage = {
        id: 'reply-' + Date.now(),
        senderUsername: activeChatUser.username,
        senderName: activeChatUser.fullName,
        text: replyText,
        timestamp: replyTime,
        isMe: false,
      };

      setChatMessages((prev) => {
        const nextState = {
          ...prev,
          [targetId]: [...(prev[targetId] || []), counterMsg],
        };
        saveChatMessages(nextState);
        return nextState;
      });
    }, 1200);
  };

  // Clear or reset conversation for current counterparty
  const handleClearCurrentChat = () => {
    if (!activeChatUser) return;
    const updated = {
      ...chatMessages,
      [activeChatUser.id]: []
    };
    setChatMessages(updated);
    saveChatMessages(updated);
    setChatStatusNotice('Conversación borrada y sincronizada en LocalStorage');
    setTimeout(() => setChatStatusNotice(null), 3000);
  };

  // Restore sample demo conversation
  const handleResetToDemoChat = () => {
    const demo = INITIAL_CHAT_MESSAGES;
    setChatMessages(demo);
    saveChatMessages(demo);
    setChatStatusNotice('Conversaciones iniciales restauradas en LocalStorage');
    setTimeout(() => setChatStatusNotice(null), 3000);
  };

  // Precios Live - simulated price change trigger
  const [dynamicPrices, setDynamicPrices] = useState<ProductPriceLive[]>(livePrices);
  const [priceNotice, setPriceNotice] = useState<string | null>(null);

  // Simulated video playback state for modern dynamic hero
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Global Trading Hubs Data
  const globalHubs = [
    { id: 'all', name: 'Todos los Hubs', flag: '🌐', stockCount: 5200, transit: 'Enlace Global' },
    { id: 'Miami', name: 'Miami EXW (Doral)', flag: '🇺🇸', stockCount: 1450, transit: 'Hub Conector LATAM' },
    { id: 'Dubai', name: 'Dubái DAFZA', flag: '🇦🇪', stockCount: 1220, transit: 'Zona Franca 0% Tax' },
    { id: 'Hong Kong', name: 'Hong Kong FOB', flag: '🇭🇰', stockCount: 1800, transit: 'Despacho Inmediato' },
    { id: 'Frankfurt', name: 'Fráncfort DDP', flag: '🇩🇪', stockCount: 730, transit: 'Aduana UE Lista' },
  ];

  const handleSimulatePriceFluctuation = () => {
    const updated = dynamicPrices.map((p) => {
      const delta = (Math.random() > 0.45 ? 1 : -1) * Math.floor(Math.random() * 9 + 3);
      const newPrice = p.currentPriceUSD + delta;
      return {
        ...p,
        previousPriceUSD: p.currentPriceUSD,
        currentPriceUSD: newPrice,
        change24hUSD: p.change24hUSD + delta,
        change24hPct: Number(((delta / p.currentPriceUSD) * 100).toFixed(2)),
        marketSentiment: delta > 0 ? ('Subiendo' as const) : ('Bajando' as const),
      };
    });
    setDynamicPrices(updated);
    setPriceNotice('¡Cotizaciones spot sincronizadas con las bolsas de electrónica de Miami y Hong Kong!');
    setTimeout(() => setPriceNotice(null), 3000);
  };

  const handleSavePrivacy = () => {
    onUpdatePrivacy(hidePhoneState, hideArchivedState);
    setShowPrivacyModal(false);
  };

  const filteredOffers = offers.filter((o) => {
    if (showOnlySaved && !o.isSaved) {
      return false;
    }
    if (activeFilterCategory !== 'all' && !o.title.toLowerCase().includes(activeFilterCategory.toLowerCase())) {
      return false;
    }
    if (selectedHub !== 'all' && !o.stockLocation.toLowerCase().includes(selectedHub.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) || 
        o.companyName.toLowerCase().includes(q) || 
        o.stockLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const savedOffers = offers.filter((o) => o.isSaved);

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC] text-[#0B192C] overflow-hidden relative selection:bg-[#00B074]/20 selection:text-[#00B074]">
      
      {/* Reconnection Success Toast */}
      {reconnectedToast && (
        <div className="fixed top-safe left-4 right-4 z-50 bg-white border border-emerald-500/50 rounded-2xl p-3 text-xs text-emerald-800 flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00B074] shrink-0" />
            <span className="font-semibold">¡Conexión Restablecida! Datos sincronizados en tiempo real.</span>
          </div>
          <button onClick={() => setReconnectedToast(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP APP BAR (NATIVE IOS WITH LOGO & HAMBURGER MENU)   */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 pt-safe pb-2.5 px-4 flex items-center justify-between shadow-xs">
        {/* Left: Hamburger Menu Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-[#0B192C] flex items-center justify-center transition-all border border-slate-200 cursor-pointer shadow-2xs"
          title="Abrir menú de opciones"
          aria-label="Menú principal"
        >
          <Menu className="w-5 h-5 text-[#0B192C]" />
        </button>

        {/* Center: Official Vorteq Logo */}
        <div className="flex items-center">
          <VorteqLogo size="md" variant="full" theme="light" animated={false} />
        </div>

        {/* Right: Quick Role Pill (Vendor or Customer) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleActiveRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer active:scale-95 shadow-2xs ${
              activeRole === 'vendor'
                ? 'bg-[#E6F7F0] text-[#008A5B] border-[#00B074]/40 hover:bg-emerald-100'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
            title="Toca para alternar rol (Vendor / Customer)"
          >
            {activeRole === 'vendor' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#00B074] animate-pulse" />
                <span>VENDOR</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>CUSTOMER</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* HAMBURGER SLIDE-OUT DRAWER (MENU LATERAL COMPLETO)       */}
      {/* ======================================================== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-[#0B192C]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer container (slides from left) */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-left duration-250 border-r border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between pt-safe">
              <VorteqLogo size="sm" variant="full" theme="light" animated={false} />
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 space-y-5 flex-1 overflow-y-auto">
              {/* Profile Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: currentUser.avatarBgColor || '#00B074' }}
                    className="w-11 h-11 rounded-2xl text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0"
                  >
                    {currentUser.avatarText || 'VQ'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#0B192C] truncate">{currentUser.fullName}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074] shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 truncate">{currentUser.companyName}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{currentUser.countryFlag} {currentUser.username}</span>
                  </div>
                </div>

                {/* Role Switch Button */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Modo de Operación</span>
                    <span className="font-mono text-[#00B074]">Activo</span>
                  </div>
                  <button
                    onClick={() => {
                      handleToggleActiveRole();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#00B074] transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-2">
                      {activeRole === 'vendor' ? (
                        <Store className="w-4 h-4 text-[#00B074]" />
                      ) : (
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                      )}
                      <div className="text-left">
                        <span className="block text-xs font-bold text-[#0B192C]">
                          {activeRole === 'vendor' ? 'Modo Proveedor (Vendor)' : 'Modo Comprador (Customer)'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {activeRole === 'vendor' ? 'Publica y vende lotes' : 'Explora y compra por volumen'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#00B074] group-hover:underline">
                      Cambiar
                    </span>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Navegación Rápida
                </span>
                <button
                  onClick={() => { setActiveTab('feed'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'feed' ? 'bg-[#E6F7F0] text-[#008A5B]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Boxes className="w-4 h-4 text-[#00B074]" />
                  <span>Mercado Mayorista (Lotes)</span>
                </button>

                <button
                  onClick={() => { setActiveTab('precios'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'precios' ? 'bg-[#E6F7F0] text-[#008A5B]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-[#00B074]" />
                  <span>Cotizaciones Spot 24h</span>
                </button>

                <button
                  onClick={() => { setActiveTab('chat'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'chat' ? 'bg-[#E6F7F0] text-[#008A5B]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#00B074]" />
                  <div className="flex-1 flex items-center justify-between">
                    <span>Negociaciones B2B</span>
                    {Object.values(chatMessages).flat().length > 0 && (
                      <span className="bg-[#00B074] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        {Object.values(chatMessages).flat().length}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('menu'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'menu' ? 'bg-[#E6F7F0] text-[#008A5B]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-[#00B074]" />
                  <span>Mi Empresa & Cuenta</span>
                </button>
              </div>

              {/* Categorías Directas */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Filtrar Categorías
                </span>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {['all', 'iPhone', 'Samsung', 'MacBook'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveFilterCategory(cat);
                        setActiveTab('feed');
                        setIsDrawerOpen(false);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                        activeFilterCategory === cat
                          ? 'bg-[#0B192C] text-white border-[#0B192C]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'all' ? 'Ver Todos' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Acciones Rápidas
                </span>
                <button
                  onClick={() => {
                    setShowOnlySaved(true);
                    setActiveTab('feed');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4 text-[#00B074]" />
                    <span>Lotes Guardados</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{savedOffers.length}</span>
                </button>

                <button
                  onClick={() => {
                    handleForceRefreshCache();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#00B074]" />
                  <span>Sincronizar Datos en Vivo</span>
                </button>

                <button
                  onClick={() => {
                    setShowQrModal(true);
                    setIsDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-slate-600" />
                  <span>Compartir Perfil QR</span>
                </button>
              </div>

              {/* Escrow Trust Information */}
              <div className="p-3 bg-[#E6F7F0] border border-[#00B074]/30 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-[#008A5B] font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Custodia Escrow B2B</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Fondos retenidos de forma segura hasta la recepción física e inspección IMEI de la mercancía.
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2 pb-safe">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
              <div className="text-center text-[10px] text-slate-400 font-mono">
                Vorteq B2B Network · Native v2.6
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN SCROLLABLE CONTENT BODY (NATIVE IOS FLUID SCROLL)   */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto overscroll-contain pb-44 space-y-4">
        
        {/* ======================================================== */}
        {/* TAB 1: INICIO (NUEVA CARA MODERNA, DINÁMICA Y FUNCIONAL) */}
        {/* ======================================================== */}
        {activeTab === 'inicio' && (
          <div className="space-y-5 pt-3">
            
            {/* HERO PRINCIPAL DINÁMICO: Vorteq B2B Interactive Terminal */}
            <div className="px-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-[#0B192C] via-[#091424] to-[#050C16] p-4 sm:p-5 shadow-xl">
                {/* Simulated video/canvas ambient background glow with Vorteq Emerald */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#00B074]/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0B192C] rounded-full blur-3xl" />
                </div>

                {/* Subtle digital grid overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                  style={{ 
                    backgroundImage: 'radial-gradient(#00B074 1px, transparent 1px)', 
                    backgroundSize: '16px 16px' 
                  }} 
                />

                {/* Top Badge & Live Indicator */}
                <div className="relative z-10 flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00B074]/15 border border-[#00B074]/40 text-[#00B074] text-[10px] font-mono font-bold tracking-wider">
                    <Zap className="w-3 h-3 text-[#00B074] animate-bounce" />
                    VORTEQ B2B EXCHANGE
                  </span>

                  <button 
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="flex items-center gap-1 text-[10px] font-mono text-slate-300 hover:text-white bg-[#0B192C]/80 px-2.5 py-0.5 rounded-md border border-slate-700"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isVideoPlaying ? 'bg-[#00B074] animate-ping' : 'bg-slate-500'}`} />
                    <span>{isVideoPlaying ? 'FEED ACTIVO' : 'PAUSADO'}</span>
                  </button>
                </div>

                {/* Main Hero Value Proposition */}
                <div className="relative z-10 space-y-1 mb-4">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    Lotes mayoristas con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B074] to-[#05D68E]">Cotización Spot</span> en vivo.
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                    Arbitraje institucional directo entre Miami, Dubái, Hong Kong y Europa con custodia segura.
                  </p>
                </div>

                {/* Live Ticker Spotlight Box */}
                <div className="relative z-10 bg-[#0B192C]/80 border border-slate-700/80 rounded-xl p-3 mb-4 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-2">
                    <span className="text-slate-300 font-sans font-semibold">Referencia Líder Spot:</span>
                    <span className="text-[#00B074] font-bold">+$13.00 (24h)</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">iPhone 16 Pro Max 256GB</h4>
                      <span className="text-[10px] text-slate-400">US LL/A · Desert Titanium · Sellado</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-lg font-black text-[#00B074]">$1,045</span>
                      <span className="text-[10px] text-slate-400 block">USD / unidad</span>
                    </div>
                  </div>
                </div>

                {/* Hero CTA Action Row with Vorteq Emerald */}
                <div className="relative z-10 flex items-center gap-2">
                  <button
                    onClick={onOpenCreateOffer}
                    className="flex-1 py-2.5 px-3 bg-[#00B074] hover:bg-[#009963] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#00B074]/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publicar Lote</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('precios')}
                    className="py-2.5 px-3.5 bg-[#0B192C] hover:bg-[#15253F] text-slate-100 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#00B074]" />
                    <span>Precios Live</span>
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS MATRIX (4 HERRAMIENTAS CLAVE) */}
            <div className="px-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <button
                  onClick={onOpenCreateOffer}
                  className="bg-white border border-slate-200 hover:border-[#00B074]/50 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E6F7F0] border border-[#00B074]/30 flex items-center justify-center text-[#008A5B] group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#0B192C]">Publicar</span>
                </button>

                <button
                  onClick={() => setActiveTab('precios')}
                  className="bg-white border border-slate-200 hover:border-[#00B074]/50 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E6F7F0] border border-[#00B074]/40 flex items-center justify-center text-[#008A5B] group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#0B192C]">Precios Spot</span>
                </button>

                <button
                  onClick={() => setActiveTab('performance')}
                  className="bg-white border border-slate-200 hover:border-[#00B074]/50 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#008A5B] group-hover:scale-105 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#0B192C]">Rendimiento</span>
                </button>

                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="bg-white border border-slate-200 hover:border-[#00B074]/50 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#0B192C]">Privacidad</span>
                </button>
              </div>
            </div>

            {/* RADAR DE HUBS MAYORISTAS INTERNACIONALES */}
            <div className="px-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#00B074]" />
                  <h3 className="text-xs font-bold text-[#0B192C] uppercase tracking-wider">
                    Hubs y Almacenes Internacionales
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#008A5B] font-bold">Stock Físico 2026</span>
              </div>

              {/* Horizontal Pill Filters for Hubs */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {globalHubs.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedHub === hub.id
                        ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{hub.flag}</span>
                    <span>{hub.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SPOTLIGHT DE ARBITRAJE ALGORÍTMICO */}
            <div className="px-4">
              <div className="bg-[#E6F7F0] border border-[#00B074]/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#008A5B] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Oportunidad de Arbitraje B2B
                  </span>
                  <span className="text-[11px] font-mono text-[#008A5B] font-bold">+4.35% ROI Neto</span>
                </div>
                <div className="text-xs text-slate-700">
                  Comprar <span className="font-bold text-[#0B192C]">iPhone 16 Pro Max</span> en <span className="text-emerald-700 font-mono font-semibold">Miami EXW ($1,045)</span> ➔ Vender en <span className="text-blue-700 font-mono font-semibold">Fráncfort DDP ($1,115)</span>.
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60">
                  <span>Margen neto estimado: <strong className="text-[#0B192C] font-mono font-bold">+$45.50/ud</strong></span>
                  <button
                    onClick={() => setActiveTab('feed')}
                    className="text-[#008A5B] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    Ver Lotes ➔
                  </button>
                </div>
              </div>
            </div>

            {/* DEMANDA DE LOS ÚLTIMOS 7 DÍAS POR MARCA */}
            <BrandDemandChart />

            {/* TOP LOTES RECIENTES */}
            <div className="px-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#0B192C] uppercase tracking-wider flex items-center gap-1.5">
                  <Boxes className="w-4 h-4 text-[#00B074]" />
                  <span>Últimos Lotes Verificados en el Piso</span>
                </h3>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="text-xs text-[#008A5B] font-bold hover:underline cursor-pointer"
                >
                  Ver todos ({filteredOffers.length}) ➔
                </button>
              </div>

              {filteredOffers.slice(0, 3).map((offer) => {
                const isSeller = offer.type === 'vender';
                return (
                  <div
                    key={offer.id}
                    className="bg-white border border-slate-200/90 hover:border-[#00B074]/50 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${
                            isSeller 
                              ? 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isSeller ? 'VENTA / ASK' : 'COMPRA / BID'}
                          </span>
                          <span className="text-slate-400">{offer.dateStr}</span>
                        </div>
                        <h4 
                          onClick={() => setExpandedOffer(offer)}
                          className="text-sm font-bold text-[#0B192C] hover:text-[#00B074] transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{offer.title}</span>
                          <Maximize2 className="w-3 h-3 text-[#00B074] opacity-70" />
                        </h4>
                      </div>

                      <div className="text-right font-mono shrink-0">
                        <span className="text-base font-black text-[#00B074]">${offer.priceUSD}</span>
                        <span className="text-[10px] text-slate-500 block font-sans">x {offer.quantity} pcs</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[#0B192C] font-semibold">{offer.stockLocationFlag} {offer.stockLocation}</span>
                        <span>·</span>
                        <span className="text-slate-500 truncate max-w-[140px]">{offer.companyName}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setExpandedOffer(offer)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0B192C] border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Maximize2 className="w-3 h-3 text-slate-600" />
                          <span>Expandir</span>
                        </button>

                        <button
                          onClick={() => {
                            const found = users.find((u) => u.username === offer.username);
                            if (found) {
                              setActiveChatUser(found);
                              setActiveTab('chat');
                            }
                          }}
                          className="px-2.5 py-1 bg-[#00B074] hover:bg-[#009663] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Negociar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PISO EN VIVO (FEED OPTIMIZADO CON FILTROS 2026)    */}
        {/* ======================================================== */}
        {activeTab === 'feed' && (
          <div className="p-4 space-y-4">
            {/* Clean contextual header */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <div>
                <h2 className="text-xl font-black text-[#0B192C] tracking-tight">
                  Mercado Mayorista
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {filteredOffers.length} lotes de electrónica con arbitraje y custodia Escrow
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleForceRefreshCache}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#00B074] active:scale-95 transition-all cursor-pointer shadow-2xs"
                  title="Refrescar lotes"
                >
                  <RefreshCw className="w-4 h-4 text-[#00B074]" />
                </button>
                <button
                  onClick={() => setShowNotificationsModal(true)}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 relative active:scale-95 transition-all cursor-pointer shadow-2xs"
                  title="Notificaciones"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 bg-[#00B074] rounded-full absolute top-1.5 right-1.5 animate-pulse" />
                </button>
              </div>
            </div>

            {/* Búsqueda por Voz y Filtros Inteligentes (Web Speech API) */}
            <VoiceSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterModalToggle={() => setShowFilterModal(!showFilterModal)}
              onShowOnlySavedToggle={setShowOnlySaved}
              onCategorySelect={setActiveFilterCategory}
              placeholder="Buscar o decir 'Buscar iPhone 16'..."
            />

            {/* Quick Filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
              <button
                onClick={() => setActiveFilterCategory('all')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  activeFilterCategory === 'all'
                    ? 'bg-[#0B192C] text-white font-bold border-[#0B192C] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Todos ({offers.length})
              </button>
              <button
                onClick={() => setActiveFilterCategory('iPhone')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  activeFilterCategory === 'iPhone'
                    ? 'bg-[#0B192C] text-white font-bold border-[#0B192C] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                iPhones
              </button>
              <button
                onClick={() => setActiveFilterCategory('Samsung')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  activeFilterCategory === 'Samsung'
                    ? 'bg-[#0B192C] text-white font-bold border-[#0B192C] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Samsung
              </button>
              <button
                onClick={() => setActiveFilterCategory('MacBook')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                  activeFilterCategory === 'MacBook'
                    ? 'bg-[#0B192C] text-white font-bold border-[#0B192C] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                MacBooks
              </button>
            </div>

            {/* INTERRUPTOR (SWITCH): FILTRAR SOLO OFERTAS GUARDADAS */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  showOnlySaved 
                    ? 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {showOnlySaved ? <BookmarkCheck className="w-4 h-4 text-[#00B074]" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0B192C]">Solo Ofertas Guardadas</span>
                    {savedOffers.length > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30 font-bold">
                        {savedOffers.length} {savedOffers.length === 1 ? 'lote' : 'lotes'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block font-medium">
                    {showOnlySaved 
                      ? 'Mostrando tus lotes marcados de interés' 
                      : 'Filtra y muestra exclusivamente tus lotes de interés'}
                  </span>
                </div>
              </div>

              {/* Accessible Interactive Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={showOnlySaved}
                onClick={() => setShowOnlySaved(!showOnlySaved)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer focus:outline-none shrink-0 ${
                  showOnlySaved ? 'bg-[#00B074]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                    showOnlySaved ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* AVISO DE MODO OFFLINE EN EL FEED */}
            {offlineStats.effectiveOffline && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between gap-3 shadow-md animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Inventario en Caché Local</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                        {filteredOffers.length} lotes listos
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-300/80 block mt-0.5">
                      Visualizando los últimos lotes cargados en localStorage. Toca cualquier lote para ver especificaciones y fotos sin conexión.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Feed List of Wholesale Cards */}
            <div className="space-y-3.5">
              {filteredOffers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-7 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F7F0] border border-[#00B074]/30 text-[#00B074] mx-auto flex items-center justify-center">
                    <BookmarkCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#0B192C]">
                      {showOnlySaved ? 'No tienes ofertas guardadas' : 'No se encontraron ofertas'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      {showOnlySaved 
                        ? 'Haz clic en el icono de marcador 🔖 en cualquier lote del feed para agregarlo a tus guardados.'
                        : 'Prueba ajustando los filtros de búsqueda o la categoría seleccionada.'}
                    </p>
                  </div>
                  {showOnlySaved && (
                    <button
                      onClick={() => setShowOnlySaved(false)}
                      className="px-4 py-2 bg-[#00B074] hover:bg-[#009663] text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-block shadow-sm"
                    >
                      Ver Todas las Ofertas
                    </button>
                  )}
                </div>
              ) : (
                filteredOffers.map((offer) => {
                  const isSeller = offer.type === 'vender';
                  const offerImages = offer.images || [];
                  const boxStatus = offer.physicalCondition?.boxStatus || 'Caja Master Sellada';
                  const warranty = offer.physicalCondition?.warrantyPeriod || 'Garantía Oficial de Fábrica';

                  return (
                    <div
                      key={offer.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-md hover:border-[#00B074]/50 transition-all"
                    >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                            isSeller 
                              ? 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isSeller ? 'VENDER / OFERTA' : 'COMPRAR / BID'}
                          </span>
                          {offerImages.length > 0 && (
                            <span 
                              onClick={() => setExpandedOffer(offer)}
                              className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md cursor-pointer hover:bg-slate-200 transition-colors"
                            >
                              📷 {offerImages.length} fotos
                            </span>
                          )}
                        </div>

                        <h3 
                          onClick={() => setExpandedOffer(offer)}
                          className="text-base font-bold text-[#0B192C] leading-snug hover:text-[#00B074] transition-colors cursor-pointer pt-0.5 flex items-center justify-between group"
                        >
                          <span>{offer.title}</span>
                          <span className="text-[11px] text-[#00B074] font-mono flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </span>
                        </h3>
                      </div>

                      <div className="text-right font-mono shrink-0 pl-2">
                        <span className="text-xl font-black text-[#00B074]">${offer.priceUSD}</span>
                        <span className="text-[10px] text-slate-500 block font-sans font-medium">Lote: {offer.quantity} pcs</span>
                      </div>
                    </div>

                    {/* Author & Company row */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center gap-2">
                        <div
                          onClick={() => {
                            const found = users.find((u) => u.username === offer.username);
                            if (found) setSelectedProfileUser(found);
                          }}
                          className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0B192C] cursor-pointer"
                        >
                          {offer.companyName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div 
                            onClick={() => {
                              const found = users.find((u) => u.username === offer.username);
                              if (found) setSelectedProfileUser(found);
                            }}
                            className="font-bold text-[#0B192C] hover:text-[#00B074] cursor-pointer"
                          >
                            {offer.companyName}
                          </div>
                          <div className="text-[11px] text-slate-500">{offer.username} · {offer.companySize}</div>
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-slate-600 font-mono">
                        {offer.stockLocationFlag} {offer.stockLocation}
                      </span>
                    </div>

                    {/* Physical Condition Quick Highlights */}
                    <div 
                      onClick={() => setExpandedOffer(offer)}
                      className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl cursor-pointer text-[11px] text-slate-600 transition-colors"
                      title="Haz clic para ver especificaciones técnicas y condición física completa"
                    >
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium truncate max-w-[200px]">
                        📦 {boxStatus.split('(')[0]}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#E6F7F0] border border-[#00B074]/30 text-[#008A5B] font-medium truncate max-w-[190px]">
                        🛡️ {warranty.split('(')[0]}
                      </span>
                      <span className="ml-auto text-[10px] text-[#00B074] font-mono font-bold hover:underline">
                        Ver ficha ➔
                      </span>
                    </div>

                    {/* Notes Box */}
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 whitespace-pre-line leading-relaxed font-mono border border-slate-200/80">
                      {offer.notes}
                    </div>

                    {/* Actions Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        {/* Expand Button */}
                        <button
                          onClick={() => setExpandedOffer(offer)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0B192C] border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                          <span>Detalles</span>
                        </button>

                        <button
                          onClick={() => {
                            const found = users.find((u) => u.username === offer.username);
                            if (found) {
                              setActiveChatUser(found);
                              setActiveTab('chat');
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00B074] hover:bg-[#009663] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-white" />
                          <span>Negociar</span>
                        </button>

                        <button
                          onClick={() => onSaveOfferToggle(offer.id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 transition-colors cursor-pointer rounded-xl border ${
                            offer.isSaved 
                              ? 'text-[#008A5B] font-bold bg-[#E6F7F0] border-[#00B074]/30' 
                              : 'text-slate-500 hover:text-slate-800 bg-white border-slate-200'
                          }`}
                        >
                          {offer.isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-[#00B074]" /> : <Bookmark className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="hidden sm:inline">{offer.isSaved ? 'Guardado' : 'Guardar'}</span>
                        </button>
                      </div>

                      <a
                        href={`https://wa.me/${(offer.phoneWhatsApp || '+34600112233').replace('+', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[#008A5B] bg-[#E6F7F0] border border-[#00B074]/30 hover:bg-emerald-100 font-bold px-2.5 py-1.5 rounded-xl transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#00B074]" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              }))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRECIOS LIVE (RADAR SPOT FINTECH 2026)             */}
        {/* ======================================================== */}
        {activeTab === 'precios' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-[#0B192C] to-[#152e4d] text-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00B074] animate-ping" />
                  RADAR SPOT EN DIRECTO
                </span>
                <span className="text-[10px] text-slate-300 font-mono">Bolsa Global B2B</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white">Precios de Referencia Mayorista</h3>
              <p className="text-xs text-slate-300">
                Monitorea en tiempo real las variaciones de precio en las principales referencias antes de cerrar tus compras o ventas.
              </p>
            </div>

            {/* Simular Fluctuación Action Bar */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-medium">Cotizaciones actualizadas en vivo</span>
              <button
                onClick={handleSimulatePriceFluctuation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#0B192C] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#00B074]" />
                <span>Simular Fluctuación</span>
              </button>
            </div>

            {priceNotice && (
              <div className="p-3 rounded-xl bg-[#E6F7F0] border border-[#00B074]/40 text-[#008A5B] text-xs font-mono animate-fadeIn flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00B074]" />
                <span>{priceNotice}</span>
              </div>
            )}

            {/* Dynamic Price List Cards */}
            <div className="space-y-3">
              {dynamicPrices.map((item) => {
                const isPositive = item.change24hUSD >= 0;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#008A5B] bg-[#E6F7F0] px-2 py-0.5 rounded-md uppercase tracking-wider inline-block font-bold">
                          {item.brand} · {item.category}
                        </span>
                        <h4 className="text-base font-bold text-[#0B192C] mt-1">{item.model}</h4>
                        <span className="text-xs text-slate-500 font-medium">{item.specs}</span>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-lg font-black text-[#0B192C]">
                          ${item.currentPriceUSD.toLocaleString()} USD
                        </div>
                        <div className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                          isPositive ? 'text-[#00B074]' : 'text-rose-500'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {isPositive ? `+$${item.change24hUSD}` : `-$${Math.abs(item.change24hUSD)}`} ({item.change24hPct}%)
                        </div>
                      </div>
                    </div>

                    {/* High / Low Range Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>Rango 24h: ${item.low24hUSD} - ${item.high24hUSD}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.marketSentiment === 'Subiendo' 
                          ? 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30' 
                          : item.marketSentiment === 'Bajando'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.marketSentiment}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CHAT Y NEGOCIACIONES B2B (PERSISTENTE LOCALSTORAGE)*/}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="p-4 space-y-4">
            {chatStatusNotice && (
              <div className="bg-[#E6F7F0] border border-[#00B074]/40 text-[#008A5B] text-xs px-3 py-2 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074] shrink-0" />
                <span>{chatStatusNotice}</span>
              </div>
            )}

            {activeChatUser ? (
              <div className="space-y-3">
                {/* Active Chat Header */}
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
                  <button
                    onClick={() => setActiveChatUser(null)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#0B192C] hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                  >
                    ← Volver
                  </button>

                  <div
                    style={{ backgroundColor: activeChatUser.avatarBgColor || '#00B074' }}
                    className="w-8 h-8 rounded-xl text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs"
                  >
                    {activeChatUser.avatarText || activeChatUser.fullName.substring(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#0B192C] truncate">{activeChatUser.companyName}</h4>
                      <span className="w-2 h-2 rounded-full bg-[#00B074] animate-pulse" title="En línea" />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                      <span>{activeChatUser.fullName}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-mono font-medium">KYC Verificado</span>
                    </div>
                  </div>

                  {/* Actions: Clear Chat & WhatsApp */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleClearCurrentChat}
                      title="Limpiar historial de este chat"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/${activeChatUser.phoneWhatsApp.replace('+', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 text-[#008A5B] border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1"
                      title="Negociar por WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* LocalStorage Persistence & Offline Indicator Banner */}
                <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[10px] font-mono transition-colors ${
                  offlineStats.effectiveOffline 
                    ? 'bg-amber-50 border-amber-200 text-amber-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {offlineStats.effectiveOffline ? (
                      <WifiOff className="w-3 h-3 text-amber-600" />
                    ) : (
                      <Database className="w-3 h-3 text-[#00B074]" />
                    )}
                    <span>
                      {offlineStats.effectiveOffline 
                        ? 'Modo Offline: Historial disponible en localStorage' 
                        : <>Persistencia activa: <strong className="text-[#0B192C]">localStorage</strong></>}
                    </span>
                  </div>
                  <span className={offlineStats.effectiveOffline ? 'text-amber-700 font-bold flex items-center gap-1' : 'text-[#008A5B] font-semibold flex items-center gap-1'}>
                    {offlineStats.effectiveOffline ? (
                      <>⚡ Sin Conexión</>
                    ) : (
                      <><CheckCheck className="w-3 h-3" /> Auto-guardado</>
                    )}
                  </span>
                </div>

                {/* Messages Container */}
                <div className="h-72 overflow-y-auto space-y-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-inner">
                  {(!chatMessages[activeChatUser.id] || chatMessages[activeChatUser.id].length === 0) ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 text-slate-500">
                      <MessageSquare className="w-8 h-8 text-slate-400" />
                      <p className="text-xs text-slate-600 font-bold">Inicia la negociación con {activeChatUser.companyName}</p>
                      <p className="text-[10px] text-slate-400 max-w-xs">
                        Tus propuestas y mensajes se conservarán automáticamente en el dispositivo.
                      </p>
                    </div>
                  ) : (
                    chatMessages[activeChatUser.id].map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          msg.isMe 
                            ? 'bg-[#00B074] text-white rounded-tr-none shadow-xs' 
                            : 'bg-white text-[#0B192C] rounded-tl-none border border-slate-200 shadow-xs'
                        }`}>
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1 mt-1 font-mono text-[9px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          {msg.isMe && <CheckCheck className="w-3 h-3 text-[#00B074]" />}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Counterparty Typing Bubble Indicator */}
                  {isCounterpartyTyping && (
                    <div className="flex flex-col items-start animate-fade-in">
                      <div className="p-2.5 rounded-2xl text-xs bg-white text-slate-700 rounded-tl-none border border-slate-200 flex items-center gap-1.5 shadow-xs">
                        <span className="text-[11px] font-semibold text-[#0B192C]">{activeChatUser.companyName}</span>
                        <span className="flex gap-1 items-center ml-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00B074] animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00B074] animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00B074] animate-bounce [animation-delay:0.4s]" />
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">Escribiendo cotización...</span>
                    </div>
                  )}

                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Quick Proposal Chips */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between font-semibold">
                    <span>⚡ Contraofertas Rápidas:</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    {quickNegotiationChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0B192C] rounded-xl border border-slate-200 text-[10px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Bar with Enter-to-Send */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Escribe tu contraoferta o pregunta comercial..."
                    className="flex-1 px-3 py-2.5 bg-white border border-slate-200 focus:border-[#00B074] rounded-xl text-xs text-[#0B192C] placeholder:text-slate-400 focus:outline-none transition-colors shadow-2xs"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!chatInputText.trim()}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      chatInputText.trim() 
                        ? 'bg-[#00B074] hover:bg-[#009663] text-white shadow-xs' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Negotiation Channels Header */}
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-base font-bold text-[#0B192C] flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#00B074]" />
                      <span>Canales de Negociación B2B</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Conversaciones sincronizadas y persistentes en el dispositivo
                    </p>
                  </div>

                  <button
                    onClick={handleResetToDemoChat}
                    title="Restaurar mensajes predeterminados de prueba"
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3 text-[#00B074]" />
                    <span>Reset Demo</span>
                  </button>
                </div>

                {/* Storage Info Banner */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#00B074]" />
                    <span className="text-[11px] text-slate-600">
                      Estado de almacenamiento: <strong className="text-[#008A5B] font-mono font-bold">Activo</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {Object.values(chatMessages).reduce((acc, m) => acc + m.length, 0)} msgs guardados
                  </span>
                </div>

                {/* Counterparties list */}
                <div className="space-y-2">
                  {users.filter(u => u.id !== currentUser.id).map((u) => {
                    const thread = chatMessages[u.id] || [];
                    const lastMsg = thread[thread.length - 1];

                    return (
                      <div
                        key={u.id}
                        onClick={() => setActiveChatUser(u)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#00B074] cursor-pointer transition-all shadow-xs hover:shadow-md group"
                      >
                        <div
                          style={{ backgroundColor: u.avatarBgColor || '#00B074' }}
                          className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs relative"
                        >
                          {u.avatarText || u.fullName.substring(0, 2)}
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00B074] border-2 border-white absolute -bottom-0.5 -right-0.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-[#0B192C] truncate group-hover:text-[#00B074] transition-colors">
                              {u.companyName}
                            </span>
                            {lastMsg && (
                              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                {lastMsg.timestamp}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <span>{u.fullName}</span>
                            <span>·</span>
                            <span>{u.countryFlag} {u.country}</span>
                          </div>

                          {/* Last message preview */}
                          <div className="text-[11px] truncate mt-1">
                            {lastMsg ? (
                              <span className={lastMsg.isMe ? 'text-[#008A5B] font-medium' : 'text-slate-600'}>
                                {lastMsg.isMe ? 'Tú: ' : ''}{lastMsg.text}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Sin mensajes previos · Toca para negociar</span>
                            )}
                          </div>
                        </div>

                        {/* Thread message count pill */}
                        <div className="flex items-center gap-1 shrink-0">
                          {thread.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E6F7F0] border border-[#00B074]/30 text-[#008A5B] font-mono text-[10px] font-bold">
                              {thread.length}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00B074] transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: PERFORMANCE & AHORRO ARBITRAJE (30 DÍAS)             */}
        {/* ======================================================== */}
        {activeTab === 'performance' && (
          <PerformanceDashboard 
            currentUser={currentUser}
            livePrices={livePrices}
            onOpenFeed={() => setActiveTab('feed')}
          />
        )}

        {/* ======================================================== */}
        {/* TAB 5: CARTERA Y MENÚ EMPRESARIAL (ONLY VENDORS & CUSTOMERS) */}
        {/* ======================================================== */}
        {activeTab === 'menu' && (
          <div className="p-4 space-y-4">
            {/* User Business Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div 
                  style={{ backgroundColor: currentUser.avatarBgColor || '#00B074' }}
                  className="w-13 h-13 rounded-2xl text-white font-black flex items-center justify-center text-base shadow-sm shrink-0"
                >
                  {currentUser.avatarText || 'VQ'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-bold text-[#0B192C]">{currentUser.companyName}</h4>
                    <CheckCircle2 className="w-4 h-4 text-[#00B074]" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentUser.fullName} · {currentUser.countryFlag} {currentUser.country}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      activeRole === 'vendor'
                        ? 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {activeRole === 'vendor' ? 'PROVEEDOR (VENDOR)' : 'COMPRADOR (CUSTOMER)'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">KYC Verificado</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfileUser(currentUser)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0B192C] border border-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Ver Ficha
              </button>
            </div>

            {/* Quick Role Switcher Banner */}
            <div className="p-3.5 bg-gradient-to-r from-slate-50 to-emerald-50/40 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  activeRole === 'vendor' ? 'bg-[#00B074] text-white' : 'bg-blue-600 text-white'
                }`}>
                  {activeRole === 'vendor' ? <Store className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0B192C] block">
                    Modo actual: {activeRole === 'vendor' ? 'Proveedor (Vendor)' : 'Comprador (Customer)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {activeRole === 'vendor' 
                      ? 'Puedes publicar lotes y recibir pedidos de compradores.'
                      : 'Puedes explorar catálogos, cotizar y chatear con vendedores.'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleActiveRole}
                className="px-3 py-1.5 bg-[#0B192C] hover:bg-[#1a2f4c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
              >
                Alternar
              </button>
            </div>

            {/* Business Specs Card (Role Specific) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
              <h5 className="text-xs font-bold text-[#0B192C] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Building2 className="w-4 h-4 text-[#00B074]" />
                <span>Datos Operativos B2B</span>
              </h5>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Identificación Fiscal:</span>
                  <span className="font-mono font-semibold text-[#0B192C]">{currentUser.taxId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Sede / Ciudad:</span>
                  <span className="font-semibold text-[#0B192C]">{currentUser.city || 'Miami, FL'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">WhatsApp Directo:</span>
                  <span className="font-mono text-emerald-700 font-bold">{currentUser.phoneWhatsApp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    {activeRole === 'vendor' ? 'Capacidad Mensual:' : 'Presupuesto Compra:'}
                  </span>
                  <span className="font-mono font-bold text-[#00B074]">
                    {activeRole === 'vendor' 
                      ? (currentUser.vendorSupplyCapacity || '>$500,000 USD')
                      : (currentUser.customerMonthlyBudget || '$50,000 - $200,000 USD')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div 
                onClick={() => setActiveTab('feed')}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 cursor-pointer hover:border-[#00B074] transition-all shadow-xs"
              >
                <Bookmark className="w-4 h-4 text-[#00B074] mb-1.5" />
                <h5 className="text-[11px] font-bold text-[#0B192C]">Guardados</h5>
                <span className="text-[10px] text-slate-500 font-mono font-medium">{savedOffers.length} lotes</span>
              </div>

              <div 
                onClick={() => setShowPrivacyModal(true)}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 cursor-pointer hover:border-[#00B074] transition-all shadow-xs"
              >
                <Lock className="w-4 h-4 text-emerald-600 mb-1.5" />
                <h5 className="text-[11px] font-bold text-[#0B192C]">Privacidad</h5>
                <span className="text-[10px] text-slate-500 font-mono">Protegida</span>
              </div>

              <div 
                onClick={() => setShowQrModal(true)}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 cursor-pointer hover:border-[#00B074] transition-all shadow-xs"
              >
                <QrCode className="w-4 h-4 text-slate-700 mb-1.5" />
                <h5 className="text-[11px] font-bold text-[#0B192C]">Compartir</h5>
                <span className="text-[10px] text-slate-500 font-mono">Código QR</span>
              </div>
            </div>

            {/* SECCIÓN DE ALERTAS DE PRECIO PERSONALIZADAS */}
            <PriceAlertsSection 
              currentUser={currentUser}
              livePrices={livePrices}
            />

            {/* CENTRO DE CONECTIVIDAD & MODO OFFLINE */}
            <OfflineStatusCard
              stats={offlineStats}
              onToggleSimulatedOffline={handleToggleSimulatedOffline}
              onForceRefreshCache={handleForceRefreshCache}
            />

            {/* Navigation Actions List (Pure Customer/Vendor Options) */}
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 text-xs font-medium text-slate-700 shadow-xs">
              <button
                onClick={onOpenAuthModal}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-[#0B192C]">Registrar Empresa o Cambiar Cuenta</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-[#0B192C]">Mi Credencial Mayorista B2B (QR)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Cerrar Sesión */}
              <button
                onClick={onLogout}
                className="w-full p-3.5 flex items-center justify-between text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span className="font-bold">Cerrar Sesión ({currentUser.username})</span>
                </div>
                <span className="text-[10px] text-rose-600 font-mono bg-rose-100 px-2.5 py-0.5 rounded-full font-bold">
                  SALIR
                </span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* FLOATING ACTION BUTTON (+ PUBLICAR) - FOR VENDORS        */}
      {/* ======================================================== */}
      {activeRole === 'vendor' && (
        <button
          onClick={onOpenCreateOffer}
          className="fixed bottom-[calc(max(env(safe-area-inset-bottom,0px),24px)+66px)] right-4 z-40 bg-[#00B074] hover:bg-[#009663] active:scale-95 text-white font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs transition-all cursor-pointer border border-[#00B074]/50 shadow-[#00B074]/30"
          title="Publicar nuevo lote mayorista"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>+ Publicar Lote</span>
        </button>
      )}

      {/* ======================================================== */}
      {/* STATIC NATIVE IOS BOTTOM BAR (ALWAYS VISIBLE & PINNED)   */}
      {/* ======================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 px-2 sm:px-6 pt-2 pb-[max(env(safe-area-inset-bottom,0px),24px)] flex items-center justify-around shadow-[0_-4px_24px_rgba(11,25,44,0.06)]">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer group ${
            activeTab === 'feed' ? 'scale-105' : ''
          }`}
        >
          <div className={`px-4 py-1 rounded-full flex items-center justify-center mb-0.5 transition-colors ${
            activeTab === 'feed' 
              ? 'bg-[#E6F7F0] text-[#008A5B]' 
              : 'text-slate-400 group-hover:text-slate-600'
          }`}>
            <Boxes className="w-5 h-5" />
          </div>
          <span className={`text-[11px] tracking-tight ${
            activeTab === 'feed' 
              ? 'text-[#008A5B] font-bold' 
              : 'text-slate-500 group-hover:text-slate-700 font-medium'
          }`}>
            Mercado
          </span>
        </button>

        <button
          onClick={() => setActiveTab('precios')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer group ${
            activeTab === 'precios' ? 'scale-105' : ''
          }`}
        >
          <div className={`px-4 py-1 rounded-full flex items-center justify-center mb-0.5 transition-colors ${
            activeTab === 'precios' 
              ? 'bg-[#E6F7F0] text-[#008A5B]' 
              : 'text-slate-400 group-hover:text-slate-600'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className={`text-[11px] tracking-tight ${
            activeTab === 'precios' 
              ? 'text-[#008A5B] font-bold' 
              : 'text-slate-500 group-hover:text-slate-700 font-medium'
          }`}>
            Precios Spot
          </span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all cursor-pointer group ${
            activeTab === 'chat' ? 'scale-105' : ''
          }`}
        >
          <div className={`px-4 py-1 rounded-full flex items-center justify-center mb-0.5 transition-colors relative ${
            activeTab === 'chat' 
              ? 'bg-[#E6F7F0] text-[#008A5B]' 
              : 'text-slate-400 group-hover:text-slate-600'
          }`}>
            <MessageSquare className="w-5 h-5" />
            {Object.values(chatMessages).flat().length > 0 && (
              <span className="absolute -top-1 right-2 bg-[#00B074] text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-md">
                {Object.values(chatMessages).flat().length}
              </span>
            )}
          </div>
          <span className={`text-[11px] tracking-tight ${
            activeTab === 'chat' 
              ? 'text-[#008A5B] font-bold' 
              : 'text-slate-500 group-hover:text-slate-700 font-medium'
          }`}>
            Chat B2B
          </span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer group ${
            activeTab === 'menu' ? 'scale-105' : ''
          }`}
        >
          <div className={`px-4 py-1 rounded-full flex items-center justify-center mb-0.5 transition-colors ${
            activeTab === 'menu' 
              ? 'bg-[#E6F7F0] text-[#008A5B]' 
              : 'text-slate-400 group-hover:text-slate-600'
          }`}>
            <Building2 className="w-5 h-5" />
          </div>
          <span className={`text-[11px] tracking-tight ${
            activeTab === 'menu' 
              ? 'text-[#008A5B] font-bold' 
              : 'text-slate-500 group-hover:text-slate-700 font-medium'
          }`}>
            Mi Cuenta
          </span>
        </button>
      </nav>

      {/* ======================================================== */}
      {/* MODAL 1: PRIVACY MODAL                                   */}
      {/* ======================================================== */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 text-[#0B192C] rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between pt-1">
              <div className="max-w-[70%]">
                <h3 className="text-lg font-bold text-[#0B192C] leading-tight">
                  Configuración de Privacidad
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Decide qué datos ven las demás empresas mayoristas.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#E6F7F0] border border-[#00B074]/30 flex items-center justify-center text-[#008A5B]">
                <Lock className="w-6 h-6" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-[#0B192C] block">Ocultar número de WhatsApp</span>
                <span className="text-[11px] text-slate-500 block max-w-[200px]">
                  Solo podrán comunicarse mediante el chat interno.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHidePhoneState(!hidePhoneState)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  hidePhoneState ? 'bg-[#00B074]' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  hidePhoneState ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold text-[#0B192C] block">Ocultar ofertas archivadas</span>
                <span className="text-[11px] text-slate-500 block max-w-[200px]">
                  Tus transacciones pasadas quedarán privadas.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHideArchivedState(!hideArchivedState)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  hideArchivedState ? 'bg-[#00B074]' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  hideArchivedState ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={handleSavePrivacy}
                className="w-full py-2.5 bg-[#00B074] hover:bg-[#009663] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                Guardar Preferencias
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: USER PROFILE VIEW                               */}
      {/* ======================================================== */}
      {selectedProfileUser && (
        <div className="fixed inset-0 z-50 bg-[#F8FAFC] text-[#0B192C] flex flex-col overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10 pt-safe">
            <button
              onClick={() => setSelectedProfileUser(null)}
              className="p-1 rounded-full text-slate-600 hover:text-[#0B192C] font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              ← Volver
            </button>
            <span className="text-sm font-bold text-[#0B192C]">{selectedProfileUser.username}</span>
            <div className="flex items-center gap-2 text-slate-400">
              <Share2 className="w-4 h-4 cursor-pointer hover:text-slate-700" />
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1">
            <div className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div 
                style={{ backgroundColor: selectedProfileUser.avatarBgColor || '#00B074' }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-sm"
              >
                {selectedProfileUser.avatarText || 'AU'}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#0B192C]">{selectedProfileUser.fullName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                    selectedProfileUser.accountType === 'vendor'
                      ? 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {selectedProfileUser.accountType === 'vendor' ? 'VENDOR (Proveedor)' : 'CUSTOMER (Comprador)'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-semibold">{selectedProfileUser.companyName}</div>
                <div className="text-xs text-slate-500">{selectedProfileUser.country} · {selectedProfileUser.countryFlag} · {selectedProfileUser.city || 'Almacén Central'}</div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-mono">
                  <span>{selectedProfileUser.phoneWhatsApp}</span>
                  {selectedProfileUser.taxId && (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                      ID Fiscal: {selectedProfileUser.taxId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Role Specific Details Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-3 shadow-xs">
              <div className="font-bold text-slate-600 flex items-center justify-between text-[11px] uppercase tracking-wider border-b border-slate-100 pb-2">
                <span>Perfil Comercial Verificado</span>
                <span className="text-[#008A5B] font-mono text-[10px] bg-[#E6F7F0] px-2 py-0.5 rounded-full font-bold">KYC APROBADO</span>
              </div>

              {selectedProfileUser.accountType === 'vendor' ? (
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">Tipo de Vendedor</span>
                    <span className="text-[#0B192C] font-semibold">{selectedProfileUser.vendorType || 'Distribuidor Mayorista'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">Capacidad de Stock</span>
                    <span className="text-[#008A5B] font-semibold">{selectedProfileUser.vendorSupplyCapacity || '$50,000 - $250,000 USD'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">Pedido Mínimo (MOQ)</span>
                    <span className="text-[#0B192C] font-semibold">{selectedProfileUser.vendorMoq || '10 unidades'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">Garantía Técnica</span>
                    <span className="text-[#008A5B] font-semibold">{selectedProfileUser.vendorWarrantyTerms || '12 Meses Oficial'}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">Tipo de Negocio</span>
                    <span className="text-[#0B192C] font-semibold">{selectedProfileUser.customerBusinessType || 'Tienda Retail'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold">Presupuesto Mensual</span>
                    <span className="text-blue-700 font-semibold">{selectedProfileUser.customerMonthlyBudget || '$20K - $100K USD'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
                    <span className="text-slate-400 block text-[10px] font-bold">Métodos de Pago Preferidos</span>
                    <span className="text-[#0B192C] font-semibold">
                      {selectedProfileUser.customerPaymentMethods?.join(' · ') || 'Transferencia SWIFT / USDT'}
                    </span>
                  </div>
                </div>
              )}

              {selectedProfileUser.address && (
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center gap-1">
                  <span className="font-semibold text-slate-600">Almacén:</span>
                  <span>{selectedProfileUser.address}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 text-center py-3 bg-white border border-slate-200 rounded-2xl font-mono shadow-xs">
              <div>
                <span className="text-base font-black text-[#0B192C]">{selectedProfileUser.offersCount}</span>
                <span className="text-[10px] text-slate-500 block font-sans">Ofertas</span>
              </div>
              <div>
                <span className="text-base font-black text-[#0B192C]">{selectedProfileUser.subscribersCount}</span>
                <span className="text-[10px] text-slate-500 block font-sans">Seguidores</span>
              </div>
              <div>
                <span className="text-base font-black text-[#0B192C]">{selectedProfileUser.followingCount}</span>
                <span className="text-[10px] text-slate-500 block font-sans">Siguiendo</span>
              </div>
              <div>
                <span className="text-base font-black text-[#0B192C]">{selectedProfileUser.chatsCount}</span>
                <span className="text-[10px] text-slate-500 block font-sans">Chats</span>
              </div>
            </div>

            {/* Logout button if viewing my own profile */}
            {selectedProfileUser.id === currentUser.id && (
              <button
                onClick={() => {
                  setSelectedProfileUser(null);
                  onLogout?.();
                }}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión de {currentUser.username}</span>
              </button>
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase">Ofertas Activas de la Empresa</h4>
              {offers.filter(o => o.username === selectedProfileUser.username).map(o => (
                <div key={o.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs">
                  <div className="flex justify-between font-bold text-[#0B192C]">
                    <span>{o.title}</span>
                    <span className="text-[#008A5B] font-mono">${o.priceUSD} USD</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-sans">{o.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: QR CODE SHARE                                   */}
      {/* ======================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 text-[#0B192C] rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-[#0B192C]">Código QR de la Empresa</h4>
            <div className="w-48 h-48 bg-slate-50 rounded-2xl mx-auto p-3 flex items-center justify-center border border-slate-200">
              <QrCode className="w-40 h-40 text-[#0B192C]" />
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {currentUser.username} · {currentUser.companyName}
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0B192C] rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: NOTIFICACIONES                                  */}
      {/* ======================================================== */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 text-[#0B192C] rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-bold text-[#0B192C]">Notificaciones Comerciales</h4>
              <button onClick={() => setShowNotificationsModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-[#0B192C]">Nueva variación de precio spot</div>
                <div className="text-slate-500 mt-0.5">iPhone 16 Pro Max subió +$13.00 USD en Miami EXW.</div>
              </div>
              <div className="p-3 rounded-xl bg-[#E6F7F0] border border-[#00B074]/30">
                <div className="font-bold text-[#008A5B]">Verificación KYC aprobada</div>
                <div className="text-slate-600 mt-0.5">Tu empresa cuenta con credenciales para cerrar contratos en custodia.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: DETALLE DE LOTE MAYORISTA (EXPAND FEATURE)      */}
      {/* ======================================================== */}
      <WholesaleDetailModal
        offer={expandedOffer}
        isOpen={!!expandedOffer}
        onClose={() => setExpandedOffer(null)}
        onSaveToggle={onSaveOfferToggle}
        onStartChat={(user, initialMsg) => {
          setActiveChatUser(user);
          setActiveTab('chat');
          if (initialMsg) {
            setChatInputText(initialMsg);
          }
        }}
        users={users}
      />


    </div>
  );
};
