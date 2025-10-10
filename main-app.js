document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let scrollTimeout;
    let videoOptimizeTimeout;

    // Navegación móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    console.log('NavToggle found:', navToggle);
    console.log('NavMenu found:', navMenu);

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            console.log('NavToggle clicked');
            e.preventDefault();
            e.stopPropagation();

            const isActive = navMenu.classList.contains('active');

            if (isActive) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('active');
                navToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            console.log('Menu is now:', navMenu.classList.contains('active') ? 'open' : 'closed');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Nav link clicked');
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    console.log('Closing menu - clicked outside');
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });

        // Cerrar menú al cambiar el tamaño de pantalla
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Manejar dropdowns en móvil
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');

            if (dropdownToggle && dropdownMenu) {
                dropdownToggle.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        });
    }

    // Smooth scroll para enlaces internos válidos solamente
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Scroll suave para el header
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;
        }, 10);
    });

    // Función para optimizar el rendimiento de videos
    function optimizeVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const isVisible = (
                rect.top >= -100 &&
                rect.bottom <= (window.innerHeight + 100)
            );

            if (!isVisible && !video.paused) {
                video.pause();
            } else if (isVisible && video.paused) {
                video.play().catch(e => console.log('Video play failed:', e));
            }
        });
    }

    // Optimizar videos al hacer scroll
    window.addEventListener('scroll', function() {
        clearTimeout(videoOptimizeTimeout);
        videoOptimizeTimeout = setTimeout(optimizeVideos, 100);
    });

    // Función para manejar errores de video
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('error', function() {
            console.log('Error loading video:', this.src);
            this.style.display = 'none';
        });

        // Asegurar que los videos se reproduzcan automáticamente cuando sea posible
        video.addEventListener('loadeddata', function() {
            this.play().catch(e => console.log('Auto-play prevented:', e));
        });
    });

    // Botón de WhatsApp flotante que va directamente a WhatsApp
    const whatsappButton = document.createElement('a');
    whatsappButton.href = "https://api.whatsapp.com/send?phone=5493465432688&text=Hola, vengo desde el sitio de SER AGRO";
    whatsappButton.target = "_blank";
    whatsappButton.className = "whatsapp-float-button";
    whatsappButton.style.cssText = `
        position: fixed;
        bottom: 180px;
        right: 40px;
        background: #25D366;
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 100000;
        transition: transform 0.3s ease;
    `;

    whatsappButton.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.106"/>
        </svg>
    `;

    // Event listeners
    whatsappButton.addEventListener('mouseenter', () => {
        whatsappButton.style.transform = 'scale(1.1)';
    });

    whatsappButton.addEventListener('mouseleave', () => {
        whatsappButton.style.transform = 'scale(1)';
    });

    document.body.appendChild(whatsappButton);

    // Ajustar posición del botón WhatsApp en móviles
    function adjustWhatsAppButton() {
        if (window.innerWidth <= 480) {
            whatsappButton.style.bottom = '170px';
            whatsappButton.style.right = '50px';
        } else {
            whatsappButton.style.bottom = '180px';
            whatsappButton.style.right = '40px';
        }
    }

    adjustWhatsAppButton();
    window.addEventListener('resize', adjustWhatsAppButton);

    // Funcionalidad del formulario de contacto
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtener datos del formulario
            const formData = new FormData(this);
            const nombre = formData.get('nombre') || '';
            const apellido = formData.get('apellido') || '';
            const email = formData.get('email') || '';
            const telefono = formData.get('telefono') || '';
            const motivo = formData.get('motivo') || '';
            const mensaje = formData.get('mensaje') || '';

            // Crear mensaje para WhatsApp
            let whatsappMessage = `*Nueva consulta desde SER AGRO*\n\n`;
            whatsappMessage += `*Nombre:* ${nombre} ${apellido}\n`;
            whatsappMessage += `*Email:* ${email}\n`;
            whatsappMessage += `*Teléfono:* ${telefono}\n`;
            whatsappMessage += `*Motivo:* ${motivo}\n`;
            if (mensaje) {
                whatsappMessage += `*Mensaje:* ${mensaje}\n`;
            }

            // Codificar mensaje para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Crear URL de WhatsApp
            const whatsappURL = `https://api.whatsapp.com/send?phone=5493465432688&text=${encodedMessage}`;

            // Mostrar mensaje de confirmación
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = '✓ Enviando...';
            submitButton.style.background = '#4CAF50';

            setTimeout(() => {
                // Abrir WhatsApp
                window.open(whatsappURL, '_blank');

                // Resetear formulario
                this.reset();

                // Restaurar botón
                submitButton.textContent = originalText;
                submitButton.style.background = '';

                // Mostrar mensaje de éxito
                alert('¡Formulario enviado! Te redirigimos a WhatsApp para completar el envío.');
            }, 1000);
        });
    });

    // Animaciones de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.feature-card, .adapt-item, .operation-card, .ext-feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});