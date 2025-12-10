from openai import OpenAI
import os
from dotenv import load_dotenv
import pathlib

# Load the environment variables from the .env file
# Use override=True to ensure .env file always takes precedence over system env vars
project_root = pathlib.Path(__file__).parent.parent
env_path = project_root / '.env'
load_dotenv(dotenv_path=env_path, override=True)

# -----------------------------------------
# 1. SET YOUR API KEY (Environment Variable)
# -----------------------------------------

api_key = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1",
)

# -----------------------------------------
# 2. Specify the model to test
# -----------------------------------------

# Change this to test different Groq models:
# Popular options:
# Available Groq models:
  #- playai-tts-arabic
  #- openai/gpt-oss-120b
  #- whisper-large-v3-turbo
  #- meta-llama/llama-guard-4-12b
  #- allam-2-7b
  #- openai/gpt-oss-safeguard-20b
  #- groq/compound-mini
  #- meta-llama/llama-prompt-guard-2-22m
  #- meta-llama/llama-4-maverick-17b-128e-instruct
  #- llama-3.1-8b-instant
  #- openai/gpt-oss-20b
  #- qwen/qwen3-32b
  #- meta-llama/llama-prompt-guard-2-86m
  #- meta-llama/llama-4-scout-17b-16e-instruct
  #- llama-3.3-70b-versatile
  #- moonshotai/kimi-k2-instruct-0905
  #- whisper-large-v3
  #- moonshotai/kimi-k2-instruct
  #- groq/compound
  #- playai-tts

model= "openai/gpt-oss-20b"  # Change this to test different models

# -----------------------------------------
# 3. Test the model
# -----------------------------------------

# # print all available models
# print("\nAvailable Groq models:")
# try:
#     models = client.models.list()
#     for model in models.data:
#         print(f"  - {model.id}")
# except Exception as e:
#     print(f"Error listing models: {e}")

# Test a simple generation
# print(f"\n{'='*60}")
# print(f"Testing generation with {model}...")
# print(f"{'='*60}")

# Test with system instruction
print(f"\n{'='*60}")
print(f"Testing generation with {model}...")
print(f"{'='*60}")

# System instruction example
system_instruction = """You are a Gen-Z chatbot with a chaotic, funny, sarcastic, and playful personality.
You speak casually using memes, slang, emojis, and internet culture references.
Keep responses SHORT and CONCISE."""

try:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_instruction},  # System instruction
            {"role": "user", "content": "hi how are you?"}
        ],
        temperature=0.7,
        max_tokens=100
    )
    print(f"✅ Success!")
    print(f"Response: {response.choices[0].message.content}")
    print(f"\nUsage: {response.usage}")
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"\n💡 Tip: Make sure the model supports chat completions.")
    print(f"   Some models (like TTS or Whisper) use different endpoints.")