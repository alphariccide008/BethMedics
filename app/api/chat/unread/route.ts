import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { query } from '@/lib/db';

// Returns count of unread customer messages for the admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ count: 0 });
    }

    // Count messages sent by customers (senderRole = CUSTOMER) across all rooms
    // "Unread" = messages that arrived in the last 24 hours from customers
    // (Simple heuristic: admin marks as read by visiting the chat page)
    const result = await query(`
      SELECT COUNT(*) AS count
      FROM messages m
      WHERE m."senderRole" = 'CUSTOMER'
        AND m."createdAt" > NOW() - INTERVAL '24 hours'
    `);

    return NextResponse.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error('[CHAT UNREAD]', err);
    return NextResponse.json({ count: 0 });
  }
}
