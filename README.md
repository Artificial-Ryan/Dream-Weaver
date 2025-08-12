# Dream Weaver

## An AI-Powered Thematic Image Gallery Generator

Dream Weaver is an innovative web application that transforms high-level concepts and selected themes into detailed, high-quality image generation prompts using the power of Google's Gemini API. These expanded prompts are then fed into a local Stable Diffusion Forge instance to generate stunning visual galleries, offering a unique and intuitive way to create AI art.

---

## ✨ Features

*   **Intelligent Prompt Expansion:** Leverage the Gemini API to turn short, abstract ideas or selected thematic options into rich, descriptive prompts optimized for Stable Diffusion.
*   **Thematic Generation:** Choose from a wide array of genres, art styles, subjects, environments, and lighting/atmosphere options to guide the AI's creative process.
*   **Multi-Image Gallery:** Generates and displays a gallery of multiple images per prompt, allowing for diverse visual interpretations.
*   **Detailed Parameter Display:** View the exact generation parameters (seed, steps, sampler, CFG scale, dimensions) for each image, enabling reproducibility and deeper understanding.
*   **Image Download:** Easily download individual generated images.
*   **Interactive Lightbox:** Click on any image in the gallery to view it in a full-screen lightbox, complete with its generation parameters and a dedicated download button.
*   **Local Forge Integration:** Designed to work seamlessly with your local Stable Diffusion Forge API, keeping image generation private and efficient.

---

## 🚀 Technologies Used

*   **Backend:** Python (Flask)
*   **AI Models:**
    *   Google Gemini API (`gemini-2.5-flash`) for prompt expansion
    *   Stable Diffusion Forge (local instance) for image generation
*   **Frontend:** HTML, CSS, JavaScript
*   **Dependency Management:** `pip`
*   **Environment Variables:** `python-dotenv`

---

## ⚙️ Setup and Installation

Follow these steps to get Dream Weaver up and running on your local machine.

### Prerequisites

*   **Python 3.8+:** Ensure Python is installed on your system.
*   **Stable Diffusion Forge:** You need a running instance of Stable Diffusion Forge (or a compatible Stable Diffusion API) accessible via a URL (e.g., `http://localhost:7860`).
*   **Google API Key:** An API key for the Google Gemini API. You can obtain one from [Google AI Studio](https://aistudio.google.com/).

### Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Artificial-Ryan/Dream-Weaver.git
    cd Dream-Weaver
    ```

2.  **Create and Configure `.env` File:**
    This file will store your API keys and other sensitive information, ensuring they are not committed to version control.
    *   Create a file named `.env` in the root directory of the `Dream-Weaver` project:
        ```bash
        touch .env
        ```
    *   Open the `.env` file in a text editor and add your Google API Key:
        ```
        GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
        ```
    *   (Optional) If your Stable Diffusion Forge API is not running on `http://localhost:7860`, you can specify its URL:
        ```
        FORGE_API_URL=http://your_forge_api_url:port
        ```
    *   Save and close the `.env` file.

3.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

---

## ▶️ How to Run

1.  **Start your Stable Diffusion Forge instance.** Ensure its API is accessible at the URL configured in your `.env` file (default: `http://localhost:7860`).
2.  **Start the Flask Application:**
    ```bash
    python app.py
    ```
    The application will typically run on `http://127.0.0.1:5000`.
3.  **Access Dream Weaver:**
    Open your web browser and navigate to `http://127.0.0.1:5000`.

---

## 💡 How to Use

*   **Text Prompt:** Enter a short, high-level concept into the text input field and click "Weave Dreams." The Gemini API will expand this into a detailed prompt for image generation.
*   **Options Selection:** Use the dropdown menus in the "Or Select Your Dream Ingredients" section to choose specific genres, art styles, subjects, environments, and lighting/atmosphere. You can combine these with a text prompt or use them independently. Click "Weave Dreams with Options."
*   **View Gallery:** Generated images will appear in the gallery below.
*   **Inspect Parameters:** Click on any image to open it in a lightbox. The lightbox will display the image along with its specific generation parameters (seed, steps, sampler, etc.).
*   **Download Images:** Use the "Download" button below each image in the gallery, or the "Download" button within the lightbox, to save the image to your device.

---

## 🔮 Future Enhancements (Ideas)

*   Allow users to adjust Stable Diffusion parameters (steps, CFG scale, dimensions) directly from the UI.
*   Implement negative prompting options.
*   Add a history feature to view past generations.
*   Integrate more advanced LLM features for prompt refinement (e.g., iterative prompting).
*   Support for different image generation models.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). (You might want to create a LICENSE file if you don't have one.)
