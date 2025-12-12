from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from APIs.groq_api import client, model, SYSTEM_INSTRUCTION, get_personality_instruction, PERSONALITIES
import json

app = Flask(__name__)
CORS(app)

# Store chat sessions with their conversation history and personality
# Format: {session_id: {'messages': [...], 'personality': 'default'}}
chat_sessions = {}

def detect_repetitive_message(messages, current_message):
    """Check if the user is sending repetitive messages"""
    if len(messages) < 3:  # Need at least a few messages to detect repetition
        return False
    
    # Get recent user messages (last 5)
    recent_user_messages = [
        msg.get('content', '').strip().lower() 
        for msg in messages[-10:] 
        if msg.get('role') == 'user'
    ]
    
    current_lower = current_message.strip().lower()
    
    # Check if current message is similar to recent messages
    if current_lower in recent_user_messages:
        return True
    
    # Check for very similar messages (simple similarity check)
    for msg in recent_user_messages[-3:]:  # Check last 3
        if msg and current_lower and msg == current_lower:
            return True
    
    return False

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        personality = data.get('personality', 'default')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create chat session
        if session_id not in chat_sessions:
            # Initialize with system instruction
            system_instruction = get_personality_instruction(personality)
            chat_sessions[session_id] = {
                'messages': [{"role": "system", "content": system_instruction}],
                'personality': personality
            }
        elif chat_sessions[session_id]['personality'] != personality:
            # Personality changed, reset with new system instruction
            system_instruction = get_personality_instruction(personality)
            chat_sessions[session_id] = {
                'messages': [{"role": "system", "content": system_instruction}],
                'personality': personality
            }
        
        # Check for repetitive messages
        is_repetitive = detect_repetitive_message(
            chat_sessions[session_id]['messages'], 
            message
        )
        
        # Add user message
        chat_sessions[session_id]['messages'].append({"role": "user", "content": message})
        
        # If repetitive, add a subtle context hint (but don't modify the message)
        # The system instruction already handles this, but we ensure full context is sent
        
        # Get response from Groq with full conversation context
        response = client.chat.completions.create(
            model=model,
            messages=chat_sessions[session_id]['messages'],
            temperature=0.8,  # Slightly higher for more variety
            max_tokens=800,   # Increased for better context-aware responses
            top_p=0.9        # Nucleus sampling for better quality
        )
        
        # Add assistant response to conversation history
        assistant_message = response.choices[0].message.content
        chat_sessions[session_id]['messages'].append({"role": "assistant", "content": assistant_message})
        
        return jsonify({
            'response': assistant_message,
            'session_id': session_id,
            'personality': personality
        }), 200
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in chat endpoint: {str(e)}")
        print(f"Traceback: {error_details}")
        return jsonify({'error': str(e), 'details': error_details}), 500

@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    """Streaming chat endpoint using Server-Sent Events (SSE)"""
    try:
        data = request.json
        message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        personality = data.get('personality', 'default')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create chat session
        if session_id not in chat_sessions:
            # Initialize with system instruction
            system_instruction = get_personality_instruction(personality)
            chat_sessions[session_id] = {
                'messages': [{"role": "system", "content": system_instruction}],
                'personality': personality
            }
        elif chat_sessions[session_id]['personality'] != personality:
            # Personality changed, reset with new system instruction
            system_instruction = get_personality_instruction(personality)
            chat_sessions[session_id] = {
                'messages': [{"role": "system", "content": system_instruction}],
                'personality': personality
            }
        
        # Add user message
        chat_sessions[session_id]['messages'].append({"role": "user", "content": message})
        
        def generate():
            try:
                # Stream the response from Groq
                full_response = ""
                stream = client.chat.completions.create(
                    model=model,
                    messages=chat_sessions[session_id]['messages'],
                    temperature=0.8,  # Slightly higher for more variety
                    max_tokens=800,   # Increased for better context-aware responses
                    top_p=0.9,        # Nucleus sampling for better quality
                    stream=True
                )
                
                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        full_response += content
                        # Send each chunk as SSE
                        yield f"data: {json.dumps({'chunk': content, 'done': False})}\n\n"
                
                # Add assistant response to conversation history
                chat_sessions[session_id]['messages'].append({"role": "assistant", "content": full_response})
                
                # Send completion signal
                yield f"data: {json.dumps({'chunk': '', 'done': True, 'full_response': full_response, 'personality': personality})}\n\n"
            except Exception as e:
                error_msg = str(e)
                yield f"data: {json.dumps({'error': error_msg, 'done': True})}\n\n"
        
        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no',
                'Connection': 'keep-alive'
            }
        )
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error in streaming chat endpoint: {str(e)}")
        print(f"Traceback: {error_details}")
        return jsonify({'error': str(e), 'details': error_details}), 500

@app.route('/api/personalities', methods=['GET'])
def list_personalities():
    """Return list of available personalities with their greetings"""
    personalities = [
        {
            "key": key, 
            "label": meta["label"],
            "greeting": meta.get("greeting", "Hello!")
        } 
        for key, meta in PERSONALITIES.items()
    ]
    return jsonify({"personalities": personalities}), 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Gen Z Chatbot API', 'endpoints': ['/api/chat', '/api/chat/stream', '/api/personalities', '/api/health']}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
