document.body.style.opacity = 0.99;
setTimeout(() => { document.body.style.opacity = 1; }, 10);

const toggles = [
    // YouTube
    'yt-thumb', 'yt-short', 'yt-home', 'yt-comm', 'yt-side', 'yt-trend', 'yt-mix', 
    'yt-likes', 'yt-you', 'yt-subs', 'yt-create', 'yt-bell', 'yt-ham', 'yt-prof', 'yt-desc', 'yt-search-sugg', 'yt-sponsor',
    // Instagram
    'ig-reel', 'ig-story', 'ig-comm', 'ig-suggested', 'ig-feed-rec', 'ig-search', 'ig-notif', 'ig-create', 'ig-dash',
    // Global NSFW
    'ig-nsfw', 'adult-site', 'word-block',
    // X (Twitter)
    'x-home-btn', 'x-follow-page-btn', 'x-chat-btn', 'x-creator-studio-btn', 'x-premium-btn', 'x-profile-btn',
    'x-search-bar', 'x-whats-happening', 'x-float-grok', 'x-float-chat',
    'x-explore', 'x-explore-foryou', 'x-explore-trend', 'x-explore-news', 'x-explore-sports', 'x-explore-ent',
    'x-notif', 'x-follow-btn', 'x-who-to-follow', 'x-home-rec', 'x-grok', 'x-bookmarks', 'x-post-btn',
    'x-home-foryou-tab', 'x-home-following-tab'
];

toggles.forEach(id => {
    const checkbox = document.getElementById(id);
    if (!checkbox) return;
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