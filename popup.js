document.body.style.opacity = 0.99;
setTimeout(() => { document.body.style.opacity = 1; }, 10);

const toggles = [
    'yt-thumb', 'yt-short', 'yt-home', 'yt-comm', 'yt-side', 'yt-trend', 'yt-mix', 
    'yt-likes', 'yt-you', 'yt-subs', 'yt-create', 'yt-bell', 'yt-ham', 'yt-prof', 'yt-desc', 'yt-search-sugg',
    'ig-reel', 'ig-story', 'ig-comm', 'ig-nsfw', 'adult-site', 'word-block',
    'ig-suggested', 'ig-feed-rec', 'ig-search', 'ig-notif', 'ig-create', 'ig-dash'
];

toggles.forEach(id => {
    const checkbox = document.getElementById(id);
    chrome.storage.local.get([id], (result) => {
        checkbox.checked = result[id] || false;
    });

    checkbox.addEventListener('change', (e) => {
        chrome.storage.local.set({ [id]: e.target.checked });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'update_toggles' }).catch(() => {});
            }
        });
    });
});