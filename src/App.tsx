import React, { useState } from 'react';
import { MobileApp } from './components/mobile/MobileApp';
import { WebAppDashboard } from './components/web/WebAppDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { AdminPanel } from './components/admin/AdminPanel';
import { CreateOfferModal } from './components/mobile/CreateOfferModal';
import { SplashScreen } from './components/mobile/SplashScreen';
import { 
  getDatabase, 
  saveUsers, 
  saveOffers, 
  setCurrentUser,
  getIsAuthenticated,
  setIsAuthenticated
} from './services/mockDatabase';
import { 
  UserAccount, 
  TradeOffer, 
  ProductPriceLive, 
  AppViewMode 
} from './types';
import { Check } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => getIsAuthenticated());
  const [db] = useState(() => getDatabase());
  const [currentUser, setCurrentUserState] = useState<UserAccount>(db.currentUser);
  const [users, setUsersState] = useState<UserAccount[]>(db.users);
  const [offers, setOffersState] = useState<TradeOffer[]>(db.offers);
  const [livePrices] = useState<ProductPriceLive[]>(db.prices);
  const [viewMode, setViewMode] = useState<AppViewMode>('mobile');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [bannerToast, setBannerToast] = useState<string | null>(null);

  const handleUsersUpdate = (newUsers: UserAccount[]) => {
    setUsersState(newUsers);
    saveUsers(newUsers);
  };

  const handleOffersUpdate = (newOffers: TradeOffer[]) => {
    setOffersState(newOffers);
    saveOffers(newOffers);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsAuthenticatedState(true);
    setIsAuthModalOpen(false);
    if (!users.some((u) => u.id === user.id)) {
      handleUsersUpdate([user, ...users]);
    }
    const roleLabel = user.accountType === 'vendor' ? 'VENDOR' : 'CUSTOMER';
    setBannerToast(`¡Bienvenido! Sesión activa como ${user.fullName} [${roleLabel}]`);
    setTimeout(() => setBannerToast(null), 3500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAuthenticatedState(false);
    setBannerToast('Sesión finalizada. Regresando a la pantalla de acceso.');
    setTimeout(() => setBannerToast(null), 3000);
  };

  const handleVerifyUser = (userId: string) => {
    const updated = users.map((u) => u.id === userId ? { ...u, verifiedStatus: u.verifiedStatus === 'verified' ? ('pending' as const) : ('verified' as const) } : u);
    handleUsersUpdate(updated);
  };

  const handleToggleUserRole = (userId: string) => {
    const updated = users.map((u) => u.id === userId ? { ...u, role: u.role === 'admin' ? ('trader' as const) : ('admin' as const) } : u);
    handleUsersUpdate(updated);
  };

  const handleDeleteOffer = (offerId: string) => {
    const updated = offers.filter((o) => o.id !== offerId);
    handleOffersUpdate(updated);
  };

  const handleCreateOfferSubmit = (newOffer: TradeOffer) => {
    handleOffersUpdate([newOffer, ...offers]);
    handleUsersUpdate(users.map((u) => u.id === currentUser.id ? { ...u, offersCount: u.offersCount + 1 } : u));
    setBannerToast('¡Oferta publicada exitosamente!');
    setTimeout(() => setBannerToast(null), 3000);
  };

  const handleSaveOfferToggle = (offerId: string) => {
    handleOffersUpdate(offers.map((o) => o.id === offerId ? { ...o, isSaved: !o.isSaved } : o));
  };

  const handleIgnoreOfferToggle = (offerId: string) => {
    handleOffersUpdate(offers.filter((o) => o.id !== offerId));
    setBannerToast('Oferta oculta de tu feed');
    setTimeout(() => setBannerToast(null), 2500);
  };

  const handleUpdatePrivacy = (hidePhone: boolean, hideArchived: boolean) => {
    const updatedUser = { ...currentUser, hidePhone, hideArchived };
    setCurrentUserState(updatedUser);
    setCurrentUser(updatedUser);
    handleUsersUpdate(users.map((u) => u.id === currentUser.id ? updatedUser : u));
    setBannerToast('Privacidad guardada');
    setTimeout(() => setBannerToast(null), 3000);
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#070B14] flex flex-col font-sans text-slate-100">
      {showSplash && (
        <SplashScreen 
          durationSeconds={4} 
          onFinish={() => setShowSplash(false)} 
        />
      )}

      {bannerToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#0f172a] text-cyan-300 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-cyan-800/80 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{bannerToast}</span>
        </div>
      )}

      {!showSplash && !isAuthenticated ? (
        <AuthScreen
          availableUsers={users}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <>
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
            <div className="flex-1 w-full h-full overflow-hidden flex flex-col bg-[#070B14]">
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
                onLogout={handleLogout}
              />
            </div>
          ) : (
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
              onLogout={handleLogout}
            />
          )}
        </>
      )}

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