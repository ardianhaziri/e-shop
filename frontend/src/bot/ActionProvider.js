import { createChatBotMessage } from "react-chatbot-kit";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleShowProducts = async () => {
    try {
      // Use your backend endpoint for products
      const res = await fetch("/api/products"); // Change path if needed
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const names = data.map(p => p.name).join(", ");
        this.addMessage(this.createChatBotMessage(`We have: ${names}`));
      } else {
        this.addMessage(this.createChatBotMessage("Sorry, no products were found."));
      }
    } catch (err) {
      this.addMessage(this.createChatBotMessage("Sorry, I couldn't fetch products right now."));
    }
  };

  handleDefault = (message) => {
    this.addMessage(this.createChatBotMessage("You can ask me about products, stock, or how to order!"));
  };

  addMessage = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };
}

export default ActionProvider;