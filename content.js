let settings = {};
let nsfwModel = null;

const defaultSettings = {
    'yt-thumb': false, 'yt-short': false, 'yt-home': false, 'yt-comm': false, 'yt-side': false,
    'yt-trend': false, 'yt-mix': false, 'yt-likes': false, 'yt-you': false, 'yt-subs': false,
    'yt-create': false, 'yt-bell': false, 'yt-ham': false, 'yt-prof': false, 'yt-desc': false, 'yt-search-sugg': false,
    'ig-reel': false, 'ig-story': false, 'ig-comm': false, 'ig-nsfw': false, 'adult-site': false, 'word-block': false,
    'ig-suggested': false, 'ig-feed-rec': false, 'ig-search': false, 'ig-notif': false, 'ig-create': false, 'ig-dash': false,
    'x-home-btn': false, 'x-follow-page-btn': false, 'x-chat-btn': false, 'x-creator-studio-btn': false, 
    'x-premium-btn': false, 'x-profile-btn': false, 'x-search-bar': false, 'x-whats-happening': false, 
    'x-float-grok': false, 'x-float-chat': false,
    'x-explore': false, 'x-explore-foryou': false, 'x-explore-trend': false, 'x-explore-news': false, 'x-explore-sports': false, 
    'x-explore-ent': false, 'x-notif': false, 'x-follow-btn': false, 'x-who-to-follow': false, 'x-home-rec': false, 
    'x-grok': false, 'x-bookmarks': false, 'x-post-btn': false, 'x-home-foryou-tab': false, 'x-home-following-tab': false
};

const explicitBlacklist = ['porn', 'nsfw', 'xvideo', 'pornhub', 'hentai', 'rule34', 'xxx', 'naked', 'nude', 'erotic', 'onlyfans'];

const initAI = async () => {
    if (typeof nsfwjs !== 'undefined' && !nsfwModel) {
        try { nsfwModel = await nsfwjs.load(); } catch (e) {}
    }
};

const runHardCease = () => {
    document.documentElement.innerHTML = `
        <div style="background:#000;color:#ff3333;font-family:monospace;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;overflow:hidden;">
            <svg style="width:100px;height:100px;fill:currentColor;" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/></svg>
            <h1 style="letter-spacing:2px;margin-top:20px;">ACCESS DENIED VIA CONTROL</h1>
        </div>`;
    window.stop();
};

const assessNetworkEnvironment = () => {
    if (!settings['word-block'] && !settings['adult-site']) return;
    const currentLoc = (window.location.hostname + window.location.pathname + window.location.search).toLowerCase();
    const matchFound = explicitBlacklist.some(term => currentLoc.includes(term));
    if (matchFound) runHardCease();
};

const updateEngine = () => {
    chrome.storage.local.get(defaultSettings, (result) => {
        settings = result;
        assessNetworkEnvironment();
        if (settings['ig-nsfw']) initAI();
        applyRules();
    });
};

const styleNode = document.createElement('style');
document.documentElement.appendChild(styleNode);

const applyRules = () => {
    const host = window.location.hostname;
    let cssRules = '';

    // YouTube Rules
    if (host.includes('youtube.com')) {
        if (settings['yt-thumb']) cssRules += `ytd-thumbnail img, .ytp-videowall-still-image { opacity: 0 !important; background: #111 !important; } `;
        if (settings['yt-short']) cssRules += `ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, a[title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"] { display: none !important; } `;
        if (settings['yt-home']) cssRules += `ytd-browse[page-subtype="home"] ytd-rich-grid-renderer { display: none !important; } `;
        if (settings['yt-comm']) cssRules += `ytd-comments#comments, #comments-text { display: none !important; } `;
        if (settings['yt-side']) cssRules += `ytd-watch-next-secondary-results-renderer { display: none !important; } `;
        if (settings['yt-trend']) cssRules += `ytd-guide-entry-renderer:has(a[href="/feed/trending"]), a[href="/feed/trending"] { display: none !important; } `;
        if (settings['yt-mix']) cssRules += `ytd-radio-renderer, ytd-compact-radio-renderer, com-google-android-apps-youtube-app-watch-next-elements-playlist-panel-renderer { display: none !important; } `;
        if (settings['yt-likes']) cssRules += `#segmented-like-button, #segmented-dislike-button, ytd-toggle-button-renderer:has(svg path[d*="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57"]) { display: none !important; } `;
        if (settings['yt-you']) cssRules += `ytd-guide-entry-renderer:has(a[href="/feed/you"]), a[href="/feed/you"] { display: none !important; } `;
        if (settings['yt-subs']) cssRules += `ytd-guide-entry-renderer:has(a[href="/feed/subscriptions"]), a[href="/feed/subscriptions"] { display: none !important; } `;
        if (settings['yt-create']) cssRules += `ytd-topbar-menu-button-renderer:has(button[aria-label="Create"]), button[aria-label="Create"] { display: none !important; } `;
        if (settings['yt-bell']) cssRules += `ytd-notification-topbar-button-renderer, button[aria-label^="Notifications"] { display: none !important; } `;
        if (settings['yt-ham']) cssRules += `yt-icon-button#guide-button { visibility: hidden !important; } `;
        if (settings['yt-prof']) cssRules += `yt-img-shadow#avatar, #avatar-btn, .ytp-profile-icon { display: none !important; } `;
        if (settings['yt-desc']) cssRules += `ytd-watch-metadata #description, ytd-video-description-infocards-section-renderer { display: none !important; } `;
        if (settings['yt-search-sugg']) cssRules += `.sbdd_b, .sbsb_a, ytd-searchbox #suggestions, .ytd-searchbox-spt { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; } `;
    }

    // Instagram Rules
    if (host.includes('instagram.com')) {
        if (settings['ig-reel']) cssRules += `a[href^="/reels/"], main article div:has(a[href^="/reels/"]), [aria-label="Reels"] { display: none !important; } `;
        if (settings['ig-comm']) cssRules += `form textarea, div[role="button"]:has(svg[aria-label="Comment"]), ul[class*="comments"] { display: none !important; } `;
    }

    // X (Twitter) Rules
    if (host.includes('x.com') || host.includes('twitter.com')) {
        if (settings['x-float-chat']) cssRules += `[data-testid="DMDrawer"], #layers div:has([data-testid="DMDrawer"]) { display: none !important; visibility: hidden !important; pointer-events: none !important; transform: scale(0) !important; } `;
        if (settings['x-float-grok']) cssRules += `[data-testid="grokFab"], button[aria-label="Grok"], #layers div:has([data-testid="grokFab"]) { display: none !important; visibility: hidden !important; pointer-events: none !important; transform: scale(0) !important; } `;
        if (settings['x-who-to-follow']) cssRules += `aside[aria-label="Who to follow"], aside[aria-label="Subscribe to Premium"], [data-testid="sidebarColumn"] div:has(> div > aside[aria-label="Who to follow"]), [data-testid="sidebarColumn"] div:has(> div > div > aside[aria-label="Who to follow"]) { display: none !important; border: none !important; margin: 0 !important; padding: 0 !important; } `;
        if (settings['x-whats-happening']) cssRules += `[aria-label="Timeline: Trending now"], [aria-label="Timeline: Explore"], [data-testid="sidebarColumn"] div:has(> div > [aria-label="Timeline: Trending now"]), [data-testid="sidebarColumn"] div:has(> div > div > [aria-label="Timeline: Trending now"]) { display: none !important; border: none !important; margin: 0 !important; padding: 0 !important; } `;
        if (settings['x-whats-happening'] && settings['x-who-to-follow']) cssRules += `[data-testid="sidebarColumn"] > div > div > div > div > div:not(:has([role="search"])) { display: none !important; border: none !important; } `;
        if (settings['x-explore']) cssRules += `[data-testid="AppTabBar_Explore_Link"], a[href^="/explore"] { display: none !important; } `;
        if (settings['x-notif']) cssRules += `[data-testid="AppTabBar_Notifications_Link"], a[href^="/notifications"] { display: none !important; } `;
        if (settings['x-grok'] || settings['x-float-grok']) cssRules += `a[href*="/i/grok"] { display: none !important; } `;
        if (settings['x-post-btn']) cssRules += `[data-testid="SideNav_NewTweet_Button"], a[href="/compose/tweet"] { display: none !important; } `;
        if (settings['x-search-bar']) cssRules += `[role="search"] { display: none !important; } `;
    }

    styleNode.textContent = cssRules;
    handleDynamicBlocks();
};

const scanForNSFW = async () => {
    if (!settings['ig-nsfw'] || !nsfwModel) return;
    const images = document.querySelectorAll('img:not([data-ai-scanned]), video:not([data-ai-scanned])');
    
    images.forEach(async (el) => {
        el.setAttribute('data-ai-scanned', 'true');
        
        // Videos cannot be frame-scanned efficiently on client-side. Hard-blur instantly.
        if (el.tagName === 'VIDEO') {
            el.style.setProperty('filter', 'blur(80px) brightness(0.1)', 'important');
            return;
        }

        if (el.tagName === 'IMG') {
            if (el.width < 40 || el.height < 40) return;
            
            const processPredictions = (predictions) => {
                // HYPER-SENSITIVE HALAL FILTER
                // Triggers if image is >25% classified as 'Sexy' (Bikinis, crop tops, deep cleavage, underwear)
                // Triggers if image is >20% classified as 'Porn' (Actual nudity)
                const isExplicit = predictions.some(p => 
                    (p.className === 'Porn' && p.probability > 0.20) || 
                    (p.className === 'Sexy' && p.probability > 0.25) || 
                    (p.className === 'Hentai' && p.probability > 0.20)
                );
                
                if (isExplicit) {
                    el.style.setProperty('filter', 'blur(80px) brightness(0.1)', 'important');
                    if (el.parentElement) el.parentElement.style.setProperty('filter', 'blur(80px) brightness(0.1)', 'important');
                }
            };

            // CORS EVASION: Send the image URL to the Background Service Worker to fetch securely
            chrome.runtime.sendMessage({ action: 'fetch_image', url: el.src }, async (response) => {
                if (response && response.base64) {
                    const proxyImg = new Image();
                    proxyImg.src = response.base64;
                    proxyImg.onload = async () => {
                        try {
                            const predictions = await nsfwModel.classify(proxyImg);
                            processPredictions(predictions);
                        } catch (e) {}
                    };
                }
            });
        }
    });
};

const sweepXSidebarTextNode = (settingKey, exactTextMatch) => {
    if (!settings[settingKey]) return;
    document.querySelectorAll('a, div[role="button"], div[role="menuitem"]').forEach(el => {
        if (el.innerText && el.innerText.trim().startsWith(exactTextMatch)) {
            const navItem = el.closest('a') || el.closest('div[role="button"]') || el;
            navItem.style.setProperty('display', 'none', 'important');
        }
    });
};

const sweepSidebarItem = (settingKey, textLabel) => {
    if (!settings[settingKey]) return;
    const textNodes = document.querySelectorAll('span, a, div, h2, h3');
    textNodes.forEach(node => {
        if (node.innerText && node.innerText.trim() === textLabel) {
            const structuralContainer = node.closest('a') || node.closest('div[role="button"]') || node.closest('li');
            if (structuralContainer) {
                structuralContainer.style.setProperty('display', 'none', 'important');
                const outerWrapper = structuralContainer.parentElement;
                if (outerWrapper && (outerWrapper.tagName === 'LI' || outerWrapper.childElementCount === 1)) {
                    outerWrapper.style.setProperty('display', 'none', 'important');
                }
            }
        }
    });
};

const handleDynamicBlocks = () => {
    const host = window.location.hostname;

    if (host.includes('instagram.com')) {
        if (settings['ig-story']) {
            document.querySelectorAll('canvas').forEach(canvas => {
                const storyTray = canvas.closest('ul') || canvas.closest('div[role="menu"]');
                if (storyTray) {
                    storyTray.style.setProperty('display', 'none', 'important');
                    const sectionContainer = storyTray.parentElement;
                    if (sectionContainer && sectionContainer.tagName === 'DIV') {
                        sectionContainer.style.setProperty('display', 'none', 'important');
                    }
                }
            });
            document.querySelectorAll('[aria-label*="Story" i], [aria-label*="story" i]').forEach(el => {
                const tray = el.closest('ul');
                if (tray) {
                    tray.style.setProperty('display', 'none', 'important');
                    if (tray.parentElement) tray.parentElement.style.setProperty('display', 'none', 'important');
                }
            });
        }
        sweepSidebarItem('ig-search', 'Search');
        sweepSidebarItem('ig-notif', 'Notifications');
        sweepSidebarItem('ig-create', 'Create');
        sweepSidebarItem('ig-dash', 'Dashboard');

        if (settings['ig-suggested'] || settings['ig-feed-rec']) {
            document.querySelectorAll('span, h3, h4').forEach(el => {
                const txt = el.innerText;
                if (settings['ig-suggested'] && (txt === 'Suggested for you' || txt === 'See all suggested')) {
                    const block = el.closest('div[style*="flex-direction: column"]') || el.parentElement?.parentElement?.parentElement;
                    if (block && block.id !== 'mount_0_0_') block.style.display = 'none';
                }
                if (settings['ig-feed-rec'] && (txt === 'Suggested posts' || txt === 'Suggested post')) {
                    const article = el.closest('article');
                    if (article) article.style.display = 'none';
                }
            });
        }
    }

    if (host.includes('x.com') || host.includes('twitter.com')) {
        const path = window.location.pathname;
        const isExplore = path.includes('/explore');
        const isHome = path === '/home' || path === '/';

        sweepXSidebarTextNode('x-home-btn', 'Home');
        sweepXSidebarTextNode('x-follow-page-btn', 'Follow');
        sweepXSidebarTextNode('x-chat-btn', 'Chat');
        sweepXSidebarTextNode('x-bookmarks', 'Bookmarks');
        sweepXSidebarTextNode('x-creator-studio-btn', 'Creator Studio');
        sweepXSidebarTextNode('x-premium-btn', 'Premium');
        sweepXSidebarTextNode('x-profile-btn', 'Profile');

        if (settings['x-bookmarks'] && path.includes('/bookmarks')) {
            document.querySelectorAll('[data-testid="primaryColumn"]').forEach(col => col.style.setProperty('display', 'none', 'important'));
        }

        if (settings['x-whats-happening']) {
            document.querySelectorAll('h2, span').forEach(el => {
                const text = el.innerText;
                if (text && (text.includes('What’s happening') || text.includes("What's happening"))) {
                    const container = el.closest('section') || el.closest('aside') || el.parentElement?.parentElement?.parentElement;
                    if (container) container.style.setProperty('display', 'none', 'important');
                }
            });
        }

        document.querySelectorAll('[role="tab"], [role="presentation"]').forEach(tab => {
            const text = tab.innerText.trim();
            if (isExplore) {
                if (settings['x-explore-foryou'] && text === 'For you') tab.style.setProperty('display', 'none', 'important');
                if (settings['x-explore-trend'] && text === 'Trending') tab.style.setProperty('display', 'none', 'important');
                if (settings['x-explore-news'] && text === 'News') tab.style.setProperty('display', 'none', 'important');
                if (settings['x-explore-sports'] && text === 'Sports') tab.style.setProperty('display', 'none', 'important');
                if (settings['x-explore-ent'] && text === 'Entertainment') tab.style.setProperty('display', 'none', 'important');
            }
            if (isHome) {
                if (settings['x-home-foryou-tab'] && text === 'For you') tab.style.setProperty('display', 'none', 'important');
                if (settings['x-home-following-tab'] && text === 'Following') tab.style.setProperty('display', 'none', 'important');
            }
        });

        if (settings['x-follow-btn']) {
            document.querySelectorAll('div[role="button"], button').forEach(btn => {
                if (btn.innerText.trim() === 'Follow') btn.style.setProperty('display', 'none', 'important');
            });
        }

        if (settings['x-home-rec'] || settings['x-who-to-follow']) {
            document.querySelectorAll('aside[aria-label="Who to follow"]').forEach(aside => {
                const cell = aside.closest('div[data-testid="cellInnerDiv"]');
                if (cell) {
                    cell.style.setProperty('display', 'none', 'important');
                    cell.style.setProperty('height', '0px', 'important');
                    cell.style.setProperty('margin', '0px', 'important');
                    cell.style.setProperty('padding', '0px', 'important');
                    cell.style.setProperty('border', 'none', 'important');
                }
            });
        }
    }

    if (settings['ig-nsfw']) scanForNSFW();
};

const observer = new MutationObserver(() => {
    handleDynamicBlocks();
});
observer.observe(document.documentElement, { childList: true, subtree: true });

updateEngine();
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'update_toggles') updateEngine();
});