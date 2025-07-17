import React, { useRef, useState, useEffect } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import axios from "../lib/axios";

const ShopBotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm ShopBot. Ask me about products!" }
  ]);
  const [lastFoundProduct, setLastFoundProduct] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isBotTyping]);

  function extractProductName(userMsg) {
    const patterns = [
      /do you have\s+(.+?)\s*\?*$/i,
      /is that product available\?*\s*(.+)?$/i,
      /have\s+(.+?)\s*\?*$/i,
      /product\s+(.+?)\s*\?*$/i
    ];
    for (let regex of patterns) {
      const match = userMsg.match(regex);
      if (match && match[1]) return match[1].trim();
    }
    if (userMsg.split(" ").length === 1) return userMsg.trim();
    return null;
  }

  function isLinkRequest(userMsg) {
    return /link|url|where can i find|show me (the )?(product )?link/i.test(userMsg);
  }

  function isFunctionalityQuestion(userMsg) {
    return /what can i do in this shopping app\??/i.test(userMsg.trim());
  }

  // Helper to generate the bot reply (returns JSX or string)
  const getBotReply = async (userMsg) => {
    // 1. Functionalities question
    if (isFunctionalityQuestion(userMsg)) {
      return (
        <>
          In this shopping app, you can:
          <ul className="list-disc ml-6 mt-2 text-emerald-300">
            <li>Explore products by category or search</li>
            <li>Chat with me (the ShopBot) for help finding products</li>
            <li>View detailed information about each product</li>
            <li>Use gift cards for your purchases</li>
            <li>Pay securely using Stripe, either by card or with Link</li>
          </ul>
        </>
      );
    }

    // 2. Link request
    if (isLinkRequest(userMsg)) {
      if (lastFoundProduct) {
        const url = `/product/${lastFoundProduct._id}`;
        return (
          <>
            {lastFoundProduct.name} is available here:{" "}
            <a
              href={url}
              className="text-emerald-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </>
        );
      } else {
        return "Please ask for a product first!";
      }
    }

    // 3. Product request
    const productName = extractProductName(userMsg);
    if (!productName) {
      setLastFoundProduct(null);
      return "Please specify a product name.";
    }

    try {
      const res = await axios.get(
        `/products/find/by-name?name=${encodeURIComponent(productName)}`
      );
      const product = res.data.product;
      if (!product) {
        setLastFoundProduct(null);
        return `We don't have ${productName} in our Shop.`;
      } else if (product.stock > 0) {
        setLastFoundProduct(product);
        return `Yes, we have "${product.name}" and it is available (stock: ${product.stock}).`;
      } else {
        setLastFoundProduct(product);
        return `"${product.name}" is currently out of stock.`;
      }
    } catch {
      setLastFoundProduct(null);
      return `We don't have ${productName} in our Shop.`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setIsBotTyping(true);

    setTimeout(async () => {
      const botReply = await getBotReply(userMsg);
      setMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
      setIsBotTyping(false);
    }, 1200);
  };

  // Render message content, supporting React nodes for bot messages with links or lists
  const renderMessage = (msg, i) => {
    if (msg.from === "bot" && typeof msg.text !== "string") {
      return (
        <div key={i} className="flex justify-start">
          <div className="rounded px-3 py-1 my-1 bg-gray-700 text-emerald-300">
            {msg.text}
          </div>
        </div>
      );
    }
    return (
      <div
        key={i}
        className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`rounded px-3 py-1 my-1 ${
            msg.from === "user"
              ? "bg-emerald-600 text-white"
              : "bg-gray-700 text-emerald-300"
          }`}
        >
          {msg.text}
        </div>
      </div>
    );
  };

  return (
    <div>
      {!open && (
        <button
          className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg z-50"
          aria-label="Open ShopBot"
          onClick={() => setOpen(true)}
        >
          <FiMessageCircle size={28} />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 max-w-[90vw] bg-gray-900 text-white rounded-lg shadow-2xl z-50 flex flex-col" style={{ minHeight: 400 }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-emerald-700 rounded-t-lg">
            <span className="font-bold">ShopBot</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
              <FiX size={22} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2" style={{ maxHeight: 300 }}>
            {messages.map(renderMessage)}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="rounded px-3 py-1 my-1 bg-gray-700 text-emerald-300 animate-pulse">
                  ShopBot is typing<span className="animate-bounce">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center border-t border-gray-700 p-2 bg-gray-800 rounded-b-lg">
            <input
              type="text"
              className="flex-1 bg-transparent text-white placeholder-gray-400 p-2 outline-none"
              placeholder='Ask me about products...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              autoFocus
            />
            <button onClick={sendMessage} className="ml-2 p-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white">
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopBotWidget;