export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [params.id]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const tags = Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);
    const images = data.image ? [data.image] : [];

    const result = await query(
      `UPDATE products SET name=$1, description=$2, price=$3, "comparePrice"=$4, image=$5, images=$6,
       category=$7, brand=$8, stock=$9, sku=$10, tags=$11, featured=$12, active=$13, "updatedAt"=NOW()
       WHERE id=$14 RETURNING *`,
      [data.name, data.description, data.price, data.comparePrice || null, data.image, images,
       data.category, data.brand || null, data.stock, data.sku || null, tags, data.featured, data.active, params.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await query('DELETE FROM products WHERE id = $1', [params.id]);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
