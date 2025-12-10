import { Brain, Sparkles, Zap, Heart, BookOpen, TrendingUp } from 'lucide-react'

function AIModes({ onModeSelect }) {
  const modes = [
    {
      id: 'default',
      name: 'Gen-Z Chaotic',
      icon: Sparkles,
      description: 'Chaotic, funny, sarcastic, and playful personality with Gen-Z humor',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'study_buddy',
      name: 'Study Buddy',
      icon: BookOpen,
      description: 'Supportive study companion who helps with learning and homework',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'flirty_bestie',
      name: 'Flirty Bestie',
      icon: Heart,
      description: 'Playful, flirty bestie with bold, charming, and confident personality',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'bratty_gf',
      name: 'Bratty Girlfriend',
      icon: Zap,
      description: 'Rude, bratty, flirty girlfriend with spicy, chaotic energy',
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'therapist_friend',
      name: 'Therapist Friend',
      icon: Heart,
      description: 'Chill therapist friend who listens and provides empathetic advice',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'productivity_coach',
      name: 'Productivity Coach',
      icon: TrendingUp,
      description: 'Energetic productivity coach who helps you plan and stay accountable',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
      borderColor: 'border-indigo-200'
    },
  ]

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 shadow-xl border-2 border-white/20 mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">AI Modes</h1>
              <p className="text-neutral-600">Choose from different AI personalities</p>
            </div>

            {/* Modes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modes.map((mode) => {
                const Icon = mode.icon
                return (
                  <div
                    key={mode.id}
                    onClick={() => onModeSelect && onModeSelect(mode.id)}
                    className={`p-6 rounded-xl bg-gradient-to-br ${mode.bgColor} border-2 ${mode.borderColor} hover:shadow-xl transition-all cursor-pointer group hover:scale-105 active:scale-95`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{mode.name}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{mode.description}</p>
                    <div className="mt-4 pt-4 border-t border-white/50">
                      <span className="text-xs font-semibold text-primary-600">Available</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Info Section */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200">
              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Switch Anytime</h3>
                  <p className="text-sm text-neutral-600">
                    You can switch between AI modes at any time from the conversation interface. Each mode has its own unique personality and conversation style.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIModes

