import pool from "@/lib/db";
import { classify } from "@/lib/classify";

export async function POST(request) {
    try {
        const { message, conversationId } = await request.json();

        if (!message || !message.trim()) {
            return Response.json({ error: "Message vide" }, { status: 400 });
        }

        let currentConversationId = conversationId;

        if (!currentConversationId) {
            const [result] = await pool.query(
                "INSERT INTO conversations (status) VALUES ('active')"
            );
            currentConversationId = result.insertId;
        }

        const [categoryRows] = await pool.query("SELECT * FROM categories");
        const [keywordRows] = await pool.query("SELECT * FROM category_keywords");

        const categoriesWithKeywords = categoryRows.map((category) => {
            const categoryKeywords = keywordRows.filter(
                (k) => k.category_id === category.id
            );
            return {
                ...category,
                keywords: categoryKeywords.map((k) => k.keyword),
            };
        });

        const result = classify(message, categoriesWithKeywords);

        await pool.query(
            "INSERT INTO messages (conversation_id, sender, content, matched_category_id, match_score) VALUES (?, 'user', ?, ?, ?)",
            [currentConversationId, message, result.category?.id ?? null, result.score]
        );

        let botReply;

        if (result.escalate) {
            botReply = "Je vous transfère à un conseiller pour traiter votre demande.";
            await pool.query(
                "UPDATE conversations SET status = 'escalated', escalation_reason = ? WHERE id = ?",
                [result.reason, currentConversationId]
            );
        } else {
            const [articleRows] = await pool.query(
                "SELECT * FROM articles WHERE category_id = ? LIMIT 1",
                [result.category.id]
            );
            botReply = articleRows[0]?.content ?? "Je n'ai pas trouvé de réponse précise pour votre demande.";
        }

        await pool.query(
            "INSERT INTO messages (conversation_id, sender, content) VALUES (?, 'bot', ?)",
            [currentConversationId, botReply]
        );
        
        return Response.json({
            reply: botReply,
            conversationId: currentConversationId,
            escalate: result.escalate,
        });

        
    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}