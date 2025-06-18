class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();

    if (lower.includes("product")) {
      this.actionProvider.handleShowProducts();
      return;
    }

    this.actionProvider.handleDefault(message);
  }
}

export default MessageParser;