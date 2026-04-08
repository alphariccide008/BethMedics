export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.user.role === 'ADMIN') {
      const result = await query(`
        SELECT cr.*, json_build_object('name', u.name, 'email', u.email) AS "user",
          (SELECT json_agg(m ORDER BY m."createdAt" ASC) FROM messages m WHERE m."roomId" = cr.id LIMIT 1) AS messages
        FROM chat_rooms cr
        JOIN users u ON u.id = cr."userId"
        ORDER BY cr."updatedAt" DESC
      `);
      return NextResponse.json(result.rows);
    } else {
      // Get or create room for customer
      let room = await query(
        'SELECT * FROM chat_rooms WHERE "userId" = $1 ORDER BY "createdAt" ASC LIMIT 1',
        [session.user.id]
      );

      if (room.rows.length === 0) {
        const id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        await query(
          `INSERT INTO chat_rooms (id, "userId", status, "createdAt", "updatedAt") VALUES ($1,$2,'OPEN',NOW(),NOW())`,
          [id, session.user.id]
        );
        room = await query('SELECT * FROM chat_rooms WHERE id = $1', [id]);
      }

      const messages = await query(
        'SELECT * FROM messages WHERE "roomId" = $1 ORDER BY "createdAt" ASC',
        [room.rows[0].id]
      );

      return NextResponse.json({ ...room.rows[0], messages: messages.rows });
    }
  } catch (err) {
    console.error('[CHAT GET]', err);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}
