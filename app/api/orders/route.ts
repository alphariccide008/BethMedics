import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool, { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items, address, city, country, phone, notes } = await req.json();
    if (!items?.length) return NextResponse.json({ error: 'No items in order' }, { status: 400 });

    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const orderId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO orders (id, "userId", total, status, address, city, country, phone, notes, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,'PENDING',$4,$5,$6,$7,$8,NOW(),NOW())`,
        [orderId, session.user.id, total, address, city, country, phone, notes || null]
      );

      for (const item of items) {
        const itemId = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        await client.query(
          `INSERT INTO order_items (id, "orderId", "productId", quantity, price) VALUES ($1,$2,$3,$4,$5)`,
          [itemId, orderId, item.id, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    const order = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    return NextResponse.json(order.rows[0], { status: 201 });
  } catch (err) {
    console.error('[ORDERS POST]', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let sql = `
      SELECT o.*,
        json_build_object('name', u.name, 'email', u.email) AS "user",
        (SELECT json_agg(json_build_object(
          'id', oi.id, 'productId', oi."productId", 'quantity', oi.quantity, 'price', oi.price,
          'product', json_build_object('name', p.name, 'image', p.image)
        )) FROM order_items oi JOIN products p ON p.id = oi."productId" WHERE oi."orderId" = o.id) AS items
      FROM orders o
      JOIN users u ON u.id = o."userId"
    `;
    const params: any[] = [];

    if (session.user.role !== 'ADMIN') {
      sql += ' WHERE o."userId" = $1';
      params.push(session.user.id);
    }

    sql += ' ORDER BY o."createdAt" DESC';

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('[ORDERS GET]', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
