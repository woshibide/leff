// configuration constants
const CONFIG = {
    MENU_ANIMATION_DELAY: 200,
    CLICKABLE_SELECTORS: [
        'a', 'button', '.clickable', '[role="button"]', 
        'input[type="submit"]', 'input[type="button"]', 
        '.tickets-button', '.programme-table tbody tr', 
        '.programme-table th', '#circle', '#search-icon',
        '#languages button', '.schedule-event-cell', '#menu-close', '#popup-close',
        '#circle-placeholder'
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
                console.log('cursor should be excited')
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
            logo: document.getElementById('nav-logo'),
            menuText: null
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
                // console.log('logo loaded successfully');
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
        this.elements.circle.addEventListener('click', () => {
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
        // show close button
        if (this.elements.closeButton) {
            this.elements.closeButton.parentElement.style.display = 'block';
        }
        
        // get circle position for expansion animation
        const circleRect = this.elements.circle.getBoundingClientRect();
        const circleTop = circleRect.top + (circleRect.height / 2);
        const circleLeft = circleRect.left + (circleRect.width / 2);

        // set css variables for the animation origin
        this.elements.circle.style.setProperty('--circle-top', `${circleTop}px`);
        this.elements.circle.style.setProperty('--circle-left', `${circleLeft}px`);

        this.elements.circle.classList.add('expanded');
        this.elements.nav.classList.add('menu-active');
        document.body.classList.add('menu-active');
        
        // swap logo to text 'menu'
        setTimeout(() => {
            if (this.elements.logo && this.elements.logo.parentNode) {
                if (!this.elements.menuText) {
                    this.elements.menuText = document.createElement('span');
                    this.elements.menuText.id = 'nav-logo-text';
                    this.elements.menuText.textContent = 'leff 2025';
                    if (this.elements.logo.className) {
                        this.elements.menuText.className = this.elements.logo.className;
                    }
                }
                this.elements.logo.parentNode.replaceChild(this.elements.menuText, this.elements.logo);
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
            // hide close button
            if (this.elements.closeButton) {
                this.elements.closeButton.parentElement.style.display = 'none';
            }
            // swap back to yellow logo after the menu animation completes
            if (this.elements.menuText && this.elements.menuText.parentNode) {
                this.elements.menuText.parentNode.replaceChild(this.elements.logo, this.elements.menuText);
            }
            // clean up css variables
            this.elements.circle.style.removeProperty('--circle-top');
            this.elements.circle.style.removeProperty('--circle-left');
        }, CONFIG.MENU_ANIMATION_DELAY);
    },

    /**
     * create a placeholder circle to maintain nav layout during animation
     */
    createPlaceholderCircle() {
        // no longer needed
    },

    /**
     * remove the placeholder circle
     */
    removePlaceholderCircle() {
        // no longer needed
    }
};

/**
 * menu dropdown module
 * handles dropdown functionality in the menu and search utility
 */
const MenuDropdown = {
    /**
     * initialize dropdown functionality
     */
    init() {
        this.setupDropdownToggles();
        this.setupSearchUtilityDropdowns();
    },

    /**
     * setup dropdown toggle event listeners for menu
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
     * setup dropdown functionality for search utility
     */
    setupSearchUtilityDropdowns() {
        const searchDropdownToggles = document.querySelectorAll('.search-utilities .dropdown-toggle');
        
        searchDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSearchDropdown(toggle);
            });
        });

        // close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-utilities .dropdown-toggle') && 
                !e.target.closest('.search-utilities .dropdown-content')) {
                this.closeAllSearchDropdowns();
            }
        });
    },

    /**
     * toggle dropdown open/close state for menu
     * @param {element} toggle - the dropdown toggle button
     */
    toggleDropdown(toggle) {
        const dropdownId = toggle.dataset.dropdown + '-dropdown';
        const dropdownContent = document.getElementById(dropdownId);
        
        if (!dropdownContent) return;

        // toggle 'expanded' class on both the toggle and the content
        toggle.classList.toggle('expanded');
        dropdownContent.classList.toggle('expanded');
    },

    /**
     * toggle dropdown for search utility
     * @param {element} toggle - the dropdown toggle button
     */
    toggleSearchDropdown(toggle) {
        const dropdownContent = toggle.nextElementSibling;
        
        if (!dropdownContent || !dropdownContent.classList.contains('dropdown-content')) return;

        // close other dropdowns first
        this.closeAllSearchDropdowns();

        // toggle current dropdown
        toggle.classList.toggle('expanded');
        dropdownContent.classList.toggle('expanded');
        
        // update arrow direction
        const arrow = toggle.querySelector('.dropdown-arrow');
        if (arrow) {
            arrow.style.transform = dropdownContent.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    },

    /**
     * close all search utility dropdowns
     */
    closeAllSearchDropdowns() {
        const searchDropdowns = document.querySelectorAll('.search-utilities .dropdown-content');
        const searchToggles = document.querySelectorAll('.search-utilities .dropdown-toggle');
        
        searchDropdowns.forEach(dropdown => {
            dropdown.classList.remove('expanded');
        });
        
        searchToggles.forEach(toggle => {
            toggle.classList.remove('expanded');
            const arrow = toggle.querySelector('.dropdown-arrow');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    }
};

/**
 * form validation module
 * handles custom validation for the mailchimp signup form
 */

// TODO: not rely on browsers defaults
const ValidationInputCheck = {
    form: null,
    emailInput: null,
    radioInput: null,
    responseContainer: null,
    messages: {
        en: {
            invalidEmail: 'Enter a valid email address.',
            agreeToTerms: 'Agree to the terms.'
        },
        nl: {
            invalidEmail: 'Voer een geldig e-mailadres in.',
            agreeToTerms: 'Stem in met de voorwaarden.'
        }
    },

    /**
     * initialize the validation module
     */
    init() {
        this.form = document.getElementById('mc-embedded-subscribe-form');
        if (!this.form) return;

        // disable native validation so custom messages always show
        this.form.setAttribute('novalidate', '');

        this.emailInput = document.getElementById('mce-EMAIL');
        this.radioInput = document.getElementById('mce-MMERGE50');
        this.responseContainer = document.getElementById('custom-mce-responses');

        // ensure response container exists and is accessible
        if (!this.responseContainer) {
            this.responseContainer = document.createElement('div');
            this.responseContainer.id = 'custom-mce-responses';
            const scroll = this.form.querySelector('#mc_embed_signup_scroll');
            (scroll || this.form).appendChild(this.responseContainer);
        }
        this.responseContainer.setAttribute('role', 'alert');
        this.responseContainer.setAttribute('aria-live', 'polite');

        // clear messages when user interacts
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                // do not clear all messages on input, only unmark this field
                this.markField(this.emailInput, true);
            });
        }
        if (this.radioInput) {
            this.radioInput.addEventListener('change', () => {
                // do not clear all messages on change, only unmark this field
                this.markField(this.radioInput, true);
            });
        }

        this.form.addEventListener('submit', this.validate.bind(this));
    },

    /**
     * validate the form on submission
     * @param {event} e - the submit event
     */
    validate(e) {
        this.clearMessages();
        let isValid = true;
        let firstInvalid = null;
        const lang = document.documentElement.lang || 'en';
        const currentMessages = this.messages[lang] || this.messages.en;

        const email = this.emailInput?.value.trim() || '';
        if (!this.isValidEmail(email)) {
            this.displayMessage(currentMessages.invalidEmail, 'error');
            this.markField(this.emailInput, false);
            isValid = false;
            if (!firstInvalid && this.emailInput) firstInvalid = this.emailInput;
        }

        if (!this.radioInput || !this.radioInput.checked) {
            this.displayMessage(currentMessages.agreeToTerms, 'error');
            this.markField(this.radioInput, false);
            isValid = false;
            if (!firstInvalid && this.radioInput) firstInvalid = this.radioInput;
        }

        if (!isValid) {
            e.preventDefault();
            // focus the first invalid field
            if (firstInvalid && typeof firstInvalid.focus === 'function') {
                firstInvalid.focus();
            }
        }
        // if valid, the form will submit as normal
    },

    /**
     * check if an email address is valid
     * @param {string} email - the email to validate
     * @returns {boolean} - true if valid, false otherwise
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * mark/unmark a field as invalid for a11y and simple styling
     * @param {HTMLElement} field 
     * @param {boolean} ok
     */
    markField(field, ok) {
        if (!field) return;
        if (ok) {
            field.removeAttribute('aria-invalid');
            field.classList.remove('field-error');
        } else {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('field-error');
        }
    },

    /**
     * display a status message to the user
     * @param {string} message - the message to display
     * @param {string} type - the type of message ('success' or 'error')
     */
    displayMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `status-message ${type}`;
        messageElement.textContent = message;
        this.responseContainer.appendChild(messageElement);
    },

    /**
     * clear all status messages
     */
    clearMessages() {
        if (this.responseContainer) this.responseContainer.innerHTML = '';
    }
};


/**
 * navigation scroll behavior module
 * handles hiding/showing navigation based on scroll direction
 */
const NavigationScroll = {
    nav: null,
    searchUtilities: null,
    lastScrollTop: 0,
    scrollThreshold: 5, // minimum scroll distance to trigger hide/show
    isHidden: false,

    /**
     * initialize navigation scroll behavior
     */
    init() {
        this.nav = document.querySelector('nav');
        if (!this.nav) return;

        // find search utilities if present on page
        this.searchUtilities = document.querySelector('.search-utilities');

        // add initial visible class
        this.nav.classList.add('nav-visible');
        
        this.setupScrollListener();
    },

    /**
     * setup scroll event listener with throttling
     */
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    /**
     * handle scroll events to show/hide navigation
     */
    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // prevent negative values when overscrolling at top
        const scrollTop = Math.max(currentScrollTop, 0);
        
        // don't hide navigation when menu is active
        if (this.nav.classList.contains('menu-active')) {
            this.showNavigation();
            this.lastScrollTop = scrollTop;
            return;
        }
        
        // don't hide navigation when at the very top of the page
        if (scrollTop < this.scrollThreshold) {
            this.showNavigation();
            this.lastScrollTop = scrollTop;
            return;
        }
        
        // determine scroll direction
        const scrollDifference = scrollTop - this.lastScrollTop;
        
        // only trigger if scroll difference is significant enough
        if (Math.abs(scrollDifference) < this.scrollThreshold) {
            return;
        }
        
        if (scrollDifference > 0 && !this.isHidden) {
            // scrolling down - hide navigation
            this.hideNavigation();
        } else if (scrollDifference < 0 && this.isHidden) {
            // scrolling up - show navigation
            this.showNavigation();
        }
        
        this.lastScrollTop = scrollTop;
    },

    /**
     * hide the navigation bar
     */
    hideNavigation() {
        this.nav.classList.remove('nav-visible');
        this.nav.classList.add('nav-hidden');
        
        // move search utilities up when navigation hides to use the freed space
        // but only on desktop (not mobile where we have our own menu system)
        if (this.searchUtilities && window.innerWidth > 768) {
            // get navigation height to move search utilities up by the same amount
            const navHeight = this.nav.offsetHeight;
            this.searchUtilities.style.transform = `translateY(-${navHeight}px)`;
            this.searchUtilities.style.transition = 'transform 0.3s var(--transition)';
        }
        
        this.isHidden = true;
    },

    /**
     * show the navigation bar
     */
    showNavigation() {
        this.nav.classList.remove('nav-hidden');
        this.nav.classList.add('nav-visible');
        
        // move search utilities back to original position when navigation shows
        // but only on desktop (not mobile where we have our own menu system)
        if (this.searchUtilities && window.innerWidth > 768) {
            this.searchUtilities.style.transform = 'translateY(0)';
            this.searchUtilities.style.transition = 'transform 0.3s var(--transition)';
        }
        
        this.isHidden = false;
    }
};


/**
 * main application initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // TextReplacer.init();
    CustomCursor.init();
    MenuSystem.init();
    MenuDropdown.init();
    ValidationInputCheck.init();
    NavigationScroll.init();
});