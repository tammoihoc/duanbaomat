import { useState } from "react";
import { MessageCircle, X, Send, Zap } from "lucide-react";
import "./ChatBot.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Xin chào! Tôi là AI Assistant của ShopPC. Tôi có thể giúp gì cho bạn?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isBot: false }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Cảm ơn bạn! Nhân viên sẽ liên hệ hỗ trợ bạn ngay. Hoặc bạn có thể gọi hotline 1900 1234 để được tư vấn trực tiếp.",
        isBot: true 
      }]);
    }, 1000);
    
    setInput("");
  };

  return (
    <>
      <button className={`chat-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      <div className={`chat-window ${isOpen ? "active" : ""}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <Zap size={20} />
            <div>
              <h4>AI Support</h4>
              <p>Online • Trả lời ngay</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)}><X size={18} /></button>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.isBot ? "bot" : "user"}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}
        </div>
        
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Nhập câu hỏi của bạn..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
