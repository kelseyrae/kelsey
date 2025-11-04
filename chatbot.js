/**
 * RAG Chatbot using WebLLM
 * Runs entirely in the browser with no API costs
 */

class RAGChatbot {
    constructor() {
        this.engine = null;
        this.knowledgeBase = null;
        this.isInitialized = false;
        this.isLoading = false;
        this.selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC"; // ~2GB, good quality
    }

    /**
     * Initialize the chatbot - load knowledge base and WebLLM engine
     */
    async initialize(progressCallback) {
        if (this.isInitialized) return;
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            // Load knowledge base
            progressCallback({ stage: 'knowledge', message: 'Loading knowledge base...' });
            await this.loadKnowledgeBase();

            // Initialize WebLLM engine
            progressCallback({ stage: 'model', message: 'Loading AI model (this may take a minute on first load)...' });

            const { CreateMLCEngine } = await import("https://esm.run/@mlc-ai/web-llm");

            this.engine = await CreateMLCEngine(this.selectedModel, {
                initProgressCallback: (progress) => {
                    progressCallback({
                        stage: 'model',
                        message: `Loading model: ${progress.text}`,
                        progress: progress.progress
                    });
                }
            });

            this.isInitialized = true;
            this.isLoading = false;
            progressCallback({ stage: 'complete', message: 'Ready to chat!' });
        } catch (error) {
            this.isLoading = false;
            console.error('Failed to initialize chatbot:', error);
            throw new Error(`Initialization failed: ${error.message}`);
        }
    }

    /**
     * Load the knowledge base from JSON file
     */
    async loadKnowledgeBase() {
        try {
            const response = await fetch('knowledge-base.json');
            if (!response.ok) {
                throw new Error('Failed to load knowledge base');
            }
            this.knowledgeBase = await response.json();
        } catch (error) {
            console.error('Error loading knowledge base:', error);
            throw error;
        }
    }

    /**
     * Retrieve relevant context chunks based on user query
     * Uses simple keyword matching and scoring
     */
    retrieveContext(query, topK = 5) {
        if (!this.knowledgeBase || !this.knowledgeBase.chunks) {
            return [];
        }

        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

        // Score each chunk based on keyword matches
        const scoredChunks = this.knowledgeBase.chunks.map(chunk => {
            let score = 0;

            // Check content for query words
            const contentLower = chunk.content.toLowerCase();
            queryWords.forEach(word => {
                if (contentLower.includes(word)) {
                    score += 2;
                }
            });

            // Check keywords for exact matches
            if (chunk.keywords) {
                chunk.keywords.forEach(keyword => {
                    const keywordLower = keyword.toLowerCase();
                    queryWords.forEach(word => {
                        if (keywordLower.includes(word) || word.includes(keywordLower)) {
                            score += 3;
                        }
                    });

                    // Exact match bonus
                    if (queryLower.includes(keywordLower)) {
                        score += 5;
                    }
                });
            }

            return { chunk, score };
        });

        // Sort by score and return top K
        return scoredChunks
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
            .map(item => item.chunk);
    }

    /**
     * Generate a response to the user's question
     */
    async chat(userMessage, onStreamUpdate = null) {
        if (!this.isInitialized) {
            throw new Error('Chatbot not initialized. Please wait for initialization to complete.');
        }

        // Retrieve relevant context
        const relevantChunks = this.retrieveContext(userMessage);

        // Build context string
        let contextStr = '';
        if (relevantChunks.length > 0) {
            contextStr = 'Relevant information about Kelsey Conophy:\n\n';
            relevantChunks.forEach((chunk, idx) => {
                contextStr += `${idx + 1}. ${chunk.content}\n\n`;
            });
        }

        // Create the prompt with context
        const systemPrompt = `You are a helpful assistant answering questions about Kelsey Conophy's background, experience, and projects. Use the provided context to answer questions accurately. If the context doesn't contain enough information to answer the question, say so honestly. Keep responses concise and friendly.`;

        const userPrompt = contextStr
            ? `Context:\n${contextStr}\n\nQuestion: ${userMessage}\n\nAnswer based on the context above:`
            : `Question: ${userMessage}\n\nAnswer:`;

        // Generate response using WebLLM
        try {
            let fullResponse = '';

            const completion = await this.engine.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 512,
                stream: true,
            });

            // Stream the response
            for await (const chunk of completion) {
                const delta = chunk.choices[0]?.delta?.content || '';
                if (delta) {
                    fullResponse += delta;
                    if (onStreamUpdate) {
                        onStreamUpdate(fullResponse);
                    }
                }
            }

            return fullResponse;
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }

    /**
     * Reset the chat (clear conversation history)
     */
    async resetChat() {
        if (this.engine) {
            await this.engine.resetChat();
        }
    }

    /**
     * Check if WebGPU is supported
     */
    static isWebGPUSupported() {
        return 'gpu' in navigator;
    }
}

// Export for use in HTML
window.RAGChatbot = RAGChatbot;
