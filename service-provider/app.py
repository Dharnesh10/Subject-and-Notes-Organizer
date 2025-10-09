import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load API Key from .env file
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("API key is missing! Set GEMINI_API_KEY in your .env file.")

# Configure Gemini
genai.configure(api_key=api_key)

# Path to JSON log file
DATA_FILE = "data.json"

# Ensure data.json exists and is a valid JSON array
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f, indent=4)


@app.route("/generate_response", methods=["POST"])
def generate_response():
    data = request.get_json()
    user_input = data.get("prompt")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    try:
        # Choose model
        try:
            model = genai.GenerativeModel("gemini-2.5-flash-preview-09-2025")
        except Exception:
            model = genai.GenerativeModel("gemini-2.5-flash")

        # Generate content
        # response = model.generate_content(user_input)
        response = model.generate_content(
            f"Please generate content based on the following input:\n{user_input}"
        )
        output_text = getattr(response, "text", "") or str(response)

        # Prepare response for frontend
        response_data = {"prompt": user_input, "text": output_text.strip()}

        # Save to JSON log
        with open(DATA_FILE, "r+") as f:
            try:
                arr = json.load(f)
            except json.JSONDecodeError:
                arr = []
            arr.append(response_data)
            f.seek(0)
            json.dump(arr, f, indent=4)
            f.truncate()

        return jsonify(response_data)

    except genai.error.GenerativeAIError as e:
        print("Gemini API error:", e)
        return jsonify({"error": "Gemini API error", "details": str(e)}), 500
    except Exception as e:
        print("SERVER ERROR:", e)
        return jsonify({"error": "Server failed", "details": str(e)}), 500


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    app.run(debug=debug_mode, port=5001)
