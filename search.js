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
     */
    init(config) {
        this.config = config;
        this.searchInput = document.getElementById(config.searchInputId);
        this.alphaFilters = document.querySelectorAll('.alpha-filter');
        this.sortButtons = document.querySelectorAll('.sort-button');
        this.container = document.querySelector(config.containerSelector);

        // specials dropdown elements
        this.dropdownToggle = document.getElementById('specials-dropdown-toggle');
        this.dropdownContent = document.getElementById('specials-dropdown-content');
        this.specialFilters = document.querySelectorAll('.special-filter');

        // dates dropdown elements
        this.datesDropdownToggle = document.getElementById('dates-dropdown-toggle');
        this.datesDropdownContent = document.getElementById('dates-dropdown-content');
        this.dateFilters = document.querySelectorAll('.date-filter');

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
                    const arrow = button.querySelector('.sort-arrow');
                    if (arrow) {
                        arrow.classList.toggle('ascending', newAscending);
                        arrow.classList.toggle('descending', !newAscending);
                    }
                    
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

        // special filters (checkboxes)
        this.specialFilters.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const specialValue = checkbox.dataset.special;
                
                if (checkbox.checked) {
                    this.activeSpecials.add(specialValue);
                } else {
                    this.activeSpecials.delete(specialValue);
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

        // date filters (checkboxes)
        this.dateFilters.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const dateValue = checkbox.dataset.date;
                
                if (checkbox.checked) {
                    this.activeDates.add(dateValue);
                } else {
                    this.activeDates.delete(dateValue);
                }
                
                this.filterAndSort();
            });
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
     * @returns {boolean} - whether card matches special filters
     */
    matchesSpecialFilter(cardLink) {
        // if no special filters are active, show all films
        if (this.activeSpecials.size === 0) return true;
        
        const filmBlock = cardLink.dataset.block || '';
        
        // check for "separate ticket" filter - show films without a block
        if (this.activeSpecials.has('separate-ticket') && filmBlock === '') {
            return true;
        }
        
        // check if film's block matches any active special filters
        for (const activeSpecial of this.activeSpecials) {
            if (activeSpecial !== 'separate-ticket') {
                // convert both to lowercase for comparison
                const blockLower = filmBlock.toLowerCase();
                const specialLower = activeSpecial.toLowerCase();
                
                // convert block name to slug format
                const blockSlug = blockLower
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '-')
                    .replace(/--+/g, '-')
                    .replace(/^-+|-+$/g, '');
                
                // check if slug matches
                if (blockSlug === specialLower) {
                    return true;
                }
            }
        }
        
        // if separate-ticket is selected and film has a block, don't show it
        if (this.activeSpecials.has('separate-ticket') && filmBlock !== '') {
            return false;
        }
        
        return false;
    },

    /**
     * check if card matches special filters
     * @param {Element} cardLink - card element to check
     * @returns {boolean} - whether card matches special filters
     */
    matchesSpecialFilter(cardLink) {
        if (this.activeSpecials.size === 0) return true;
        
        const filmBlock = cardLink.dataset.block || '';
        
        // check for separate ticket filter (films without blocks)
        if (this.activeSpecials.has('separate-ticket')) {
            if (filmBlock === '') {
                return true;
            }
        }
        
        // check if film block matches any active special
        for (const activeSpecial of this.activeSpecials) {
            if (activeSpecial !== 'separate-ticket' && filmBlock.includes(activeSpecial)) {
                return true;
            }
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
     * @param {string} sortField - field to sort by
     * @returns {number} - comparison result
     */
    compareCards(cardA, cardB, sortField) {
        let comparison = 0;
        
        // handle special sort fields
        if (sortField === 'date') {
            comparison = this.compareDates(cardA.dataset.date, cardB.dataset.date);
        } else if (sortField === 'film_count') {
            const aCount = parseInt(cardA.dataset.filmCount, 10) || 0;
            const bCount = parseInt(cardB.dataset.filmCount, 10) || 0;
            comparison = bCount - aCount; // default descending for count
        } else {
            // default alphabetical sort
            const aValue = cardA.dataset[sortField] || '';
            const bValue = cardB.dataset[sortField] || '';
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
    }
};
