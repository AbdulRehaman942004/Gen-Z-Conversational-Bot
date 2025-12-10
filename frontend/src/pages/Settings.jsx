import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-react'
import { useState } from 'react'

function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
              <p className="text-neutral-600">Manage your preferences and account</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Profile Settings */}
              <section className="p-6 rounded-xl bg-gradient-to-r from-white to-neutral-50/50 border border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Profile</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue="User"
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Notification Settings */}
              <section className="p-6 rounded-xl bg-gradient-to-r from-white to-neutral-50/50 border border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Enable Notifications</p>
                      <p className="text-sm text-neutral-600">Receive notifications for new messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Appearance Settings */}
              <section className="p-6 rounded-xl bg-gradient-to-r from-white to-neutral-50/50 border border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Appearance</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">Dark Mode</p>
                      <p className="text-sm text-neutral-600">Switch to dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Language Settings */}
              <section className="p-6 rounded-xl bg-gradient-to-r from-white to-neutral-50/50 border border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Language</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Select Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Security Settings */}
              <section className="p-6 rounded-xl bg-gradient-to-r from-white to-neutral-50/50 border border-neutral-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-900">Security</h2>
                </div>
                <div className="space-y-4">
                  <button className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-lg text-neutral-900 hover:bg-neutral-50 transition-colors text-left font-medium">
                    Change Password
                  </button>
                  <button className="w-full px-4 py-2.5 bg-white border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left font-medium">
                    Delete Account
                  </button>
                </div>
              </section>

              {/* Save Button */}
              <div className="pt-4">
                <button className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 text-[15px]">
                  <Save className="w-5 h-5" />
                  <span className="font-semibold">Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

