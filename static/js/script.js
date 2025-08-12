document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const loadingDiv = document.querySelector('.loading');
    const imageGallery = document.querySelector('.image-gallery');
    const errorDiv = document.querySelector('.error');
    const expandedPromptDisplay = document.querySelector('.expanded-prompt-display');
    const expandedPromptText = document.getElementById('expandedPromptText');

    // New dropdown elements
    const genreThemeSelect = document.getElementById('genreThemeSelect');
    const artStyleSelect = document.getElementById('artStyleSelect');
    const subjectCharacterSelect = document.getElementById('subjectCharacterSelect');
    const environmentSettingSelect = document.getElementById('environmentSettingSelect');
    const lightingAtmosphereSelect = document.getElementById('lightingAtmosphereSelect');
    const generateWithOptionsBtn = document.getElementById('generateWithOptionsBtn'); // New button

    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeButton = document.querySelector('.close-button');
    const downloadLightboxBtn = document.getElementById('downloadLightboxBtn');

    // Function to handle image generation request
    const handleGenerateRequest = async (useOptions = false) => {
        let prompt = promptInput.value.trim();
        let selectedOptions = {};

        if (useOptions) {
            selectedOptions = {
                genre_theme: genreThemeSelect.value,
                art_style: artStyleSelect.value,
                subject_character: subjectCharacterSelect.value,
                environment_setting: environmentSettingSelect.value,
                lighting_atmosphere: lightingAtmosphereSelect.value
            };
            // If using options, and no text prompt, ensure at least one option is selected
            if (!prompt && Object.values(selectedOptions).every(val => !val)) {
                errorDiv.textContent = 'Please enter a prompt or select at least one option.';
                errorDiv.style.display = 'block';
                return;
            }
        } else {
            // If not using options, prompt is required
            if (!prompt) {
                errorDiv.textContent = 'Please enter a prompt.';
                errorDiv.style.display = 'block';
                return;
            }
        }

        imageGallery.innerHTML = ''; // Clear previous images
        errorDiv.style.display = 'none';
        expandedPromptDisplay.style.display = 'none'; // Hide expanded prompt initially
        loadingDiv.style.display = 'block';

        try {
            const requestBody = { prompt: prompt };
            if (useOptions) {
                requestBody.options = selectedOptions;
            }

            const response = await fetch('/generate_images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate images');
            }

            const data = await response.json();
            
            // Display expanded prompt
            if (data.expanded_prompt) {
                expandedPromptText.textContent = data.expanded_prompt;
                expandedPromptDisplay.style.display = 'block';
            }

            if (data.images && data.images.length > 0) {
                data.images.forEach((base64Image, index) => {
                    const imageInfo = data.image_info[index] || {}; // Get info for this image

                    const imageItem = document.createElement('div');
                    imageItem.classList.add('image-item');

                    const img = document.createElement('img');
                    img.src = `data:image/png;base64,${base64Image}`;
                    img.alt = `Generated Image ${index + 1}`;
                    imageItem.appendChild(img);

                    // Parameters display
                    const paramsDiv = document.createElement('div');
                    paramsDiv.classList.add('parameters-display');
                    paramsDiv.innerHTML = `
                        <p><strong>Seed:</strong> ${imageInfo.seed || 'N/A'}</p>
                        <p><strong>Steps:</strong> ${imageInfo.steps || 'N/A'}</p>
                        <p><strong>Sampler:</strong> ${imageInfo.sampler_name || 'N/A'}</p>
                        <p><strong>CFG Scale:</strong> ${imageInfo.cfg_scale || 'N/A'}</p>
                        <p><strong>Dimensions:</strong> ${imageInfo.width || 'N/A'}x${imageInfo.height || 'N/A'}</p>
                    `;
                    imageItem.appendChild(paramsDiv);

                    // Download button
                    const downloadBtn = document.createElement('a');
                    downloadBtn.classList.add('download-btn');
                    downloadBtn.href = img.src;
                    downloadBtn.download = `dream_weaver_image_${imageInfo.seed || index}.png`;
                    downloadBtn.textContent = 'Download';
                    imageItem.appendChild(downloadBtn);

                    imageGallery.appendChild(imageItem);

                    // Add click listener for lightbox
                    img.addEventListener('click', () => {
                        lightboxImage.src = img.src;
                        lightboxCaption.innerHTML = paramsDiv.innerHTML; // Use same params for caption
                        downloadLightboxBtn.href = img.src;
                        downloadLightboxBtn.download = downloadBtn.download;
                        lightbox.style.display = 'block';
                    });
                });
            } else {
                errorDiv.textContent = 'No images were generated. Please try a different prompt.';
                errorDiv.style.display = 'block';
            }

        } catch (error) {
            errorDiv.textContent = `Error: ${error.message}`;
            errorDiv.style.display = 'block';
        } finally {
            loadingDiv.style.display = 'none';
        }
    };

    // Event Listeners for both buttons
    generateBtn.addEventListener('click', () => handleGenerateRequest(false)); // Original button
    generateWithOptionsBtn.addEventListener('click', () => handleGenerateRequest(true)); // New button

    // Close lightbox
    closeButton.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
});