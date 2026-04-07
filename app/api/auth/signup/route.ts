import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

    await query(
      `INSERT INTO users (id, name, email, password, phone, role, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,'CUSTOMER',NOW(),NOW())`,
      [id, name, email, hashed, phone || null]
    );

    return NextResponse.json({ message: 'Account created successfully!' }, { status: 201 });
  } catch (err) {
    console.error('[SIGNUP ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
