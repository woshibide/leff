function runIntro() {
    const entro = document.querySelector('#entro-block');
    const svg = document.querySelector('#the-e svg');
    const slogan = document.querySelector('#slogan h1');
    const program = document.querySelector('#program-coming');
    const navbar = document.querySelector('nav');
    const styles = getComputedStyle(document.documentElement);
    const blue = styles.getPropertyValue('--blue').trim() || '#5f7cef';
    const yellow = styles.getPropertyValue('--yellow').trim() || '#ffff00';
    const bgMain = styles.getPropertyValue('--bg-main').trim() || '#2d2526';
    // guard missing elements gracefully — return a paused timeline if
    // the essentials aren't present
    if (!entro || !program || !navbar) {
        return gsap.timeline({ paused: true });
    }

    gsap.set(navbar, { opacity: 0 });
    gsap.set(entro, { backgroundColor: "rgba(45, 37, 38, 1)" });
    if (svg) gsap.set(svg, { scale: 20, opacity: 0, transformOrigin: "50% 50%", fill: 'rgba(95, 124, 239, 1)' });
    if (slogan) gsap.set(slogan, { opacity: 0 });
    gsap.set(program, { opacity: 0, display: "none" });

    const tl = gsap.timeline({ paused: true });

    // --- ACT 1 ---
    tl.to(entro, {
        backgroundColor: "rgba(0,0,0, 0.1)",
        duration: 2,
        ease: "power2.inOut"
    })
    .to(svg, {
        opacity: 1,
        scale: 2,
        duration: 1,
        ease: "expo.out"
    }, "<")

    // --- ACT 2 ---
    tl.to(svg, {
        fill: yellow,
        duration: 0.3,
        ease: "power1.out"
    })
    .to(slogan, {
        opacity: 1,
        duration: 0.3,
        ease: "power1.out"
    }, "<")
    // .to({}, { duration: 0.5 })
    .to(svg, {
        scale: 1,
        duration: 0.4,
        ease: "expo.out"
    });

    // --- ACT 3 ---
    tl.to(entro, { 
        backgroundColor: "rgba(0,0,0,0)",
        backdropFilter: "blur(0px)",
        webkitBackdropFilter: "blur(0px)",
    })
    
    .to(svg, {
        y: "-120vh",
        opacity: 0,
        duration: 0.8,
        ease: "power4.in"
    })
    .to(slogan, {
        y: "120vh",
        opacity: 0,
        duration: 0.8,
        ease: "power4.in"
    }, "<")

    // permanently remove them
    .set([svg, slogan], { display: "none" })


    // show program (and KEEP it)
    .set(program, { display: "block" })
    .fromTo(program,
        { opacity: 0, y: 8 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }
    );

    tl.to(navbar, { opacity: 1});


    // when timeline completes, remember that intro played and apply class
    try {
        tl.eventCallback('onComplete', function() {
            try {
                sessionStorage.setItem('leffIntroPlayed', '1');
            } catch (e) { /* ignore storage errors */ }
            try {
                document.documentElement.classList.add('intro-played');
            } catch (e) { /* ignore DOM errors */ }
        });
    } catch (e) {
        /* if eventCallback isn't available no-op */
    }

    return tl;
}

window.leffIntro = runIntro();