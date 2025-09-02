/**
 * hover simulation script for leff website
 * simulates hover effects on cards using a fixed horizontal line
 */

class HoverSimulator {
    constructor(options = {}) {
        this.debug = options.debug || false; // debug mode shows the line
        this.interval = options.interval || 3000; // ms between hover checks
        this.lineHeight = options.lineHeight || 3; // px height of the line
        
        this.line = null;
        this.cards = [];
        this.isRunning = false;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        this.createLine();
        this.findCards();
        this.startSimulation();
        
        // handle window resize and scroll
        window.addEventListener('resize', () => {
            this.updateLinePosition();
            this.findCards();
        });
        
        window.addEventListener('scroll', () => {
            this.updateLinePosition();
        });
        
        console.log(`hover simulator initialized with ${this.cards.length} cards`);
    }
    
    createLine() {
        this.line = document.createElement('div');
        this.line.id = 'hover-simulator-line';
        this.line.style.cssText = `
            position: fixed;
            top: 50%;
            left: 0;
            width: 100vw;
            height: ${this.lineHeight}px;
            background: ${this.debug ? 'rgba(255, 0, 0, 0.8)' : 'transparent'};
            z-index: ${this.debug ? '10000' : '-1'};
            pointer-events: none;
            transform: translateY(-50%);
        `;
        document.body.appendChild(this.line);
    }
    
    updateLinePosition() {
        if (this.line) {
            // keep line fixed in center of viewport
            this.line.style.top = '50%';
        }
    }
    
    findCards() {
        // find all hoverable card elements
        const selectors = [
            '.film-card-link',      // used on individual film pages
            '.film-card-wrapper',   // used on films page
            '.filmmaker-card-link', 
            '.special-block-card-link'
        ];
        
        this.cards = [];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                let card = null;
                
                // different pages have different structures
                if (selector === '.film-card-wrapper') {
                    // on films page, the .film-card is inside .film-card-wrapper
                    card = el.querySelector('.film-card');
                } else {
                    // on other pages, look for the specific card types
                    card = el.querySelector('.film-card, .filmmaker-card, .special-block-card');
                }
                
                if (card && rect.width > 0 && rect.height > 0) {
                    this.cards.push({
                        element: el,
                        card: card,
                        bounds: {
                            left: rect.left + window.scrollX,
                            right: rect.right + window.scrollX,
                            top: rect.top + window.scrollY,
                            bottom: rect.bottom + window.scrollY
                        }
                    });
                }
            });
        });
        
        console.log(`found ${this.cards.length} cards`);
    }
    
    startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.checkHoverIntersections();
        
        // set up interval to continuously check for intersections
        this.intervalId = setInterval(() => {
            this.checkHoverIntersections();
        }, this.interval);
    }
    
    stopSimulation() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // remove any active hover states
        this.clearAllHoverStates();
    }
    
    checkHoverIntersections() {
        if (!this.isRunning) return;
        
        // get current line position (center of viewport)
        const viewportHeight = window.innerHeight;
        const lineY = window.scrollY + (viewportHeight / 2);
        
        this.cards.forEach(cardData => {
            const bounds = cardData.bounds;
            
            // check if horizontal line intersects with card vertically
            const intersects = lineY >= bounds.top && lineY <= bounds.bottom;
            
            if (intersects) {
                this.triggerCardHover(cardData);
            } else {
                this.removeCardHover(cardData);
            }
        });
    }
    
    triggerCardHover(cardData) {
        if (!cardData.element.classList.contains('simulated-hover')) {
            cardData.element.classList.add('simulated-hover');
            cardData.card.classList.add('simulated-hover');
            
            // trigger css hover effects by adding styles directly
            this.applyHoverStyles(cardData);
            
            if (this.debug) {
                console.log('hover triggered:', cardData.element);
            }
        }
    }
    
    removeCardHover(cardData) {
        if (cardData.element.classList.contains('simulated-hover')) {
            cardData.element.classList.remove('simulated-hover');
            cardData.card.classList.remove('simulated-hover');
            
            // remove hover styles
            this.removeHoverStyles(cardData);
            
            if (this.debug) {
                console.log('hover removed:', cardData.element);
            }
        }
    }
    
    applyHoverStyles(cardData) {
        const card = cardData.card;
        
        // apply styles based on card type
        if (card.classList.contains('film-card')) {
            // film card hover effects
            card.style.border = '2px solid var(--accent)';
            card.style.backgroundColor = 'var(--dark-silver)';
            
            // image scale effect
            const img = card.querySelector('.film-card-image img');
            if (img) {
                img.style.transform = 'scale(1.03)';
            }
            
        } else if (card.classList.contains('filmmaker-card')) {
            // filmmaker card hover effects
            card.style.background = 'var(--bg-main)';
            card.style.color = 'var(--accent)';
            
        } else if (card.classList.contains('special-block-card')) {
            // special block card hover effects
            card.style.background = 'var(--bg-main)';
            card.style.color = 'var(--accent)';
        }
    }
    
    removeHoverStyles(cardData) {
        const card = cardData.card;
        
        // remove inline styles to return to css defaults
        if (card.classList.contains('film-card')) {
            card.style.border = '';
            card.style.backgroundColor = '';
            
            const img = card.querySelector('.film-card-image img');
            if (img) {
                img.style.transform = '';
            }
            
        } else if (card.classList.contains('filmmaker-card')) {
            card.style.background = '';
            card.style.color = '';
            
        } else if (card.classList.contains('special-block-card')) {
            card.style.background = '';
            card.style.color = '';
        }
    }
    
    clearAllHoverStates() {
        this.cards.forEach(cardData => {
            this.removeCardHover(cardData);
        });
    }
    
    // public methods for external control
    toggleDebug() {
        this.debug = !this.debug;
        this.line.style.background = this.debug ? 'rgba(255, 0, 0, 0.8)' : 'transparent';
        this.line.style.zIndex = this.debug ? '10000' : '-1';
        console.log('debug mode:', this.debug);
    }
    
    setInterval(interval) {
        this.interval = interval;
        
        // restart simulation with new interval
        if (this.isRunning) {
            this.stopSimulation();
            this.startSimulation();
        }
        
        console.log('interval set to:', interval);
    }
    
    refresh() {
        this.findCards();
        console.log(`refreshed: found ${this.cards.length} cards`);
    }
}

// initialize on dom ready
document.addEventListener('DOMContentLoaded', function() {
    // only initialize on pages with cards
    const hasCards = document.querySelector('.film-card-link, .film-card-wrapper, .filmmaker-card-link, .special-block-card-link');
    
    // check if screen width is 768px or less
    const isSmallScreen = window.innerWidth <= 768;
    
    if (hasCards && isSmallScreen) {
        window.hoverSimulator = new HoverSimulator({
            debug: false, // set to false to hide the line
            interval: 100 // check every 100ms for intersections
        });
        
        // expose controls to console for debugging
        //  console.log('hover simulator loaded. controls:');
        //  console.log('- hoverSimulator.toggleDebug() - show/hide debug line');
        //  console.log('- hoverSimulator.setInterval(ms) - change check interval');
        //  console.log('- hoverSimulator.refresh() - refresh card detection');
        //  console.log('- hoverSimulator.stopSimulation() - stop simulation');
        //  console.log('- hoverSimulator.startSimulation() - start simulation');
    }
});

// handle window resize to start/stop simulator based on screen size
window.addEventListener('resize', function() {
    const hasCards = document.querySelector('.film-card-link, .film-card-wrapper, .filmmaker-card-link, .special-block-card-link');
    const isSmallScreen = window.innerWidth <= 768;
    
    if (hasCards && isSmallScreen && !window.hoverSimulator) {
        // start simulator if not already running
        window.hoverSimulator = new HoverSimulator({
            debug: false,
            interval: 100
        });
    } else if ((!hasCards || !isSmallScreen) && window.hoverSimulator) {
        // stop simulator if running and conditions no longer met
        window.hoverSimulator.stopSimulation();
        if (window.hoverSimulator.line) {
            window.hoverSimulator.line.remove();
        }
        window.hoverSimulator = null;
    }
});
