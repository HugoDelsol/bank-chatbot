"use client";

import { useState } from "react";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", content: "Bonjour, comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = input;
    
    setMessages([...messages, { sender: "user", content: input }]);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        conversationId: conversationId,
      }),
    });

    const data = await response.json();

    setConversationId(data.conversationId);
    setMessages((prev) => [...prev, { sender: 'bot', content: data.reply }]);
  }

  return (
    <div className={styles.wrapper}>
      <h1>Chat support banque</h1>

      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.messageRow} ${styles[msg.sender]}`}
          >
            <div className={`${styles.bubble} ${styles[msg.sender]}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
        />
        <button onClick={handleSend}>Envoyer</button>
      </ form>
    </ div>
  );
}