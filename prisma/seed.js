const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const products = [
  {
    name: 'OmegaShield Omega-3 Fish Oil',
    description: 'Premium pharmaceutical-grade omega-3 fatty acids (EPA & DHA) for heart, brain, and joint health. Each softgel contains 1000mg of concentrated fish oil.',
    price: 24.99, comparePrice: 34.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'],
    category: 'Supplements', brand: 'BethMedic', stock: 150, sku: 'BM-SUP-001',
    tags: ['omega-3', 'heart health', 'supplements'], featured: true, active: true,
  },
  {
    name: 'ProBio+ Advanced Probiotic',
    description: '50 billion CFUs with 12 diverse strains for optimal gut health, immune support, and digestive wellness. Shelf-stable formula, no refrigeration needed.',
    price: 34.99, comparePrice: 44.99,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600',
    images: ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=600'],
    category: 'Supplements', brand: 'BethMedic', stock: 80, sku: 'BM-SUP-002',
    tags: ['probiotics', 'gut health', 'immune'], featured: true, active: true,
  },
  {
    name: 'Digital Blood Pressure Monitor',
    description: 'Clinically validated upper arm blood pressure monitor with large LCD display, memory function for 60 readings, and irregular heartbeat detection.',
    price: 89.99, comparePrice: 119.99,
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600',
    images: ['https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600'],
    category: 'Medical Devices', brand: 'BethMedic Pro', stock: 45, sku: 'BM-DEV-001',
    tags: ['blood pressure', 'monitor', 'diagnostic'], featured: true, active: true,
  },
  {
    name: 'Advanced First Aid Kit',
    description: '200-piece comprehensive first aid kit for home, office, and travel. Includes bandages, antiseptics, splints, emergency blanket, and medical guide.',
    price: 49.99, comparePrice: 64.99,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600',
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600'],
    category: 'First Aid', brand: 'BethMedic', stock: 200, sku: 'BM-FA-001',
    tags: ['first aid', 'emergency', 'safety'], featured: true, active: true,
  },
  {
    name: 'Pulse Oximeter Pro',
    description: 'Fingertip pulse oximeter with OLED display for accurate SpO2 and pulse rate monitoring. Perfect for athletes, seniors, and high-altitude travelers.',
    price: 39.99, comparePrice: 55.99,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600',
    images: ['https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600'],
    category: 'Medical Devices', brand: 'BethMedic Pro', stock: 120, sku: 'BM-DEV-002',
    tags: ['pulse oximeter', 'oxygen', 'monitoring'], featured: false, active: true,
  },
  {
    name: 'Vitamin D3 + K2 Complex',
    description: 'High-potency Vitamin D3 (5000 IU) with MK-7 Vitamin K2 for superior calcium absorption, bone strength, and immune system support.',
    price: 19.99, comparePrice: 27.99,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600',
    images: ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=600'],
    category: 'Supplements', brand: 'BethMedic', stock: 300, sku: 'BM-SUP-003',
    tags: ['vitamin d', 'vitamin k', 'bone health'], featured: false, active: true,
  },
  {
    name: 'Medical Grade Thermometer',
    description: 'Non-contact infrared forehead thermometer with 1-second reading, fever alert, and memory for 20 measurements. FDA cleared.',
    price: 59.99, comparePrice: 79.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'],
    category: 'Medical Devices', brand: 'BethMedic Pro', stock: 75, sku: 'BM-DEV-003',
    tags: ['thermometer', 'fever', 'diagnostic'], featured: false, active: true,
  },
  {
    name: 'Collagen Peptides Powder',
    description: 'Hydrolyzed collagen peptides from grass-fed bovine for skin elasticity, joint support, and muscle recovery. Unflavored, easily dissolves in any beverage.',
    price: 44.99, comparePrice: 59.99,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600',
    images: ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=600'],
    category: 'Supplements', brand: 'BethMedic', stock: 90, sku: 'BM-SUP-004',
    tags: ['collagen', 'skin health', 'joints'], featured: false, active: true,
  },
  {
    name: 'Premium Hand Sanitizer 500ml',
    description: '75% alcohol-based hospital-grade hand sanitizer with aloe vera and vitamin E. WHO-recommended formula. Kills 99.9% of germs and bacteria.',
    price: 14.99, comparePrice: 19.99,
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600',
    images: ['https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600'],
    category: 'Personal Care', brand: 'BethMedic', stock: 500, sku: 'BM-PC-001',
    tags: ['sanitizer', 'hygiene', 'antibacterial'], featured: false, active: true,
  },
  {
    name: 'Glucometer Starter Kit',
    description: 'Complete blood glucose monitoring system with meter, 100 test strips, lancing device, 100 lancets, and carrying case. No coding required.',
    price: 69.99, comparePrice: 89.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'],
    category: 'Diagnostics', brand: 'BethMedic Pro', stock: 60, sku: 'BM-DX-001',
    tags: ['glucose', 'diabetes', 'blood sugar'], featured: true, active: true,
  },
  {
    name: 'Magnesium Glycinate 400mg',
    description: 'Highly bioavailable magnesium glycinate chelate for deep sleep, muscle relaxation, stress relief, and cardiovascular health. Gentle on the stomach.',
    price: 22.99, comparePrice: 29.99,
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600',
    images: ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=600'],
    category: 'Supplements', brand: 'BethMedic', stock: 180, sku: 'BM-SUP-005',
    tags: ['magnesium', 'sleep', 'relaxation'], featured: false, active: true,
  },
  {
    name: 'Surgical Disposable Masks 50pk',
    description: 'ASTM Level 3 rated surgical face masks with 3-ply filtration, fluid resistance, and comfortable ear loops. BFE 99%. Box of 50.',
    price: 18.99, comparePrice: 24.99,
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600',
    images: ['https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600'],
    category: 'Personal Care', brand: 'BethMedic', stock: 1000, sku: 'BM-PC-002',
    tags: ['mask', 'protection', 'surgical'], featured: false, active: true,
  },
];

async function main() {
  console.log('🌱 Seeding BethMedic database...\n');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bethmedic.com' },
    update: {},
    create: { name: 'Beth (Founder)', email: 'admin@bethmedic.com', password: adminPassword, role: 'ADMIN', phone: '+1-800-BETHMEDIC' },
  });
  console.log('✅ Admin:', admin.email);

  const custPass = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: { name: 'John Doe', email: 'customer@example.com', password: custPass, role: 'CUSTOMER' },
  });
  console.log('✅ Customer:', customer.email);

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { sku: product.sku } });
    if (!existing) {
      await prisma.product.create({ data: product });
      console.log('✅ Product:', product.name);
    } else {
      console.log('⏭  Exists:', product.name);
    }
  }

  console.log('\n🎉 Done!\nAdmin: admin@bethmedic.com / admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
