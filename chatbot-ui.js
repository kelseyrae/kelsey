/**
 * Chatbot UI Manager
 * Handles all UI interactions for the RAG chatbot
 */

class ChatbotUI {
    constructor() {
        this.chatbot = null;
        this.isOpen = false;
        this.isInitializing = false;
        this.messageHistory = [];
    }

    /**
     * Initialize the UI and attach event listeners
     */
    init() {
        // Check WebGPU support
        if (!RAGChatbot.isWebGPUSupported()) {
            console.warn('WebGPU not supported - chatbot will not be available');
            this.hideButton();
            return;
        }

        this.attachEventListeners();
        this.createChatbot();
        
        // Start preloading the model in the background
        this.preloadModel();
    }

    /**
     * Preload the model in the background when page loads
     */
    async preloadModel() {
        console.log('Starting background model preload...');
        
        try {
            await this.chatbot.initialize((progress) => {
                // Log progress to console, but don't show to user yet
                console.log('Preload progress:', progress.message);
            });
            
            console.log('Model preloaded successfully!');
        } catch (error) {
            console.error('Model preload failed:', error);
            // Don't show error to user - they'll see it when they open chat
            // Reset the loading flag so user can try again when opening chat
            this.chatbot.isLoading = false;
        }
    }

    /**
     * Create chatbot instance
     */
    createChatbot() {
        this.chatbot = new RAGChatbot();
    }

    /**
     * Hide the chat button if WebGPU is not supported
     */
    hideButton() {
        const button = document.getElementById('chat-button');
        if (button) {
            button.style.display = 'none';
        }
    }

    /**
     * Attach event listeners to UI elements
     */
    attachEventListeners() {
        // Chat button toggle
        const chatButton = document.getElementById('chat-button');
        if (chatButton) {
            chatButton.addEventListener('click', () => this.toggleChat());
        }

        // Close button
        const closeButton = document.getElementById('chat-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeChat());
        }

        // Send button
        const sendButton = document.getElementById('chat-send');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Input field - send on Enter
        const input = document.getElementById('chat-input');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    /**
     * Toggle chat window open/closed
     */
    async toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            await this.openChat();
        }
    }

    /**
     * Open chat window
     */
    async openChat() {
        try {
            const chatWindow = document.getElementById('chat-window');
            const chatButton = document.getElementById('chat-button');

            if (chatWindow) {
                chatWindow.classList.add('open');
                this.isOpen = true;
            } else {
                console.error('Chat window element not found');
                return;
            }

            if (chatButton) {
                chatButton.style.display = 'none';
            }

            // Initialize chatbot if not already initialized
            if (!this.chatbot.isInitialized && !this.isInitializing) {
                await this.initializeChatbot();
            }

            // Focus input
            const input = document.getElementById('chat-input');
            if (input) {
                input.focus();
            }
        } catch (error) {
            console.error('Error opening chat:', error);
            this.addSystemMessage('Failed to open chat. Please refresh the page.');
        }
    }

    /**
     * Close chat window
     */
    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');

        if (chatWindow) {
            chatWindow.classList.remove('open');
            this.isOpen = false;
        }

        if (chatButton) {
            chatButton.style.display = 'flex';
        }
    }

    /**
     * Initialize the chatbot (load model)
     */
    async initializeChatbot() {
        if (this.isInitializing) return;

        // If already initialized from preload, just show ready message
        if (this.chatbot.isInitialized) {
            this.addSystemMessage('Ready! Ask me anything about Kelsey.');
            this.enableInput();
            return;
        }

        this.isInitializing = true;
        this.addSystemMessage('Initializing AI assistant...');

        try {
            await this.chatbot.initialize((progress) => {
                this.updateSystemMessage(progress.message);
            });

            this.updateSystemMessage('Ready! Ask me anything about Kelsey.');
            this.enableInput();
        } catch (error) {
            this.updateSystemMessage(`Error: ${error.message}. Please refresh and try again.`);
            console.error('Initialization error:', error);
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Send a message
     */
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        if (!this.chatbot.isInitialized) {
            this.addSystemMessage('Please wait for the assistant to finish loading...');
            return;
        }

        // Clear input
        input.value = '';

        // Add user message to chat
        this.addUserMessage(message);

        // Disable input while processing
        this.disableInput();

        try {
            // Add a placeholder for the bot response
            const botMessageId = this.addBotMessage('');

            // Get response with streaming
            await this.chatbot.chat(message, (partialResponse) => {
                this.updateBotMessage(botMessageId, partialResponse);
            });

        } catch (error) {
            this.addSystemMessage(`Error: ${error.message}`);
            console.error('Chat error:', error);
        } finally {
            this.enableInput();
            input.focus();
        }
    }

    /**
     * Add a user message to the chat
     */
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        this.messageHistory.push({ role: 'user', content: message });
    }

    /**
     * Add a bot message to the chat (returns message ID for updating)
     */
    addBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message';
        messageDiv.textContent = message || 'Thinking...';
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        this.messageHistory.push({ role: 'assistant', content: message });
        return messageDiv;
    }

    /**
     * Update an existing bot message (for streaming)
     */
    updateBotMessage(messageElement, newContent) {
        if (messageElement) {
            messageElement.textContent = newContent;
            this.scrollToBottom();

            // Update in history
            if (this.messageHistory.length > 0) {
                this.messageHistory[this.messageHistory.length - 1].content = newContent;
            }
        }
    }

    /**
     * Add a system message to the chat
     */
    addSystemMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message system-message';
        messageDiv.id = 'system-message';
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Update the last system message
     */
    updateSystemMessage(message) {
        const systemMessage = document.getElementById('system-message');
        if (systemMessage) {
            systemMessage.textContent = message;
        } else {
            this.addSystemMessage(message);
        }
        this.scrollToBottom();
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    /**
     * Enable input field
     */
    enableInput() {
        const input = document.getElementById('chat-input');
        const sendButton = document.getElementById('chat-send');

        if (input) {
            input.disabled = false;
            input.placeholder = 'Ask me about Kelsey...';
        }

        if (sendButton) {
            sendButton.disabled = false;
        }
    }

    /**
     * Disable input field
     */
    disableInput() {
        const input = document.getElementById('chat-input');
        const sendButton = document.getElementById('chat-send');

        if (input) {
            input.disabled = true;
            input.placeholder = 'Processing...';
        }

        if (sendButton) {
            sendButton.disabled = true;
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const ui = new ChatbotUI();
    ui.init();
});
