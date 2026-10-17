import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Store, 
  ShoppingBag, 
  Check, 
  ArrowRight,
  Zap,
  Boxes,
  CreditCard
} from 'lucide-react';
import { UserAccount, BusinessRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  availableUsers: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  availableUsers,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [selectedRole, setSelectedRole] = useState<BusinessRole>('vendor');

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('@');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('+');
  const [country, setCountry] = useState('Estados Unidos');
  const [countryFlag, setCountryFlag] = useState('🇺🇸');
  const [city, setCity] = useState('Miami, FL');
  const [address, setAddress] = useState('Logistics Free Trade Zone');
  const [companySize, setCompanySize] = useState('$10M - $25M');

  // Vendor specifics
  const [vendorType, setVendorType] = useState('Importador Mayorista Directo');
  const [vendorCategories, setVendorCategories] = useState<string[]>([
    'Smartphones Apple & Samsung',
    'MacBooks & Laptops'
  ]);
  const [vendorSupplyCapacity, setVendorSupplyCapacity] = useState('$50,000 - $250,000 USD/mes');
  const [vendorMoq, setVendorMoq] = useState('10 unidades mínimas');
  const [vendorWarrantyTerms, setVendorWarrantyTerms] = useState('12 Meses Garantía Oficial AppleCare / RMA 48h');

  // Customer specifics
  const [customerBusinessType, setCustomerBusinessType] = useState('Tienda Retail de Tecnología');
  const [customerMonthlyBudget, setCustomerMonthlyBudget] = useState('$20,000 - $100,000 USD/mes');
  const [customerPaymentMethods, setCustomerPaymentMethods] = useState<string[]>([
    'Transferencia Bancaria (SWIFT)',
    'USDT (TRC20)'
  ]);
  const [customerDeliveryPref, setCustomerDeliveryPref] = useState('Envío Aéreo Express a Almacén');

  const handleCountryChange = (c: string) => {
    setCountry(c);
    if (c === 'España') { setCountryFlag('🇪🇸'); setPhoneWhatsApp('+34 '); }
    else if (c === 'Estados Unidos') { setCountryFlag('🇺🇸'); setPhoneWhatsApp('+1 '); }
    else if (c === 'Emiratos Árabes (Dubái)') { setCountryFlag('🇦🇪'); setPhoneWhatsApp('+971 '); }
    else if (c === 'India') { setCountryFlag('🇮🇳'); setPhoneWhatsApp('+91 '); }
    else if (c === 'Canadá') { setCountryFlag('🇨🇦'); setPhoneWhatsApp('+1 '); }
    else if (c === 'México') { setCountryFlag('🇲🇽'); setPhoneWhatsApp('+52 '); }
    else if (c === 'Perú') { setCountryFlag('🇵🇪'); setPhoneWhatsApp('+51 '); }
    else if (c === 'Colombia') { setCountryFlag('🇨🇴'); setPhoneWhatsApp('+57 '); }
    else { setCountryFlag('🌐'); }
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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.startsWith('@') ? username : `@${username}`;

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: fullName || 'Comerciante Mayorista',
      companyName: companyName || 'Empresa de Distribución B2B',
      taxId: taxId || 'RUC-20601982731',
      email: email || `${cleanUsername.replace('@', '')}@empresa.com`,
      phoneWhatsApp: phoneWhatsApp.length > 2 ? phoneWhatsApp : '+13054508900',
      country,
      countryFlag,
      city,
      address,
      companySize,
      verifiedStatus: 'verified',
      role: selectedRole,
      accountType: selectedRole,
      vendorType: selectedRole === 'vendor' ? vendorType : undefined,
      vendorCategories: selectedRole === 'vendor' ? vendorCategories : undefined,
      vendorSupplyCapacity: selectedRole === 'vendor' ? vendorSupplyCapacity : undefined,
      vendorMoq: selectedRole === 'vendor' ? vendorMoq : undefined,
      vendorWarrantyTerms: selectedRole === 'vendor' ? vendorWarrantyTerms : undefined,
      customerBusinessType: selectedRole === 'customer' ? customerBusinessType : undefined,
      customerMonthlyBudget: selectedRole === 'customer' ? customerMonthlyBudget : undefined,
      customerPaymentMethods: selectedRole === 'customer' ? customerPaymentMethods : undefined,
      customerDeliveryPref: selectedRole === 'customer' ? customerDeliveryPref : undefined,
      avatarText: companyName.substring(0, 2).toUpperCase() || (selectedRole === 'vendor' ? 'VD' : 'CS'),
      avatarBgColor: selectedRole === 'vendor' ? '#00B074' : '#0284c7',
      endorsements: ['Vorteq Verified B2B', 'WhatsApp B2B'],
      exhibitions: ["Miami '26"],
      offersCount: selectedRole === 'vendor' ? 1 : 0,
      subscribersCount: 0,
      followingCount: 0,
      chatsCount: 0,
      hidePhone: false,
      hideArchived: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white text-[#0B192C] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00B074] to-[#0B192C] px-6 py-4 text-white flex items-center justify-between sticky top-0 z-10">
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>{mode === 'register' ? 'Registro Mayorista Vorteq B2B' : 'Iniciar Sesión / Cambiar Cuenta'}</span>
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Accede a la red global de compraventa mayorista de electrónica
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#008A5B] border-b-2 border-[#00B074] font-bold shadow-xs'
                : 'text-slate-500 hover:text-[#0B192C]'
            }`}
          >
            Registrar Nueva Cuenta (VENDOR / CUSTOMER)
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#008A5B] border-b-2 border-[#00B074] font-bold shadow-xs'
                : 'text-slate-500 hover:text-[#0B192C]'
            }`}
          >
            Iniciar Sesión / Cuentas Demo
          </button>
        </div>

        <div className="p-6">
          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {/* Selector VENDOR vs CUSTOMER */}
              <div>
                <label className="block text-slate-700 font-bold mb-2 uppercase tracking-wider text-[11px]">
                  Paso 1: Tipo de Perfil B2B
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedRole('vendor')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'vendor'
                        ? 'bg-[#E6F7F0] border-[#00B074] text-[#0B192C] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Store className="w-4 h-4 text-[#008A5B]" />
                      {selectedRole === 'vendor' && <Check className="w-3.5 h-3.5 text-[#008A5B]" />}
                    </div>
                    <div className="font-bold text-[#0B192C] text-xs">VENDOR</div>
                    <div className="text-[10px] text-slate-500">Proveedor / Venta de Lotes</div>
                  </div>

                  <div
                    onClick={() => setSelectedRole('customer')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedRole === 'customer'
                        ? 'bg-blue-50 border-blue-600 text-[#0B192C] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      {selectedRole === 'customer' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="font-bold text-[#0B192C] text-xs">CUSTOMER</div>
                    <div className="text-[10px] text-slate-500">Comprador / Retail & Mayorista</div>
                  </div>
                </div>
              </div>

              {/* Paso 2: Datos Generales */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Carlos Mendoza"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Usuario (@handle)</label>
                    <input
                      type="text"
                      required
                      placeholder="@empresa.trader"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Razón Social / Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Iberia Telecom S.L."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">RUC / Tax ID / NIF</label>
                    <input
                      type="text"
                      required
                      placeholder="20601982731"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Email Corporativo</label>
                    <input
                      type="email"
                      required
                      placeholder="ventas@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">WhatsApp Comercial</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 305 450 8900"
                      value={phoneWhatsApp}
                      onChange={(e) => setPhoneWhatsApp(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">País</label>
                    <select
                      value={country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    >
                      <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                      <option value="Emiratos Árabes (Dubái)">🇦🇪 Emiratos Árabes (Dubái)</option>
                      <option value="España">🇪🇸 España</option>
                      <option value="México">🇲🇽 México</option>
                      <option value="Perú">🇵🇪 Perú</option>
                      <option value="Colombia">🇨🇴 Colombia</option>
                      <option value="Canadá">🇨🇦 Canadá</option>
                      <option value="India">🇮🇳 India</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Ciudad / Almacén</label>
                    <input
                      type="text"
                      placeholder="Miami, FL"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#0B192C] focus:bg-white focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>
              </div>

              {/* Paso 3: Campos según rol */}
              {selectedRole === 'vendor' ? (
                <div className="space-y-3 pt-2 bg-[#E6F7F0]/40 p-3.5 rounded-2xl border border-[#00B074]/30">
                  <div className="font-bold text-[#008A5B] text-xs flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    <span>Datos del Proveedor (Vendor):</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Tipo de Vendedor</label>
                      <select
                        value={vendorType}
                        onChange={(e) => setVendorType(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[#0B192C] focus:outline-none focus:border-[#00B074]"
                      >
                        <option value="Distribuidor Oficial de Marca">Distribuidor Oficial de Marca</option>
                        <option value="Importador Mayorista Directo">Importador Mayorista Directo</option>
                        <option value="Broker B2B Internacional">Broker B2B Internacional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Capacidad Mensual</label>
                      <select
                        value={vendorSupplyCapacity}
                        onChange={(e) => setVendorSupplyCapacity(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[#0B192C] focus:outline-none focus:border-[#00B074]"
                      >
                        <option value="$10,000 - $50,000 USD/mes">$10K - $50K USD</option>
                        <option value="$50,000 - $250,000 USD/mes">$50K - $250K USD</option>
                        <option value=">$1,000,000 USD/mes">&gt;$1M USD</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Garantía Ofrecida</label>
                    <input
                      type="text"
                      value={vendorWarrantyTerms}
                      onChange={(e) => setVendorWarrantyTerms(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[#0B192C] focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 bg-blue-50/40 p-3.5 rounded-2xl border border-blue-200">
                  <div className="font-bold text-blue-700 text-xs flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Datos del Comprador (Customer):</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Tipo de Negocio</label>
                      <select
                        value={customerBusinessType}
                        onChange={(e) => setCustomerBusinessType(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[#0B192C] focus:outline-none focus:border-blue-600"
                      >
                        <option value="Tienda Retail de Tecnología">Tienda Retail</option>
                        <option value="Cadena de Tiendas Físicas">Cadena de Tiendas</option>
                        <option value="E-commerce / Tienda Online">E-commerce</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Presupuesto Mensual</label>
                      <select
                        value={customerMonthlyBudget}
                        onChange={(e) => setCustomerMonthlyBudget(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[#0B192C] focus:outline-none focus:border-blue-600"
                      >
                        <option value="$5,000 - $20,000 USD/mes">$5K - $20K USD</option>
                        <option value="$20,000 - $100,000 USD/mes">$20K - $100K USD</option>
                        <option value=">$100,000 USD/mes">&gt;$100K USD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer ${
                    selectedRole === 'vendor' ? 'bg-[#00B074] hover:bg-[#009663] shadow-[#00B074]/25' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
                  }`}
                >
                  Completar Registro y Entrar como {selectedRole === 'vendor' ? 'VENDOR (Proveedor)' : 'CUSTOMER (Comprador)'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Selecciona una de las cuentas registradas para probar la app como VENDOR (Proveedor) o CUSTOMER (Comprador):
              </p>

              <div className="space-y-2">
                {availableUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onLoginSuccess(u);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:border-[#00B074] hover:bg-emerald-50/40 cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: u.avatarBgColor || '#00B074' }}
                        className="w-10 h-10 rounded-2xl text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0"
                      >
                        {u.avatarText || u.fullName.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0B192C] text-xs sm:text-sm flex items-center gap-1.5 group-hover:text-[#008A5B] transition-colors">
                          <span>{u.fullName}</span>
                          <span className="text-[11px] font-normal text-slate-400">{u.username}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                            u.accountType === 'vendor' ? 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {u.accountType === 'vendor' ? 'VENDOR' : 'CUSTOMER'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {u.companyName} · {u.countryFlag} {u.country}
                        </div>
                      </div>
                    </div>

                    <button className="px-3.5 py-1.5 bg-[#00B074] hover:bg-[#009663] text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-2xs">
                      Entrar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
