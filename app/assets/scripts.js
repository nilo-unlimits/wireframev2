// Clean Unlimits App - Main JavaScript


// Header and Navigation Scroll Behavior
function initializeScrollBehavior() {
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (!mainContent || !header || !bottomNav) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 10;
    
    mainContent.addEventListener('scroll', function() {
        const scrollTop = mainContent.scrollTop;
        const scrollDelta = Math.abs(scrollTop - lastScrollTop);
        
        if (scrollDelta < scrollThreshold) return;
        
        const floatingAI = document.getElementById('floatingAI');
        const currentPage = document.querySelector('.page.active')?.id;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide header and nav
            header.classList.add('hidden');
            bottomNav.classList.add('hidden');
            
            // Show floating FS on explore/dreams/challenges/meditation when menu is hidden
            if (floatingAI && (currentPage === 'explore' || currentPage === 'dreams' || currentPage === 'challenges' || currentPage === 'meditation')) {
                floatingAI.classList.add('visible');
            }
        } else {
            // Scrolling up - show header and nav
            header.classList.remove('hidden');
            bottomNav.classList.remove('hidden');
            
            // Hide floating FS when menu is visible
            if (floatingAI) {
                floatingAI.classList.remove('visible');
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// Page content loader
async function loadPageContent(pageId) {
    try {
        const response = await fetch(`pages/${pageId}.html`);
        if (response.ok) {
            const content = await response.text();
            const pageElement = document.getElementById(pageId);
            if (pageElement) {
                pageElement.innerHTML = content;
            }
        }
    } catch (error) {
        console.error(`Error loading page ${pageId}:`, error);
        // Create fallback content
        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            pageElement.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${pageId.charAt(0).toUpperCase() + pageId.slice(1)}</h1>
                    <p class="page-subtitle">This page is under construction.</p>
                </div>
            `;
        }
    }
}

// Component loader function
async function loadComponent(componentName, containerId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (response.ok) {
            const content = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = content;
            }
        }
    } catch (error) {
        console.error(`Error loading component ${componentName}:`, error);
    }
}

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Simple showPage function
function enhancedShowPage(pageId) {
    console.log('Loading page:', pageId);
    
    // Hide/show footer and header based on page type
    const footer = document.querySelector('.bottom-nav');
    const header = document.querySelector('.header');
    const innerPages = ['learn-more', 'manage-account', 'credits', 'future-self', 'tasks'];
    
    if (footer) {
        if (innerPages.includes(pageId)) {
            footer.style.display = 'none';
        } else {
            footer.style.display = 'block';
        }
    }
    
    if (header) {
        if (innerPages.includes(pageId)) {
            header.style.display = 'none';
        } else {
            header.style.display = 'block';
        }
    }
    
    // Load content if page is empty (only for inner pages that aren't preloaded)
    const pageElement = document.getElementById(pageId);
    if (pageElement && !pageElement.innerHTML.trim() && innerPages.includes(pageId)) {
        loadPageContent(pageId).then(() => {
            // Load breadcrumb for inner pages
            if (pageId === 'learn-more') {
                loadComponent('breadcrumb', 'breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'manage-account') {
                loadComponent('breadcrumb', 'account-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'credits') {
                loadComponent('breadcrumb', 'credits-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'future-self') {
                loadComponent('breadcrumb', 'future-self-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            } else if (pageId === 'tasks') {
                loadComponent('breadcrumb', 'tasks-breadcrumb-container').then(() => {
                    updateBreadcrumbTitle(pageId);
                    initializeLucideIcons();
                });
            }
        });
    } else {
        // Initialize icons for already loaded pages
        initializeLucideIcons();
        
        // Set breadcrumb title for already loaded pages
        updateBreadcrumbTitle(pageId);
    }
    
    // Call the basic showPage function
    basicShowPage(pageId);
}

// Rename the original function
function basicShowPage(pageId) {
    console.log(`showPage called with: ${pageId}`);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    console.log(`Found ${pages.length} pages`);
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const targetPage = document.getElementById(pageId);
    console.log(`Target page found:`, !!targetPage);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`Page ${pageId} is now active`);
    }
    
    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the corresponding nav item
    const activeNavItem = document.querySelector(`.nav-item[onclick*="${pageId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    console.log(`Navigated to page: ${pageId}`);
}

// Set the global showPage to the enhanced version
window.showPage = enhancedShowPage;

// DOM Content Loaded Event Handler
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load header, footer, and burger menu components first
        await loadComponent('header', 'header-container');
        await loadComponent('footer', 'footer-container');
        await loadComponent('burger-menu', 'burger-menu-container');
        
        // Initialize scroll behavior
        initializeScrollBehavior();
        
        // Load and show explore page by default
        await loadPageContent('explore');
        enhancedShowPage('explore');
        
        // Preload dreams and challenges pages
        await loadPageContent('dreams');
        await loadPageContent('challenges');
        await loadPageContent('future-self');
        
        // Load breadcrumb for future-self since it's preloaded
        await loadComponent('breadcrumb', 'future-self-breadcrumb-container');
        updateBreadcrumbTitle('future-self');
        
    } catch (error) {
        console.error('Error loading app content:', error);
    }
    
    // Initialize Lucide icons
    initializeLucideIcons();
    
    console.log('Clean Unlimits app loaded successfully');
});

// Plan selection functionality for subscribe page
function selectPlan(planType) {
    const options = document.querySelectorAll('.subscription-option');
    options.forEach(option => {
        option.classList.remove('selected');
        const radio = option.querySelector('.radio-button');
        radio.classList.remove('active');
    });
    
    const selectedOption = document.querySelector(`[data-plan="${planType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        const radio = selectedOption.querySelector('.radio-button');
        radio.classList.add('active');
    }
}

// Initialize plan selection when subscribe page loads
function initializeSubscriptionOptions() {
    const options = document.querySelectorAll('.subscription-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const planType = this.getAttribute('data-plan');
            selectPlan(planType);
        });
    });
}

// Breadcrumb navigation functions
function navigateBack() {
    showPage('explore'); // Go back to home page
}

function navigateClose() {
    showPage('explore'); // Close to home page
}

// New Breadcrumb System
const BREADCRUMB_TITLES = {
    'tasks': 'MY TASKS',
    'future-self': 'FUTURE SELF',
    'credits': 'DREAM CREDITS',
    'manage-account': 'MANAGE ACCOUNT',
    'learn-more': 'SUBSCRIPTION'
};

function updateBreadcrumbTitle(pageId) {
    const title = BREADCRUMB_TITLES[pageId];
    if (!title) return;
    
    // Wait a bit for DOM to be ready, then update all possible breadcrumb elements
    setTimeout(() => {
        // Try multiple selectors to find breadcrumb title element
        const selectors = [
            '#breadcrumb-title',
            '.breadcrumb-title',
            '[id*="breadcrumb"] .breadcrumb-title',
            '.breadcrumb-header .breadcrumb-title'
        ];
        
        let updated = false;
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.textContent = title;
                    updated = true;
                }
            });
        });
        
        console.log(`Breadcrumb update for ${pageId}: ${updated ? 'SUCCESS' : 'FAILED'} - Title: ${title}`);
    }, 50);
    
    // Also try immediately
    const immediateElement = document.querySelector('#breadcrumb-title, .breadcrumb-title');
    if (immediateElement) {
        immediateElement.textContent = title;
    }
}

// Profile picture editing function
function editProfilePicture() {
    alert('Profile picture editing functionality would be implemented here');
}

// Subscription toggle functions
function showSubscriptionView() {
    const subscriptionContent = document.getElementById('subscription-content');
    const subscribedContent = document.getElementById('subscribed-content');
    const heroBanner = document.querySelector('.hero-banner');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    if (subscriptionContent && subscribedContent) {
        subscriptionContent.style.display = 'block';
        subscribedContent.style.display = 'none';
        if (heroBanner) heroBanner.style.display = 'block';
        
        toggleBtns.forEach(btn => btn.classList.remove('active'));
        toggleBtns[0].classList.add('active');
    }
}

function showSubscribedView() {
    const subscriptionContent = document.getElementById('subscription-content');
    const subscribedContent = document.getElementById('subscribed-content');
    const heroBanner = document.querySelector('.hero-banner');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    if (subscriptionContent && subscribedContent) {
        subscriptionContent.style.display = 'none';
        subscribedContent.style.display = 'block';
        if (heroBanner) heroBanner.style.display = 'none';
        
        toggleBtns.forEach(btn => btn.classList.remove('active'));
        toggleBtns[1].classList.add('active');
    }
}

// Burger Menu Functions
function openBurgerMenu() {
    const menu = document.getElementById('burger-menu');
    const backdrop = document.getElementById('burger-backdrop');
    
    if (menu && backdrop) {
        menu.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBurgerMenu() {
    const menu = document.getElementById('burger-menu');
    const backdrop = document.getElementById('burger-backdrop');
    
    if (menu && backdrop) {
        menu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Export functions for global access
window.selectPlan = selectPlan;
window.initializeSubscriptionOptions = initializeSubscriptionOptions;
window.navigateBack = navigateBack;
window.navigateClose = navigateClose;
window.setBreadcrumbTitle = setBreadcrumbTitle;
window.openBurgerMenu = openBurgerMenu;
window.closeBurgerMenu = closeBurgerMenu;
window.editProfilePicture = editProfilePicture;
window.showSubscriptionView = showSubscriptionView;
window.showSubscribedView = showSubscribedView;

// Future Self Chat Functions
function launchFutureSelf() {
    console.log('Launching Future Self...');
    showPage('future-self');
}

function sendMessage() {
    const input = document.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    input.value = '';
    autoResizeTextarea(input);
    
    // Simulate Future Self response after a delay
    setTimeout(() => {
        addFutureSelfResponse(message);
    }, 1500);
}

function addUserMessage(text) {
    const chatContainer = document.querySelector('#chat-messages');
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerHTML = `
        <div>
            <div class="message-text">${text}</div>
            <div class="message-timestamp">${timestamp}</div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addFutureSelfResponse(userMessage) {
    const chatContainer = document.querySelector('#chat-messages');
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Generate contextual responses based on user input
    const responses = [
        "I see you're thinking about this deeply. That curiosity you feel right now? It's the same spark that leads to our biggest breakthroughs.",
        "The path you're on might feel uncertain, but I can tell you that every step matters. Trust the process.",
        "You're asking the right questions. That willingness to explore and grow is exactly what shapes our future.",
        "I remember when we first started questioning this. It's beautiful to see you taking these steps now.",
        "The version of you that emerges from this journey will thank you for asking these questions today."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message future-self-message';
    messageDiv.innerHTML = `
        <div>
            <div class="message-text">${response}</div>
            <div class="message-timestamp">${timestamp}</div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    
    // Enable/disable send button based on content
    const sendBtn = document.querySelector('.chat-send-btn') || document.querySelector('.chat-send-btn-rounded');
    const hasContent = textarea.value.trim().length > 0;
    if (sendBtn) {
        sendBtn.disabled = !hasContent;
    }
}

// Export Future Self functions
window.launchFutureSelf = launchFutureSelf;
window.sendMessage = sendMessage;
window.handleChatKeydown = handleChatKeydown;
window.autoResizeTextarea = autoResizeTextarea;

// Tasks Page Functions
function filterTasks() {
    const searchTerm = document.querySelector('.task-search').value.toLowerCase();
    const tasks = document.querySelectorAll('.task-item-detailed');
    
    tasks.forEach(task => {
        const taskName = task.querySelector('.task-name').textContent.toLowerCase();
        const dreamTitle = task.querySelector('.dream-title').textContent.toLowerCase();
        
        if (taskName.includes(searchTerm) || dreamTitle.includes(searchTerm)) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    });
}

function filterByDate(dateFilter) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${dateFilter}"]`).classList.add('active');
    
    // Filter tasks
    const tasks = document.querySelectorAll('.task-item-detailed');
    
    tasks.forEach(task => {
        const taskDate = task.getAttribute('data-date');
        
        if (dateFilter === 'all' || taskDate === dateFilter) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    });
}

// Export tasks functions
window.filterTasks = filterTasks;
window.filterByDate = filterByDate;