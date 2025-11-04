# RAG Chatbot for Personal Website

A completely free, browser-based RAG (Retrieval-Augmented Generation) chatbot that runs entirely on the client side with **zero hosting or inference costs**.

## Features

- **100% Free**: No API costs, no hosting fees, no usage limits
- **Client-Side Only**: Runs entirely in the browser using WebLLM and WebGPU
- **Privacy-Friendly**: No data sent to external servers (except for model downloads)
- **RAG-Powered**: Uses keyword-based retrieval to ground responses in your actual background and experience
- **Minimal Hallucinations**: Responses are grounded in the knowledge base content
- **Small & Fast**: Uses quantized models (Phi-3-mini ~2GB) that run efficiently in browsers

## How It Works

### Architecture

1. **Knowledge Base** (`knowledge-base.json`): Contains structured information about your background, experience, and projects
2. **RAG Retrieval** (`chatbot.js`): Simple keyword-based search to find relevant context chunks
3. **WebLLM Integration** (`chatbot.js`): Loads and runs quantized LLMs directly in the browser using WebGPU
4. **UI Components** (`chatbot-ui.js`, `chatbot.css`): Chat interface and interaction handling

### Technology Stack

- **WebLLM**: Framework for running LLMs in the browser using WebGPU
- **Model**: Phi-3-mini-4k-instruct-q4f16_1 (~2GB quantized model)
- **No Backend**: Pure static HTML/CSS/JavaScript

## Browser Requirements

- **WebGPU Support Required**: Modern browsers with WebGPU enabled
  - Chrome/Edge 113+ (enable `chrome://flags/#enable-unsafe-webgpu`)
  - Firefox Nightly with WebGPU enabled
  - Safari Technology Preview on macOS 14+

- **Recommended**: 8GB+ RAM for smooth performance
- **Storage**: ~2-3GB for model caching (downloaded once)

## Files

- `index.html` - Main website with chatbot integration
- `chatbot.js` - Core RAG chatbot logic and WebLLM integration
- `chatbot-ui.js` - UI interaction handling
- `chatbot.css` - Chatbot styling
- `knowledge-base.json` - Structured knowledge about you

## Customization

### Update Knowledge Base

Edit `knowledge-base.json` to add/modify information:

```json
{
  "chunks": [
    {
      "id": "unique-id",
      "category": "background|projects|skills|contact|personal",
      "content": "The actual information content...",
      "keywords": ["keyword1", "keyword2"]
    }
  ]
}
```

### Change Model

In `chatbot.js`, update the `selectedModel` to use a different model:

```javascript
this.selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC"; // Smaller, faster
// or
this.selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC"; // Default, better quality
```

Available models: https://github.com/mlc-ai/web-llm#models

### Customize UI

- Edit `chatbot.css` to change colors, sizes, positioning
- Modify `chatbot-ui.js` to change behavior and messages
- Update the chat button emoji/text in `index.html`

## Performance Notes

- **First Load**: Model downloads ~2GB (cached for future visits)
- **Subsequent Loads**: Fast, uses cached model
- **Response Time**: 1-3 seconds per response depending on hardware
- **RAM Usage**: ~2-4GB while chatbot is active

## Limitations

- Requires modern browser with WebGPU support
- Model download required on first use (2GB+)
- Performance varies by device (faster on desktop, slower on mobile)
- Simple keyword-based retrieval (not semantic/embedding-based)
- Limited to knowledge in the knowledge base

## Cost Comparison

| Solution | Setup Cost | Per-Query Cost | Monthly Cost (1000 queries) |
|----------|------------|----------------|------------------------------|
| **This (WebLLM)** | $0 | $0 | $0 |
| API with user keys | $0 | ~$0.01 | ~$10 |
| Hosted RAG (AWS) | ~$50/mo | ~$0.001 | ~$51 |
| Full API backend | ~$20/mo | ~$0.01 | ~$30 |

## Future Enhancements

Potential improvements:
- Semantic search using lightweight embeddings (e.g., all-MiniLM)
- Conversation history/context
- Multi-turn conversations
- Model selection UI
- Offline PWA support

## Credits

- **WebLLM**: https://github.com/mlc-ai/web-llm
- **Model**: Phi-3-mini by Microsoft (https://huggingface.co/microsoft/Phi-3-mini-4k-instruct)

## License

MIT License - Feel free to use for your own website!
