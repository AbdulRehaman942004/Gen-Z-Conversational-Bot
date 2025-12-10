import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load the environment variables from the .env file
load_dotenv()

# -----------------------------------------
# 1. SET YOUR API KEY (Environment Variable)
# -----------------------------------------

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
print("API Key: ", os.getenv("GEMINI_API_KEY"))

# -----------------------------------------
# 2. Choose the model (Gemini 2.0 / Flash)
# -----------------------------------------

# Create the model
# Note: system_instruction is not supported in this version, so we'll handle it in app.py
# model = genai.GenerativeModel("models/gemini-2.0-flash")
# Print all available models

print("Available models: ")
for model in genai.list_models():
    print(model.name)
