from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in a .env file.")
genai.configure(api_key=GOOGLE_API_KEY)

# Configure Forge API
FORGE_API_URL = os.getenv("FORGE_API_URL", "http://localhost:7860") # Default Forge API URL

def expand_prompt(short_prompt, options=None):
    """Expands a short prompt and/or selected options into a detailed Stable Diffusion prompt using Gemini API."""
    
    gemini_prompt_parts = []
    gemini_prompt_parts.append("You are an expert Stable Diffusion prompt engineer. Your task is to take a high-level concept and expand it into a detailed, high-quality prompt suitable for image generation. Focus on descriptive adjectives, lighting, style, and atmosphere. Do NOT include any negative prompts.")

    if short_prompt:
        gemini_prompt_parts.append(f"The core concept is: \"{short_prompt}\"")
    
    if options:
        options_str = []
        for category, value in options.items():
            if value: # Only include if a value was selected
                options_str.append(f"{category.replace('_', ' ').title()}: {value}")
        if options_str:
            gemini_prompt_parts.append("Consider the following selected options:")
            gemini_prompt_parts.extend(options_str)

    gemini_prompt_parts.append("\nDetailed Stable Diffusion prompt:")
    gemini_prompt = "\n".join(gemini_prompt_parts)

    model = genai.GenerativeModel('gemini-2.5-flash')
    
    try:
        response = model.generate_content(gemini_prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error expanding prompt with Gemini: {e}")
        return short_prompt # Fallback to original prompt on error

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_images', methods=['POST'])
def generate_images():
    data = request.json
    prompt = data.get('prompt')
    options = data.get('options')

    if not prompt and (not options or all(not v for v in options.values())):
        return jsonify({"error": "Please enter a prompt or select at least one option."}),

    # Expand the prompt using Gemini
    expanded_prompt = expand_prompt(prompt, options)
    print(f"Original Prompt: {prompt}")
    print(f"Selected Options: {options}")
    print(f"Expanded Prompt: {expanded_prompt}")

    try:
        payload = {
            "prompt": expanded_prompt, # Use the expanded prompt
            "steps": 20,
            "sampler_name": "Euler a",
            "n_iter": 1,
            "batch_size": 3, # Generate 3 images
            "cfg_scale": 7,
            "width": 512,
            "height": 512
        }
        
        response = requests.post(f"{FORGE_API_URL}/sdapi/v1/txt2img", json=payload)
        response.raise_for_status() # Raise an exception for HTTP errors

        data = response.json()
        images = data.get('images', [])
        
        # Extract parameters from the 'info' field if available
        all_image_info = []
        if 'info' in data and isinstance(data['info'], str):
            try:
                parsed_info = json.loads(data['info'])
                
                if isinstance(parsed_info, list):
                    for img_info_str in parsed_info:
                        img_info = json.loads(img_info_str)
                        all_image_info.append({
                            "seed": img_info.get("seed"),
                            "steps": img_info.get("steps"),
                            "sampler_name": img_info.get("sampler_name"),
                            "cfg_scale": img_info.get("cfg_scale"),
                            "width": img_info.get("width"),
                            "height": img_info.get("height"),
                            "prompt": img_info.get("prompt")
                        })
                elif isinstance(parsed_info, dict):
                    base_seed = parsed_info.get("seed")
                    for i in range(payload["batch_size"]):
                        all_image_info.append({
                            "seed": base_seed + i if base_seed is not None else None,
                            "steps": parsed_info.get("steps"),
                            "sampler_name": parsed_info.get("sampler_name"),
                            "cfg_scale": parsed_info.get("cfg_scale"),
                            "width": parsed_info.get("width"),
                            "height": parsed_info.get("height"),
                            "prompt": parsed_info.get("prompt")
                        })
            except json.JSONDecodeError:
                print("Warning: Could not decode 'info' field as JSON string.")
                all_image_info = [{"seed": None, "steps": None, "sampler_name": None, "cfg_scale": None, "width": None, "height": None, "prompt": None} for _ in images]
        else:
            all_image_info = [{"seed": None, "steps": None, "sampler_name": None, "cfg_scale": None, "width": None, "height": None, "prompt": None} for _ in images]

        return jsonify({
            "images": images,
            "expanded_prompt": expanded_prompt,
            "image_info": all_image_info
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {e}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
