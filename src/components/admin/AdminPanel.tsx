import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  Search, 
  Building2, 
  Check, 
  ArrowLeft,
  RefreshCw,
  Plus
} from 'lucide-react';
import { UserAccount, TradeOffer } from '../../types';

interface AdminPanelProps {
  users: UserAccount[];
  offers: TradeOffer[];
  onVerifyUser: (userId: string) => void;
  onToggleUserRole: (userId: string) => void;
  onDeleteOffer: (offerId: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  offers,
  onVerifyUser,
  onToggleUserRole,
  onDeleteOffer,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'offers' | 'analytics'>('users');
  const [searchUser, setSearchUser] = useState('');
  const [searchOffer, setSearchOffer] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredOffers = offers.filter(
    (o) =>
      o.title.toLowerCase().includes(searchOffer.toLowerCase()) ||
      o.companyName.toLowerCase().includes(searchOffer.toLowerCase()) ||
      o.stockLocation.toLowerCase().includes(searchOffer.toLowerCase())
  );

  const totalVolumeUSD = offers.reduce((acc, curr) => acc + curr.quantity * curr.priceUSD, 0);

  return (
    <div className="bg-white min-h-screen text-slate-800">
      {/* Top Admin Bar */}
      <div className="bg-[#1e293b] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-base font-bold tracking-tight">Panel de Control del Administrador</h2>
              <span className="text-[10px] bg-blue-900 text-blue-300 font-mono px-2 py-0.5 rounded font-semibold">
                ROOT ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gestión central de usuarios B2B, verificación de empresas y moderación de ofertas
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#00B074] hover:bg-[#236da0] text-white text-xs font-bold rounded-lg transition-colors"
        >
          Volver a la App
        </button>
      </div>

      {/* KPI Stats Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium">Empresas Registradas</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{users.length}</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              ✓ {users.filter(u => u.verifiedStatus === 'verified').length} Verificadas con KYC
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium">Ofertas Activas en Vivo</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{offers.length}</div>
            <span className="text-[11px] text-blue-600 font-medium mt-1 block">
              En tiempo real en Apple & Android
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium">Volumen Mayorista Listado</span>
            <div className="text-2xl font-bold text-[#2b82bd] mt-1 font-mono">
              ${(totalVolumeUSD / 1000).toLocaleString()}k USD
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Stock físico verificado
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-medium">Estado de la Red</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <CheckCircle className="w-6 h-6" /> 100% Operativo
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              0 reportes de disputa
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-[#2b82bd] text-[#2b82bd]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Empresas y Usuarios ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'offers'
                ? 'border-[#2b82bd] text-[#2b82bd]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Moderación de Ofertas ({offers.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, empresa o @usuario..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Empresa / Contacto</th>
                    <th className="py-3 px-4">Ubicación</th>
                    <th className="py-3 px-4">Tamaño</th>
                    <th className="py-3 px-4">WhatsApp</th>
                    <th className="py-3 px-4">Rol</th>
                    <th className="py-3 px-4 text-center">Estado KYC</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: u.avatarBgColor || '#00B074' }}
                            className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shrink-0"
                          >
                            {u.avatarText || u.fullName.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{u.companyName}</div>
                            <div className="text-[11px] text-slate-500">
                              {u.fullName} · <span className="font-mono">{u.username}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span>{u.countryFlag} {u.country}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono">
                        {u.companySize}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600">
                        {u.phoneWhatsApp}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.verifiedStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {u.verifiedStatus === 'verified' ? '✓ Verificada' : '⏳ Pendiente'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onVerifyUser(u.id)}
                            title="Alternar Verificación"
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                              u.verifiedStatus === 'verified'
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500'
                            }`}
                          >
                            {u.verifiedStatus === 'verified' ? 'Revocar' : 'Verificar'}
                          </button>

                          <button
                            onClick={() => onToggleUserRole(u.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md"
                          >
                            {u.role === 'admin' ? 'Hacer Trader' : 'Hacer Admin'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: OFFERS MODERATION */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar en ofertas..."
                  value={searchOffer}
                  onChange={(e) => setSearchOffer(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#00B074]"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Título del Lote</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Empresa Emisora</th>
                    <th className="py-3 px-4">Ubicación Stock</th>
                    <th className="py-3 px-4 text-right">Cantidad</th>
                    <th className="py-3 px-4 text-right">Precio Unitario</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOffers.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{o.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{o.notes}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          o.type === 'vender'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {o.type === 'vender' ? 'VENDER' : 'COMPRAR'}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{o.companyName}</div>
                        <div className="text-[11px] text-slate-500">{o.username}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {o.stockLocationFlag} {o.stockLocation}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        {o.quantity.toLocaleString()} pcs
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-[#00B074]">
                        ${o.priceUSD} USD
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteOffer(o.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar Oferta del Piso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
