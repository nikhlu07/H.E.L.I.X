export interface Product {
  productId: string;
  name: string;
  batchNumber: string;
  manufacturer: {
    address: string;
    name: string;
    license: string;
  };
  quantity: number;
  mfgDate: string;
  expiryDate: string;
  category: string;
  status: 'Manufactured' | 'In Transit' | 'At Distributor' | 'At Pharmacy' | 'Delivered';
  currentHolder: string;
  blockchain: {
    txHash: string;
    blockNumber: number;
    tokenId: number;
  };
  transfers: Transfer[];
  ingredients: string[];
  dosage: string;
  form: string;
  packaging: string;
  storageRequirements: string;
  fdaNumber: string;
  targetRegions: string[];
}

export interface Transfer {
  from: string;
  fromName: string;
  fromRole: 'Manufacturer' | 'Distributor' | 'Pharmacy' | 'Hospital';
  to: string;
  toName: string;
  toRole: 'Manufacturer' | 'Distributor' | 'Pharmacy' | 'Hospital';
  timestamp: string;
  location: string;
  temperature: number;
  humidity: number;
  verified: boolean;
  txHash: string;
  notes?: string;
}

export interface User {
  address: string;
  name: string;
  email: string;
  role: 'Manufacturer' | 'Distributor' | 'Pharmacy' | 'Patient';
  license: string;
  verified: boolean;
  stats: {
    totalProducts: number;
    totalTransfers: number;
    avgDeliveryTime: number;
    trustScore: number;
  };
}

export const mockProducts: Product[] = [
  {
    productId: 'MED-2024-A1B2C3',
    name: 'Amoxicillin 500mg',
    batchNumber: 'BATCH-001',
    manufacturer: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC',
      name: 'PharmaCorp Ltd',
      license: 'FDA-12345',
    },
    quantity: 10000,
    mfgDate: '2024-01-15',
    expiryDate: '2026-01-15',
    category: 'Antibiotics',
    status: 'In Transit',
    currentHolder: '0x456abc789def012345678901234567890abcdef0',
    blockchain: {
      txHash: '0xabc123def456789012345678901234567890abcdef123456789012345678901',
      blockNumber: 12345678,
      tokenId: 42,
    },
    transfers: [
      {
        from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC',
        fromName: 'PharmaCorp Ltd',
        fromRole: 'Manufacturer',
        to: '0x456abc789def012345678901234567890abcdef0',
        toName: 'MediDistribute Global',
        toRole: 'Distributor',
        timestamp: '2024-01-16T10:30:00Z',
        location: 'Mumbai, India',
        temperature: 4.5,
        humidity: 45,
        verified: true,
        txHash: '0xdef456789012345678901234567890abcdef1234567890123456789012345',
        notes: 'Initial shipment from manufacturer',
      },
    ],
    ingredients: ['Amoxicillin Trihydrate', 'Magnesium Stearate', 'Microcrystalline Cellulose'],
    dosage: '500mg per capsule',
    form: 'Capsule',
    packaging: 'Blister Pack - 10 capsules per strip',
    storageRequirements: '2-8°C, Protected from light',
    fdaNumber: 'NDA-050760',
    targetRegions: ['North America', 'Europe', 'Asia'],
  },
  {
    productId: 'MED-2024-X9Y8Z7',
    name: 'Ibuprofen 400mg',
    batchNumber: 'BATCH-002',
    manufacturer: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC',
      name: 'PharmaCorp Ltd',
      license: 'FDA-12345',
    },
    quantity: 15000,
    mfgDate: '2024-02-01',
    expiryDate: '2026-02-01',
    category: 'Analgesics',
    status: 'At Pharmacy',
    currentHolder: '0x789def012345678901234567890abcdef012345',
    blockchain: {
      txHash: '0x123abc456def789012345678901234567890abcdef123456789012345678902',
      blockNumber: 12345680,
      tokenId: 43,
    },
    transfers: [
      {
        from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC',
        fromName: 'PharmaCorp Ltd',
        fromRole: 'Manufacturer',
        to: '0x456abc789def012345678901234567890abcdef0',
        toName: 'MediDistribute Global',
        toRole: 'Distributor',
        timestamp: '2024-02-02T09:00:00Z',
        location: 'Mumbai, India',
        temperature: 22,
        humidity: 40,
        verified: true,
        txHash: '0xaaa111bbb222ccc333ddd444eee555fff666777888999000aaabbbcccddd',
      },
      {
        from: '0x456abc789def012345678901234567890abcdef0',
        fromName: 'MediDistribute Global',
        fromRole: 'Distributor',
        to: '0x789def012345678901234567890abcdef012345',
        toName: 'HealthPlus Pharmacy',
        toRole: 'Pharmacy',
        timestamp: '2024-02-05T14:20:00Z',
        location: 'New Delhi, India',
        temperature: 23,
        humidity: 42,
        verified: true,
        txHash: '0xbbb222ccc333ddd444eee555fff666777888999000aaabbbcccdddeee111',
      },
    ],
    ingredients: ['Ibuprofen', 'Colloidal Silicon Dioxide', 'Croscarmellose Sodium'],
    dosage: '400mg per tablet',
    form: 'Tablet',
    packaging: 'Bottle - 100 tablets',
    storageRequirements: '20-25°C, Dry place',
    fdaNumber: 'NDA-019522',
    targetRegions: ['Global'],
  },
];

export const mockUser: User = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC',
  name: 'PharmaCorp Ltd',
  email: 'contact@pharmacorp.com',
  role: 'Manufacturer',
  license: 'FDA-12345',
  verified: true,
  stats: {
    totalProducts: 142,
    totalTransfers: 387,
    avgDeliveryTime: 3.2,
    trustScore: 98,
  },
};

export const generateMockTxHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const generateProductId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'MED-2024-';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};

export const categories = [
  'Antibiotics',
  'Analgesics',
  'Vaccines',
  'Antivirals',
  'Cardiovascular',
  'Diabetes',
  'Respiratory',
  'Oncology',
];

export const productForms = [
  'Tablet',
  'Capsule',
  'Injection',
  'Syrup',
  'Drops',
  'Cream',
  'Inhaler',
];
