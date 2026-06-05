chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetch_image') {
        fetch(request.url)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => sendResponse({ base64: reader.result });
                reader.readAsDataURL(blob);
            })
            .catch(err => sendResponse({ error: err.toString() }));
        return true; // Keeps the message channel open for the async response
    }
});