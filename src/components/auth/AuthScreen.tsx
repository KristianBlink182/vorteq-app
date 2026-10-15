import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  Store, 
  ShoppingBag, 
  Boxes, 
  Truck, 
  MapPin, 
  CreditCard, 
  Layers, 
  Globe, 
  Sparkles, 
  Check, 
  ChevronRight,
  ArrowRight,
  Zap,
  Smartphone,
  Laptop
} from 'lucide-react';
import { UserAccount, BusinessRole } from '../../types';
import { VorteqLogo } from '../common/VorteqLogo';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  availableUsers: UserAccount[];
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  availableUsers,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmailOrUser, setLoginEmailOrUser] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration step & role
  const [selectedRole, setSelectedRole] = useState<BusinessRole>('vendor');

  // General profile fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('@');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('+');
  const [country, setCountry] = useState('Estados Unidos');
  const [countryFlag, setCountryFlag] = useState('🇺🇸');
  const [city, setCity] = useState('Miami, FL');
  const [address, setAddress] = useState('8400 NW 36th St, Logistics Free Zone');
  const [companySize, setCompanySize] = useState('$10M - $25M');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // VENDOR specific fields
  const [vendorType, setVendorType] = useState('Importador Mayorista Directo');
  const [vendorCategories, setVendorCategories] = useState<string[]>([
    'Smartphones Apple & Samsung',
    'MacBooks & Laptops'
  ]);
  const [vendorSupplyCapacity, setVendorSupplyCapacity] = useState('$50,000 - $250,000 USD/mes');
  const [vendorMoq, setVendorMoq] = useState('10 unidades mínimas');
  const [vendorWarrantyTerms, setVendorWarrantyTerms] = useState('12 Meses Garantía Oficial AppleCare / RMA 48h');

  // CUSTOMER specific fields
  const [customerBusinessType, setCustomerBusinessType] = useState('Tienda Retail de Tecnología');
  const [customerMonthlyBudget, setCustomerMonthlyBudget] = useState('$20,000 - $100,000 USD/mes');
  const [customerPaymentMethods, setCustomerPaymentMethods] = useState<string[]>([
    'Transferencia Bancaria (SWIFT)',
    'USDT (TRC20)'
  ]);
  const [customerDeliveryPref, setCustomerDeliveryPref] = useState('Envío Aéreo Express a Almacén');

  const countriesList = [
    { name: 'Estados Unidos', flag: '🇺🇸', code: '+1' },
    { name: 'Emiratos Árabes (Dubái)', flag: '🇦🇪', code: '+971' },
    { name: 'España', flag: '🇪🇸', code: '+34' },
    { name: 'México', flag: '🇲🇽', code: '+52' },
    { name: 'Perú', flag: '🇵🇪', code: '+51' },
    { name: 'Colombia', flag: '🇨🇴', code: '+57' },
    { name: 'Chile', flag: '🇨🇱', code: '+56' },
    { name: 'Canadá', flag: '🇨🇦', code: '+1' },
    { name: 'India', flag: '🇮🇳', code: '+91' },
    { name: 'China (Hong Kong)', flag: '🇭🇰', code: '+852' },
  ];

  const handleCountrySelect = (cName: string) => {
    const item = countriesList.find((c) => c.name === cName);
    if (item) {
      setCountry(item.name);
      setCountryFlag(item.flag);
      if (!phoneWhatsApp || phoneWhatsApp === '+' || phoneWhatsApp.length < 4) {
        setPhoneWhatsApp(item.code + ' ');
      }
    }
  };

  const toggleVendorCategory = (cat: string) => {
    if (vendorCategories.includes(cat)) {
      if (vendorCategories.length > 1) {
        setVendorCategories(vendorCategories.filter((c) => c !== cat));
      }
    } else {
      setVendorCategories([...vendorCategories, cat]);
    }
  };

  const toggleCustomerPayment = (method: string) => {
    if (customerPaymentMethods.includes(method)) {
      if (customerPaymentMethods.length > 1) {
        setCustomerPaymentMethods(customerPaymentMethods.filter((m) => m !== method));
      }
    } else {
      setCustomerPaymentMethods([...customerPaymentMethods, method]);
    }
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const term = loginEmailOrUser.trim().toLowerCase();
    if (!term) {
      setLoginError('Por favor ingresa tu correo corporativo o usuario.');
      return;
    }

    // Find matched user
    const found = availableUsers.find(
      (u) =>
        u.email.toLowerCase() === term ||
        u.username.toLowerCase() === term ||
        u.username.toLowerCase() === `@${term.replace('@', '')}`
    );

    if (found) {
      onLoginSuccess(found);
    } else {
      // Auto-create or login with entered credentials for frictionless testing
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        username: term.startsWith('@') ? term : `@${term}`,
        fullName: term.includes('@') ? term.split('@')[0] : term,
        companyName: 'Vorteq Global Trading Partner',
        email: term.includes('@') ? term : `${term}@vorteq.trade`,
        phoneWhatsApp: '+1 305 900 1234',
        country: 'Estados Unidos',
        countryFlag: '🇺🇸',
        companySize: '$10M - $25M',
        verifiedStatus: 'verified',
        role: 'trader',
        accountType: 'vendor',
        taxId: 'US-FL-902148',
        city: 'Miami, FL',
        address: 'Free Trade Logistics Hub',
        vendorType: 'Importador Mayorista Directo',
        vendorCategories: ['Smartphones Apple & Samsung'],
        vendorSupplyCapacity: '$50,000 - $250,000 USD/mes',
        vendorMoq: '10 unidades',
        vendorWarrantyTerms: '12 Meses Garantía Oficial',
        avatarText: term.substring(0, 2).toUpperCase(),
        avatarBgColor: '#00B074',
        endorsements: ['Vorteq Verified', 'Escrow B2B'],
        exhibitions: ["Miami '26"],
        offersCount: 1,
        subscribersCount: 2,
        followingCount: 1,
        chatsCount: 3,
        hidePhone: false,
        hideArchived: false,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      onLoginSuccess(newUser);
    }
  };

  // Registration handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().startsWith('@')
      ? username.trim()
      : `@${username.trim() || 'trader'}`;

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: fullName.trim() || 'Operador Mayorista',
      companyName: companyName.trim() || 'Compañía de Distribución Tecnológica',
      taxId: taxId.trim() || 'RUC-20609814290',
      email: email.trim() || `${cleanUsername.replace('@', '')}@empresa.com`,
      phoneWhatsApp: phoneWhatsApp.trim().length > 3 ? phoneWhatsApp.trim() : '+1 305 450 8900',
      country,
      countryFlag,
      city: city.trim() || 'Miami, FL',
      address: address.trim() || 'Parque Industrial Tecnológico',
      companySize,
      verifiedStatus: 'verified',
      role: 'trader',
      accountType: selectedRole,
      password: password || 'Vorteq2026!',
      // Vendor fields
      vendorType: selectedRole === 'vendor' ? vendorType : undefined,
      vendorCategories: selectedRole === 'vendor' ? vendorCategories : undefined,
      vendorSupplyCapacity: selectedRole === 'vendor' ? vendorSupplyCapacity : undefined,
      vendorMoq: selectedRole === 'vendor' ? vendorMoq : undefined,
      vendorWarrantyTerms: selectedRole === 'vendor' ? vendorWarrantyTerms : undefined,
      // Customer fields
      customerBusinessType: selectedRole === 'customer' ? customerBusinessType : undefined,
      customerMonthlyBudget: selectedRole === 'customer' ? customerMonthlyBudget : undefined,
      customerPaymentMethods: selectedRole === 'customer' ? customerPaymentMethods : undefined,
      customerDeliveryPref: selectedRole === 'customer' ? customerDeliveryPref : undefined,
      avatarText: companyName.substring(0, 2).toUpperCase() || (selectedRole === 'vendor' ? 'VD' : 'CS'),
      avatarBgColor: selectedRole === 'vendor' ? '#00B074' : '#0284c7',
      endorsements: ['Vorteq Verified B2B', 'Escrow Custody Certified'],
      exhibitions: ["Miami '26", "Hong Kong '26"],
      offersCount: selectedRole === 'vendor' ? 1 : 0,
      subscribersCount: 0,
      followingCount: 0,
      chatsCount: 0,
      hidePhone: false,
      hideArchived: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onLoginSuccess(newUser);
  };

  // Find demo users
  const demoVendor = availableUsers.find((u) => u.accountType === 'vendor' || u.id === 'user-vedant') || availableUsers[0];
  const demoCustomer = availableUsers.find((u) => u.accountType === 'customer' || u.id === 'user-it-squad') || availableUsers[1] || availableUsers[0];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col justify-center items-center py-8 px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00B074]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#0B192C]/80 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#0284c7]/15 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(#00B074 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0B192C]/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
        {/* Top Header with Vorteq Brand Lockup */}
        <div className="p-6 sm:p-8 border-b border-slate-800 text-center relative bg-gradient-to-b from-[#0e2238] to-[#0B192C]">
          <div className="flex justify-center mb-3">
            <VorteqLogo size="lg" variant="full" theme="dark" animated={true} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Plataforma Mayorista Global de Electrónica
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Acceso interconectado en tiempo real para Proveedores (Vendors) y Compradores (Customers).
          </p>

          {/* Interconnection badge */}
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-[#00B074]/10 border border-[#00B074]/30 rounded-full text-[11px] font-mono text-[#00B074]">
            <span className="w-2 h-2 rounded-full bg-[#00B074] animate-ping" />
            <span>SISTEMA INTERCONECTADO · APP MÓVIL & WEB B2B</span>
          </div>

          {/* Mode Tabs: Iniciar Sesión vs Registrarse */}
          <div className="flex bg-[#07111e] p-1.5 rounded-2xl border border-slate-800 mt-6 max-w-md mx-auto shadow-inner">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-[#00B074] text-white shadow-md shadow-[#00B074]/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-[#00B074] text-white shadow-md shadow-[#00B074]/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Registrarse</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* ======================================================== */}
          {/* 1. MODO: INICIAR SESIÓN (LOGIN)                         */}
          {/* ======================================================== */}
          {mode === 'login' ? (
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo Corporativo o Usuario (@handle)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ejemplo@empresa.com o @emaavy.vedant"
                      value={loginEmailOrUser}
                      onChange={(e) => setLoginEmailOrUser(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#07111e] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#07111e] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00B074] hover:bg-[#009663] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#00B074]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Ingresar a Vorteq B2B</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Fast 1-Click Demo Accounts */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 tracking-wider">
                    ACCESO RÁPIDO PARA PRUEBAS (1-CLICK DEMO):
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                    INSTANTÁNEO
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Demo Vendor Button */}
                  <button
                    type="button"
                    onClick={() => onLoginSuccess(demoVendor)}
                    className="p-3.5 bg-[#07111e] hover:bg-[#0e2137] border border-[#00B074]/40 hover:border-[#00B074] rounded-2xl text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#00B074]/20 text-[#00B074] font-extrabold text-[10px] font-mono flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        <span>VENDOR</span>
                      </span>
                      <span className="text-xs text-slate-400">{demoVendor.countryFlag}</span>
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm group-hover:text-[#00B074] transition-colors">
                      {demoVendor.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {demoVendor.companyName}
                    </div>
                    <div className="text-[10px] text-emerald-400/80 font-mono mt-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Probar como Proveedor Mayorista</span>
                    </div>
                  </button>

                  {/* Demo Customer Button */}
                  <button
                    type="button"
                    onClick={() => onLoginSuccess(demoCustomer)}
                    className="p-3.5 bg-[#07111e] hover:bg-[#0e2137] border border-cyan-500/40 hover:border-cyan-400 rounded-2xl text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-[10px] font-mono flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        <span>CUSTOMER</span>
                      </span>
                      <span className="text-xs text-slate-400">{demoCustomer.countryFlag}</span>
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm group-hover:text-cyan-400 transition-colors">
                      {demoCustomer.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {demoCustomer.companyName}
                    </div>
                    <div className="text-[10px] text-cyan-400/80 font-mono mt-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Probar como Comprador / Cliente</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* 2. MODO: REGISTRARSE (VENDOR O CUSTOMER)                */
            /* ======================================================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* PASO 1: SELECCIÓN OBLIGATORIA ENTRE VENDOR O CUSTOMER */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Selecciona tu Tipo de Cuenta Mayorista:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Rol VENDOR */}
                  <div
                    onClick={() => setSelectedRole('vendor')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'vendor'
                        ? 'bg-[#00B074]/10 border-[#00B074] shadow-lg shadow-[#00B074]/20'
                        : 'bg-[#07111e] border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-[#00B074]/20 border border-[#00B074]/40 flex items-center justify-center text-[#00B074]">
                        <Store className="w-5 h-5" />
                      </div>
                      {selectedRole === 'vendor' ? (
                        <span className="w-5 h-5 rounded-full bg-[#00B074] text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <div className="font-black text-white text-sm sm:text-base">
                      VENDOR (Proveedor)
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      Vendo lotes al por mayor, smartphones, laptops o componentes. Publico inventario y gestiono stock.
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-[#00B074] font-mono font-semibold">
                      <Boxes className="w-3 h-3" />
                      <span>Publicar ofertas · Escrow Seller</span>
                    </div>
                  </div>

                  {/* Rol CUSTOMER */}
                  <div
                    onClick={() => setSelectedRole('customer')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'customer'
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-[#07111e] border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      {selectedRole === 'customer' ? (
                        <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <div className="font-black text-white text-sm sm:text-base">
                      CUSTOMER (Cliente)
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      Compro lotes de tecnología para retail, e-commerce, tiendas o distribución regional.
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono font-semibold">
                      <CreditCard className="w-3 h-3" />
                      <span>Comprar lotes · Precios mayoristas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PASO 2: DATOS GENERALES DEL PERFIL */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Datos de Perfil y Empresa:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Nombre Completo del Contacto</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Mendoza"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Usuario (@handle)</label>
                    <input
                      type="text"
                      required
                      placeholder="@empresa.trader"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Razón Social / Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Iberia Telecom Wholesale S.L."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">RUC / Tax ID / NIF Fiscal</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 20601982731 o US-EIN-9842"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Email Corporativo</label>
                    <input
                      type="email"
                      required
                      placeholder="contacto@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">WhatsApp / Móvil Comercial</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 305 450 8900"
                      value={phoneWhatsApp}
                      onChange={(e) => setPhoneWhatsApp(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">País</label>
                    <select
                      value={country}
                      onChange={(e) => handleCountrySelect(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#00B074]"
                    >
                      {countriesList.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ciudad</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Miami, FL"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Contraseña</label>
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>
              </div>

              {/* PASO 3: CAMPOS ESPECÍFICOS SEGÚN VENDOR O CUSTOMER */}
              {selectedRole === 'vendor' ? (
                <div className="space-y-3 pt-2 border-t border-slate-800 bg-[#00B074]/5 p-4 rounded-2xl border border-[#00B074]/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00B074] uppercase tracking-wider">
                    <Store className="w-4 h-4" />
                    <span>3. Información Específica del VENDOR (Proveedor):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Tipo de Vendedor</label>
                      <select
                        value={vendorType}
                        onChange={(e) => setVendorType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#00B074]"
                      >
                        <option value="Distribuidor Oficial de Marca">Distribuidor Oficial de Marca</option>
                        <option value="Importador Mayorista Directo">Importador Mayorista Directo</option>
                        <option value="Broker B2B Internacional">Broker B2B Internacional</option>
                        <option value="Fabricante / Ensamblador OEM">Fabricante / Ensamblador OEM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Capacidad Mensual de Stock</label>
                      <select
                        value={vendorSupplyCapacity}
                        onChange={(e) => setVendorSupplyCapacity(e.target.value)}
                        className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#00B074]"
                      >
                        <option value="$10,000 - $50,000 USD/mes">$10,000 - $50,000 USD/mes</option>
                        <option value="$50,000 - $250,000 USD/mes">$50,000 - $250,000 USD/mes</option>
                        <option value="$250,000 - $1,000,000 USD/mes">$250,000 - $1,000,000 USD/mes</option>
                        <option value=">$1,000,000 USD/mes">&gt;$1,000,000 USD/mes (Gran Mayorista)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Categorías de Inventario que Provees:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Smartphones Apple & Samsung',
                        'MacBooks & Laptops',
                        'Tablets & iPads',
                        'Componentes & CPUs',
                        'Audio & Wearables',
                        'Accesorios Originales'
                      ].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleVendorCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            vendorCategories.includes(cat)
                              ? 'bg-[#00B074] text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {vendorCategories.includes(cat) && <Check className="w-3 h-3 inline mr-1" />}
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Pedido Mínimo (MOQ)</label>
                      <input
                        type="text"
                        value={vendorMoq}
                        onChange={(e) => setVendorMoq(e.target.value)}
                        placeholder="Ej. 10 unidades o $2,500 USD"
                        className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Garantía Ofrecida</label>
                      <input
                        type="text"
                        value={vendorWarrantyTerms}
                        onChange={(e) => setVendorWarrantyTerms(e.target.value)}
                        placeholder="Ej. 12 Meses Garantía Oficial AppleCare"
                        className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B074]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ESPECÍFICO DE CUSTOMER (CLIENTE / COMPRADOR) */
                <div className="space-y-3 pt-2 border-t border-slate-800 bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <ShoppingBag className="w-4 h-4" />
                    <span>3. Información Específica del CUSTOMER (Comprador):</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Tipo de Negocio</label>
                      <select
                        value={customerBusinessType}
                        onChange={(e) => setCustomerBusinessType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Tienda Retail de Tecnología">Tienda Retail de Tecnología</option>
                        <option value="Cadena de Tiendas Físicas">Cadena de Tiendas Físicas</option>
                        <option value="E-commerce / Tienda Online">E-commerce / Tienda Online</option>
                        <option value="Servicio Técnico & Reacondicionamiento">Servicio Técnico & Reacondicionamiento</option>
                        <option value="Empresa Corporativa / B2B Final">Empresa Corporativa / B2B Final</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Presupuesto Mensual de Compra</label>
                      <select
                        value={customerMonthlyBudget}
                        onChange={(e) => setCustomerMonthlyBudget(e.target.value)}
                        className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="$5,000 - $20,000 USD/mes">$5,000 - $20,000 USD/mes</option>
                        <option value="$20,000 - $100,000 USD/mes">$20,000 - $100,000 USD/mes</option>
                        <option value="$100,000 - $500,000 USD/mes">$100,000 - $500,000 USD/mes</option>
                        <option value=">$500,000 USD/mes">&gt;$500,000 USD/mes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Métodos de Pago Preferidos:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Transferencia Bancaria (SWIFT)',
                        'USDT (TRC20)',
                        'Carta de Crédito (LC)',
                        'Contraentrega en Almacén'
                      ].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleCustomerPayment(m)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                            customerPaymentMethods.includes(m)
                              ? 'bg-cyan-500 text-black font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {customerPaymentMethods.includes(m) && <Check className="w-3 h-3 inline mr-1" />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Preferencia Logística / Entrega</label>
                    <select
                      value={customerDeliveryPref}
                      onChange={(e) => setCustomerDeliveryPref(e.target.value)}
                      className="w-full px-3 py-2 bg-[#07111e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Envío Aéreo Express a Almacén">Envío Aéreo Express a Almacén</option>
                      <option value="Retiro Directo en Bodega del Proveedor (Ex-Works)">Retiro Directo en Bodega del Proveedor (Ex-Works)</option>
                      <option value="Flete Marítimo Consolidado (CIF/FOB)">Flete Marítimo Consolidado (CIF/FOB)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Términos y Condiciones */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#00B074] focus:ring-0"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-400 leading-snug cursor-pointer">
                  Acepto los Términos de Comercio Mayorista B2B, Verificación Antifraude y Protocolos de Custodia Escrow de Vorteq.
                </label>
              </div>

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={!acceptTerms}
                className={`w-full py-3 font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedRole === 'vendor'
                    ? 'bg-[#00B074] hover:bg-[#009663] text-white shadow-[#00B074]/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30'
                }`}
              >
                <span>
                  Completar Registro y Entrar como {selectedRole === 'vendor' ? 'VENDOR (Proveedor)' : 'CUSTOMER (Comprador)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
