let creating;

async function setupOffscreenDocument(path) {
    const offscreenUrl = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [offscreenUrl]
    });

    if (existingContexts.length > 0) return;

    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: path,
            reasons: ['DOM_PARSER'],
            justification: 'Run NSFWJS AI model bypassing host Content Security Policy'
        });
        await creating;
        creating = null;
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'process_image_ai') {
        (async () => {
            try {
                await setupOffscreenDocument('offscreen.html');

                const fetchRes = await fetch(request.url);
                const blob = await fetchRes.blob();
                
                const reader = new FileReader();
                reader.onloadend = () => {
                    chrome.runtime.sendMessage({
                        action: 'analyze_base64',
                        base64: reader.result
                    }, (aiResult) => {
                        sendResponse(aiResult);
                    });
                };
                reader.readAsDataURL(blob);

            } catch (error) {
                sendResponse({ error: error.toString() });
            }
        })();
        return true;
    }
});