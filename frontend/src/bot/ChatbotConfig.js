import { createChatBotMessage } from "react-chatbot-kit";

const botName = "ShopBot";

const config = {
  botName,
  initialMessages: [
    createChatBotMessage(`Hi! I'm ${botName}. How can I help you today?`)
  ],
  customStyles: {
    botMessageBox: { backgroundColor: "#10b981" },
    chatButton: { backgroundColor: "#10b981" }
  }
};

export default config;