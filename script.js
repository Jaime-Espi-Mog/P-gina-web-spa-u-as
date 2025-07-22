document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Carrusel de galería
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Crear puntos de navegación
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Ir a slide específico
    function goToSlide(index) {
        currentIndex = index;
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Actualizar puntos activos
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Navegación
    function prevSlide() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        goToSlide(currentIndex);
    }
    
    function nextSlide() {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        goToSlide(currentIndex);
    }
    
    // Autoplay
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Inicializar carrusel
    if (carouselContainer && slides.length > 0) {
        createDots();
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Navegación táctil para móviles
        let touchStartX = 0;
        
        carouselContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].clientX;
            stopAutoSlide();
        });
        
        carouselContainer.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (diff > 50) {
                nextSlide();
            } else if (diff < -50) {
                prevSlide();
            }
            
            startAutoSlide();
        });
        
        // Iniciar autoplay
        startAutoSlide();
        
        // Pausar autoplay al interactuar
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Form validation and submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Mostrar loader
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                // Envío real del formulario
                fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        alert('¡Gracias por tu reserva! Te contactaremos pronto para confirmar.');
                        contactForm.reset();
                    } else {
                        alert('Hubo un error al enviar tu mensaje. Por favor inténtalo de nuevo.');
                    }
                })
                .catch(error => {
                    alert('Error de conexión. Por favor inténtalo más tarde.');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
            } else {
                alert('Por favor completa todos los campos requeridos');
            }
        });
    }
    
    // Animaciones de aparición
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});