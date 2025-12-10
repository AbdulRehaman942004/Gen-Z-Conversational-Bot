import { MessageCircle, Clock, Search } from 'lucide-react'
import { useState } from 'react'

function Chats() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock chat history
  const chats = [
    { id: 1, title: 'Gen-Z Chaotic Chat', lastMessage: 'Sup trouble 😉 what\'re we on rn?', time: '3:19 AM', unread: 0 },
    { id: 2, title: 'Study Buddy Session', lastMessage: 'Let\'s tackle that math problem!', time: '2:45 AM', unread: 2 },
    { id: 3, title: 'Productivity Coach', lastMessage: 'Great job on completing your tasks!', time: '1:30 AM', unread: 0 },
    { id: 4, title: 'Therapist Friend', lastMessage: 'How are you feeling today?', time: '12:15 AM', unread: 1 },
  ]

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Chats</h1>
                <p className="text-neutral-600">Your conversation history</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Chat List */}
            <div className="space-y-3">
              {filteredChats.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500">No chats found</p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white to-neutral-50/50 border border-neutral-200 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-neutral-900 truncate">{chat.title}</h3>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs text-neutral-500">{chat.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-semibold flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Empty State */}
            {chats.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-2">No chats yet</p>
                <p className="text-sm text-neutral-400">Start a conversation to see it here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats

