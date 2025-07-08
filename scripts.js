//console.log('🟢 scripts.js loaded');

// utility function to get asset path with base path
function getAssetPath(path) {
    const basePath = window.BASE_PATH || '/';
    return basePath + path.replace(/^\//, '');
}

document.addEventListener('DOMContentLoaded', function() {
    //console.log('🟢 dom content loaded');
    
    // replace every occurrence of the word "leff" with italicized e in text nodes only
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        // chatgpt magickkkkkk
        node => node.parentElement?.tagName.match(/^(SCRIPT|STYLE|TITLE)$/) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (/\bleff\b/.test(node.textContent)) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(textNode => {
        const span = document.createElement('span');
        span.innerHTML = textNode.textContent.replace(/\bleff\b/g, 'l<em>e</em>ff');
        textNode.parentNode.replaceChild(span, textNode);
    });

    // custom cursor handler
    const customCursor = document.getElementById('custom-cursor');
    if (customCursor) {
        document.addEventListener('mousemove', function(e) {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });
    }
    
    const circle = document.getElementById('circle');
    const circleContainer = document.getElementById('circle-container');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeButtons = document.querySelectorAll('.close-menu');
    const nav = document.querySelector('nav');

    // console.log('🔍 elements found:', {
    //     circle: circle,
    //     circleContainer: circleContainer,
    //     menuOverlay: menuOverlay,
    //     closeButtons: closeButtons.length
    // });




    // circle container click handler (parent of circle)
    circleContainer.addEventListener('click', function(e) {
        //console.log('🟡 circle container clicked!', e.target);
        circle.classList.add('expanded');
        nav.classList.add('menu-active');
        document.body.classList.add('menu-active');
        //console.log('🟡 added expanded class to circle');
        
        setTimeout(() => {
            menuOverlay.classList.add('active');
            //console.log('🟡 added active class to menu');
        }, 300);
    });

    // close menu handlers
    closeButtons.forEach((button, index) => {
        //console.log(`🟢 adding close handler to button ${index}`);
        button.addEventListener('click', function(e) {
            //console.log('🔴 close button clicked');
            e.preventDefault();
            closeMenu();
        });
    });

    // close when clicking overlay background
    menuOverlay.addEventListener('click', function(e) {
        //console.log('🟡 menu overlay clicked, target:', e.target);
        if (e.target === menuOverlay) {
            //console.log('🔴 clicked on overlay background, closing menu');
            closeMenu();
        }
    });

    // close menu function
    function closeMenu() {
        //console.log('🔴 closing menu...');
        menuOverlay.classList.remove('active');
        nav.classList.remove('menu-active');
        document.body.classList.remove('menu-active');
        //console.log('🔴 removed active class from menu');
        
        setTimeout(() => {
            circle.classList.remove('expanded');
            //console.log('🔴 removed expanded class from circle');
        }, 300);
    }
});