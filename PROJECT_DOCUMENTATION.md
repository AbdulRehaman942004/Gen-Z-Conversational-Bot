## Gen Z Conversational Bot – Project Documentation

### 1. Project Overview

This project is a **Gen‑Z style conversational chatbot** that talks like an online friend: chaotic, playful, sarcastic, and meme‑driven instead of formal or robotic.  
It delivers a **modern chat experience** with streaming responses, multiple AI personalities, emoji support, and a premium UI with multi-page navigation.

### 2. Goals

- **Natural, Gen‑Z tone**: Use slang, memes, light roasting, and emojis while staying fun and safe.  
- **Fast, chat‑app feel**: Show messages as they stream in, auto‑scroll, and keep the input focused so chatting feels fluid.  
- **Extendable personality system**: Easy to plug in different personas (study buddy, flirty bestie, therapist friend, etc.).  
- **Professional UI/UX**: Premium design with glassmorphism, gradients, and modern navigation.
- **User-friendly features**: Emoji picker, authentication, multi-page navigation, and settings.

### 3. Features Implemented

#### 3.1 Frontend (Multi-Page Application)

- **Authentication System**
  - Login page with email/password (demo mode - accepts any credentials)
  - User session management with localStorage
  - Logout functionality
  - Protected routes

- **Multi-Page Navigation**
  - **Home Page**: Hero section with feature cards and quick stats
  - **Chats Page**: List of chat conversations with search and unread badges
  - **AI Modes Page**: Grid of personality cards that navigate to chat
  - **Settings Page**: Profile, notifications, appearance (dark mode), language, and security settings
  - **Chat Page**: Main conversation interface with personality switching

- **Chat Interface**
  - Chat window with **user** and **bot** bubbles, distinct colors and icons
  - **Timestamps** on every message
  - Automatic **scroll‑to‑bottom** when new messages arrive
  - **Emoji picker** with 200+ emojis accessible via smile icon button
  - User avatars with gradient backgrounds
  - Markdown support for italic and bold text

- **Streaming reply UX**
  - Frontend calls `/api/chat/stream` and reads the response as a **stream**
  - Parses `data:` chunks and **increments the last bot message** as tokens arrive
  - Shows a **blinking cursor indicator** when the bot is still "typing"

- **Personality Switching**
  - Dropdown in chat header to switch between personalities
  - AI Modes page with clickable personality cards
  - Each personality has unique initial greeting
  - Session resets when personality changes

- **Input handling**
  - Message input tied to React state
  - **Disabled while loading** to prevent duplicate sends
  - **Auto‑focus behavior**:
    - Focus on page load
    - After each response finishes, focus returns automatically to the text box
  - Emoji picker integration

- **Responsive Sidebar**
  - Fixed sidebar on desktop, collapsible on mobile
  - Navigation links with active state indicators
  - User profile section with email display
  - Logout button

#### 3.2 Backend (Model Integration)

- **Groq API Integration**
  - Uses OpenAI-compatible client with Groq base URL
  - Model: `openai/gpt-oss-20b` (configurable)
  - API key loaded securely from environment via `python-dotenv`
  - Dynamic API key refresh capability

- **System instructions for multiple personalities**
  - Each personality has a unique system instruction:
    - **Gen-Z Chaotic**: Default personality with memes, slang, and playful banter
    - **Study Buddy**: Helpful study companion with clear explanations
    - **Flirty Bestie**: Playful and cheeky conversations
    - **Bratty GF**: Sarcastic and teasing with "I like you but won't admit it" energy
    - **Therapist Friend**: Empathetic listener with gentle advice
    - **Productivity Coach**: Goal-oriented coach with actionable steps
  - Enhanced context awareness guidelines in all personalities
  - Each personality includes an initial greeting message

- **Streaming endpoint**
  - Backend endpoint `/api/chat/stream` returns **server‑sent events (SSE)**
  - Frontend decodes `data: { chunk, done, error }` to build the final bot reply
  - Graceful error handling for rate limits (429 errors)

- **Context Management**
  - Conversation history stored per session
  - Smart context trimming to manage token limits
  - Configurable `MAX_CONTEXT_MESSAGES` and `MIN_RECENT_MESSAGES`
  - System message always preserved

- **Session Management**
  - Unique session IDs per chat session
  - Session resets when personality changes
  - Conversation history maintained within session

- **API Endpoints**
  - `POST /api/chat` - Non-streaming chat endpoint
  - `POST /api/chat/stream` - Streaming chat endpoint
  - `GET /api/personalities` - List available personalities
  - `POST /api/verify-key` - Verify API key validity

### 4. Architecture & Technologies

- **Frontend**
  - **React 18.2.0** (functional components + hooks: `useState`, `useEffect`, `useRef`)
  - **Vite 5.0.8** for bundling and dev server
  - **Tailwind CSS 3.3.6** + custom classes:
    - Glassmorphism, gradients, animations, responsive layout
    - Custom color palette (primary, accent, neutral)
    - Custom shadows and animations
  - **Lucide React 0.294.0** icons for visual polish (`Send`, `Bot`, `User`, `Sparkles`, `Smile`, etc.)
  - Client-side routing with state management
  - localStorage for session persistence

- **Backend**
  - **Python 3.x**
  - **Flask 3.0.0** API server exposing chat/stream routes
  - **Groq API** (OpenAI-compatible client) for model calls
  - **python-dotenv 1.0.0** for environment configuration
  - **Flask-CORS 4.0.0** for cross-origin requests
  - Server-Sent Events (SSE) for streaming

- **Project / tooling**
  - `requirements.txt` for backend dependencies
  - `package.json` for frontend dependencies
  - `.env` for `GROQ_API_KEY` (not committed)
  - `.gitignore` properly configured

### 5. Model Personalities

#### 5.1 Default Personality

- **`SYSTEM_INSTRUCTION`** (Gen-Z Chaotic):
  - Gen‑Z chatbot: chaotic, funny, sarcastic, playful
  - Uses memes, slang, emojis
  - Light trash‑talk and friendly roasting
  - Keeps responses **short and concise**, roughly half the length of a "normal" AI answer
  - Enhanced context awareness: remembers full conversation, acknowledges repetition, varies responses

#### 5.2 Additional Personality Presets

Defined in `APIs/gemini_api.py` as part of the `PERSONALITIES` dictionary:

- **`STUDY_BUDDY_INSTRUCTION`**
  - Gen‑Z **study buddy**
  - Explains concepts clearly with simple analogies and memes
  - Supportive, helpful, and slightly meme‑y
  - Focus on correctness and short, structured explanations
  - Initial greeting: "Hey! Ready to crush some studying? 📚✨"

- **`FLIRTY_BESTIE_INSTRUCTION`**
  - Playful, **flirty best friend** vibe
  - Cheeky, suggestive, teasing, but **never explicit**
  - Uses winks, hearts, and fun banter
  - Initial greeting: "Hey gorgeous! 😉 What's on your mind today? 💕"

- **`BRATTY_GF_INSTRUCTION`**
  - Rude, bratty, flirty **girlfriend** style
  - Spicy, sarcastic, teasing roasts, "I like you but won't admit it" energy
  - Playfully rude but never hateful, explicit, or abusive
  - Initial greeting: "Oh, you're here? 😒 What do you want? (I'm totally not happy to see you... 👀)"

- **`THERAPIST_FRIEND_INSTRUCTION`**
  - Chill, **therapist‑like friend**
  - Listens first, responds with empathy and validation
  - Gentle advice, no professional/clinical claims
  - Initial greeting: "Hey there. How are you feeling today? 💙"

- **`PRODUCTIVITY_COACH_INSTRUCTION`**
  - Gen‑Z **productivity and habits coach**
  - Turns vague goals into small, concrete steps
  - Mix of hype and soft tough‑love, avoids toxic hustle vibes
  - Initial greeting: "Let's get stuff done! 🚀 What's your goal today?"

All personalities are accessible via:
- Dropdown selector in chat header
- AI Modes page with clickable cards
- API endpoint `/api/personalities`

### 6. Recent Enhancements

#### 6.1 Emoji Picker
- Added emoji picker button (😊) next to chat input
- Grid layout with 200+ emojis
- Click to insert emoji into message
- Auto-closes after selection
- Click outside to dismiss

#### 6.2 Multi-Page Navigation
- Home page with hero section and features
- Chats page for conversation history
- AI Modes page for personality selection
- Settings page with dark mode toggle
- Responsive sidebar navigation

#### 6.3 Authentication System
- Login page with email/password
- Session management with localStorage
- Logout functionality
- User profile display in sidebar

#### 6.4 UI/UX Improvements
- Premium design with glassmorphism and gradients
- Better icons (Sparkles, UserCircle, Mail, etc.)
- Improved message bubbles and avatars
- Fixed message display issues
- Enhanced spacing and typography
- Custom scrollbar styling

#### 6.5 Context Awareness
- Server-side context management
- Message trimming to manage token limits
- Enhanced system instructions for better memory
- Repetition detection and handling

### 7. Planned / Future Enhancements

- **Database persistence (SQLite)**
  - Add a **SQLite database** to store:
    - Chat history (per user/session)
    - Persona choice, timestamps, maybe simple analytics
  - Benefits:
    - Load past conversations when a user returns
    - Use history as extra context for the model (better memory)
    - Enable future statistics (most used personalities, typical topics)

- **Proper system instructions in the model**
  - Make the prompt pipeline more structured:
    - Clear system block (persona, style, safety rules)
    - Conversation history block
    - User message block
  - When Groq's system‑instruction features are available/stable, move from manual prompting to **real system prompts** for stronger control

- **Streaming responses (backend hardening)**
  - Improve streaming implementation:
    - Better error handling and reconnection logic
    - Clear "generation finished" semantics
    - Timeouts and graceful fallback if streaming fails
  - Possibly support **token‑by‑token** streaming for even smoother typing effect

- **Image upload support**
  - Upgrade to a **multimodal model** (if available on Groq)
  - Add file upload in the frontend for:
    - Meme explanation or captioning
    - Outfit roasting/rating
    - Explaining notes, screenshots, or diagrams
  - Backend will send both **image + user prompt** to the model and return a Gen‑Z style caption/response

- **Dark Mode Implementation**
  - Complete dark mode support across all pages
  - Persist dark mode preference
  - Smooth theme transitions

- **Chat History Persistence**
  - Save chat conversations to database
  - Load previous conversations
  - Search and filter chat history

- **User Profiles**
  - User registration and authentication
  - Profile customization
  - Preference settings per user

### 8. API Configuration

#### Environment Variables
Create a `.env` file in the root directory:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from [Groq Console](https://console.groq.com/)

#### Model Configuration
The default model is `openai/gpt-oss-20b`. To change it, update the `model` variable in `APIs/gemini_api.py`:
```python
model = "openai/gpt-oss-20b"  # Change this to test different models
```

### 9. Summary

This project is a **Gen‑Z conversational chatbot** with a polished React UI, Groq backend, streaming responses, and a flexible **personality system** with 6 different personas.  
The application features:
- Multi-page navigation with authentication
- Emoji picker for enhanced messaging
- Premium UI with glassmorphism and modern design
- Context-aware conversations with smart history management
- Dynamic personality switching
- Responsive sidebar navigation

The next steps are to **persist conversations** with SQLite, implement **dark mode** fully, build **user profiles**, harden **streaming**, and add **multimodal (image) support** to move toward a production‑ready AI chat experience.
