import { Sparkles, MessageCircle, Brain, Zap } from 'lucide-react'

function Home() {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 shadow-xl border-2 border-white/20 mb-6">
                <Sparkles className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-4">Welcome to AI Assistant</h1>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Your intelligent conversation partner with multiple personality modes
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Smart Conversations</h3>
                <p className="text-neutral-600 text-sm">
                  Engage in natural, context-aware conversations with advanced AI
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Multiple Modes</h3>
                <p className="text-neutral-600 text-sm">
                  Switch between different AI personalities to match your needs
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Fast & Responsive</h3>
                <p className="text-neutral-600 text-sm">
                  Get instant responses with streaming technology
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-200">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">6+</div>
                <div className="text-sm text-neutral-600">AI Modes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">24/7</div>
                <div className="text-sm text-neutral-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">∞</div>
                <div className="text-sm text-neutral-600">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

