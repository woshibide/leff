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

        if (!this.container) {
            console.warn('SearchUtility: Container not found:', config.containerSelector);
            return;
        }

        this.cardLinks = Array.from(this.container.querySelectorAll(config.cardLinkSelector));
        this.activeSort = config.defaultSort;
        this.activeSortAscending = true; // default to ascending
        this.activeLetter = null;

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

            if (matchesSearch && matchesLetter) {
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
