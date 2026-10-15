import { UserAccount, TradeOffer, ProductPriceLive, FeaturedStory, ChatMessage, AdminLog } from '../types';

const STORAGE_KEY_PREFIX = 'vorteq_b2b_';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-vedant',
    username: '@emaavy.vedant',
    fullName: 'Vedant Prajapati',
    companyName: 'Emaavy Global Fze',
    email: 'vedant@emaavyglobal.com',
    phoneWhatsApp: '+919687436263',
    country: 'India',
    countryFlag: '🇮🇳',
    companySize: '$10M - $25M',
    verifiedStatus: 'verified',
    role: 'trader',
    avatarText: 'ER',
    avatarBgColor: '#0ea5e9',
    endorsements: ['mobi hub', 'LinkedIn', 'WhatsApp', 'importando USA', 'GSM B2B'],
    exhibitions: ["IFA Berlin '26", "Hong Kong '26", "Miami '26", "Colombia '26"],
    offersCount: 26,
    subscribersCount: 1,
    followingCount: 0,
    chatsCount: 4,
    hidePhone: false,
    hideArchived: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'user-it-squad',
    username: '@ITSCANADA',
    fullName: 'Rajesh Sachdeva',
    companyName: 'iT SQUAD CANADA INC',
    email: 'rajesh@itsquadcanada.com',
    phoneWhatsApp: '+14169082341',
    country: 'Canada',
    countryFlag: '🇨🇦',
    companySize: '$10M - $25M',
    verifiedStatus: 'verified',
    role: 'trader',
    avatarText: 'IT',
    avatarBgColor: '#3b82f6',
    endorsements: ['mobi hub', 'WhatsApp', 'GSM B2B'],
    exhibitions: ["Miami '26", "Hong Kong '26"],
    offersCount: 14,
    subscribersCount: 8,
    followingCount: 2,
    chatsCount: 12,
    hidePhone: false,
    hideArchived: false,
    createdAt: '2026-02-10',
  },
  {
    id: 'user-admin',
    username: '@admin.global',
    fullName: 'Admin Principal',
    companyName: 'Vorteq B2B Operations HQ',
    email: 'admin@vorteqb2b.com',
    phoneWhatsApp: '+13059871122',
    country: 'United States',
    countryFlag: '🇺🇸',
    companySize: '>$50M',
    verifiedStatus: 'verified',
    role: 'admin',
    avatarText: 'VQ',
    avatarBgColor: '#00B074',
    endorsements: ['Vorteq Official B2B', 'GSMA Partner', 'Escrow Custodian'],
    exhibitions: ["MWC Barcelona '26", "CES Vegas '26"],
    offersCount: 2,
    subscribersCount: 1420,
    followingCount: 50,
    chatsCount: 95,
    hidePhone: false,
    hideArchived: false,
    createdAt: '2025-10-01',
  }
];

export const INITIAL_STORIES: FeaturedStory[] = [
  {
    id: 'story-1',
    username: '@Marriam.nasir',
    companyName: 'Sunstrike International',
    tagline: "Sunstrike International is one of the world's leading wholesale distributors...",
    countryFlag: '🇦🇪',
    logoBg: '#fee2e2',
  },
  {
    id: 'story-2',
    username: '@Khaled.royal',
    companyName: 'Royal Line Electronics',
    tagline: 'Your Ultimate Electronics Distribution Partner in the Middle East...',
    countryFlag: '🇦🇪',
    logoBg: '#ede9fe',
  },
  {
    id: 'story-3',
    username: '@YasminMemo',
    companyName: 'New Way Middle East',
    tagline: 'Dynamic company based in Dubai Airport Freezone, physical stock ready...',
    countryFlag: '🇦🇪',
    logoBg: '#dcfce7',
  }
];

export const INITIAL_OFFERS: TradeOffer[] = [
  {
    id: 'off-1',
    title: 'iPhone Bulk Inventory',
    username: '@emaavy.vedant',
    companyName: 'Emaavy Global Fze',
    type: 'vender',
    companySize: '$10M - $25M',
    stockLocation: 'India',
    stockLocationFlag: '🇮🇳',
    dateStr: 'vie, 25 sept 2026',
    notes: 'Ready to ship iPhones\nAll master carton\n15 128 non active\n15 128 active\n15 256 non active...',
    priceUSD: 595,
    quantity: 420,
    status: 'active',
    isSaved: false,
    views: 124,
    phoneWhatsApp: '+919687436263',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      modelNumber: 'A3090 / A3094 Global & US Specs',
      chipset: 'Apple A16 Bionic & A18 Pro Hexa-core (3nm)',
      storage: '128GB (240 pcs) · 256GB (180 pcs)',
      ram: '6GB / 8GB LPDDR5X',
      display: '6.1" / 6.7" Super Retina XDR OLED, Dynamic Island, 2000 nits',
      network: '5G Dual eSIM / Nano-SIM + eSIM (Desbloqueado de Fábrica)',
      batteryHealth: '100% Nueva de Fábrica (0 ciclos de carga)',
      colorDistribution: 'Black (35%), Blue (25%), Green (20%), Yellow (10%), Pink (10%)',
      osVersion: 'iOS 18 Oficial de Fábrica preinstalado'
    },
    physicalCondition: {
      boxStatus: 'Master Carton Sellada de Fábrica (Caja máster de 10 unidades precintada de origen, nunca abierta)',
      warrantyPeriod: '12 Meses Garantía Oficial AppleCare Internacional desde primera activación',
      cosmeticGrade: 'Grado A+ Nuevo Sellado (Brand New Factory Sealed - 10/10 Inmaculado)',
      sealStatus: 'Precintos de seguridad adhesivos originales de Apple intactos con tiras de desgarre (pull-tabs)',
      activationStatus: 'No activado (Non-active) · 0 días registrados en Apple GSX',
      accessoriesIncluded: 'Caja retail individual con sellos de fábrica, cable USB-C trenzado original Apple, manuales',
      imeiVerification: 'GSMA Clean · Limpio de reportes, sin bloqueo de operador ni iCloud / MDM corporativo',
      inspectionReport: 'Auditoría de lote #QC-EMA-8841 aprobada con lectura de códigos Datamatrix por escáner láser'
    }
  },
  {
    id: 'off-2',
    title: 'Samsung Flip 8 100pcs',
    username: '@ITSCANADA',
    companyName: 'iT SQUAD CANADA INC',
    type: 'vender',
    companySize: '$10M - $25M',
    stockLocation: 'Canada',
    stockLocationFlag: '🇨🇦',
    dateStr: 'vie, 25 sept 2026',
    notes: '100 pcs Samsung Flip 8 available.\nCondition: Brand new sealed\nSpecs: Canadian specs\nColors: Pink, Cream, Black, Mint',
    priceUSD: 680,
    quantity: 100,
    status: 'active',
    isSaved: true,
    views: 89,
    phoneWhatsApp: '+14169082341',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      modelNumber: 'SM-F741W (Canadian / North American Spec)',
      chipset: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm Octa-core)',
      storage: '256GB UFS 4.0 alta velocidad',
      ram: '12GB LPDDR5X',
      display: '6.7" Dynamic AMOLED 2X 120Hz Adaptativo + 3.4" Super AMOLED FlexWindow',
      network: '5G Sub-6 / Dual SIM (Nano-SIM + eSIM) Desbloqueado Global',
      batteryHealth: '100% Nueva (Batería dual 4,000 mAh de fábrica)',
      colorDistribution: 'Pink (30 pcs), Cream (30 pcs), Black (25 pcs), Mint (15 pcs)',
      osVersion: 'Android 14 con One UI 6.1.1 (Actualizaciones garantizadas por 7 años)'
    },
    physicalCondition: {
      boxStatus: 'Cajas Retail Individuales Selladas con Sello Holográfico de Fábrica Samsung',
      warrantyPeriod: '12 Meses Garantía de Fábrica Samsung Oficial Norteamérica / Internacional',
      cosmeticGrade: 'Grado A+ Pristine (100% Nuevo en empaque térmico con film protector original)',
      sealStatus: 'Sellos de papel de seguridad Samsung intactos en ambos extremos con tinta reflectiva',
      activationStatus: '100% Sin activar · IMEI de fábrica listo para activación inmediata en cualquier país',
      accessoriesIncluded: 'Cable USB-C a USB-C Samsung original, herramienta de extracción SIM, documentación',
      imeiVerification: 'IMEI limpio validado en GSMA y bases canadienses (CWTA), libre de contratos de operador',
      inspectionReport: 'Inspección física en bodega Toronto completada bajo protocolo ISO-9001 #CA-QC-7721'
    }
  },
  {
    id: 'off-3',
    title: 'iPhone 16 & 17 Collection',
    username: '@emaavy.vedant',
    companyName: 'Emaavy Global Fze',
    type: 'vender',
    companySize: '$10M - $25M',
    stockLocation: 'India',
    stockLocationFlag: '🇮🇳',
    dateStr: 'jue, 24 sept 2026',
    notes: 'iPhone 16 128 non active\nBlack - 56 pcs\nTeal - 42 pcs\nWhite - 116 pcs\nUltramarine - 18 pcs...',
    priceUSD: 740,
    quantity: 232,
    status: 'active',
    isSaved: false,
    views: 215,
    phoneWhatsApp: '+919687436263',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      modelNumber: 'A3296 / A3290 Global Spec (Camera Control Button)',
      chipset: 'Apple A18 Bionic Hexa-Core de 3nm de segunda generación',
      storage: '128GB / 256GB NVMe',
      ram: '8GB LPDDR5X (Soporte completo Apple Intelligence)',
      display: '6.1" Super Retina XDR OLED con Ceramic Shield 2ª Generación',
      network: '5G All Global Bands, Dual eSIM o Nano-SIM + eSIM Desbloqueado',
      batteryHealth: '100% Nueva (0 ciclos, recién salido de línea de producción oficial)',
      colorDistribution: 'White (116 pcs), Black (56 pcs), Teal (42 pcs), Ultramarine (18 pcs)',
      osVersion: 'iOS 18.2 Oficial con Apple Intelligence habilitado'
    },
    physicalCondition: {
      boxStatus: 'Master Cartons de 20 uds selladas de origen con precintos de seguridad de aduana',
      warrantyPeriod: '12 Meses Garantía Internacional AppleCare Oficial desde la fecha de primera activación',
      cosmeticGrade: 'Grado A+ Factory Fresh (10/10 Inmaculado en empaque sellado)',
      sealStatus: 'Tiras de seguridad dobles intactas en cada caja individual dentro del máster pack',
      activationStatus: 'No activados (0 días de activación en base de datos global Apple GSX)',
      accessoriesIncluded: 'Caja retail individual con cable USB-C trenzado de 1 metro y documentación reglamentaria',
      imeiVerification: 'Verificación Apple GSX / GSMA 100% limpia sin bloqueos de red ni deudas de operador',
      inspectionReport: 'Certificado de autenticidad Vorteq SafeTrade #VQ-99201 expedido en zona franca'
    }
  },
  {
    id: 'off-4',
    title: 'BUY ORDER: 500x MacBook Air M3 256GB',
    username: '@Marriam.nasir',
    companyName: 'Sunstrike International',
    type: 'comprar',
    companySize: '>$50M',
    stockLocation: 'Dubai',
    stockLocationFlag: '🇦🇪',
    dateStr: 'jue, 24 sept 2026',
    notes: 'Urgent wholesale buy order: Looking for 500 units MacBook Air M3 13-inch sealed master cartons. CIF Dubai or EXW Miami.',
    priceUSD: 885,
    quantity: 500,
    status: 'active',
    isSaved: false,
    views: 310,
    phoneWhatsApp: '+971501234567',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
    ],
    specs: {
      modelNumber: 'MRXN3LL/A / MRXQ3LL/A US / Global Spec',
      chipset: 'Apple Silicon M3 (8-core CPU, 8-core/10-core GPU, 16-core Neural Engine)',
      storage: '256GB SSD PCIe de ultra alta velocidad',
      ram: '8GB / 16GB Unified Memory de 100GB/s de ancho de banda',
      display: '13.6" Liquid Retina Display con True Tone y 500 nits de brillo',
      network: 'Wi-Fi 6E (802.11ax) + Bluetooth 5.3',
      batteryHealth: '100% Nueva de Fábrica (Batería de polímero de litio, hasta 18h de duración)',
      colorDistribution: 'Space Gray (300 pcs), Midnight (100 pcs), Silver (100 pcs)',
      osVersion: 'macOS Sequoia oficial preinstalado'
    },
    physicalCondition: {
      boxStatus: 'Requerido: Master Carton Sellada de Fábrica (Caja exterior marrón de Apple intacta con etiquetas)',
      warrantyPeriod: 'Requerido: 12 Meses Garantía Apple Oficial internacional no iniciada',
      cosmeticGrade: 'Requerido: Grado A+ Brand New Sealed de Distribuidor Oficial Autorizado',
      sealStatus: 'Precintos de fábrica intactos con sello de garantía sin manipular',
      activationStatus: 'No activados (Non-active) con lista de números de serie listos para validación previa en GSX',
      accessoriesIncluded: 'Adaptador de corriente USB-C de 30W original, cable MagSafe 3 de 2m, caja sellada',
      imeiVerification: 'Seriales limpios validados antes del desembolso de custodia Escrow en cuenta bancaria',
      inspectionReport: 'Inspección física obligatoria por agente autorizado en Dubai Airport Freezone (DAFZA)'
    }
  }
];

export const INITIAL_LIVE_PRICES: ProductPriceLive[] = [
  {
    id: 'p-1',
    model: 'iPhone 16 Pro Max 256GB',
    brand: 'Apple',
    category: 'Nuevos Sellados',
    specs: 'US LL/A · Desert Titanium · Desbloqueado',
    currentPriceUSD: 1045,
    previousPriceUSD: 1032,
    change24hUSD: 13,
    change24hPct: 1.25,
    low24hUSD: 1030,
    high24hUSD: 1055,
    marketSentiment: 'Subiendo',
    history: [
      { time: '09:00', price: 1032 },
      { time: '12:00', price: 1038 },
      { time: '15:00', price: 1042 },
      { time: '18:00', price: 1045 },
    ],
    sparkline: [1025, 1030, 1028, 1035, 1040, 1038, 1045]
  },
  {
    id: 'p-2',
    model: 'Samsung Galaxy S24 Ultra 512GB',
    brand: 'Samsung',
    category: 'Nuevos Sellados',
    specs: 'Dual SIM · Titanium Black · Global',
    currentPriceUSD: 875,
    previousPriceUSD: 882,
    change24hUSD: -7,
    change24hPct: -0.79,
    low24hUSD: 868,
    high24hUSD: 885,
    marketSentiment: 'Bajando',
    history: [
      { time: '09:00', price: 882 },
      { time: '12:00', price: 879 },
      { time: '15:00', price: 874 },
      { time: '18:00', price: 875 },
    ],
    sparkline: [890, 888, 885, 880, 878, 872, 875]
  },
  {
    id: 'p-3',
    model: 'iPhone 15 128GB (Caja Sellada)',
    brand: 'Apple',
    category: 'Nuevos Sellados',
    specs: 'Color Mix · Sim Free · Todos los mercados',
    currentPriceUSD: 595,
    previousPriceUSD: 590,
    change24hUSD: 5,
    change24hPct: 0.84,
    low24hUSD: 588,
    high24hUSD: 600,
    marketSentiment: 'Subiendo',
    history: [
      { time: '09:00', price: 590 },
      { time: '12:00', price: 592 },
      { time: '15:00', price: 595 },
    ],
    sparkline: [585, 588, 590, 592, 590, 594, 595]
  },
  {
    id: 'p-4',
    model: 'MacBook Pro 14" M3 Pro 512GB',
    brand: 'Apple',
    category: 'Laptops',
    specs: '18GB RAM · Space Black · US/ES Keyboard',
    currentPriceUSD: 1615,
    previousPriceUSD: 1625,
    change24hUSD: -10,
    change24hPct: -0.61,
    low24hUSD: 1605,
    high24hUSD: 1630,
    marketSentiment: 'Estable',
    history: [
      { time: '09:00', price: 1625 },
      { time: '14:00', price: 1618 },
      { time: '18:00', price: 1615 },
    ],
    sparkline: [1640, 1630, 1625, 1620, 1615, 1618, 1615]
  },
  {
    id: 'p-5',
    model: 'PlayStation 5 Pro 2TB Digital',
    brand: 'Sony',
    category: 'Consolas',
    specs: 'Standard White · Pallet Lots · 100V-240V',
    currentPriceUSD: 680,
    previousPriceUSD: 665,
    change24hUSD: 15,
    change24hPct: 2.25,
    low24hUSD: 660,
    high24hUSD: 690,
    marketSentiment: 'Subiendo',
    history: [
      { time: '09:00', price: 665 },
      { time: '13:00', price: 672 },
      { time: '18:00', price: 680 },
    ],
    sparkline: [650, 658, 665, 670, 672, 678, 680]
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'user-vedant': [
    { 
      id: 'msg-1', 
      senderUsername: '@emaavy.vedant', 
      senderName: 'Vedant Prajapati', 
      text: '¡Hola! Tenemos stock físico verificado de iPhone 16 Pro Max y 15 en cajas máster selladas con entrega inmediata en Miami.', 
      timestamp: '11:42 AM', 
      isMe: false 
    },
    { 
      id: 'msg-2', 
      senderUsername: '@trader.global', 
      senderName: 'Trader Principal', 
      text: 'Hola Vedant, ¿cuál es el precio unitario mínimo para un lote de 150 unidades puesto en Doral Free Trade Zone?', 
      timestamp: '11:45 AM', 
      isMe: true 
    },
    { 
      id: 'msg-3', 
      senderUsername: '@emaavy.vedant', 
      senderName: 'Vedant Prajapati', 
      text: 'Podemos cerrar a $1,175/u por las 150 piezas si cerramos con custodia Escrow hoy mismo.', 
      timestamp: '11:48 AM', 
      isMe: false 
    }
  ],
  'user-it-squad': [
    {
      id: 'msg-its-1',
      senderUsername: '@ITSCANADA',
      senderName: 'Rajesh Sachdeva',
      text: 'Saludos! Llegando lote de MacBook Air 15" M3 a Toronto. ¿Tienen clientes interesados para reexportación?',
      timestamp: '09:15 AM',
      isMe: false
    }
  ]
};

// Helper to access stored chat messages
export const getStoredChatMessages = (currentUser?: UserAccount): Record<string, ChatMessage[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'chat_messages');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading chat messages from localStorage:', e);
  }

  // Fallback with current user details if available
  if (currentUser) {
    return {
      ...INITIAL_CHAT_MESSAGES,
      'user-vedant': INITIAL_CHAT_MESSAGES['user-vedant'].map(msg => 
        msg.isMe ? { ...msg, senderUsername: currentUser.username, senderName: currentUser.fullName } : msg
      )
    };
  }
  return INITIAL_CHAT_MESSAGES;
};

export const saveChatMessages = (messages: Record<string, ChatMessage[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'chat_messages', JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving chat messages to localStorage:', e);
  }
};

export const clearStoredChatMessages = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'chat_messages');
  } catch (e) {
    console.error('Error clearing chat messages from localStorage:', e);
  }
};

// Helper to access stored data
export const getDatabase = () => {
  try {
    const storedUsers = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
    const storedOffers = localStorage.getItem(STORAGE_KEY_PREFIX + 'offers');
    const storedPrices = localStorage.getItem(STORAGE_KEY_PREFIX + 'prices');
    const storedCurrentUserId = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user_id');

    const users: UserAccount[] = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
    const rawOffers: TradeOffer[] = storedOffers ? JSON.parse(storedOffers) : INITIAL_OFFERS;
    
    // Ensure every offer has rich images, specs, and physical condition even if stored previously
    const offers: TradeOffer[] = rawOffers.map((offer) => {
      const initialMatch = INITIAL_OFFERS.find((io) => io.id === offer.id);
      return {
        ...offer,
        images: (offer.images && offer.images.length > 0) ? offer.images : (initialMatch?.images || [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
        ]),
        specs: offer.specs || initialMatch?.specs || {
          modelNumber: 'Global B2B Specification',
          chipset: 'Procesador Oficial de Alta Gama',
          storage: '128GB / 256GB / 512GB',
          ram: '8GB RAM',
          display: 'Pantalla OLED Retina High Refresh Rate',
          network: '5G All Global Bands Desbloqueado',
          batteryHealth: '100% Nueva de Fábrica',
          colorDistribution: 'Surtido comercial equilibrado',
          osVersion: 'Sistema operativo oficial vigente'
        },
        physicalCondition: offer.physicalCondition || initialMatch?.physicalCondition || {
          boxStatus: 'Master Carton Sellada de Fábrica (100% Sealed)',
          warrantyPeriod: '12 Meses Garantía Oficial del Fabricante',
          cosmeticGrade: 'Grado A+ Nuevo Sellado (Brand New Factory Sealed)',
          sealStatus: 'Precintos de seguridad originales intactos sin abrir',
          activationStatus: 'No activado (Non-active) · 0 días',
          accessoriesIncluded: 'Empaque original con accesorios de fábrica completos',
          imeiVerification: 'GSMA Clean · Sin bloqueos de operador ni reporte de robo',
          inspectionReport: 'Inspección física en bodega aprobada con certificación'
        }
      };
    });

    const prices: ProductPriceLive[] = storedPrices ? JSON.parse(storedPrices) : INITIAL_LIVE_PRICES;
    
    const currentUserId = storedCurrentUserId || users[0].id;
    const currentUser = users.find(u => u.id === currentUserId) || users[0];
    const chatMessages = getStoredChatMessages(currentUser);

    return { users, offers, prices, currentUser, stories: INITIAL_STORIES, chatMessages };
  } catch (e) {
    return { 
      users: INITIAL_USERS, 
      offers: INITIAL_OFFERS, 
      prices: INITIAL_LIVE_PRICES, 
      currentUser: INITIAL_USERS[0], 
      stories: INITIAL_STORIES,
      chatMessages: INITIAL_CHAT_MESSAGES
    };
  }
};

export const saveUsers = (users: UserAccount[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  } catch (e) {}
};

export const saveOffers = (offers: TradeOffer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'offers', JSON.stringify(offers));
  } catch (e) {}
};

export const setCurrentUser = (user: UserAccount) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user_id', user.id);
  } catch (e) {}
};

