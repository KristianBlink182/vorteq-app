import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Box, 
  Calendar, 
  Cpu, 
  HardDrive, 
  Smartphone, 
  Wifi, 
  BatteryCharging, 
  Palette, 
  FileCheck, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  Sparkles,
  Lock,
  Building2,
  AlertCircle
} from 'lucide-react';
import { TradeOffer, UserAccount } from '../../types';

interface WholesaleDetailModalProps {
  offer: TradeOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToggle: (offerId: string) => void;
  onStartChat: (user: UserAccount, initialMessage?: string) => void;
  users: UserAccount[];
}

export const WholesaleDetailModal: React.FC<WholesaleDetailModalProps> = ({
  offer,
  isOpen,
  onClose,
  onSaveToggle,
  onStartChat,
  users
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  if (!isOpen || !offer) return null;

  const isSeller = offer.type === 'vender';
  const seller = users.find((u) => u.username === offer.username);

  // Fallback images if not populated
  const images = offer.images && offer.images.length > 0 ? offer.images : [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
  ];

  const totalLotValue = offer.priceUSD * offer.quantity;

  const specs = offer.specs || {
    modelNumber: 'Global Specification',
    chipset: 'Procesador de Alta Eficiencia',
    storage: 'Capacidad Comercial Estándar',
    ram: 'Memoria Unificada / LPDDR5X',
    display: 'Pantalla OLED de Alta Resolución',
    network: '5G All Global Bands Desbloqueado',
    batteryHealth: '100% Nueva de Fábrica',
    colorDistribution: 'Surtido comercial equilibrado',
    osVersion: 'Sistema operativo oficial vigente'
  };

  const condition = offer.physicalCondition || {
    boxStatus: 'Master Carton Sellada de Fábrica (100% Sealed)',
    warrantyPeriod: '12 Meses Garantía Oficial del Fabricante',
    cosmeticGrade: 'Grado A+ Nuevo Sellado (Brand New Factory Sealed)',
    sealStatus: 'Precintos de seguridad originales intactos sin abrir',
    activationStatus: 'No activado (Non-active) · 0 días',
    accessoriesIncluded: 'Empaque original con accesorios de fábrica completos',
    imeiVerification: 'GSMA Clean · Sin bloqueos de operador ni reporte de robo',
    inspectionReport: 'Inspección física en bodega aprobada con certificación'
  };

  const handleCopySpecs = () => {
    const textToCopy = `📦 LOTE MAYORISTA: ${offer.title}
💰 Precio: $${offer.priceUSD} USD/ud | Cantidad: ${offer.quantity} pcs ($${totalLotValue.toLocaleString()} USD total)
📍 Ubicación: ${offer.stockLocationFlag} ${offer.stockLocation}
🏢 Empresa: ${offer.companyName} (${offer.username})

✨ CONDICIÓN FÍSICA:
• Estado de Caja: ${condition.boxStatus}
• Período de Garantía: ${condition.warrantyPeriod}
• Grado Cosmético: ${condition.cosmeticGrade}
• Precintos / Sellos: ${condition.sealStatus}
• Activación: ${condition.activationStatus}
• Accesorios: ${condition.accessoriesIncluded}
• Verificación IMEI: ${condition.imeiVerification}

⚙️ ESPECIFICACIONES TÉCNICAS:
• N° Modelo: ${specs.modelNumber || 'N/A'}
• Procesador: ${specs.chipset || 'N/A'}
• Almacenamiento: ${specs.storage || 'N/A'}
• RAM: ${specs.ram || 'N/A'}
• Pantalla: ${specs.display || 'N/A'}
• Red: ${specs.network || 'N/A'}
• Batería: ${specs.batteryHealth || 'N/A'}
• Colores: ${specs.colorDistribution || 'N/A'}
• SO: ${specs.osVersion || 'N/A'}

Vorteq B2B Marketplace SafeTrade 2026`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2500);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleStartNegotiation = () => {
    if (seller) {
      onStartChat(seller, `Hola ${seller.fullName}, me interesa expandir negociación para el lote "${offer.title}" (${offer.quantity} pcs @ $${offer.priceUSD} USD en ${offer.stockLocation}).`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative text-[#0B192C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR / HEADER */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-slate-100 bg-white/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${
              isSeller 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30'
            }`}>
              {isSeller ? 'VENTA / ASK WHOLESALE' : 'COMPRA / BID WHOLESALE'}
            </span>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1 font-semibold">
              <span>{offer.stockLocationFlag}</span>
              <span>{offer.stockLocation}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveToggle(offer.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                offer.isSaved 
                  ? 'bg-[#E6F7F0] border-[#00B074]/40 text-[#008A5B]' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-[#0B192C]'
              }`}
              title={offer.isSaved ? 'Guardado en tus lotes' : 'Guardar lote'}
            >
              {offer.isSaved ? <BookmarkCheck className="w-4 h-4 text-[#008A5B]" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* TITLE & PRICE HERO */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-black text-[#0B192C] leading-tight">
                {offer.title}
              </h2>
              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-[#008A5B] font-mono leading-none block">
                  ${offer.priceUSD}
                </span>
                <span className="text-[11px] text-slate-500 font-sans">USD / unidad</span>
              </div>
            </div>

            {/* QUICK STATS CHIPS */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block font-sans font-bold">Lote Total</span>
                <span className="font-bold text-[#0B192C] text-sm">{offer.quantity} pcs</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block font-sans font-bold">Valor del Lote</span>
                <span className="font-bold text-blue-700 text-sm">${totalLotValue.toLocaleString()}</span>
              </div>
              <div className="bg-[#E6F7F0] border border-[#00B074]/30 rounded-2xl p-2.5 text-center">
                <span className="text-[10px] text-[#008A5B] block font-sans font-bold">Custodia Escrow</span>
                <span className="font-bold text-[#008A5B] text-xs flex items-center justify-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Segura
                </span>
              </div>
            </div>
          </div>

          {/* GALLERY CAROUSEL WITH MULTIPLE IMAGES */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00B074]" />
                <span>Galería Fotográfica de Inspección ({images.length} fotos)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {activeImageIndex + 1} / {images.length}
              </span>
            </div>

            {/* Main Featured Image with Controls */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video group">
              <img
                src={images[activeImageIndex]}
                alt={`${offer.title} - Inspección ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
              />

              {/* Verified Stock Badge on Image */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-[#008A5B] shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-[#00B074]" />
                <span>Stock Físico Verificado</span>
              </div>

              {/* Photo Caption Tag */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-700 font-semibold shadow-xs">
                {activeImageIndex === 0 && 'Vista Frontal / Packaging Retail'}
                {activeImageIndex === 1 && 'Sellos de Fábrica y Precintos'}
                {activeImageIndex === 2 && 'Master Carton & Embalaje de Envío'}
                {activeImageIndex >= 3 && 'Inspección de Unidad y Calidad'}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-sm transition-all border border-slate-200 cursor-pointer shadow-md"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-sm transition-all border border-slate-200 cursor-pointer shadow-md"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'border-[#00B074] ring-2 ring-[#00B074]/30 scale-102' 
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* EXACT PHYSICAL CONDITION SECTION (PROMINENT HIGHLIGHT) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E6F7F0] border border-[#00B074]/30 flex items-center justify-center text-[#008A5B]">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0B192C] uppercase tracking-wider">
                    Condición Física Exacta de la Unidad
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Auditoría de empaque, sellos y garantías físicas
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E6F7F0] text-[#008A5B] border border-[#00B074]/30 font-bold">
                Inspección 100%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Box Status */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                  <Box className="w-3.5 h-3.5 text-amber-600" />
                  <span>Estado de la Caja (Box Status)</span>
                </span>
                <p className="text-[#0B192C] font-semibold text-xs leading-snug">
                  {condition.boxStatus}
                </p>
              </div>

              {/* Warranty Period */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5 text-[#008A5B]" />
                  <span>Período de Garantía (Warranty)</span>
                </span>
                <p className="text-[#008A5B] font-semibold text-xs leading-snug flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{condition.warrantyPeriod}</span>
                </p>
              </div>

              {/* Cosmetic Grade */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Grado Cosmético</span>
                </span>
                <p className="text-[#0B192C] font-medium text-xs leading-snug">
                  {condition.cosmeticGrade}
                </p>
              </div>

              {/* Seal Status */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Precintos y Sellos</span>
                </span>
                <p className="text-[#0B192C] font-medium text-xs leading-snug">
                  {condition.sealStatus}
                </p>
              </div>

              {/* Activation Status */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00B074]" />
                  <span>Estado de Activación</span>
                </span>
                <p className="text-[#0B192C] font-medium text-xs leading-snug font-mono">
                  {condition.activationStatus}
                </p>
              </div>

              {/* IMEI / Blacklist Check */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Validación IMEI / GSMA</span>
                </span>
                <p className="text-[#0B192C] font-medium text-xs leading-snug">
                  {condition.imeiVerification}
                </p>
              </div>
            </div>

            {/* Accessories & Inspection report banner */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">Accesorios en caja:</span>
                <span className="text-[#0B192C] font-medium">{condition.accessoriesIncluded}</span>
              </div>
              {condition.inspectionReport && (
                <div className="flex items-center gap-1.5 text-[10px] text-[#008A5B] font-semibold pt-1 border-t border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{condition.inspectionReport}</span>
                </div>
              )}
            </div>
          </div>

          {/* FULL TECHNICAL SPECIFICATIONS */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-[#0B192C] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00B074]" />
                <span>Especificaciones Técnicas Completas</span>
              </h3>
              <button
                onClick={handleCopySpecs}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#0B192C] transition-colors cursor-pointer"
              >
                {copiedSpecs ? (
                  <>
                    <Check className="w-3 h-3 text-[#00B074]" />
                    <span className="text-[#00B074] font-bold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Ficha</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {specs.modelNumber && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" /> N° de Modelo:
                  </span>
                  <span className="font-mono font-bold text-[#0B192C]">{specs.modelNumber}</span>
                </div>
              )}

              {specs.chipset && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" /> Procesador:
                  </span>
                  <span className="font-semibold text-[#0B192C] truncate max-w-[170px]" title={specs.chipset}>
                    {specs.chipset}
                  </span>
                </div>
              )}

              {specs.storage && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" /> Almacenamiento:
                  </span>
                  <span className="font-mono font-bold text-blue-700">{specs.storage}</span>
                </div>
              )}

              {specs.ram && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" /> Memoria RAM:
                  </span>
                  <span className="font-mono font-bold text-[#0B192C]">{specs.ram}</span>
                </div>
              )}

              {specs.display && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg sm:col-span-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Pantalla:
                  </span>
                  <span className="font-medium text-[#0B192C]">{specs.display}</span>
                </div>
              )}

              {specs.network && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg sm:col-span-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-slate-400" /> Red / Compatibilidad:
                  </span>
                  <span className="font-medium text-[#0B192C]">{specs.network}</span>
                </div>
              )}

              {specs.colorDistribution && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg sm:col-span-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-slate-400" /> Mix de Colores:
                  </span>
                  <span className="font-medium text-[#0B192C]">{specs.colorDistribution}</span>
                </div>
              )}

              {specs.batteryHealth && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-[#008A5B]" /> Batería:
                  </span>
                  <span className="font-mono font-bold text-[#008A5B]">{specs.batteryHealth}</span>
                </div>
              )}

              {specs.osVersion && (
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" /> Firmware / OS:
                  </span>
                  <span className="font-mono font-medium text-[#0B192C]">{specs.osVersion}</span>
                </div>
              )}
            </div>
          </div>

          {/* NOTES & LOGISTICS MANIFEST */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Manifiesto Comercial & Notas de Embarque
            </h4>
            <div className="text-xs text-[#0B192C] font-mono whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {offer.notes}
            </div>
          </div>

          {/* SELLER IDENTITY & ESCROW VERIFICATION */}
          {seller && (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[#008A5B] text-sm">
                  {seller.avatarText || seller.companyName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#0B192C] text-xs">{seller.companyName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00B074]" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    {seller.fullName} · {seller.username} · {seller.companySize}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-600 font-mono font-semibold">
                {seller.countryFlag} {seller.country}
              </span>
            </div>
          )}

        </div>

        {/* STICKY BOTTOM ACTIONS FOOTER */}
        <div className="p-4 px-5 border-t border-slate-200 bg-white/95 backdrop-blur-md shrink-0 flex items-center justify-between gap-3">
          <div className="text-left font-mono hidden sm:block">
            <span className="text-[10px] text-slate-400 font-sans block font-bold">Precio total lote</span>
            <span className="text-base font-black text-[#0B192C]">${totalLotValue.toLocaleString()} USD</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={`https://wa.me/${(offer.phoneWhatsApp || '+34600112233').replace('+', '')}?text=${encodeURIComponent(`Hola ${offer.companyName}, vi su oferta "${offer.title}" de ${offer.quantity} pcs en Vorteq B2B.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#E6F7F0] hover:bg-[#d4f2e5] text-[#008A5B] border border-[#00B074]/30 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#008A5B]" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleStartNegotiation}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#00B074] hover:bg-[#009663] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Negociar en Chat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
