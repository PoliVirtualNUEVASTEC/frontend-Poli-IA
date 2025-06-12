import React, { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // ✅ Importante para estilos
import chatbotIcon from "../assets/icon_PoliIA.ico";
import { fetchData } from "../services/api";
import "../chatbot.css";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newUserMessage: Message = { text: inputValue, sender: "user" };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    if (showWelcome) setShowWelcome(false);
    setInputValue("");
    setIsTyping(true);

    try {
      const formattedMessages = updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const responseText = await fetchData(formattedMessages);
      const newBotMessage: Message = { text: responseText, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error("Error al obtener respuesta del chatbot:", error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages]);

  return (
    <div className="chatbot-container">
      <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <img src={chatbotIcon} alt="Chatbot" className="chatbot-icon" />}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <img src={chatbotIcon} alt="Chatbot" className="chatbot-header-icon" />
            <span className="chatbot-header-title">Poli - IA</span>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-content">
            {showWelcome && (
              <div className="chatbot-welcome">
                <p className="chatbot-welcome-text">Hola, soy Poli - IA</p>
                <img src={chatbotIcon} alt="Avatar Chatbot" className="chatbot-avatar" />
                <p className="chatbot-question">¿En qué puedo ayudarte?</p>
              </div>
            )}

            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chatbot-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}>
                  <ReactMarkdown
                    children={msg.text}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  />
                </div>
              ))}

              {isTyping && (
                <div className="typing-dots">
                {[".", ".", "."].map((dot, index) => (
                  <motion.span
                    key={index}
                    style={{ display: "inline-block", marginRight: "2px" }}
                    initial={{ y: 0, opacity: 0.3 }}
                    animate={{ y: [-3, 3, -3], opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.3, // cada punto inicia después del anterior
                      repeat: Infinity,
                      repeatDelay: index === 2 ? 1 : 0, // solo el último punto espera 1s antes de reiniciar
                    }}
                  >
                    {dot}
                  </motion.span>
                ))}
              </div>              
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="chatbot-input-container">
            <input
              type="text"
              placeholder="Pregunta lo que quieras"
              className="chatbot-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button className="chatbot-send-button" onClick={sendMessage}>
              <Send size={20} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
