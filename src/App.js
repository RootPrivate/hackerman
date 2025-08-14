import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000';

function App() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setStatus('Failed to fetch messages');
    }
  };

  // Send SMS
  const sendSMS = async () => {
    if (!to || !message) return;
    try {
      await axios.post(`${API}/send-sms`, { to, message });
      setMessage('');
      fetchMessages();
    } catch (err) {
      console.error(err);
      setStatus('Failed to send SMS');
    }
  };

  // Poll for new messages every 3 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">Google Voice</div>
        <button>Messages</button>
        <button>Voicemail</button>
        <button>Contacts</button>
      </div>

      {/* Main chat area */}
      <div className="main">
        <div className="header">Chat</div>

        <div className="messages">
          {messages.length === 0 && <div className="no-messages">No messages yet</div>}

          {messages.map((m, index) => (
            <div
              key={index}
              className={`message ${m.direction === 'outgoing' ? 'outgoing' : 'incoming'}`}
            >
              <div>{m.message}</div>
              <small>{new Date(m.created_at).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="composer">
          <input
            placeholder="Recipient number"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
          <textarea
            placeholder="Type a message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
          />
          <button onClick={sendSMS}>Send</button>
        </div>

        {status && <div className="status">{status}</div>}
      </div>
    </div>
  );
}

export default App;
