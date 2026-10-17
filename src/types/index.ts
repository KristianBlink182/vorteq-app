export type Language = 'es' | 'en';
export type AppViewMode = 'mobile' | 'web'; // User requested separated web and app sharing same DB!

export type UserRole = 'vendor' | 'customer' | 'trader';
export type BusinessRole = 'vendor' | 'customer';

export interface UserAccount {
  id: string;
  username: string; // e.g. "@emaavy.vedant"
  fullName: string; // e.g. "Vedant"
  companyName: string; // e.g. "Emaavy Global Fze"
  email: string;
  phoneWhatsApp: string; // e.g. "+919687436263"
  country: string; // e.g. "India"
  countryFlag: string; // e.g. "🇮🇳"
  companySize: string; // e.g. "$10M - $25M"
  verifiedStatus: 'verified' | 'pending' | 'unverified';
  role: UserRole;
  accountType: BusinessRole; // 'vendor' (Proveedor/Mayorista) | 'customer' (Cliente/Comprador B2B)
  taxId?: string; // RUC / Tax ID / NIF Fiscal
  city?: string;
  address?: string;
  password?: string;
  // Specific to VENDOR (Proveedor)
  vendorType?: string; // Distribuidor Oficial, Importador Mayorista, Broker, Fabricante
  vendorCategories?: string[]; // Categorías de inventario que provee
  vendorSupplyCapacity?: string; // Capacidad mensual estimada de stock
  vendorMoq?: string; // Pedido mínimo requerido (MOQ)
  vendorWarrantyTerms?: string; // Días de garantía y política RMA
  // Specific to CUSTOMER (Cliente / Comprador)
  customerBusinessType?: string; // Tienda Retail, E-commerce, Cadena Minorista, Servicio Técnico, Corporativo
  customerMonthlyBudget?: string; // Presupuesto mensual estimado de compra
  customerPaymentMethods?: string[]; // Transferencia Bancaria SWIFT, Carta de Crédito, USDT, Contraentrega
  customerDeliveryPref?: string; // Retiro en almacén, Envío aéreo express, Flete marítimo
  avatarText?: string;
  avatarBgColor?: string;
  endorsements: string[]; // e.g. ["mobi hub", "LinkedIn", "WhatsApp", "importando USA", "GSM B2B"]
  exhibitions: string[]; // e.g. ["IFA Berlin '26", "Hong Kong '26", "Miami '26", "Colombia '26"]
  offersCount: number;
  subscribersCount: number;
  followingCount: number;
  chatsCount: number;
  hidePhone: boolean;
  hideArchived: boolean;
  createdAt: string;
}

export interface TradeOfferPhysicalCondition {
  boxStatus: string; // e.g. "Caja Máster Sellada de Fábrica (100% Sealed)"
  warrantyPeriod: string; // e.g. "12 Meses Garantía Oficial AppleCare Internacional"
  cosmeticGrade: string; // e.g. "Grado A+ Nuevo Sellado (Brand New Factory Sealed)"
  sealStatus: string; // e.g. "Precintos holográficos de seguridad intactos"
  activationStatus: string; // e.g. "No activado (0 días de activación / Non-active)"
  accessoriesIncluded: string; // e.g. "Cable original trenzado USB-C, manuales oficiales, caja original"
  imeiVerification: string; // e.g. "GSMA Clean · Sin bloqueo de operador ni iCloud / MDM"
  inspectionReport?: string; // e.g. "Vorteq Quality Gate QC-2026-98 Passed"
}

export interface TradeOfferSpecs {
  modelNumber?: string; // e.g. "A3296 / LL/A (US)"
  chipset?: string; // e.g. "Apple A18 Pro Bionic (3nm)"
  storage?: string; // e.g. "128GB / 256GB / 512GB"
  ram?: string; // e.g. "8GB LPDDR5X"
  display?: string; // e.g. "6.9\" Super Retina XDR OLED 120Hz ProMotion"
  network?: string; // e.g. "5G Dual eSIM (US) / Desbloqueado de fábrica"
  batteryHealth?: string; // e.g. "100% Batería nueva (0 ciclos)"
  colorDistribution?: string; // e.g. "Titanio Desierto (40%), Titanio Natural (35%), Negro (25%)"
  osVersion?: string; // e.g. "iOS 18.2 Oficial"
}

export interface TradeOffer {
  id: string;
  title: string; // e.g. "iPhone Bulk Inventory"
  username: string; // e.g. "@emaavy.vedant"
  companyName: string; // e.g. "Emaavy Global Fze"
  type: 'vender' | 'comprar';
  companySize: string; // e.g. "$10M - $25M"
  stockLocation: string; // e.g. "India", "Canada", "Dubai", "Miami"
  stockLocationFlag: string; // e.g. "🇮🇳", "🇨🇦", "🇦🇪", "🇺🇸"
  dateStr: string; // e.g. "vie, 25 sept 2026"
  notes: string; // e.g. "Ready to ship iPhones\nAll master carton\n15 128 non active..."
  priceUSD: number;
  quantity: number;
  status: 'active' | 'archived' | 'flagged';
  isSaved?: boolean;
  isIgnored?: boolean;
  views: number;
  phoneWhatsApp?: string;
  // Detailed wholesale lot data
  images?: string[];
  specs?: TradeOfferSpecs;
  physicalCondition?: TradeOfferPhysicalCondition;
}

export interface ProductPriceLive {
  id: string;
  model: string; // e.g. "iPhone 16 Pro Max 256GB"
  brand: string; // e.g. "Apple"
  category: string; // e.g. "Nuevos", "Usados", "MacBooks"
  specs: string; // e.g. "US LL/A · Desert Titanium · Sealed"
  currentPriceUSD: number;
  previousPriceUSD: number;
  change24hUSD: number;
  change24hPct: number;
  low24hUSD: number;
  high24hUSD: number;
  history: { time: string; price: number }[];
  marketSentiment: 'Subiendo' | 'Bajando' | 'Estable';
  sparkline: number[];
}

export interface FeaturedStory {
  id: string;
  username: string; // e.g. "@Marriam.nasir"
  companyName: string; // e.g. "Sunstrike International"
  tagline: string; // e.g. "Sunstrike International is one of the world's leadin..."
  countryFlag: string;
  logoBg: string;
  hasSeen?: boolean;
}

export interface ChatMessage {
  id: string;
  offerId?: string;
  senderUsername: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface PriceAlert {
  id: string;
  brand: 'Apple' | 'Samsung' | 'MacBook' | 'Xiaomi';
  model: string;
  targetPriceUSD: number;
  condition: 'below_target' | 'percent_drop' | 'any_change';
  percentDrop?: number;
  notifyEmail: boolean;
  notifyPush: boolean;
  emailAddress: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
}
