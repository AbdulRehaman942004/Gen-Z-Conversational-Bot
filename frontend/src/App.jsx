import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, ChevronDown, LogOut, Menu, X, Settings, MessageSquare, Home, Sparkles, Zap, Brain, MessageCircle, Mail, UserCircle, Smile } from 'lucide-react'
import Login from './Login'
import HomePage from './pages/Home'
import ChatsPage from './pages/Chats'
import AIModesPage from './pages/AIModes'
import SettingsPage from './pages/Settings'

// Simple markdown parser for italic (*text*) and bold (**text**)
function parseMarkdown(text) {
  if (!text) return ''
  
  // Escape HTML to prevent XSS
  let parsed = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Use a unique placeholder that won't appear in text
  const BOLD_OPEN = '___BOLD_OPEN___'
  const BOLD_CLOSE = '___BOLD_CLOSE___'
  
  // Step 1: Convert **bold** to placeholders (must be done first)
  parsed = parsed.replace(/\*\*([^*]+?)\*\*/g, `${BOLD_OPEN}$1${BOLD_CLOSE}`)
  
  // Step 2: Convert *italic* to <em>italic</em> (remaining single asterisks)
  parsed = parsed.replace(/\*([^*]+?)\*/g, '<em>$1</em>')
  
  // Step 3: Replace bold placeholders with <strong> tags
  parsed = parsed.replace(new RegExp(BOLD_OPEN, 'g'), '<strong>')
  parsed = parsed.replace(new RegExp(BOLD_CLOSE, 'g'), '</strong>')
  
  return parsed
}

function App() {
  // Authentication state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('chat') // 'home', 'chats', 'aimodes', 'settings', 'chat'

  // Get initial greeting based on default personality
  const getInitialGreeting = (personalityKey, personalitiesList) => {
    const personality = personalitiesList.find(p => p.key === personalityKey)
    return personality?.greeting || "Sup trouble 🤭 what're we on rn?"
  }

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [personalities, setPersonalities] = useState([])
  const [selectedPersonality, setSelectedPersonality] = useState('default')
  const [personalitiesLoading, setPersonalitiesLoading] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sessionId = useRef(`session_${Date.now()}`)

  // Fetch personalities on mount
  useEffect(() => {
    const fetchPersonalities = async () => {
      setPersonalitiesLoading(true)
      try {
        const response = await fetch('/api/personalities')
        if (response.ok) {
          const data = await response.json()
          const fetchedPersonalities = data.personalities || []
          console.log('Fetched personalities:', fetchedPersonalities)
          setPersonalities(fetchedPersonalities)
          
          // If no personality is selected or selected one doesn't exist, set to first available
          if (fetchedPersonalities.length > 0) {
            const validPersonality = fetchedPersonalities.find(p => p.key === selectedPersonality)
            if (!validPersonality) {
              setSelectedPersonality(fetchedPersonalities[0].key)
            }
            // Set initial greeting message
            const currentPersonality = fetchedPersonalities.find(p => p.key === selectedPersonality) || fetchedPersonalities[0]
            setMessages([
              {
                role: 'bot',
                content: currentPersonality.greeting || "Sup trouble 🤭 what're we on rn?",
                timestamp: new Date()
              }
            ])
          }
        } else {
          console.error('Failed to fetch personalities:', response.status, response.statusText)
          setPersonalities([
            { key: 'default', label: 'Gen-Z Chaotic' }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch personalities:', error)
        setPersonalities([
          { key: 'default', label: 'Gen-Z Chaotic' }
        ])
      } finally {
        setPersonalitiesLoading(false)
      }
    }
    if (user) {
      fetchPersonalities()
    }
  }, [user, selectedPersonality])

  // Keep the cursor in the input whenever we're not loading
  useEffect(() => {
    if (!isLoading && user) {
      inputRef.current?.focus()
    }
  }, [isLoading, user])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmojiPicker])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle personality change - reset session and clear messages
  const handlePersonalityChange = (e) => {
    const newPersonality = e.target.value
    if (newPersonality === selectedPersonality) return
    
    console.log('Personality changed from', selectedPersonality, 'to', newPersonality)
    setSelectedPersonality(newPersonality)
    
    // Reset session to apply new personality
    sessionId.current = `session_${Date.now()}`
    
    // Get greeting for the new personality
    const newPersonalityData = personalities.find(p => p.key === newPersonality)
    const greeting = newPersonalityData?.greeting || "Sup trouble 🤭 what're we on rn?"
    
    // Clear messages and show new personality greeting
    setMessages([
      {
        role: 'bot',
        content: greeting,
        timestamp: new Date()
      }
    ])
  }

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

    // Add user message immediately - FIX: Ensure it's added to state
    setMessages(prev => {
      // Check if user message already exists to avoid duplicates
      const lastMessage = prev[prev.length - 1]
      if (lastMessage && lastMessage.role === 'user' && lastMessage.content === userInput) {
        return prev
      }
      return [
      ...prev,
      userMessage,
      {
        role: 'bot',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }
      ]
    })

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          session_id: sessionId.current,
          personality: selectedPersonality
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
        buffer = lines.pop() || ''

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

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setMessages([])
    setSidebarOpen(false)
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-2xl border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-neutral-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 shadow-xl border-2 border-white/20">
                  <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <h2 className="text-lg font-bold gradient-text">AI Assistant</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                currentPage === 'home'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentPage('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                currentPage === 'chat'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setCurrentPage('chats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                currentPage === 'chats'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Chats</span>
            </button>
            <button
              onClick={() => setCurrentPage('aimodes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                currentPage === 'aimodes'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>AI Modes</span>
            </button>
            <button
              onClick={() => setCurrentPage('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
                currentPage === 'settings'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Settings</span>
            </button>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-neutral-200/50">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md border border-white/30">
                <UserCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{user.name || 'User'}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary-600" />
                  <p className="text-xs text-neutral-600 truncate">{user.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'chats' && <ChatsPage />}
        {currentPage === 'aimodes' && (
          <AIModesPage 
            onModeSelect={(modeId) => {
              setSelectedPersonality(modeId)
              setCurrentPage('chat')
              // Reset session when switching personality
              sessionId.current = `session_${Date.now()}`
              // Get greeting for the new personality
              const newPersonalityData = personalities.find(p => p.key === modeId)
              const greeting = newPersonalityData?.greeting || "Sup trouble 🤭 what're we on rn?"
              setMessages([
                {
                  role: 'bot',
                  content: greeting,
                  timestamp: new Date()
                }
              ])
            }}
          />
        )}
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'chat' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[92vh] flex flex-col bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
            <header className="bg-gradient-to-r from-white/90 via-primary-50/30 to-white/90 border-b border-white/30 px-8 py-5 backdrop-blur-md">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <Menu className="w-6 h-6 text-neutral-700" />
                  </button>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 shadow-xl border-2 border-white/20">
                    <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
            <div>
                    <h1 className="text-2xl font-bold gradient-text">AI Assistant</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">Intelligent conversation interface</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <label htmlFor="personality-select" className="text-sm font-semibold text-neutral-700 whitespace-nowrap">
                    Conversation Mode:
                  </label>
                  <div className="relative min-w-[200px]">
                    <select
                      id="personality-select"
                      value={selectedPersonality}
                      onChange={handlePersonalityChange}
                      className="appearance-none bg-white border border-neutral-300 rounded-xl px-4 py-2.5 pr-10 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all cursor-pointer hover:border-primary-400 hover:shadow-sm w-full disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                      disabled={personalitiesLoading || personalities.length === 0}
                    >
                      {personalitiesLoading ? (
                        <option value="default">Loading...</option>
                      ) : personalities.length === 0 ? (
                        <option value="default">No modes available</option>
                      ) : (
                        personalities.map((personality) => (
                          <option key={personality.key} value={personality.key} className="bg-white text-neutral-900">
                            {personality.label}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
            </div>
          </div>
        </header>

        {/* Messages Container */}
            <div className="flex-1 bg-gradient-to-b from-white/40 via-white/60 to-white/40 overflow-y-auto px-8 py-6 space-y-5 backdrop-blur-sm">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 mb-4">
                      <MessageCircle className="w-12 h-12 text-primary-600" />
                    </div>
                    <p className="text-neutral-500 text-lg font-medium">Start a conversation</p>
                    <p className="text-neutral-400 text-sm mt-1">Send a message to begin chatting</p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
            <div
              key={index}
                    className={`flex gap-4 animate-slide-in ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
                    {message.role === 'bot' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center shadow-sm border border-primary-200/50">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                      </div>
                    )}
              
              <div
                      className={`max-w-[78%] message-bubble ${
                        message.role === 'user'
                          ? 'premium-shadow'
                          : 'bg-white/90 backdrop-blur-sm border border-primary-200/30 text-neutral-900'
                      }`}
                      style={message.role === 'user' ? {
                        background: 'linear-gradient(to bottom right, #2563EB, #3B82F6)',
                        color: 'white'
                      } : {}}
                    >
                      <div 
                        className="text-[15px] leading-relaxed whitespace-pre-wrap"
                        style={message.role === 'user' ? { color: 'white' } : { color: '#1F2937' }}
                      >
                        {message.content ? (
                          <span 
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                          />
                        ) : null}
                  {message.isStreaming && (
                          <span className={`inline-block w-2 h-4 ml-1.5 ${
                            message.role === 'user' ? 'bg-white/80' : 'bg-primary-500'
                          } animate-pulse rounded`}>|</span>
                        )}
                      </div>
                      <span 
                        className="text-xs mt-2.5 block font-medium"
                        style={message.role === 'user' ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#6B7280' }}
                      >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg border-2 border-white/20">
                  <UserCircle className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
              )}
            </div>
                ))
              )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={sendMessage}
              className="bg-gradient-to-r from-white/90 via-primary-50/30 to-white/90 border-t border-white/30 px-8 py-5 backdrop-blur-md"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative emoji-picker-container">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                autoFocus
                className="w-full bg-white border border-neutral-300 rounded-xl px-5 py-3.5 pr-12 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-[15px] shadow-sm hover:shadow-md focus:shadow-md"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <Smile className="w-5 h-5 text-neutral-500 hover:text-primary-600" />
              </button>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-neutral-200 rounded-xl shadow-xl p-4 w-80 max-h-64 overflow-y-auto z-50 emoji-picker-container">
                  <div className="grid grid-cols-8 gap-2">
                    {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInput(prev => prev + emoji)
                          setShowEmojiPicker(false)
                          inputRef.current?.focus()
                        }}
                        className="text-2xl hover:bg-neutral-100 rounded-lg p-2 transition-colors hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-7 py-3.5 btn-primary rounded-xl flex items-center gap-2.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span className="font-semibold">Send</span>
            </button>
          </div>
        </form>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default App
