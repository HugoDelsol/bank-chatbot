import pool from "@/lib/db";

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const [rows] = await pool.query(
            `SELECT
                m.id,
                m.sender,
                m.content,
                m.match_score,
                m.created_at,
                c.name AS category_name
            FROM messages m
            LEFT JOIN categories c ON c.id = m.matched_category_id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC`,
            [id]
        );

        return Response.json({ messages: rows });
    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}