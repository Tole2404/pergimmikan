import React, { useState, useEffect, useRef } from 'react';
import './NailongChatbot.css';
import loadingImage from '../../assets/images/retro/loading.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getFriendlyErrorMessage = async (response) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (err) {
    payload = null;
  }

  const serverMessage = payload?.message || payload?.error || '';

  if (response.status === 401 || response.status === 403) {
    return serverMessage || 'Dongker gagal login ke layanan AI. Kemungkinan API key di backend tidak valid.';
  }

  if (response.status === 404) {
    return serverMessage || 'Endpoint chatbot tidak ditemukan.';
  }

  if (response.status === 429) {
    return serverMessage || 'Terlalu banyak permintaan. Coba lagi sebentar ya.';
  }

  if (response.status >= 500) {
    return serverMessage || 'Server AI sedang bermasalah.';
  }

  return serverMessage || 'Dongker lagi kesulitan menjawab.';
};

const DongkerChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'dongker',
      text: 'Halo, aku Dongker. Aku siap nemenin ngobrol santai, dengerin cerita kamu, atau bantuin cari info soal petualangan anak-anak PERGIMMIKAN. Lagi pengin bahas apa?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessageText = inputValue.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to list
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Format messages history for the API call (role and content format compatible with v2)
      const chatHistory = messages.map((msg) => ({
        role: msg.sender === 'dongker' ? 'assistant' : 'user',
        content: msg.text,
      }));

      // Add the latest user message
      chatHistory.push({
        role: 'user',
        content: userMessageText,
      });

      const response = await fetch(`${API_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error(await getFriendlyErrorMessage(response));
      }

      const data = await response.json();

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `dongker-${Date.now()}`,
          sender: 'dongker',
          text: data.reply || 'Oops, Dongker lagi nyelip di jalur retro. Coba kirim pesan lagi ya!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('Error chatting with Dongker:', error);
      setIsTyping(false);

      const errorMessage = (() => {
        const text = error?.message || '';

        if (text.toLowerCase().includes('api key') || text.toLowerCase().includes('unauthorized')) {
          return 'API key-nya sepertinya belum pas. Cek setting backend dulu ya.';
        }

        if (text.toLowerCase().includes('rate') || text.includes('429')) {
          return 'Dongker lagi capek karena kebanyakan dipanggil. Coba lagi sebentar ya.';
        }

        if (text.toLowerCase().includes('endpoint') || text.includes('404')) {
          return 'Route chatbot-nya belum ketemu. Coba cek URL backend-nya ya.';
        }

        if (text.toLowerCase().includes('server') || text.includes('502') || text.includes('500')) {
          return 'Server AI-nya lagi bermasalah. Bukan salah kamu kok.';
        }

        return 'Dongker lagi kesulitan terhubung. Coba kirim pesan lagi ya.';
      })();

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `dongker-err-${Date.now()}`,
            sender: 'dongker',
            text: errorMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="nailong-chatbot-container">
      {/* Floating Toggle Button */}
      <button
        className={`nailong-chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Tanya Dongker AI"
        title="Tanya Dongker AI"
      >
        <img src={loadingImage} alt="Dongker AI" />
        {!isOpen && <span className="nailong-chat-badge">AI Chat</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="nailong-chat-window">
          {/* Header */}
          <div className="nailong-chat-header">
            <div className="nailong-header-profile">
              <img src={loadingImage} alt="Dongker Avatar" className="nailong-header-avatar" />
              <div>
                <h4 className="nailong-header-title">Dongker Chatbot</h4>
                <span className="nailong-header-status">Dodo Hengker</span>
              </div>
            </div>
            <button className="nailong-chat-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {/* Messages Body */}
          <div className="nailong-chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`nailong-chat-msg ${msg.sender === 'user' ? 'user-msg' : 'nailong-msg'}`}
              >
                <div className="nailong-msg-bubble">
                  {msg.text}
                  <span className="nailong-msg-time">{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="nailong-chat-msg nailong-msg">
                <div className="nailong-msg-bubble typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form className="nailong-chat-footer" onSubmit={handleSend}>
            <input
              type="text"
              className="nailong-chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ketik pesan untuk Dongker..."
              maxLength={500}
            />
            <button type="submit" className="nailong-chat-send" disabled={!inputValue.trim()}>
              Kirim
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DongkerChatbot;
