/* =====================================================
   PORTFOLIO JS — Fadlan Eka Putra
   ================================================     */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. CUSTOM CURSOR */
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    const animateRing = () => {
        const ease = 0.13;
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        rafId = requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverTargets = document.querySelectorAll(
        'a, button, .work-card, .drop-row, .nav-link, .cf-submit, .back-top, .clink'
    );
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });


    /* 2. NAVBAR ↔ TASKBAR */
    const navbar   = document.getElementById('navbar');
    const taskbar  = document.getElementById('taskbar');
    const aboutSec = document.getElementById('about');

    const TRIGGER_Y = aboutSec
        ? Math.max(aboutSec.offsetTop - 80, 100)
        : window.innerHeight * 0.85;

    let isScrolled = false;
    let rafPending = false;

    const showNavbar = () => {
        navbar.classList.remove('nav-hidden');
        taskbar.classList.remove('tb-visible');
    };

    const showTaskbar = () => {
        navbar.classList.add('nav-hidden');
        taskbar.classList.add('tb-visible');
    };

    const handleScroll = () => {
        const y = window.scrollY;
        if (y >= TRIGGER_Y) {
            if (!isScrolled) { isScrolled = true; showTaskbar(); }
        } else {
            if (isScrolled) { isScrolled = false; showNavbar(); }
        }
        rafPending = false;
    };

    window.addEventListener('scroll', () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(handleScroll);
    }, { passive: true });

    handleScroll();


    /* 2b. TASKBAR DROPDOWN */
    const tbDropWrap  = document.getElementById('tbDropWrap');
    const tbDropBtn   = document.getElementById('tbDropBtn');
    const tbDropPanel = document.getElementById('tbDropPanel');

    if (tbDropBtn && tbDropWrap) {
        tbDropBtn.addEventListener('click', e => {
            e.stopPropagation();
            tbDropWrap.classList.toggle('open');
        });
        document.addEventListener('click', e => {
            if (!tbDropWrap.contains(e.target)) tbDropWrap.classList.remove('open');
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') tbDropWrap.classList.remove('open');
        });
        tbDropPanel?.querySelectorAll('.drop-row').forEach(row => {
            row.addEventListener('click', () => tbDropWrap.classList.remove('open'));
        });
    }


    /* 3. DROPDOWN NAVBAR */
    const dropWrap   = document.getElementById('dropWrap');
    const dropBtn    = document.getElementById('dropBtn');
    const dropBubble = document.getElementById('dropBubble');

    let dropOpen = false;

    const openDrop = () => {
        dropOpen = true;
        dropWrap.classList.add('open');
        dropBtn.setAttribute('aria-expanded', 'true');
    };

    const closeDrop = () => {
        dropOpen = false;
        dropWrap.classList.remove('open');
        dropBtn.setAttribute('aria-expanded', 'false');
    };

    dropBtn.addEventListener('click', e => {
        e.stopPropagation();
        dropOpen ? closeDrop() : openDrop();
    });

    document.addEventListener('click', e => {
        if (!dropWrap.contains(e.target)) closeDrop();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDrop();
    });

    dropBubble.querySelectorAll('.drop-row').forEach(row => {
        row.addEventListener('click', () => setTimeout(closeDrop, 100));
    });


    /* 4. SCROLL REVEAL */
    const reveals = document.querySelectorAll('.js-reveal, .about-wrap, .contact-left, .contact-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const siblings = [...(entry.target.parentElement?.children || [])];
            const index    = siblings.indexOf(entry.target);
            const delay    = Math.min(index * 90, 400);

            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay);

            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => {
        el.classList.add('js-reveal');
        revealObserver.observe(el);
    });

    document.querySelectorAll('.about-big, .about-body, .about-stats-row, .about-img-wrap').forEach(el => {
        el.classList.add('js-reveal');
        revealObserver.observe(el);
    });


    /* 5. SKILL BAR ANIMATION */
    const skillBars = document.querySelectorAll('.sbar-fill');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const pct = entry.target.getAttribute('data-pct');
            entry.target.style.width = pct + '%';
            barObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => barObserver.observe(bar));


    /* 6. ACTIVE NAV HIGHLIGHT */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');

    const highlightNav = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 130) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#e2f1f8';
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });


    /* 7. CONTACT FORM */
    const form    = document.getElementById('contactForm');
    const btnText = document.getElementById('cfBtnText');
    const success = document.getElementById('cfSuccess');
    const cfBtn   = document.getElementById('cfBtn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            btnText.textContent = 'Mengirim...';
            cfBtn.disabled      = true;
            cfBtn.style.opacity = '0.65';

            setTimeout(() => {
                success.style.display = 'block';
                form.reset();
                btnText.textContent    = 'Kirim Pesan';
                cfBtn.disabled         = false;
                cfBtn.style.opacity    = '1';
                setTimeout(() => { success.style.display = 'none'; }, 6000);
            }, 1400);
        });
    }


    /* 8. MARQUEE */
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const wrap = marqueeTrack.closest('.marquee-wrap');
        wrap.addEventListener('mouseenter', () => { marqueeTrack.style.animationPlayState = 'paused'; });
        wrap.addEventListener('mouseleave', () => { marqueeTrack.style.animationPlayState = 'running'; });
    }


    /* 9. TILT EFFECT */
    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect  = card.getBoundingClientRect();
            const cx    = rect.left + rect.width  / 2;
            const cy    = rect.top  + rect.height / 2;
            const dx    = (e.clientX - cx) / rect.width;
            const dy    = (e.clientY - cy) / rect.height;
            const rotX  = (-dy * 6).toFixed(2);
            const rotY  = (dx  * 6).toFixed(2);
            card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    console.log('%c✦ Fadlan Eka Putra — Portfolio Loaded', 'color:#00f0ff;font-weight:700;font-size:13px;');
});