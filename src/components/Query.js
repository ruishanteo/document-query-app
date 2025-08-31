import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Query = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const onQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const cleanResponse = (text) => {
    // Remove bullet points, extra line spaces, and trim the text
    return text
      .replace(/^\s*[-*]\s+/gm, "") // Remove bullet points (e.g., "-", "*")
      .replace(/\n\s*\n/g, "\n") // Remove extra blank lines
      .trim(); // Trim leading/trailing spaces
  };

  const onSend = async () => {
    if (!query.trim()) return;
    try {
      const userMessage = { role: "user", content: query };
      setHistory((prevHistory) => [...prevHistory, userMessage]);

      const response = await axios.post(
        "http://localhost:8000/query/",
        { query, history },
        { headers: { "Content-Type": "application/json" } }
      );

      const botResponses = response.data.results.map((result) => ({
        role: "bot",
        content: cleanResponse(result.text),
      }));
      setHistory((prevHistory) => [...prevHistory, ...botResponses]);

      setQuery("");
    } catch (error) {
      console.error("Error querying chatbot", error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div style={styles.chatContainer}>
      <h2 style={styles.header}>Chat with the Bot</h2>
      <div ref={chatContainerRef} style={styles.chatBox}>
        {history.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === "user" ? styles.userMessage : styles.botMessage),
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={query}
          onChange={onQueryChange}
          placeholder="Type your message here..."
          style={styles.input}
        />
        <button onClick={onSend} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    width: "400px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    textAlign: "center",
    fontSize: "18px",
  },
  chatBox: {
    height: "400px",
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  message: {
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "8px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  userMessage: {
    backgroundColor: "#007bff",
    color: "white",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  botMessage: {
    backgroundColor: "#e9ecef",
    color: "#333",
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Query;
