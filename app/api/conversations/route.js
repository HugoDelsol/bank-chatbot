import pool from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await pool.query(`
      SELECT
        c.id,
        c.status,
        c.escalation_reason,
        c.started_at,
        COUNT(m.id) AS message_count
      FROM conversations c
      LEFT JOIN messages m ON m.conversation_id = c.id
      GROUP BY c.id
      ORDER BY CASE WHEN c.status = 'escalated' THEN 0 ELSE 1 END, c.started_at DESC
    `);

        return Response.json({ conversations: rows });
    } catch (error) {
        console.error(error, "test");
        return Response.json({ error: error.message }, { status: 500 });
    }
}