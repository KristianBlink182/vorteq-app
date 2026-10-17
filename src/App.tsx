import React, { useState } from 'react';
import { MobileApp } from './components/mobile/MobileApp';
import { AuthModal } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
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
  ProductPriceLive 
} from './types';
import { Check } from 'lucide-react';

export default function App() {
  // 4-second Splash Screen state
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Authentication state (persisted in localStorage)
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => getIsAuthenticated());

  // Load shared database
  const [db] = useState(() => getDatabase());
  const [currentUser, setCurrentUserState] = useState<UserAccount>(db.currentUser);
  const [users, setUsersState] = useState<UserAccount[]>(db.users);
  const [offers, setOffersState] = useState<TradeOffer[]>(db.offers);
  const [livePrices] = useState<ProductPriceLive[]>(db.prices);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    setIsAuthenticated(true);
    setIsAuthenticatedState(true);
    setIsAuthModalOpen(false);

    if (!users.some((u) => u.id === user.id)) {
      handleUsersUpdate([user, ...users]);
    }

    const roleLabel = user.accountType === 'vendor' ? 'VENDOR (Proveedor)' : 'CUSTOMER (Comprador)';
    setBannerToast(`¡Bienvenido! Sesión activa como ${user.fullName} [${roleLabel}]`);
    setTimeout(() => setBannerToast(null), 3500);
  };

  // Logout callback
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAuthenticatedState(false);
    setBannerToast('Sesión finalizada. Regresando a la pantalla de acceso.');
    setTimeout(() => setBannerToast(null), 3000);
  };

  // User posts new offer
  const handleCreateOfferSubmit = (newOffer: TradeOffer) => {
    const updated = [newOffer, ...offers];
    handleOffersUpdate(updated);

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
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* 4-Second Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen 
          durationSeconds={4} 
          onFinish={() => setShowSplash(false)} 
        />
      )}

      {/* Toast Notification */}
      {bannerToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-white text-[#0B192C] text-xs font-bold px-4 py-2.5 rounded-full shadow-xl border border-slate-200 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#00B074]" />
          <span>{bannerToast}</span>
        </div>
      )}

      {/* Flow check: If Splash finished and user NOT authenticated, render AuthScreen */}
      {!showSplash && !isAuthenticated ? (
        <AuthScreen
          availableUsers={users}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        /* Authenticated Pure Native Mobile App (Vendors & Customers) */
        <div className="flex-1 w-full h-full overflow-hidden flex flex-col bg-[#F8FAFC]">
          <MobileApp
            currentUser={currentUser}
            users={users}
            offers={offers}
            livePrices={livePrices}
            stories={db.stories}
            onOpenCreateOffer={() => setIsCreateOfferOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSaveOfferToggle={handleSaveOfferToggle}
            onIgnoreOfferToggle={handleIgnoreOfferToggle}
            onUpdatePrivacy={handleUpdatePrivacy}
            onLogout={handleLogout}
          />
        </div>
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
