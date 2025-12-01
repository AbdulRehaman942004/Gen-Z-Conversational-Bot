# Gen Z Conversational Bot

A modern, professional Gen Z chatbot with a sleek frontend and Gemini AI backend.

## Features

- 🤖 AI-powered conversations using Google Gemini
- 🎨 Modern, professional UI with glassmorphism design
- 💬 Real-time chat interface
- 🎯 Gen Z personality and responses
- 🔒 Session management

## Setup

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the root directory:
```
GEMINI_API_KEY=your_api_key_here
```

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

The frontend will run on `http://localhost:3000`

## Usage

1. Start the backend server first (Flask API)
2. Start the frontend development server
3. Open `http://localhost:3000` in your browser
4. Start chatting with the Gen Z bot!

## Tech Stack

### Backend
- Flask
- Google Gemini AI
- Flask-CORS

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide React (Professional Icons)

