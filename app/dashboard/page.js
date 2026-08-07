"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import styles from "./dashboard.module.css";
const statusStyles = {
    escalated: styles.statusEscalated,
    active: styles.statusActive,
    resolved: styles.statusResolved,
};

export default function DashboardPage() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchConversations() {
            const response = await fetch("/api/conversations");
            const data = await response.json();
            setConversations(data.conversations);
            setLoading(false);
        }

        fetchConversations();
    }, []);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className={styles.wrapper}>
            <h1>Dashboard d'audit</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Statut</th>
                        <th>Raison escalade</th>
                        <th>Messages</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {conversations.map((conv) => (
                        <tr key={conv.id}>
                            <td>
                                <Link href={`/dashboard/${conv.id}`}>{conv.id}</Link>
                            </td>
                            <td className={statusStyles[conv.status]}>{conv.status}</td>
                            <td>{conv.escalation_reason ?? "-"}</td>
                            <td>{conv.message_count}</td>
                            <td>{new Date(conv.started_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}