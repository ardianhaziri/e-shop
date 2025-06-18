import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../bot/ChatbotConfig";
import MessageParser from "../bot/MessageParser";
import ActionProvider from "../bot/ActionProvider";
import { FaRobot } from "react-icons/fa";
import "../bot/chatbot-dark.css";
const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
        style={{ transition: "all .3s" }}
      >
        {open && (
          <div className="mb-2 shadow-2xl rounded-lg overflow-hidden" style={{ width: "340px" }}>
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center focus:outline-none transition"
          aria-label="Chat with us"
        >
          <FaRobot size={26} />
        </button>
      </div>
    </div>
  );
};

export default ChatBotWidget;