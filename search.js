/**
 * shared search and filter utility for programme and filmmakers pages
 * handles search input, alphabetical filtering, and sorting functionality
 */
const SearchUtility = {
    /**
     * initialize search functionality for a page
     * @param {Object} config - configuration object
     * @param {string} config.searchInputId - id of search input element
     * @param {string} config.containerSelector - selector for cards container
     * @param {string} config.cardLinkSelector - selector for individual card links
     * @param {Array} config.searchFields - array of data attributes to search in
     * @param {string} config.defaultSort - default sort field
     * @param {Object} config.sortFieldMap - mapping of sort button values to data attributes
     */
    init(config) {
        this.config = config;
        // set default sort field mapping if not provided
        this.config.sortFieldMap = config.sortFieldMap || {
            'title': 'title',
            'director': 'name', 
            'name': 'name'
        };
        this.searchInput = document.getElementById(config.searchInputId);
        this.alphaFilters = document.querySelectorAll('.alpha-filter');
        this.sortButtons = document.querySelectorAll('.sort-button');
        this.container = document.querySelector(config.containerSelector);

        // mobile menu elements
        this.mobileToggle = document.getElementById('mobile-search-toggle');
        this.mobileOverlay = document.getElementById('mobile-search-overlay');
        this.searchUtilities = document.getElementById('search-utilities');

        // specials dropdown elements
        this.dropdownToggle = document.getElementById('specials-dropdown-toggle');
        this.dropdownContent = document.getElementById('specials-dropdown-content');
        this.specialFilters = document.querySelectorAll('.special-filter');

        // dates dropdown elements
        this.datesDropdownToggle = document.getElementById('dates-dropdown-toggle');
        this.datesDropdownContent = document.getElementById('dates-dropdown-content');
        this.dateFilters = document.querySelectorAll('.date-filter');

        // navigation dropdown elements
        this.navDropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
        this.navDropdownContents = document.querySelectorAll('.nav-dropdown-content');

        if (!this.container) {
            console.warn('SearchUtility: Container not found:', config.containerSelector);
            return;
        }

        this.cardLinks = Array.from(this.container.querySelectorAll(config.cardLinkSelector));
        this.activeSort = config.defaultSort;
        this.activeSortAscending = true; // default to ascending
        this.activeLetter = null;
        this.activeSpecials = new Set(); // track active special filters
        this.activeDates = new Set(); // track active date filters

        console.log('SearchUtility initialized with', this.cardLinks.length, 'cards');

        this.bindEvents();
        this.filterAndSort();
    },

    /**
     * bind event listeners
     */
    bindEvents() {
        // mobile menu toggle
        if (this.mobileToggle && this.mobileOverlay && this.searchUtilities) {
            this.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });

            // close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.searchUtilities.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        }

        // search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterAndSort());
        }

        // alphabetical filters
        this.alphaFilters.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('active')) {
                    this.activeLetter = null;
                    button.classList.remove('active');
                } else {
                    this.alphaFilters.forEach(btn => btn.classList.remove('active'));
                    this.activeLetter = button.dataset.letter;
                    button.classList.add('active');
                }
                this.filterAndSort();
            });
        });

        // sort buttons
        this.sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                const isCurrentlyActive = button.classList.contains('active');
                
                if (isCurrentlyActive) {
                    // toggle ascending/descending for the active button
                    const currentAscending = button.dataset.ascending === 'true';
                    const newAscending = !currentAscending;
                    button.dataset.ascending = newAscending.toString();
                    
                    // update arrow visual state
                    const arrow = button.querySelector('.side-menu-arrow');
                    
                    if (arrow) {
                        arrow.classList.toggle('ascending', newAscending);
                        arrow.classList.toggle('descending', !newAscending);
                    }
                    
                    // animate letter swap
                    this.animateLetterSwap(button);
                    
                    this.activeSort = button.dataset.sort;
                    this.activeSortAscending = newAscending;
                } else {
                    // switch to new sort button
                    this.sortButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    this.activeSort = button.dataset.sort;
                    this.activeSortAscending = button.dataset.ascending === 'true';
                }
                
                this.filterAndSort();
            });
        });

        // specials dropdown toggle
        if (this.dropdownToggle && this.dropdownContent) {
            this.dropdownToggle.addEventListener('click', () => {
                const isOpen = this.dropdownContent.classList.contains('open');
                this.dropdownContent.classList.toggle('open', !isOpen);
                this.dropdownToggle.classList.toggle('active', !isOpen);
            });

            // close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.dropdownToggle.contains(e.target) && !this.dropdownContent.contains(e.target)) {
                    this.dropdownContent.classList.remove('open');
                    this.dropdownToggle.classList.remove('active');
                }
            });
        }

        // special filters (buttons)
        this.specialFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent dropdown from closing
                const specialValue = button.dataset.special;
                
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                    this.activeSpecials.delete(specialValue);
                } else {
                    button.classList.add('active');
                    this.activeSpecials.add(specialValue);
                }
                
                this.filterAndSort();
            });
        });

        // dates dropdown toggle
        if (this.datesDropdownToggle && this.datesDropdownContent) {
            this.datesDropdownToggle.addEventListener('click', () => {
                const isOpen = this.datesDropdownContent.classList.contains('open');
                this.datesDropdownContent.classList.toggle('open', !isOpen);
                this.datesDropdownToggle.classList.toggle('active', !isOpen);
            });

            // close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (this.datesDropdownToggle && this.datesDropdownContent &&
                    !this.datesDropdownToggle.contains(e.target) && !this.datesDropdownContent.contains(e.target)) {
                    this.datesDropdownContent.classList.remove('open');
                    this.datesDropdownToggle.classList.remove('active');
                }
            });
        }

        // date filters (buttons)
        this.dateFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent dropdown from closing
                const dateValue = button.dataset.date;
                
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                    this.activeDates.delete(dateValue);
                } else {
                    button.classList.add('active');
                    this.activeDates.add(dateValue);
                }
                
                this.filterAndSort();
            });
        });

        // navigation dropdown toggles
        this.navDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const dropdownId = toggle.dataset.dropdown;
                const dropdownContent = document.getElementById(dropdownId + '-dropdown');
                
                if (dropdownContent) {
                    const isOpen = dropdownContent.classList.contains('open');
                    
                    // close all other nav dropdowns
                    this.navDropdownContents.forEach(content => {
                        if (content !== dropdownContent) {
                            content.classList.remove('open');
                        }
                    });
                    this.navDropdownToggles.forEach(t => {
                        if (t !== toggle) {
                            t.classList.remove('active');
                        }
                    });
                    
                    // toggle current dropdown
                    dropdownContent.classList.toggle('open', !isOpen);
                    toggle.classList.toggle('active', !isOpen);
                }
            });
        });

        // close nav dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            let clickedInsideDropdown = false;
            
            this.navDropdownToggles.forEach(toggle => {
                const dropdownId = toggle.dataset.dropdown;
                const dropdownContent = document.getElementById(dropdownId + '-dropdown');
                
                if (toggle.contains(e.target) || (dropdownContent && dropdownContent.contains(e.target))) {
                    clickedInsideDropdown = true;
                }
            });
            
            if (!clickedInsideDropdown) {
                this.navDropdownContents.forEach(content => {
                    content.classList.remove('open');
                });
                this.navDropdownToggles.forEach(toggle => {
                    toggle.classList.remove('active');
                });
            }
        });
    },

    /**
     * filter and sort cards based on current criteria
     */
    filterAndSort() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';

        // filter cards
        this.cardLinks.forEach(cardLink => {
            const matchesSearch = this.matchesSearchTerm(cardLink, searchTerm);
            const matchesLetter = this.matchesLetterFilter(cardLink);
            const matchesSpecial = this.matchesSpecialFilter(cardLink);
            const matchesDate = this.matchesDateFilter(cardLink);

            if (matchesSearch && matchesLetter && matchesSpecial && matchesDate) {
                cardLink.style.display = 'block';
            } else {
                cardLink.style.display = 'none';
            }
        });

        // sort cards
        this.sortCards();
    },

    /**
     * check if card matches search term
     * @param {Element} cardLink - card element to check
     * @param {string} searchTerm - search term to match
     * @returns {boolean} - whether card matches search
     */
    matchesSearchTerm(cardLink, searchTerm) {
        if (!searchTerm) return true;

        return this.config.searchFields.some(field => {
            const value = cardLink.dataset[field];
            return value && value.toLowerCase().includes(searchTerm);
        });
    },

    /**
     * check if card matches letter filter
     * handles both film titles and filmmaker names (all first letters)
     * @param {Element} cardLink - card element to check
     * @returns {boolean} - whether card matches letter filter
     */
    matchesLetterFilter(cardLink) {
        if (!this.activeLetter) return true;
        
        // check film title first letter
        if (cardLink.dataset.letter === this.activeLetter) {
            return true;
        }
        
        // check all filmmaker name first letters
        const allLetters = cardLink.dataset.allLetters;
        if (allLetters) {
            const letters = allLetters.split(',');
            return letters.includes(this.activeLetter);
        }
        
        return false;
    },

    /**
     * check if card matches special filter
     * @param {Element} cardLink - card element to check
     * @returns {boolean} - whether card matches special filter
     */
    matchesSpecialFilter(cardLink) {
        if (this.activeSpecials.size === 0) return true;
        
        const cardBlock = cardLink.dataset.block || '';
        
        // check for separate ticket (films with no block)
        if (this.activeSpecials.has('separate-ticket') && cardBlock === '') {
            return true;
        }
        
        // convert card block to slug format for comparison
        const cardBlockSlug = cardBlock.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        
        // check for exact special block matches
        for (const activeSpecial of this.activeSpecials) {
            if (activeSpecial !== 'separate-ticket') {
                // compare both original block name and slug format
                if (cardBlock.toLowerCase() === activeSpecial.toLowerCase() || 
                    cardBlockSlug === activeSpecial.toLowerCase()) {
                    return true;
                }
            }
        }
        
        return false;
    },

    /**
     * check if card matches date filter
     * @param {Element} cardLink - card element to check
     * @returns {boolean} - whether card matches date filter
     */
    matchesDateFilter(cardLink) {
        if (this.activeDates.size === 0) return true;
        
        const cardDate = cardLink.dataset.date || '';
        
        // check for exact date matches
        return this.activeDates.has(cardDate);
    },

    /**
     * sort cards based on active sort option
     */
    sortCards() {
        const sortedCardLinks = this.cardLinks.sort((a, b) => {
            return this.compareCards(a, b, this.activeSort);
        });

        // re-append sorted cards to container
        sortedCardLinks.forEach(cardLink => this.container.appendChild(cardLink));
    },

    /**
     * compare two cards for sorting
     * @param {Element} cardA - first card element
     * @param {Element} cardB - second card element
     * @param {string} sortField - field to sort by (button value)
     * @returns {number} - comparison result
     */
    compareCards(cardA, cardB, sortField) {
        let comparison = 0;
        
        // map the sort field to the actual data attribute
        const actualField = this.config.sortFieldMap[sortField] || sortField;
        
        // handle special sort fields
        if (actualField === 'date') {
            comparison = this.compareDates(cardA.dataset.date, cardB.dataset.date);
        } else if (actualField === 'film_count' || actualField === 'films') {
            // handle both film_count (filmmakers) and films (specials) attributes
            const aCount = parseInt(cardA.dataset.filmCount || cardA.dataset.films, 10) || 0;
            const bCount = parseInt(cardB.dataset.filmCount || cardB.dataset.films, 10) || 0;
            comparison = bCount - aCount; // default descending for count
        } else {
            // default alphabetical sort using mapped field
            const aValue = cardA.dataset[actualField] || '';
            const bValue = cardB.dataset[actualField] || '';
            comparison = aValue.localeCompare(bValue);
        }
        
        // apply ascending/descending order
        return this.activeSortAscending ? comparison : -comparison;
    },

    /**
     * compare dates for sorting
     * @param {string} dateA - first date string
     * @param {string} dateB - second date string
     * @returns {number} - comparison result
     */
    compareDates(dateA, dateB) {
        const monthMap = {
            'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
            'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
        };

        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(0);
            const parts = dateStr.toLowerCase().split(' ');
            if (parts.length !== 2) return new Date(0);
            const day = parseInt(parts[0], 10);
            const month = monthMap[parts[1]];
            if (isNaN(day) || month === undefined) return new Date(0);
            return new Date(new Date().getFullYear(), month, day);
        };

        const parsedDateA = parseDate(dateA);
        const parsedDateB = parseDate(dateB);
        return parsedDateA - parsedDateB;
    },

    /**
     * toggle mobile menu open/closed
     */
    toggleMobileMenu() {
        const isActive = this.searchUtilities.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    /**
     * open mobile menu
     */
    openMobileMenu() {
        this.searchUtilities.classList.add('active');
        this.mobileOverlay.classList.add('active');
        this.mobileToggle.classList.add('active');
        this.mobileOverlay.style.display = 'block';
        
        // ensure menu content is scrolled to top when opened
        this.searchUtilities.scrollTop = 0;
        
        // prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    },

    /**
     * animate letter swap for sort buttons
     * @param {Element} button - sort button element
     */
    animateLetterSwap(button) {
        const letterA = button.querySelector('.letter-a');
        const letterZ = button.querySelector('.letter-z');
        
        if (!letterA || !letterZ) return;
        
        // get current text content
        const aText = letterA.textContent;
        const zText = letterZ.textContent;
        
        // add animation class
        const sortLetters = button.querySelector('.sort-letters');
        if (sortLetters) {
            sortLetters.classList.add('swapping');
            
            // swap the letters after a short delay for visual effect
            setTimeout(() => {
                letterA.textContent = zText;
                letterZ.textContent = aText;
                
                // remove animation class after animation completes
                setTimeout(() => {
                    sortLetters.classList.remove('swapping');
                }, 300);
            }, 150);
        }
    },

    /**
     * close mobile menu
     */
    closeMobileMenu() {
        this.searchUtilities.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        this.mobileToggle.classList.remove('active');
        
        // small delay before hiding overlay to allow for transition
        setTimeout(() => {
            if (!this.mobileOverlay.classList.contains('active')) {
                this.mobileOverlay.style.display = 'none';
            }
        }, 300);
        
        // restore body scroll
        document.body.style.overflow = '';
    }
};
