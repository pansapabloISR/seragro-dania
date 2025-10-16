document.addEventListener("DOMContentLoaded", function () {
    // Variables globales
    let scrollTimeout;
    let videoOptimizeTimeout;

    // Navegación móvil
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    console.log("NavToggle found:", navToggle);
    console.log("NavMenu found:", navMenu);

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function (e) {
            console.log("NavToggle clicked");
            e.preventDefault();
            e.stopPropagation();

            const isActive = navMenu.classList.contains("active");

            if (isActive) {
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
                document.body.style.overflow = "";
            } else {
                navMenu.classList.add("active");
                navToggle.classList.add("active");
                document.body.style.overflow = "hidden";
            }

            console.log(
                "Menu is now:",
                navMenu.classList.contains("active") ? "open" : "closed",
            );
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll(".nav-menu a");
        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                console.log("Nav link clicked");
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
                document.body.style.overflow = "";
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener("click", function (e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                if (navMenu.classList.contains("active")) {
                    console.log("Closing menu - clicked outside");
                    navMenu.classList.remove("active");
                    navToggle.classList.remove("active");
                    document.body.style.overflow = "";
                }
            }
        });

        // Cerrar menú al cambiar el tamaño de pantalla
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
                document.body.style.overflow = "";
            }
        });

        // Manejar dropdowns en móvil
        const dropdowns = document.querySelectorAll(".dropdown");
        dropdowns.forEach((dropdown) => {
            const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
            const dropdownMenu = dropdown.querySelector(".dropdown-menu");

            if (dropdownToggle && dropdownMenu) {
                dropdownToggle.addEventListener("click", function (e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdownMenu.style.display =
                            dropdownMenu.style.display === "block"
                                ? "none"
                                : "block";
                    }
                });
            }
        });
    }

    // Smooth scroll para enlaces internos válidos solamente
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href && href !== "#" && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }
        });
    });

    // Scroll suave para el header
    let lastScrollTop = 0;
    const header = document.querySelector(".header");

    window.addEventListener("scroll", function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = "translateY(-100%)";
            } else {
                // Scrolling up
                header.style.transform = "translateY(0)";
            }
            lastScrollTop = scrollTop;
        }, 10);
    });

    // Función para optimizar el rendimiento de videos
    function optimizeVideos() {
        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
            const rect = video.getBoundingClientRect();
            const isVisible =
                rect.top >= -100 && rect.bottom <= window.innerHeight + 100;

            if (!isVisible && !video.paused) {
                video.pause();
            } else if (isVisible && video.paused) {
                video.play().catch((e) => console.log("Video play failed:", e));
            }
        });
    }

    // Optimizar videos al hacer scroll
    window.addEventListener("scroll", function () {
        clearTimeout(videoOptimizeTimeout);
        videoOptimizeTimeout = setTimeout(optimizeVideos, 100);
    });

    // Función para manejar errores de video
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        video.addEventListener("error", function () {
            console.log("Error loading video:", this.src);
            this.style.display = "none";
        });

        // Asegurar que los videos se reproduzcan automáticamente cuando sea posible
        video.addEventListener("loadeddata", function () {
            this.play().catch((e) => console.log("Auto-play prevented:", e));
        });
    });

    // ========================================
    // NOTA: El botón de WhatsApp ahora está integrado en el widget unificado
    // Ver: js/unified-contact-widget.js
    // ========================================

    // Funcionalidad del formulario de contacto
    const contactForms = document.querySelectorAll(".contact-form");
    contactForms.forEach((form) => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Obtener datos del formulario
            const formData = new FormData(this);
            const nombre = formData.get("nombre") || "";
            const apellido = formData.get("apellido") || "";
            const email = formData.get("email") || "";
            const telefono = formData.get("telefono") || "";
            const motivo = formData.get("motivo") || "";
            const mensaje = formData.get("mensaje") || "";

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

            submitButton.textContent = "✓ Enviando...";
            submitButton.style.background = "#4CAF50";

            setTimeout(() => {
                // Abrir WhatsApp
                window.open(whatsappURL, "_blank");

                // Resetear formulario
                this.reset();

                // Restaurar botón
                submitButton.textContent = originalText;
                submitButton.style.background = "";

                // Mostrar mensaje de éxito
                alert(
                    "¡Formulario enviado! Te redirigimos a WhatsApp para completar el envío.",
                );
            }, 1000);
        });
    });

    // Animaciones de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll(
        ".feature-card, .adapt-item, .operation-card, .ext-feature",
    );
    animatedElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });
});
