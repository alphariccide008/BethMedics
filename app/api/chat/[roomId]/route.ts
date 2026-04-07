import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db';

export async function GET(_: Request, { params }: { params: { roomId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const room = await query(`
      SELECT cr.*, json_build_object('name', u.name, 'email', u.email) AS "user"
      FROM chat_rooms cr JOIN users u ON u.id = cr."userId"
      WHERE cr.id = $1
    `, [params.roomId]);

    if (room.rows.length === 0) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    const messages = await query(
      'SELECT * FROM messages WHERE "roomId" = $1 ORDER BY "createdAt" ASC',
      [params.roomId]
    );

    // Mark messages as read
    const markRole = session.user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    await query(
      'UPDATE messages SET read = true WHERE "roomId" = $1 AND "senderRole" = $2 AND read = false',
      [params.roomId, markRole]
    );

    return NextResponse.json({ ...room.rows[0], messages: messages.rows });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });

    const id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const result = await query(
      `INSERT INTO messages (id, "roomId", content, "senderRole", "senderName", read, "createdAt")
       VALUES ($1,$2,$3,$4,$5,false,NOW()) RETURNING *`,
      [id, params.roomId, content.trim(), session.user.role, session.user.name || 'Unknown']
    );

    await query(
      'UPDATE chat_rooms SET "updatedAt" = NOW() WHERE id = $1',
      [params.roomId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
