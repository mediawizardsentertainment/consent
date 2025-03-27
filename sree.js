
        const API_KEY = 'ddc-beta-1tvcr2al6t-osFkWlvhmErcpEm2hzVF9PDoowrFzYPHdbJ';
        let isGenerating = false;
        let currentGeneration = 1;
        let totalGenerations = 1;

        async function startGeneration() {
            if (isGenerating) return;
            
            const num = parseInt(document.getElementById('num').value);
            totalGenerations = num;
            currentGeneration = 1;
            
            document.getElementById('current-count').textContent = currentGeneration;
            document.getElementById('total-count').textContent = totalGenerations;
            
            await generateImagesSequentially(num);
        }

        async function generateImagesSequentially(total) {
            isGenerating = true;
            const prompt = document.getElementById('prompt').value;
            const size = document.getElementById('size').value;
            const loading = document.querySelector('.loading');

            if (!prompt.trim()) {
                alert('Please enter a description for your image');
                isGenerating = false;
                return;
            }

            loading.style.display = 'block';

            const historyEntry = {
                timestamp: new Date().toISOString(),
                prompt: prompt,
                images: []
            };

            try {
                for (let i = 0; i < total; i++) {
                    document.getElementById('current-count').textContent = currentGeneration;
                    
                    const response = await fetch('https://beta.sree.shop/v1/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "Provider-5/flux-pro",
                            prompt: prompt,
                            n: 1,
                            size: size
                        })
                    });

                    const data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.error?.message || `Failed to generate image ${currentGeneration}`);
                    }

                    if (!data.data || data.data.length === 0) {
                        throw new Error(`No image generated for ${currentGeneration}`);
                    }

                    const image = data.data[0];
                    historyEntry.images.push(image.url);
                    displayImage(image.url);
                    currentGeneration++;
                }

                saveToHistory(historyEntry);
                loadHistory();

            } catch (error) {
                alert(error.message);
            } finally {
                loading.style.display = 'none';
                isGenerating = false;
            }
        }

        function displayImage(url) {
            const gallery = document.getElementById('gallery');
            const card = document.createElement('div');
            card.className = 'image-card';
            card.innerHTML = `
                <img src="${url}" alt="Generated image">
                <div class="card-footer">
                    <a href="${url}" download class="download-btn">
                        Download
                    </a>
                </div>
            `;
            gallery.prepend(card);
        }

        function saveToHistory(entry) {
            const history = JSON.parse(localStorage.getItem('generationHistory') || '[]');
            history.unshift(entry);
            localStorage.setItem('generationHistory', JSON.stringify(history));
        }

        function loadHistory() {
            const historyList = document.getElementById('history-list');
            const history = JSON.parse(localStorage.getItem('generationHistory') || '[]');
            
            historyList.innerHTML = '';
            
            history.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `
                    <div class="history-prompt">${entry.prompt}</div>
                    <div style="color: #888; font-size: 0.85rem;">
                        ${new Date(entry.timestamp).toLocaleDateString()} - 
                        ${entry.images.length} image${entry.images.length > 1 ? 's' : ''}
                    </div>
                `;
                item.onclick = () => showHistoryImages(entry.images);
                historyList.appendChild(item);
            });
        }

        function showHistoryImages(images) {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            
            images.forEach(url => {
                displayImage(url);
            });
        }

        function clearHistory() {
            localStorage.removeItem('generationHistory');
            loadHistory();
            document.getElementById('gallery').innerHTML = '';
        }

        // Initialize history on load
        loadHistory();
