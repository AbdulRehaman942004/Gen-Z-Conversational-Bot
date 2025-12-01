import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Sup trouble 🤭 what’re we on rn?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sessionId = useRef(`session_${Date.now()}`)

  // Keep the cursor in the input whenever we're not loading
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const userInput = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message and create a placeholder bot message for streaming in one update
    setMessages(prev => [
      ...prev,
      userMessage,
      {
        role: 'bot',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }
    ])

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          session_id: sessionId.current
        })
      })

      if (!response.ok) {
        throw new Error('Stream request failed')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                setMessages(prev => {
                  const updated = [...prev]
                  const streamingIndex = updated.findIndex(m => m.isStreaming && m.role === 'bot')
                  if (streamingIndex !== -1) {
                    updated[streamingIndex] = {
                      role: 'bot',
                      content: `Error: ${data.error}`,
                      timestamp: new Date()
                    }
                  }
                  return updated
                })
                break
              }

              if (data.chunk) {
                accumulatedContent += data.chunk
                setMessages(prev => {
                  const updated = [...prev]
                  const streamingIndex = updated.findIndex(m => m.isStreaming && m.role === 'bot')
                  if (streamingIndex !== -1) {
                    updated[streamingIndex] = {
                      role: 'bot',
                      content: accumulatedContent,
                      timestamp: new Date(),
                      isStreaming: !data.done
                    }
                  }
                  return updated
                })
              }

              if (data.done) {
                setMessages(prev => {
                  const updated = [...prev]
                  const streamingIndex = updated.findIndex(m => m.isStreaming && m.role === 'bot')
                  if (streamingIndex !== -1) {
                    updated[streamingIndex] = {
                      role: 'bot',
                      content: data.full_response || accumulatedContent,
                      timestamp: new Date()
                    }
                  }
                  return updated
                })
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev]
        const streamingIndex = updated.findIndex(m => m.isStreaming && m.role === 'bot')
        if (streamingIndex !== -1) {
          updated[streamingIndex] = {
            role: 'bot',
            content: 'Connection error. Make sure the backend is running.',
            timestamp: new Date()
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-genz-darker via-genz-dark to-genz-darker">
      <div className="w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <header className="glass rounded-t-2xl p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-genz-purple to-genz-pink">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Gen Z Chatbot</h1>
              <p className="text-sm text-gray-400">AI-powered conversations</p>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 glass overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 animate-fade-in ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'bot' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-genz-purple to-genz-pink flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-genz-purple to-genz-pink text-white'
                    : 'glass-strong text-gray-100'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-genz-purple animate-pulse">|</span>
                  )}
                </p>
                <span className="text-xs opacity-60 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-genz-cyan to-genz-purple flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}


          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={sendMessage}
          className="glass rounded-b-2xl p-4 border-t border-white/10"
        >
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              autoFocus
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-genz-purple focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-genz-purple to-genz-pink rounded-xl text-white font-medium hover:from-genz-purple/90 hover:to-genz-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-genz-purple/20"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App

