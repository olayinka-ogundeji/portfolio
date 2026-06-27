// ============================================
// SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) navLinks.classList.remove('show');
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 100;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });
});

// ============================================
// TYPING EFFECT ON HERO TAGLINE
// ============================================
const typingElement = document.getElementById('typingText');
if (typingElement) {
    const phrases = ['action, structure & results.', 'scalable systems.', 'business growth.'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
}

// ============================================
// FADE-IN ON SCROLL
// ============================================
const fadeSections = document.querySelectorAll('.about, .services, .tools, .impact, .clients, .testimonials, .booking, .contact');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

fadeSections.forEach(section => {
    section.classList.add('fade-section');
    fadeObserver.observe(section);
});

// ============================================
// ANIMATED STAT COUNTERS
// ============================================
const counters = document.querySelectorAll('.impact-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const count = parseInt(target.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(eased * count);
                target.textContent = currentCount.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    target.textContent = count.toLocaleString();
                }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ============================================
// MOUSE TILT EFFECT ON HERO IMAGE
// ============================================
const tiltContainer = document.getElementById('tiltContainer');
const tiltElement = document.getElementById('tiltElement');

if (tiltContainer && tiltElement) {
    tiltContainer.addEventListener('mousemove', (e) => {
        const rect = tiltContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        tiltElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        tiltElement.style.transition = 'transform 0.1s ease';
    });

    tiltContainer.addEventListener('mouseleave', () => {
        tiltElement.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        tiltElement.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
}

// ============================================
// TESTIMONIALS CAROUSEL (Auto-Moving)
// ============================================
function createCarousel(trackId, prevId, nextId, dotsId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);
    if (!track) return;

    let currentIndex = 0;
    let itemsPerView = getItemsPerView();
    const totalItems = track.children.length;
    let autoSlideInterval;

    function getItemsPerView() {
        if (window.innerWidth < 480) return 1;
        if (window.innerWidth < 992) return 1;
        return 2;
    }

    function updateCarousel() {
        itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        const gap = 24;
        const cardWidth = track.children[0]?.offsetWidth || 300;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        const totalDots = Math.ceil(totalItems / itemsPerView);
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(currentIndex / itemsPerView));
        });
    }

    function createDots() {
        const totalDots = Math.ceil(totalItems / itemsPerView);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                const newIndex = i * itemsPerView;
                currentIndex = Math.min(newIndex, totalItems - itemsPerView);
                updateCarousel();
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function goToNext() {
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex + itemsPerView < totalItems) {
            currentIndex += itemsPerView;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }

    function goToPrev() {
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex - itemsPerView >= 0) {
            currentIndex -= itemsPerView;
        } else {
            currentIndex = maxIndex;
        }
        updateCarousel();
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(goToNext, 4000);
    }

    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        goToPrev();
        resetAutoSlide();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        goToNext();
        resetAutoSlide();
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createDots();
            currentIndex = 0;
            updateCarousel();
            resetAutoSlide();
        }, 200);
    });

    createDots();
    updateCarousel();
    startAutoSlide();
}

// Initialize only the testimonials carousel
createCarousel('testimonialTrack', 'testimonialPrev', 'testimonialNext', 'testimonialDots');

// ============================================
// CONTACT FORM
// ============================================
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function (e) {
        if (this.action.includes('YOUR_FORMSPREE_ID')) {
            e.preventDefault();
            const btn = this.querySelector('.btn-submit');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            btn.style.background = '#C9A84C';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '#1B2A4A';
                this.reset();
            }, 2200);
        }
    });
}

console.log('✨ Olayinka Ogundeji · The Catalyst VA Portfolio ready!');