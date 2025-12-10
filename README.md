# Gen Z Conversational Bot

A modern, professional Gen Z chatbot with a sleek frontend and Groq AI backend. Features multiple AI personalities, emoji picker, multi-page navigation, and a premium UI design.

## Features

- 🤖 AI-powered conversations using Groq API
- 🎭 Multiple AI personalities (Gen-Z Chaotic, Study Buddy, Flirty Bestie, Bratty GF, Therapist Friend, Productivity Coach)
- 😊 Emoji picker with 200+ emojis
- 🎨 Premium UI with glassmorphism, gradients, and modern design
- 💬 Real-time streaming chat interface
- 🔐 User authentication and session management
- 📱 Multi-page navigation (Home, Chats, AI Modes, Settings)
- 🎯 Context-aware conversations with conversation history
- 🔄 Dynamic personality switching

## Setup

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the root directory:
```
GROQ_API_KEY=your_api_key_here
```

   Get your API key from [Groq Console](https://console.groq.com/)

3. Start the Flask backend:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default port)

## Usage

1. Start the backend server first (Flask API)
2. Start the frontend development server
3. Open `http://localhost:5173` in your browser
4. Login with any credentials (demo mode)
5. Choose an AI personality from the dropdown or AI Modes page
6. Start chatting! Use the emoji picker (😊) to add emojis to your messages

## Tech Stack

### Backend
- Flask 3.0.0
- Groq API (OpenAI-compatible)
- Flask-CORS
- Python-dotenv

### Frontend
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.3.6
- Lucide React (Professional Icons)

## Project Structure

```
├── app.py                 # Flask backend server
├── APIs/
│   ├── gemini_api.py     # Groq API client & personality definitions
│   └── test.py           # API testing script
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main chat component
│   │   ├── Login.jsx     # Authentication page
│   │   └── pages/        # Home, Chats, AI Modes, Settings
│   ├── package.json
│   └── tailwind.config.js
├── requirements.txt
└── .env                   # API keys (not committed)
```

## Features in Detail

### AI Personalities
- **Gen-Z Chaotic**: Default personality with memes, slang, and playful banter
- **Study Buddy**: Helpful study companion with clear explanations
- **Flirty Bestie**: Playful and cheeky conversations
- **Bratty GF**: Sarcastic and teasing with "I like you but won't admit it" energy
- **Therapist Friend**: Empathetic listener with gentle advice
- **Productivity Coach**: Goal-oriented coach with actionable steps

### UI Features
- Responsive sidebar navigation
- Dark mode support (Settings page)
- Emoji picker with categorized emojis
- Message timestamps
- Streaming responses with typing indicators
- Premium glassmorphism design
- Smooth animations and transitions

