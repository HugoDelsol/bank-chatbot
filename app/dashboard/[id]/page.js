"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./detail.module.css";

const senderStyles = {
    user: styles.senderUser,
    bot: styles.senderBot,
};

export default function ConversationDetailPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMessages() {
            const response = await fetch(`/api/conversations/${id}`);
            const data = await response.json();
            setMessages(data.messages);
            setLoading(false);
        }

        fetchMessages();
    }, [id]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className={styles.wrapper}>
            <h1>Conversation #{id}</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Émetteur</th>
                        <th>Message</th>
                        <th>Catégorie</th>
                        <th>Score</th>
                        <th>Heure</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((msg) => (
                        <tr key={msg.id}>
                            <td className={senderStyles[msg.sender]}>{msg.sender}</td>
                            <td>{msg.content}</td>
                            <td className={!msg.category_name ? styles.noCategory : ""}>
                                {msg.category_name ?? "—"}
                            </td>
                            <td>{msg.match_score ?? "—"}</td>
                            <td>{new Date(msg.created_at).toLocaleTimeString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}