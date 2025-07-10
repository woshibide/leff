// configuration constants
const CONFIG = {
    MENU_ANIMATION_DELAY: 400,
    CLICKABLE_SELECTORS: [
        'a', 'button', '.clickable', '[role="button"]', 
        'input[type="submit"]', 'input[type="button"]', 
        '.tickets-button', '.programme-table tbody tr', 
        '.programme-table th', '#circle', '#search-icon',
        '#languages button', '.schedule-event-cell', '#menu-close', '#popup-close'
    ]
};

/**
 * utility function to get asset path with base path
 * @param {string} path - the asset path
 * @returns {string} - the full asset path
 */
function getAssetPath(path) {
    const basePath = window.BASE_PATH || '/';
    return basePath + path.replace(/^\//, '');
}

/**
 * text replacement module
 * replaces "leff" with italicized version in text nodes
 */
const TextReplacer = {
    /**
     * replace all occurrences of "leff" with stylized version
     */
    init() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            this.createTextFilter()
        );
        
        const textNodes = this.findTextNodes(walker);
        this.replaceTextInNodes(textNodes);
    },

    /**
     * create filter for text walker to exclude script/style/title elements
     * @returns {function} filter function
     */
    createTextFilter() {
        return node => {
            const excludedTags = /^(SCRIPT|STYLE|TITLE)$/;
            return node.parentElement?.tagName.match(excludedTags) 
                ? NodeFilter.FILTER_REJECT 
                : NodeFilter.FILTER_ACCEPT;
        };
    },

    /**
     * find all text nodes containing "leff"
     * @param {TreeWalker} walker - the tree walker
     * @returns {Array} array of text nodes
     */
    findTextNodes(walker) {
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (/\bleff\b/i.test(node.textContent)) {
                textNodes.push(node);
            }
        }
        return textNodes;
    },

    /**
     * replace text in the found nodes
     * @param {Array} textNodes - array of text nodes to process
     */
    replaceTextInNodes(textNodes) {
        textNodes.forEach(textNode => {
            const span = document.createElement('span');
            span.innerHTML = textNode.textContent.replace(
                /\bleff\b/gi, 
                '<span style="text-transform: lowercase;">l<em>e</em>ff</span>'
            );
            textNode.parentNode.replaceChild(span, textNode);
        });
    }
};

/**
 * custom cursor module
 * handles custom cursor movement and hover effects
 */
const CustomCursor = {
    cursor: null,

    /**
     * initialize custom cursor functionality
     */
    init() {
        this.cursor = document.getElementById('custom-cursor');
        if (!this.cursor) return;

        this.setupMouseTracking();
        this.setupHoverEffects();
    },

    /**
     * setup mouse tracking for cursor movement
     */
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });
    },

    /**
     * setup hover effects for clickable elements
     */
    setupHoverEffects() {
        const selectors = CONFIG.CLICKABLE_SELECTORS.join(', ');
        
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches(selectors)) {
                this.cursor.classList.add('excited');
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches(selectors)) {
                this.cursor.classList.remove('excited');
            }
        }, true);
    }
};

/**
 * menu system module
 * handles menu opening, closing, and interactions
 */
const MenuSystem = {
    elements: {},

    /**
     * initialize menu system
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.ensureLogoLoads();
    },

    /**
     * cache frequently used dom elements
     */
    cacheElements() {
        this.elements = {
            circle: document.getElementById('circle'),
            circleContainer: document.getElementById('circle-container'),
            menuOverlay: document.getElementById('menu-overlay'),
            closeButton: document.getElementById('menu-close'),
            nav: document.querySelector('nav'),
            logo: document.getElementById('nav-logo')
        };
    },

    /**
     * ensure logo loads properly on page load
     */
    ensureLogoLoads() {
        if (this.elements.logo) {
            // check if logo is already loaded
            if (this.elements.logo.complete && this.elements.logo.naturalWidth > 0) {
                return; // logo is already loaded
            }
            
            // force reload the yellow logo to ensure it displays
            const logoSrc = getAssetPath('assets/leff-logo-yellow.svg');
            
            // add load handler to confirm success
            this.elements.logo.onload = () => {
                console.log('logo loaded successfully');
            };
            
            // add error handler in case the logo fails to load
            this.elements.logo.onerror = () => {
                console.warn('logo failed to load, trying relative path...');
                // try relative path as fallback
                this.elements.logo.src = 'assets/leff-logo-yellow.svg';
                
                // if that also fails, try one more time with cache bust
                this.elements.logo.onerror = () => {
                    console.warn('logo still failing, trying cache bust...');
                    this.elements.logo.src = logoSrc + '?t=' + Date.now();
                };
            };
            
            // set the source (this should trigger load/error event)
            this.elements.logo.src = logoSrc;
        }
    },

    /**
     * setup all menu-related event listeners
     */
    setupEventListeners() {
        this.setupMenuToggle();
        this.setupCloseHandlers();
        this.setupOverlayClick();
    },

    /**
     * setup menu toggle functionality
     */
    setupMenuToggle() {
        this.elements.circleContainer.addEventListener('click', () => {
            this.openMenu();
        });
    },

    /**
     * setup close button handlers
     */
    setupCloseHandlers() {
        if (this.elements.closeButton) {
            this.elements.closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });
        }
    },

    /**
     * setup overlay click to close menu
     */
    setupOverlayClick() {
        this.elements.menuOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.menuOverlay) {
                this.closeMenu();
            }
        });
    },

    /**
     * open the menu with animation
     */
    openMenu() {
        this.elements.circle.classList.add('expanded');
        this.elements.nav.classList.add('menu-active');
        document.body.classList.add('menu-active');
        
        // swap to black logo after a small delay to ensure css transitions don't interfere
        setTimeout(() => {
            if (this.elements.logo) {
                this.elements.logo.src = getAssetPath('assets/leff-logo-black.svg');
            }
        }, 50);
        
        setTimeout(() => {
            this.elements.menuOverlay.classList.add('active');
        }, CONFIG.MENU_ANIMATION_DELAY);
    },

    /**
     * close the menu with animation
     */
    closeMenu() {
        this.elements.menuOverlay.classList.remove('active');
        this.elements.nav.classList.remove('menu-active');
        document.body.classList.remove('menu-active');
        
        setTimeout(() => {
            this.elements.circle.classList.remove('expanded');
            // swap back to yellow logo after the menu animation completes
            if (this.elements.logo) {
                this.elements.logo.src = getAssetPath('assets/leff-logo-yellow.svg');
            }
        }, CONFIG.MENU_ANIMATION_DELAY);
    }
};

/**
 * menu dropdown module
 * handles dropdown functionality in the menu
 */
const MenuDropdown = {
    /**
     * initialize dropdown functionality
     */
    init() {
        this.setupDropdownToggles();
    },

    /**
     * setup dropdown toggle event listeners
     */
    setupDropdownToggles() {
        const dropdownToggles = document.querySelectorAll('.menu-dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDropdown(toggle);
            });
        });
    },

    /**
     * toggle dropdown open/close state
     * @param {Element} toggle - the dropdown toggle button
     */
    toggleDropdown(toggle) {
        const dropdownId = toggle.dataset.dropdown + '-dropdown';
        const dropdownContent = document.getElementById(dropdownId);
        
        if (!dropdownContent) return;

        const isExpanded = toggle.classList.contains('expanded');
        
        // close all other dropdowns first
        this.closeAllDropdowns();
        
        if (!isExpanded) {
            // open this dropdown
            toggle.classList.add('expanded');
            dropdownContent.classList.add('expanded');
        }
    },

    /**
     * close all open dropdowns
     */
    closeAllDropdowns() {
        const allToggles = document.querySelectorAll('.menu-dropdown-toggle');
        const allContents = document.querySelectorAll('.menu-dropdown-content');
        
        allToggles.forEach(toggle => toggle.classList.remove('expanded'));
        allContents.forEach(content => content.classList.remove('expanded'));
    }
};

/**
 * main application initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    TextReplacer.init();
    CustomCursor.init();
    MenuSystem.init();
    MenuDropdown.init();
});