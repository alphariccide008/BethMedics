const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = 'postgresql://bethmedic_user:evyFoPBSst18zb12aFFxwTZYi6DHVsD8@dpg-d7ae55vkijhs73dm2s9g-a.oregon-postgres.render.com/bethmedic?sslmode=require';

const client = new Client({ connectionString: DATABASE_URL });

const products = [
  { name: 'OmegaShield Omega-3 Fish Oil', description: 'Premium pharmaceutical-grade omega-3 fatty acids (EPA & DHA) for heart, brain, and joint health.', price: 24.99, comparePrice: 34.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', category: 'Supplements', brand: 'BethMedic', stock: 150, sku: 'BM-SUP-001', tags: ['omega-3','heart health'], featured: true },
  { name: 'ProBio+ Advanced Probiotic', description: '50 billion CFUs with 12 diverse strains for optimal gut health and immune support.', price: 34.99, comparePrice: 44.99, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600', category: 'Supplements', brand: 'BethMedic', stock: 80, sku: 'BM-SUP-002', tags: ['probiotics','gut health'], featured: true },
  { name: 'Digital Blood Pressure Monitor', description: 'Clinically validated upper arm blood pressure monitor with large LCD display and memory for 60 readings.', price: 89.99, comparePrice: 119.99, image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600', category: 'Medical Devices', brand: 'BethMedic Pro', stock: 45, sku: 'BM-DEV-001', tags: ['blood pressure','monitor'], featured: true },
  { name: 'Advanced First Aid Kit', description: '200-piece comprehensive first aid kit for home, office, and travel.', price: 49.99, comparePrice: 64.99, image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600', category: 'First Aid', brand: 'BethMedic', stock: 200, sku: 'BM-FA-001', tags: ['first aid','emergency'], featured: true },
  { name: 'Pulse Oximeter Pro', description: 'Fingertip pulse oximeter with OLED display for accurate SpO2 monitoring.', price: 39.99, comparePrice: 55.99, image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600', category: 'Medical Devices', brand: 'BethMedic Pro', stock: 120, sku: 'BM-DEV-002', tags: ['pulse oximeter','oxygen'], featured: false },
  { name: 'Vitamin D3 + K2 Complex', description: 'High-potency Vitamin D3 (5000 IU) with MK-7 Vitamin K2 for bone strength and immune support.', price: 19.99, comparePrice: 27.99, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600', category: 'Supplements', brand: 'BethMedic', stock: 300, sku: 'BM-SUP-003', tags: ['vitamin d','bone health'], featured: false },
  { name: 'Medical Grade Thermometer', description: 'Non-contact infrared forehead thermometer with 1-second reading and fever alert.', price: 59.99, comparePrice: 79.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', category: 'Medical Devices', brand: 'BethMedic Pro', stock: 75, sku: 'BM-DEV-003', tags: ['thermometer','fever'], featured: false },
  { name: 'Collagen Peptides Powder', description: 'Hydrolyzed collagen peptides for skin elasticity, joint support, and muscle recovery.', price: 44.99, comparePrice: 59.99, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600', category: 'Supplements', brand: 'BethMedic', stock: 90, sku: 'BM-SUP-004', tags: ['collagen','skin health'], featured: false },
  { name: 'Premium Hand Sanitizer 500ml', description: '75% alcohol-based hospital-grade hand sanitizer. Kills 99.9% of germs.', price: 14.99, comparePrice: 19.99, image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600', category: 'Personal Care', brand: 'BethMedic', stock: 500, sku: 'BM-PC-001', tags: ['sanitizer','hygiene'], featured: false },
  { name: 'Glucometer Starter Kit', description: 'Complete blood glucose monitoring system with meter, 100 test strips, and lancets.', price: 69.99, comparePrice: 89.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', category: 'Diagnostics', brand: 'BethMedic Pro', stock: 60, sku: 'BM-DX-001', tags: ['glucose','diabetes'], featured: true },
  { name: 'Magnesium Glycinate 400mg', description: 'Highly bioavailable magnesium for deep sleep, muscle relaxation, and stress relief.', price: 22.99, comparePrice: 29.99, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600', category: 'Supplements', brand: 'BethMedic', stock: 180, sku: 'BM-SUP-005', tags: ['magnesium','sleep'], featured: false },
  { name: 'Surgical Disposable Masks 50pk', description: 'ASTM Level 3 surgical face masks with 3-ply filtration. BFE 99%. Box of 50.', price: 18.99, comparePrice: 24.99, image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600', category: 'Personal Care', brand: 'BethMedic', stock: 1000, sku: 'BM-PC-002', tags: ['mask','protection'], featured: false },
];

function genId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

async function main() {
  await client.connect();
  console.log('✅ Connected to database!\n🌱 Seeding...\n');

  // Admin
  const adminPass = await bcrypt.hash('admin123', 12);
  const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', ['admin@bethmedic.com']);
  if (adminCheck.rows.length === 0) {
    await client.query(
      `INSERT INTO users (id, name, email, password, role, phone, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())`,
      [genId(), 'Beth (Founder)', 'admin@bethmedic.com', adminPass, 'ADMIN', '+1-800-BETHMEDIC']
    );
    console.log('✅ Admin created: admin@bethmedic.com');
  } else { console.log('⏭  Admin already exists'); }

  // Customer
  const custPass = await bcrypt.hash('customer123', 12);
  const custCheck = await client.query('SELECT id FROM users WHERE email = $1', ['customer@example.com']);
  if (custCheck.rows.length === 0) {
    await client.query(
      `INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`,
      [genId(), 'John Doe', 'customer@example.com', custPass, 'CUSTOMER']
    );
    console.log('✅ Customer created: customer@example.com');
  } else { console.log('⏭  Customer already exists'); }

  // Products
  for (const p of products) {
    const check = await client.query('SELECT id FROM products WHERE sku = $1', [p.sku]);
    if (check.rows.length === 0) {
      await client.query(
        `INSERT INTO products (id, name, description, price, "comparePrice", image, images, category, brand, stock, sku, tags, featured, active, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW())`,
        [genId(), p.name, p.description, p.price, p.comparePrice, p.image, [p.image], p.category, p.brand, p.stock, p.sku, p.tags, p.featured, true]
      );
      console.log('✅ Product:', p.name);
    } else { console.log('⏭  Exists:', p.name); }
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\nAdmin:    admin@bethmedic.com / admin123');
  console.log('Customer: customer@example.com / customer123');

  await client.end();
}

main().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
