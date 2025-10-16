(function() {
    'use strict';

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================
    const CONFIG = {
        primaryColor: '#2E7D32',
        secondaryColor: '#1B5E20',
        whatsappColor: '#25D366',
        whatsappNumber: '5493465432688',
        position: 'bottom-right' // bottom-right o bottom-left
    };

    let isExpanded = false;
    let isMavildalChatInitialized = false;

    // ==========================================
    // CREAR ESTRUCTURA HTML
    // ==========================================
    function createUnifiedWidget() {
        const widgetHTML = `
            <div id="unified-contact-widget">
                <!-- Botón principal flotante -->
                <button id="main-contact-button" aria-label="Opciones de contacto">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" class="icon-main">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                    </svg>
                    <span class="button-text">¿Necesitas ayuda?</span>
                </button>

                <!-- Menú de opciones (oculto por defecto) -->
                <div id="contact-options-menu" style="display: none;">
                    <!-- Opción 1: Llamar a Mavilda (Vapi) -->
                    <button class="contact-option" id="option-vapi" data-action="voice">
                        <div class="option-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                            </svg>
                        </div>
                        <div class="option-text">
                            <strong>Llamar a Mavilda</strong>
                            <span>Habla con nuestra ingeniera</span>
                        </div>
                    </button>

                    <!-- Opción 2: Chat con Mavilda -->
                    <button class="contact-option" id="option-chat" data-action="chat">
                        <div class="option-icon" style="background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                                <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
                            </svg>
                        </div>
                        <div class="option-text">
                            <strong>Chat con Mavilda</strong>
                            <span>Escribe tu consulta</span>
                        </div>
                    </button>

                    <!-- Opción 3: WhatsApp -->
                    <button class="contact-option" id="option-whatsapp" data-action="whatsapp">
                        <div class="option-icon" style="background: ${CONFIG.whatsappColor};">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.106"/>
                            </svg>
                        </div>
                        <div class="option-text">
                            <strong>WhatsApp</strong>
                            <span>Contacto inmediato</span>
                        </div>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // ==========================================
    // AGREGAR ESTILOS CSS
    // ==========================================
    function addStyles() {
        const styles = `
            #unified-contact-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 100000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            /* Botón principal */
            #main-contact-button {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 24px;
                background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
                border: none;
                border-radius: 50px;
                color: white;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            #main-contact-button::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }

            #main-contact-button:hover::before {
                width: 300px;
                height: 300px;
            }

            #main-contact-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(46, 125, 50, 0.5);
            }

            #main-contact-button.expanded {
                border-radius: 50%;
                padding: 16px;
                width: 60px;
                height: 60px;
                justify-content: center;
            }

            #main-contact-button.expanded .button-text {
                display: none;
            }

            #main-contact-button.expanded .icon-main {
                transform: rotate(180deg);
            }

            .icon-main {
                transition: transform 0.3s ease;
                flex-shrink: 0;
            }

            .button-text {
                white-space: nowrap;
                transition: opacity 0.2s ease;
            }

            /* Menú de opciones */
            #contact-options-menu {
                position: absolute;
                bottom: 80px;
                right: 0;
                display: flex;
                flex-direction: column;
                gap: 12px;
                opacity: 0;
                transform: translateY(20px) scale(0.9);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }

            #contact-options-menu.show {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }

            /* Cada opción de contacto */
            .contact-option {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px 20px;
                background: white;
                border: none;
                border-radius: 16px;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-width: 280px;
                text-align: left;
            }

            .contact-option:hover {
                transform: translateX(-5px) translateY(-2px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            }

            .option-icon {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .option-text {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .option-text strong {
                color: #1a1a1a;
                font-size: 15px;
                font-weight: 600;
            }

            .option-text span {
                color: #666;
                font-size: 13px;
                font-weight: 400;
            }

            /* Animaciones de entrada escalonadas */
            #contact-options-menu.show .contact-option:nth-child(1) {
                animation: slideInOption 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
            }

            #contact-options-menu.show .contact-option:nth-child(2) {
                animation: slideInOption 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
            }

            #contact-options-menu.show .contact-option:nth-child(3) {
                animation: slideInOption 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
            }

            @keyframes slideInOption {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            /* Responsive - Mobile */
            @media (max-width: 768px) {
                #unified-contact-widget {
                    bottom: 15px;
                    right: 15px;
                }

                #main-contact-button {
                    padding: 14px 20px;
                    font-size: 14px;
                }

                .contact-option {
                    min-width: 260px;
                    padding: 14px 18px;
                }

                .option-icon {
                    width: 44px;
                    height: 44px;
                }

                .option-text strong {
                    font-size: 14px;
                }

                .option-text span {
                    font-size: 12px;
                }

                #contact-options-menu {
                    bottom: 70px;
                }
            }

            /* Evitar que el menú se salga de la pantalla en móvil */
            @media (max-width: 480px) {
                #contact-options-menu {
                    right: 0;
                    left: auto;
                }

                .contact-option {
                    min-width: calc(100vw - 40px);
                    max-width: 320px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ==========================================
    // TOGGLE MENÚ
    // ==========================================
    function toggleMenu() {
        isExpanded = !isExpanded;
        const mainButton = document.getElementById('main-contact-button');
        const menu = document.getElementById('contact-options-menu');

        if (isExpanded) {
            mainButton.classList.add('expanded');
            menu.style.display = 'flex';
            setTimeout(() => menu.classList.add('show'), 10);
        } else {
            menu.classList.remove('show');
            setTimeout(() => {
                menu.style.display = 'none';
                mainButton.classList.remove('expanded');
            }, 400);
        }
    }

    // ==========================================
    // ACCIONES DE CADA OPCIÓN
    // ==========================================
    function handleOptionClick(action) {
        switch(action) {
            case 'voice':
                // Activar Vapi widget
                activateVapiWidget();
                break;
            case 'chat':
                // Abrir chat de Mavilda
                openMavildalChat();
                break;
            case 'whatsapp':
                // Abrir WhatsApp
                openWhatsApp();
                break;
        }
        
        // Cerrar el menú después de seleccionar
        toggleMenu();
    }

    // ==========================================
    // ACTIVAR VAPI WIDGET
    // ==========================================
    function activateVapiWidget() {
        const vapiWidget = document.querySelector('vapi-widget');
        if (vapiWidget) {
            // Simular click en el botón de Vapi para abrir
            const vapiButton = vapiWidget.shadowRoot?.querySelector('button[aria-label*="Call"]') || 
                              vapiWidget.shadowRoot?.querySelector('button');
            if (vapiButton) {
                vapiButton.click();
            }
        } else {
            console.warn('Vapi widget no encontrado');
        }
    }

    // ==========================================
    // ABRIR CHAT MAVILDA
    // ==========================================
    function openMavildalChat() {
        // Buscar el botón del chat de Mavilda
        const mavildalButton = document.getElementById('mavilda-chat-button');
        if (mavildalButton) {
            mavildalButton.click();
        } else {
            console.warn('Botón de Mavilda no encontrado');
        }
    }

    // ==========================================
    // ABRIR WHATSAPP
    // ==========================================
    function openWhatsApp() {
        const message = encodeURIComponent('Hola, vengo desde el sitio de SER AGRO');
        const whatsappURL = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${message}`;
        window.open(whatsappURL, '_blank');
    }

    // ==========================================
    // CERRAR MENÚ AL HACER CLICK FUERA
    // ==========================================
    function handleClickOutside(event) {
        const widget = document.getElementById('unified-contact-widget');
        if (isExpanded && widget && !widget.contains(event.target)) {
            toggleMenu();
        }
    }

    // ==========================================
    // INICIALIZAR EVENTOS
    // ==========================================
    function initializeEvents() {
        const mainButton = document.getElementById('main-contact-button');
        mainButton.addEventListener('click', toggleMenu);

        // Event listeners para cada opción
        document.getElementById('option-vapi').addEventListener('click', () => handleOptionClick('voice'));
        document.getElementById('option-chat').addEventListener('click', () => handleOptionClick('chat'));
        document.getElementById('option-whatsapp').addEventListener('click', () => handleOptionClick('whatsapp'));

        // Cerrar al hacer click fuera
        document.addEventListener('click', handleClickOutside);

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isExpanded) {
                toggleMenu();
            }
        });
    }

    // ==========================================
    // OCULTAR WIDGETS ORIGINALES
    // ==========================================
    function hideOriginalWidgets() {
        // Ocultar botón de WhatsApp original
        const whatsappButton = document.querySelector('.whatsapp-float-button');
        if (whatsappButton) {
            whatsappButton.style.display = 'none';
        }

        // Ocultar botón de Mavilda original
        const mavildalButton = document.getElementById('mavilda-chat-button');
        if (mavildalButton) {
            mavildalButton.style.display = 'none';
        }

        // Ocultar widget de Vapi (solo el botón flotante, no el widget completo)
        const vapiWidget = document.querySelector('vapi-widget');
        if (vapiWidget && vapiWidget.shadowRoot) {
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: none !important;
                }
            `;
            vapiWidget.shadowRoot.appendChild(style);
        }
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    function init() {
        // Crear widget
        createUnifiedWidget();

        // Agregar estilos
        addStyles();

        // Esperar un momento para que los otros widgets se carguen
        setTimeout(() => {
            // Ocultar widgets originales
            hideOriginalWidgets();

            // Inicializar eventos
            initializeEvents();

            console.log('✅ Widget unificado de contacto cargado correctamente');
        }, 1000);
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
