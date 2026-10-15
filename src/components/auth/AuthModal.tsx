import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { UserAccount } from '../../types';

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

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('@');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('+');
  const [country, setCountry] = useState('España');
  const [countryFlag, setCountryFlag] = useState('🇪🇸');
  const [companySize, setCompanySize] = useState('$10M - $25M');
  const [role, setRole] = useState<'trader' | 'admin'>('trader');

  const handleCountryChange = (c: string) => {
    setCountry(c);
    if (c === 'España') setCountryFlag('🇪🇸');
    else if (c === 'Estados Unidos') setCountryFlag('🇺🇸');
    else if (c === 'Emiratos Árabes') setCountryFlag('🇦🇪');
    else if (c === 'India') setCountryFlag('🇮🇳');
    else if (c === 'Canadá') setCountryFlag('🇨🇦');
    else if (c === 'México') setCountryFlag('🇲🇽');
    else setCountryFlag('🌐');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.startsWith('@') ? username : `@${username}`;

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: fullName || 'Comerciante Mayorista',
      companyName: companyName || 'Empresa de Distribución B2B',
      email: email || `${cleanUsername.replace('@', '')}@empresa.com`,
      phoneWhatsApp: phoneWhatsApp.length > 2 ? phoneWhatsApp : '+34600112233',
      country,
      countryFlag,
      companySize,
      verifiedStatus: 'verified', // auto verify on demo
      role,
      avatarText: companyName.substring(0, 2).toUpperCase() || 'AU',
      avatarBgColor: '#00B074',
      endorsements: ['AUROX Verified', 'WhatsApp B2B'],
      exhibitions: ["Miami '26"],
      offersCount: 0,
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
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#00B074] px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {mode === 'register' ? 'Registro de Empresa Mayorista B2B' : 'Iniciar Sesión'}
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Accede a la red global de compraventa de electrónica
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'register'
                ? 'bg-white text-[#00B074] border-b-2 border-[#00B074]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Crear Nueva Cuenta de Empresa
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'login'
                ? 'bg-white text-[#00B074] border-b-2 border-[#00B074]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cambiar de Usuario / Iniciar Sesión
          </button>
        </div>

        <div className="p-6">
          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Usuario (@handle)</label>
                  <input
                    type="text"
                    required
                    placeholder="@empresa.trader"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Razón Social de la Empresa</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Iberia Telecom Wholesale S.L."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Corporativo</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="ventas@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">WhatsApp de Empresa</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="+34 612 345 678"
                      value={phoneWhatsApp}
                      onChange={(e) => setPhoneWhatsApp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">País del Negocio</label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074] bg-white"
                  >
                    <option value="España">🇪🇸 España</option>
                    <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                    <option value="Emiratos Árabes">🇦🇪 Emiratos Árabes (Dubái)</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="Canadá">🇨🇦 Canadá</option>
                    <option value="México">🇲🇽 México</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tamaño de la Empresa</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074] bg-white"
                  >
                    <option value="$1M - $5M">$1M - $5M anuales</option>
                    <option value="$10M - $25M">$10M - $25M anuales</option>
                    <option value="$25M - $50M">$25M - $50M anuales</option>
                    <option value=">$50M">&gt; $50M volumen mayorista</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rol de Acceso</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('trader')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold ${
                      role === 'trader'
                        ? 'bg-blue-50 border-[#00B074] text-[#00B074]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Comerciante B2B (Trader)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold ${
                      role === 'admin'
                        ? 'bg-blue-50 border-[#00B074] text-[#00B074]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Administrador de Plataforma
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00B074] hover:bg-[#236da0] text-white font-bold rounded-lg transition-colors shadow-sm"
                >
                  Completar Registro y Entrar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Selecciona una de las cuentas demo registradas para probar la app como comerciante o administrador:
              </p>

              <div className="space-y-2">
                {availableUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      onLoginSuccess(u);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#00B074] hover:bg-blue-50/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: u.avatarBgColor || '#00B074' }}
                        className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm shadow-xs"
                      >
                        {u.avatarText || u.fullName.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <span>{u.fullName}</span>
                          <span className="text-xs font-normal text-slate-500">{u.username}</span>
                          {u.role === 'admin' && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {u.companyName} · {u.countryFlag} {u.country}
                        </div>
                      </div>
                    </div>

                    <button className="px-3 py-1 bg-[#00B074] text-white text-xs font-semibold rounded-lg">
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
