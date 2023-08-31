import React, { useState } from "react";

function ChatApp() {
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const apiKey = "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";
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const handleSendMessage = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const newMessage = { role: "user", content: inputMessage };
    setChatHistory([...chatHistory, newMessage]);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      ...chatHistory,
      newMessage,
    ];

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ messages: messages }),
      });

      const data = await response.json();
      const assistantReply = data.choices[0].message.content;
      const newAssistantMessage = {
        role: "assistant",
        content: assistantReply,
      };
      setChatHistory([...chatHistory, newAssistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="ChatApp">
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatApp;
