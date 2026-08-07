"use client";

import { useState } from "react";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", content: "Bonjour, comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", content: input }]);
    setInput("");
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

      <div className={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
}