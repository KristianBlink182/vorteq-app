import React, { useState } from 'react';
import { X, Building2, Tag, MapPin, DollarSign, Boxes, Send } from 'lucide-react';
import { TradeOffer, UserAccount } from '../../types';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSubmitOffer: (newOffer: TradeOffer) => void;
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitOffer,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'vender' | 'comprar'>('vender');
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [priceUSD, setPriceUSD] = useState<number>(650);
  const [stockLocation, setStockLocation] = useState('India');
  const [stockLocationFlag, setStockLocationFlag] = useState('🇮🇳');
  const [notes, setNotes] = useState('');

  const handleLocationChange = (val: string) => {
    setStockLocation(val);
    if (val === 'India') setStockLocationFlag('🇮🇳');
    else if (val === 'Canada') setStockLocationFlag('🇨🇦');
    else if (val === 'Dubai') setStockLocationFlag('🇦🇪');
    else if (val === 'Miami') setStockLocationFlag('🇺🇸');
    else if (val === 'España') setStockLocationFlag('🇪🇸');
    else setStockLocationFlag('🌐');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const offer: TradeOffer = {
      id: `off-${Date.now()}`,
      title: title || 'iPhone Bulk Inventory',
      username: currentUser.username,
      companyName: currentUser.companyName,
      type,
      companySize: currentUser.companySize,
      stockLocation,
      stockLocationFlag,
      dateStr: 'Hoy, ' + new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      notes: notes || 'Ready to ship master cartons. Physical stock verified.',
      priceUSD: Number(priceUSD),
      quantity: Number(quantity),
      status: 'active',
      views: 1,
      phoneWhatsApp: currentUser.phoneWhatsApp,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
      ],
      specs: {
        modelNumber: 'Global B2B Unlocked Spec',
        chipset: 'Procesador de Alta Potencia Oficial',
        storage: 'Capacidad Comercial Estándar',
        ram: '8GB RAM',
        display: 'Pantalla OLED Retina High Refresh',
        network: '5G All Global Bands Desbloqueado',
        batteryHealth: '100% Nueva de Fábrica',
        colorDistribution: 'Mix equilibrado según pedido',
        osVersion: 'Sistema operativo oficial de fábrica'
      },
      physicalCondition: {
        boxStatus: 'Master Carton Sellada de Fábrica (100% Sealed)',
        warrantyPeriod: '12 Meses Garantía Oficial del Fabricante',
        cosmeticGrade: 'Grado A+ Nuevo Sellado (Brand New Factory Sealed)',
        sealStatus: 'Precintos de seguridad intactos de fábrica sin abrir',
        activationStatus: 'No activado (Non-active) · 0 días',
        accessoriesIncluded: 'Caja original con accesorios y cables completos',
        imeiVerification: 'GSMA Clean · Limpio de reportes, sin iCloud ni MDM',
        inspectionReport: `Lote verificado por ${currentUser.companyName} bajo normas Vorteq SafeTrade`
      }
    };

    onSubmitOffer(offer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-[#00B074] text-white px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-sm font-bold">Publicar Nueva Oferta B2B</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs font-sans">
          {/* Vender / Comprar Toggle */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Intención de la Oferta</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('vender')}
                className={`py-2 rounded-lg border text-xs font-bold transition-colors ${
                  type === 'vender'
                    ? 'bg-blue-50 border-[#00B074] text-[#00B074]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Vender (Tengo Stock)
              </button>
              <button
                type="button"
                onClick={() => setType('comprar')}
                className={`py-2 rounded-lg border text-xs font-bold transition-colors ${
                  type === 'comprar'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Comprar (Busco Stock)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Título de la Oferta</label>
            <input
              type="text"
              required
              placeholder="Ej. iPhone Bulk Inventory o Samsung Flip 8 100pcs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ubicación del Stock</label>
              <select
                value={stockLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-none focus:border-[#00B074]"
              >
                <option value="India">🇮🇳 India</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Dubai">🇦🇪 Dubai Freezone</option>
                <option value="Miami">🇺🇸 Miami (Doral)</option>
                <option value="España">🇪🇸 España (Madrid)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cantidad (Unidades)</label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-[#00B074]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Precio Unitario ($ USD)</label>
            <input
              type="number"
              required
              min={1}
              value={priceUSD}
              onChange={(e) => setPriceUSD(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono font-bold text-[#00B074] focus:outline-none focus:border-[#00B074]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Descripción / Notas del Lote</label>
            <textarea
              rows={3}
              required
              placeholder="Detalla modelo, capacidad, color, estado (sellado/activo), condiciones de entrega..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#00B074]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#00B074] hover:bg-[#236da0] text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              Publicar Lote en el Feed en Vivo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
