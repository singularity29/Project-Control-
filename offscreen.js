let model = null;

async function loadModel() {
    if (!model) {
        model = await nsfwjs.load();
    }
    return model;
}
loadModel();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze_base64') {
        (async () => {
            try {
                await loadModel();
                const img = new Image();
                img.onload = async () => {
                    const predictions = await model.classify(img);
                    sendResponse({ predictions });
                };
                img.onerror = () => sendResponse({ error: "Image decoding failed" });
                img.src = request.base64;
            } catch (e) {
                sendResponse({ error: e.toString() });
            }
        })();
        return true; 
    }
});