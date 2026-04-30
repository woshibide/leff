// configuration constants
const CONFIG = {
    MENU_ANIMATION_DELAY: 300,
    CLICKABLE_SELECTORS: [
        'a', 'button', '.clickable', '[role="button"]', 
        'input[type="submit"]', 'input[type="button"]', 
        '.tickets-button', '.programme-table tbody tr', 
        '.programme-table th', '#square', '#search-icon',
        '#languages button', '.schedule-event-cell', '#menu-close', '#popup-close',
        '#square-placeholder'
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
            if (e.target instanceof Element && e.target.matches(selectors)) {
                // console.log('cursor should be excited')
                this.cursor.classList.add('excited');
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target instanceof Element && e.target.matches(selectors)) {
                this.cursor.classList.remove('excited');
            }
        }, true);
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
    toggle: null,
    searchUtilities: null,
    lastScrollTop: 0,
    scrollThreshold: 5,
    isHidden: false,

    init() {
        this.nav = document.querySelector('nav');
        if (!this.nav) return;

        this.toggle = document.getElementById('nav-toggle');
        this.searchUtilities = document.querySelector('.search-utilities');

        this.nav.classList.add('nav-visible');

        // sync menu-open class (optional but useful)
        if (this.toggle) {
            this.toggle.addEventListener('change', () => {
                this.nav.classList.toggle('menu-open', this.toggle.checked);
            });
        }

        this.setupScrollListener();
    },

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

    handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollTop = Math.max(currentScrollTop, 0);

        // menu open → never hide nav
        if (this.toggle && this.toggle.checked) {
            this.showNavigation();
            this.lastScrollTop = scrollTop;
            return;
        }

        if (scrollTop < this.scrollThreshold) {
            this.showNavigation();
            this.lastScrollTop = scrollTop;
            return;
        }

        const diff = scrollTop - this.lastScrollTop;

        if (Math.abs(diff) < this.scrollThreshold) return;

        if (diff > 0 && !this.isHidden) {
            this.hideNavigation();
        } else if (diff < 0 && this.isHidden) {
            this.showNavigation();
        }

        this.lastScrollTop = scrollTop;
    },

    hideNavigation() {
        this.nav.classList.remove('nav-visible');
        this.nav.classList.add('nav-hidden');

        if (this.searchUtilities && window.innerWidth > 768) {
            const navHeight = this.nav.offsetHeight;
            this.searchUtilities.style.transform = `translateY(-${navHeight}px)`;
            this.searchUtilities.style.transition = 'transform 0.3s var(--transition)';
        }

        this.isHidden = true;
    },

    showNavigation() {
        this.nav.classList.remove('nav-hidden');
        this.nav.classList.add('nav-visible');

        if (this.searchUtilities && window.innerWidth > 768) {
            this.searchUtilities.style.transform = 'translateY(0)';
            this.searchUtilities.style.transition = 'transform 0.3s var(--transition)';
        }

        this.isHidden = false;
    }
};

// init
document.addEventListener('DOMContentLoaded', () => {
    NavigationScroll.init();
});


/**
 * main application initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    CustomCursor.init();
    MenuDropdown.init();
    ValidationInputCheck.init();
    NavigationScroll.init();
});