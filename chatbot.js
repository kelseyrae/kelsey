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
        this.selectedModel = "Phi-3.5-mini-instruct-q4f16_1-MLC"; // ~2.2GB, excellent quality and instruction following
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
     * Tokenize query into searchable words
     */
    tokenize(text) {
        return text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2)
            .map(word => word.replace(/[^\w]/g, ''));
    }

    /**
     * Count occurrences of a word in text
     */
    countOccurrences(text, word) {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        const matches = text.match(regex);
        return matches ? matches.length : 0;
    }

    /**
     * Count how many chunks contain this term (for IDF calculation)
     */
    countChunksWithTerm(word) {
        if (!this.knowledgeBase || !this.knowledgeBase.chunks) return 1;
        
        let count = 0;
        for (const chunk of this.knowledgeBase.chunks) {
            const contentLower = chunk.content.toLowerCase();
            if (contentLower.includes(word)) {
                count++;
            }
        }
        return Math.max(count, 1); // Avoid division by zero
    }

    /**
     * Determine if query matches a category
     */
    queryMatchesCategory(query, category, subcategory) {
        const queryLower = query.toLowerCase();
        
        // Category keywords
        const categoryMap = {
            'experience': ['work', 'job', 'role', 'company', 'companies', 'position', 'worked', 'career', 'employed', 'where'],
            'skills': ['skill', 'expertise', 'technology', 'tech', 'know', 'experience with', 'technologies'],
            'education': ['school', 'university', 'degree', 'education', 'study', 'studied'],
            'projects': ['project', 'built', 'created', 'developed', 'made'],
            'achievements': ['achievement', 'accomplishment', 'success', 'result', 'impact', 'metric'],
            'contact': ['contact', 'reach', 'email', 'phone', 'linkedin', 'github'],
            'personal': ['hobby', 'personal', 'free time', 'spare time', 'interests'],
            'background': ['about', 'who', 'background', 'overview', 'tell me']
        };
        
        if (categoryMap[category]) {
            return categoryMap[category].some(keyword => queryLower.includes(keyword));
        }
        
        return false;
    }

    /**
     * Determine optimal topK based on query complexity
     */
    determineTopK(query) {
        const queryLower = query.toLowerCase();
        
        // List queries need more context to show all items
        if (queryLower.includes('companies') || 
            queryLower.includes('all') ||
            queryLower.includes('list') ||
            queryLower.includes('where has') ||
            queryLower.includes('worked at')) {
            return 10; // More chunks for comprehensive lists
        }
        
        // Broad overview queries need more context
        if (queryLower.includes('tell me about') || 
            queryLower.includes('overview') || 
            queryLower.includes('summary') ||
            queryLower.includes('background')) {
            return 8;
        }
        
        // Specific factual queries need focused context
        if (queryLower.includes('when') || 
            queryLower.includes('where') || 
            queryLower.includes('specific') ||
            queryLower.includes('how many') ||
            queryLower.includes('which')) {
            return 5;
        }
        
        // Default
        return 6;
    }

    /**
     * Get recency weight (more recent = higher score)
     */
    getRecencyWeight(timePeriod) {
        if (!timePeriod) return 1.0;
        
        const timeLower = timePeriod.toLowerCase();
        
        if (timeLower === 'current' || timeLower.includes('present') || timeLower.includes('2024')) {
            return 1.3;
        }
        if (timeLower.includes('2023') || timeLower.includes('2022')) {
            return 1.2;
        }
        if (timeLower.includes('2021') || timeLower.includes('2020')) {
            return 1.1;
        }
        
        return 1.0;
    }

    /**
     * Retrieve relevant context chunks based on user query
     * Uses BM25-style scoring with category boosting and dynamic topK
     */
    retrieveContext(query, topK = null) {
        if (!this.knowledgeBase || !this.knowledgeBase.chunks) {
            return [];
        }

        // Determine optimal topK if not specified
        if (topK === null) {
            topK = this.determineTopK(query);
        }

        const queryWords = this.tokenize(query);
        const totalChunks = this.knowledgeBase.chunks.length;

        // Score each chunk using BM25-inspired algorithm
        const scoredChunks = this.knowledgeBase.chunks.map(chunk => {
            let score = 0;

            // TF-IDF-like scoring
            queryWords.forEach(word => {
                const termFreq = this.countOccurrences(chunk.content, word);
                const docFreq = this.countChunksWithTerm(word);
                
                // BM25-style formula (simplified)
                if (termFreq > 0) {
                    const idf = Math.log((totalChunks - docFreq + 0.5) / (docFreq + 0.5) + 1);
                    const tf = (termFreq * 2.0) / (termFreq + 1.0); // Saturation function
                    score += tf * idf;
                }
            });

            // Keyword exact matches (high value)
            if (chunk.keywords) {
                chunk.keywords.forEach(keyword => {
                    const keywordLower = keyword.toLowerCase();
                    queryWords.forEach(word => {
                        if (keywordLower.includes(word) || word.includes(keywordLower)) {
                            score += 3;
                        }
                    });

                    // Exact keyword match in query
                    if (query.toLowerCase().includes(keywordLower)) {
                        score += 5;
                    }
                });
            }

            // Category boost (if query matches category)
            if (this.queryMatchesCategory(query, chunk.category, chunk.subcategory)) {
                score *= 1.5;
            }

            // Recency boost (more recent = slightly higher)
            if (chunk.time_period) {
                score *= this.getRecencyWeight(chunk.time_period);
            }

            // Confidence boost (high confidence chunks score slightly better)
            if (chunk.confidence === 'high') {
                score *= 1.1;
            }

            return { chunk, score };
        });

        // Sort by score and return top K
        const sortedChunks = scoredChunks
            .sort((a, b) => b.score - a.score);
        
        // Lower threshold to 0.1 to capture more relevant chunks
        const threshold = 0.1;
        const filteredChunks = sortedChunks.filter(item => item.score > threshold);
        
        return filteredChunks
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
        const systemPrompt = `You are a knowledgeable professional assistant providing accurate information about Kelsey Conophy, a technical AI product leader.

YOUR ROLE:
- Answer questions about Kelsey's background, experience, skills, projects, and achievements
- Be professional, concise, and informative
- Sound like you're representing her professionally (use third person: "Kelsey has..." not "I have...")

CRITICAL ACCURACY RULES:
1. ONLY use information explicitly stated in the provided context below
2. Quote numbers, percentages, and dates EXACTLY as stated (e.g., "40% reduction", "$2B in value")
3. Never invent or guess company names, technologies, or achievements
4. If the context doesn't contain the answer, respond: "I don't have that specific information in my knowledge base"
5. Do not extrapolate or make logical leaps beyond what's stated

FORMATTING GUIDELINES:
- For work history: Include role, company, dates, and key achievements
- For technical questions: List specific technologies and skills mentioned
- For achievements: Use exact metrics from the context (percentages, dollar amounts)
- Keep responses focused and well-structured
- Use bullet points for lists of items

REMEMBER: Accuracy is more important than being comprehensive. If you're unsure, say so.`;

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
                temperature: 0.5,
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
