import React, { useState, useEffect } from 'react';
import { MobileApp } from './components/mobile/MobileApp';
import { WebAppDashboard } from './components/web/WebAppDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { CreateOfferModal } from './components/mobile/CreateOfferModal';
import { SplashScreen } from './components/mobile/SplashScreen';
import { VorteqLogo } from './components/common/VorteqLogo';
import { 
  getDatabase, 
  saveUsers, 
  saveOffers, 
  setCurrentUser 
} from './services/mockDatabase';
import { 
  UserAccount, 
  TradeOffer, 
  ProductPriceLive, 
  FeaturedStory,
  AppViewMode 
} from './types';
import { Smartphone, Globe, ShieldCheck, UserPlus, LogIn, Check, Play } from 'lucide-react';

export default function App() {
  // 4-second Splash Screen state
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Load shared database
  const [db, setDb] = useState(() => getDatabase());
  const [currentUser, setCurrentUserState] = useState<UserAccount>(db.currentUser);
  const [users, setUsersState] = useState<UserAccount[]>(db.users);
  const [offers, setOffersState] = useState<TradeOffer[]>(db.offers);
  const [livePrices, setLivePricesState] = useState<ProductPriceLive[]>(db.prices);

  // App mode: mobile view vs Web B2B platform
  const [viewMode, setViewMode] = useState<AppViewMode>('mobile');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [bannerToast, setBannerToast] = useState<string | null>(null);

  // Sync users to storage
  const handleUsersUpdate = (newUsers: UserAccount[]) => {
    setUsersState(newUsers);
    saveUsers(newUsers);
  };

  // Sync offers to storage
  const handleOffersUpdate = (newOffers: TradeOffer[]) => {
    setOffersState(newOffers);
    saveOffers(newOffers);
  };

  // User registration / login callback
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUserState(user);
    setCurrentUser(user);

    // If new user, add to database
    if (!users.some((u) => u.id === user.id)) {
      handleUsersUpdate([user, ...users]);
    }

    setBannerToast(`¡Sesión iniciada como ${user.fullName} (${user.companyName})!`);
    setTimeout(() => setBannerToast(null), 3500);
  };

  // Admin verifies user
  const handleVerifyUser = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          verifiedStatus: u.verifiedStatus === 'verified' ? ('pending' as const) : ('verified' as const),
        };
      }
      return u;
    });
    handleUsersUpdate(updated);
  };

  // Admin toggles user role
  const handleToggleUserRole = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: u.role === 'admin' ? ('trader' as const) : ('admin' as const),
        };
      }
      return u;
    });
    handleUsersUpdate(updated);
  };

  // Admin deletes offer
  const handleDeleteOffer = (offerId: string) => {
    const updated = offers.filter((o) => o.id !== offerId);
    handleOffersUpdate(updated);
  };

  // User posts new offer
  const handleCreateOfferSubmit = (newOffer: TradeOffer) => {
    const updated = [newOffer, ...offers];
    handleOffersUpdate(updated);

    // Update user offer count
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, offersCount: u.offersCount + 1 };
      }
      return u;
    });
    handleUsersUpdate(updatedUsers);

    setBannerToast('¡Oferta publicada exitosamente en el piso en vivo!');
    setTimeout(() => setBannerToast(null), 3000);
  };

  // Toggle save offer
  const handleSaveOfferToggle = (offerId: string) => {
    const updated = offers.map((o) => {
      if (o.id === offerId) {
        return { ...o, isSaved: !o.isSaved };
      }
      return o;
    });
    handleOffersUpdate(updated);
  };

  // Toggle ignore offer
  const handleIgnoreOfferToggle = (offerId: string) => {
    const updated = offers.filter((o) => o.id !== offerId);
    handleOffersUpdate(updated);
    setBannerToast('Oferta oculta de tu feed');
    setTimeout(() => setBannerToast(null), 2500);
  };

  // Update privacy settings
  const handleUpdatePrivacy = (hidePhone: boolean, hideArchived: boolean) => {
    const updatedUser = { ...currentUser, hidePhone, hideArchived };
    setCurrentUserState(updatedUser);
    setCurrentUser(updatedUser);

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    handleUsersUpdate(updatedUsers);

    setBannerToast('Configuración de privacidad guardada correctamente');
    setTimeout(() => setBannerToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#060911] flex flex-col font-sans text-slate-100">
      {/* 4-Second Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen 
          durationSeconds={4} 
          onFinish={() => setShowSplash(false)} 
        />
      )}

      {/* Universal Top Switcher Bar (App Móvil vs App Web B2B) */}
      <div className="bg-[#0B192C] text-white px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <VorteqLogo size="sm" variant="full" theme="dark" animated={true} />
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            {viewMode === 'mobile' ? 'Mobile App Experience 2026' : 'Desktop B2B Trading Hub'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Replay Splash button */}
          <button
            onClick={() => setShowSplash(true)}
            title="Ver Splash Screen de 4 segundos"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0A192F] hover:bg-[#15253F] border border-slate-700 text-slate-300 rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 text-[#00B074]" />
            <span className="hidden sm:inline">Ver Splash (4s)</span>
          </button>

          {/* Switch Mode Button */}
          <div className="flex items-center bg-[#0A192F] p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'mobile' ? 'bg-[#00B074] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Móvil</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'web' ? 'bg-[#00B074] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>App Web</span>
            </button>
          </div>

          {/* Admin Panel Button */}
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-700/80 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          {/* User Registration / Login Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#0A192F] hover:bg-[#15253F] text-slate-200 border border-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#00B074]" />
            <span className="hidden sm:inline">Usuario / Registro</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {bannerToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#0f172a] text-cyan-300 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-cyan-800/80 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{bannerToast}</span>
        </div>
      )}

      {/* Main View Display */}
      {isAdminPanelOpen ? (
        <AdminPanel
          users={users}
          offers={offers}
          onVerifyUser={handleVerifyUser}
          onToggleUserRole={handleToggleUserRole}
          onDeleteOffer={handleDeleteOffer}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      ) : viewMode === 'mobile' ? (
        /* Mobile App View with Modern 2026 Fintech Structure */
        <div className="flex-1 py-4 sm:py-6 px-2 flex justify-center items-start">
          <MobileApp
            currentUser={currentUser}
            users={users}
            offers={offers}
            livePrices={livePrices}
            stories={db.stories}
            onOpenCreateOffer={() => setIsCreateOfferOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
            onSwitchToWebApp={() => setViewMode('web')}
            onSaveOfferToggle={handleSaveOfferToggle}
            onIgnoreOfferToggle={handleIgnoreOfferToggle}
            onUpdatePrivacy={handleUpdatePrivacy}
          />
        </div>
      ) : (
        /* Web App View (Separated Desktop Web Platform sharing exact same DB) */
        <WebAppDashboard
          currentUser={currentUser}
          users={users}
          offers={offers}
          livePrices={livePrices}
          onOpenCreateOffer={() => setIsCreateOfferOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          onSwitchToMobileApp={() => setViewMode('mobile')}
          onSaveOfferToggle={handleSaveOfferToggle}
        />
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        availableUsers={users}
      />

      <CreateOfferModal
        isOpen={isCreateOfferOpen}
        onClose={() => setIsCreateOfferOpen(false)}
        currentUser={currentUser}
        onSubmitOffer={handleCreateOfferSubmit}
      />
    </div>
  );
}
