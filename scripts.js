// html-first circle and menu functionality with debug
console.log('🟢 scripts.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🟢 dom content loaded');
    
    const circle = document.getElementById('circle');
    const circleContainer = document.getElementById('circle-container');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeButtons = document.querySelectorAll('.close-menu');

    console.log('🔍 elements found:', {
        circle: circle,
        circleContainer: circleContainer,
        menuOverlay: menuOverlay,
        closeButtons: closeButtons.length
    });

    if (!circle) {
        console.error('❌ circle element not found!');
        return;
    }

    if (!circleContainer) {
        console.error('❌ circle-container element not found!');
        return;
    }

    if (!menuOverlay) {
        console.error('❌ menu-overlay element not found!');
        return;
    }

    // circle container click handler (parent of circle)
    circleContainer.addEventListener('click', function(e) {
        console.log('🟡 circle container clicked!', e.target);
        circle.classList.add('expanded');
        console.log('🟡 added expanded class to circle');
        
        setTimeout(() => {
            menuOverlay.classList.add('active');
            console.log('🟡 added active class to menu');
        }, 300);
    });

    // close menu handlers
    closeButtons.forEach((button, index) => {
        console.log(`🟢 adding close handler to button ${index}`);
        button.addEventListener('click', function(e) {
            console.log('🔴 close button clicked');
            e.preventDefault();
            closeMenu();
        });
    });

    // close when clicking overlay background
    menuOverlay.addEventListener('click', function(e) {
        console.log('🟡 menu overlay clicked, target:', e.target);
        if (e.target === menuOverlay) {
            console.log('🔴 clicked on overlay background, closing menu');
            closeMenu();
        }
    });

    // close menu function
    function closeMenu() {
        console.log('🔴 closing menu...');
        menuOverlay.classList.remove('active');
        console.log('🔴 removed active class from menu');
        
        setTimeout(() => {
            circle.classList.remove('expanded');
            console.log('🔴 removed expanded class from circle');
        }, 300);
    }

    // expose functions to window for console testing
    window.debugMenu = {
        circle: circle,
        circleContainer: circleContainer,
        menuOverlay: menuOverlay,
        openMenu: function() {
            console.log('🧪 debug: opening menu');
            circle.classList.add('expanded');
            setTimeout(() => {
                menuOverlay.classList.add('active');
            }, 300);
        },
        closeMenu: closeMenu,
        toggleMenu: function() {
            console.log('🧪 debug: toggling menu');
            if (menuOverlay.classList.contains('active')) {
                closeMenu();
            } else {
                this.openMenu();
            }
        },
        simulateClick: function() {
            console.log('🧪 debug: simulating container click');
            circleContainer.click();
        }
    };

    console.log('🟢 menu debug functions available at window.debugMenu');
});