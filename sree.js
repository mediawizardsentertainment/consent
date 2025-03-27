
        (function() {
            'use strict';

            const API_KEY = 'ddc-beta-1tvcr2al6t-osFkWlvhmErcpEm2hzVF9PDoowrFzYPHdbJ';
            const API_ENDPOINT = 'https://paid.sree.shop/v1/';
            
            const DOM = {
                prompt: document.getElementById('prompt'),
                model: document.getElementById('model'),
                generateBtn: document.getElementById('generateBtn'),
                loading: document.getElementById('loading'),
                error: document.querySelector('.error-message'),
                imageGrid: document.getElementById('imageGrid')
            };

            let isGenerating = false;

            function toggleUIState(isLoading) {
                DOM.generateBtn.disabled = isLoading;
                DOM.loading.style.display = isLoading ? 'flex' : 'none';
                DOM.error.textContent = '';
                isGenerating = isLoading;
            }

            function createImageCard(url, model) {
                const card = document.createElement('div');
                card.className = 'image-card';
                card.innerHTML = `
                    <div class="model-tag">${model.split('/')[1]}</div>
                    <button class="download-btn" aria-label="Download image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>
                    <img src="${url}" alt="Generated image" loading="lazy">
                `;
                
                card.querySelector('.download-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `ai-image-${Date.now()}.jpg`;
                    link.click();
                });

                return card;
            }

            async function handleGeneration() {
                if (isGenerating) return;

                const prompt = DOM.prompt.value.trim();
                if (!prompt) {
                    DOM.error.textContent = 'Please enter a description to generate images';
                    DOM.prompt.focus();
                    return;
                }

                toggleUIState(true);
                DOM.imageGrid.innerHTML = '';

                try {
                    const response = await fetch(API_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${API_KEY}`
                        },
                        body: JSON.stringify({
                            prompt,
                            model: DOM.model.value,
                            n: 4,
                            size: "1024x1024"
                        })
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error?.message || 'Failed to generate images');
                    }

                    const { data = [] } = await response.json();
                    if (!data.length) throw new Error('No images were generated');

                    data.forEach(({ url }) => {
                        DOM.imageGrid.appendChild(createImageCard(url, DOM.model.value));
                    });
                } catch (error) {
                    console.error('Generation error:', error);
                    DOM.error.textContent = `Error: ${error.message}`;
                } finally {
                    toggleUIState(false);
                }
            }

            DOM.generateBtn.addEventListener('click', handleGeneration);
            DOM.prompt.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGeneration();
                }
            });
        })();
