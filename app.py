from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from APIs.gemini_api import model, SYSTEM_INSTRUCTION
import json

app = Flask(__name__)
CORS(app)

# Store chat sessions (in production, use Redis or database)
chat_sessions = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat()
            # Send system instruction as first message to establish personality
            try:
                chat_sessions[session_id].send_message(SYSTEM_INSTRUCTION)
            except:
                pass  # Continue even if this fails
        
        chat = chat_sessions[session_id]
        response = chat.send_message(message)
        
        return jsonify({
            'response': response.text,
            'session_id': session_id
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
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat()
            # Send system instruction as first message to establish personality
            try:
                chat_sessions[session_id].send_message(SYSTEM_INSTRUCTION)
            except:
                pass  # Continue even if this fails
        
        chat = chat_sessions[session_id]
        
        def generate():
            try:
                # Stream the response from Gemini
                full_response = ""
                for chunk in chat.send_message(message, stream=True):
                    if chunk.text:
                        full_response += chunk.text
                        # Send each chunk as SSE
                        yield f"data: {json.dumps({'chunk': chunk.text, 'done': False})}\n\n"
                
                # Send completion signal
                yield f"data: {json.dumps({'chunk': '', 'done': True, 'full_response': full_response})}\n\n"
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

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Gen Z Chatbot API', 'endpoints': ['/api/chat', '/api/chat/stream', '/api/health']}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
