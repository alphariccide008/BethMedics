export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '100');

    let sql = 'SELECT * FROM products WHERE active = true';
    const params: any[] = [];
    let idx = 1;

    if (category && category !== 'All') {
      sql += ` AND category = $${idx++}`;
      params.push(category);
    }
    if (featured === 'true') {
      sql += ` AND featured = true`;
    }
    if (search) {
      sql += ` AND (name ILIKE $${idx} OR description ILIKE $${idx} OR category ILIKE $${idx} OR brand ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    sql += ` ORDER BY "createdAt" DESC LIMIT $${idx}`;
    params.push(limit);

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('[PRODUCTS GET]', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const images = data.image ? [data.image] : [];

    const result = await query(
      `INSERT INTO products (id, name, description, price, "comparePrice", image, images, category, brand, stock, sku, tags, featured, active, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW()) RETURNING *`,
      [id, data.name, data.description, data.price, data.comparePrice || null, data.image, images,
       data.category, data.brand || null, data.stock || 0, data.sku || null, tags, data.featured ?? false, data.active ?? true]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('[PRODUCTS POST]', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
