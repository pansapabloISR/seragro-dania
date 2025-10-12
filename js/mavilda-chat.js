(function() {
    'use strict';

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================
    const CONFIG = {
        webhookUrl: 'https://primary-production-396f31.up.railway.app/webhook/mavilda-chat',
        position: 'bottom-right',
        primaryColor: '#2E7D32',
        secondaryColor: '#1B5E20',
        autoGreeting: true  // ← NUEVO: saludo automático
    };

    let isOpen = false;
    let sessionId = null;
    let hasGreeted = false; // ← NUEVO: controla si ya saludó

    // ==========================================
    // GENERAR SESSION ID
    // ==========================================
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // ==========================================
    // CREAR ESTRUCTURA HTML
    // ==========================================
    function createChatWidget() {
        const widgetHTML = `
            <div id="mavilda-chat-container">
                <!-- Botón flotante -->
                <button id="mavilda-chat-button" aria-label="Abrir chat con Mavilda">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style="flex-shrink: 0;">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.60 15.72 3.64 17.19L2.5 21.5L7.08 20.38C8.46 21.24 10.17 21.75 12 21.75C17.52 21.75 22 17.27 22 11.75C22 6.23 17.52 2 12 2ZM12 20C10.43 20 8.95 19.55 7.68 18.76L7.41 18.59L4.65 19.31L5.38 16.65L5.19 16.36C4.33 15.03 3.85 13.47 3.85 11.85C3.85 7.36 7.51 3.7 12 3.7C16.49 3.7 20.15 7.36 20.15 11.85C20.15 16.34 16.49 20 12 20Z"/>
                        <path d="M8.5 7.5C8.5 7.22 8.72 7 9 7H15C15.28 7 15.5 7.22 15.5 7.5C15.5 7.78 15.28 8 15 8H9C8.72 8 8.5 7.78 8.5 7.5Z"/>
                        <path d="M8.5 10.5C8.5 10.22 8.72 10 9 10H15C15.28 10 15.5 10.22 15.5 10.5C15.5 10.78 15.28 11 15 11H9C8.72 11 8.5 10.78 8.5 10.5Z"/>
                        <path d="M8.5 13.5C8.5 13.22 8.72 13 9 13H12C12.28 13 12.5 13.22 12.5 13.5C12.5 13.78 12.28 14 12 14H9C8.72 14 8.5 13.78 8.5 13.5Z"/>
                    </svg>
                    <span style="margin-left: 8px; font-size: 13px; font-weight: 600; line-height: 1.2;">Chatea con la<br>ingeniera Mavilda</span>
                </button>

                <!-- Ventana de chat -->
                <div id="mavilda-chat-window" style="display: none;">
                    <div id="mavilda-chat-header">
                        <div class="header-content">
                            <img src="imagenes/mavilda ingeniera agronoma.png" alt="Seragro" class="chat-logo">
                            <div class="header-text">
                                <strong>Mavilda</strong>
                                <span>Asesora Seragro</span>
                            </div>
                        </div>
                        <button id="mavilda-chat-close" aria-label="Cerrar chat">✕</button>
                    </div>

                    <div id="mavilda-chat-messages"></div>

                    <div id="mavilda-chat-input-container">
                        <input 
                            type="text" 
                            id="mavilda-chat-input" 
                            placeholder="Escribí tu mensaje..."
                            autocomplete="off"
                        />
                        <button id="mavilda-chat-send" aria-label="Enviar mensaje">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                                <path d="M2 10L18 2L12 18L10 12L2 10Z"/>
                            </svg>
                        </button>
                    </div>
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
            #mavilda-chat-container {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                z-index: 100000;
            }

            #mavilda-chat-button {
                position: fixed;
                bottom: 20px;
                right: 40px;
                width: auto;
                min-width: 160px;
                height: 64px;
                padding: 12px 18px;
                border-radius: 32px;
                background: ${CONFIG.primaryColor};
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 100000;
                color: white;
            }

            #mavilda-chat-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                background: ${CONFIG.secondaryColor};
            }

            #mavilda-chat-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 380px;
                max-width: calc(100vw - 40px);
                height: 600px;
                max-height: calc(100vh - 120px);
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                z-index: 100000;
                overflow: hidden;
            }

            #mavilda-chat-header {
                background: ${CONFIG.primaryColor};
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chat-logo {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: white;
                padding: 4px;
                object-fit: contain;
            }

            .header-text {
                display: flex;
                flex-direction: column;
            }

            .header-text strong {
                font-size: 16px;
            }

            .header-text span {
                font-size: 12px;
                opacity: 0.9;
            }

            #mavilda-chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            }

            #mavilda-chat-close:hover {
                background: rgba(255,255,255,0.1);
            }

            #mavilda-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #f5f5f5;
            }

            .chat-message {
                margin-bottom: 12px;
                display: flex;
                flex-direction: column;
            }

            .chat-message.user {
                align-items: flex-end;
            }

            .chat-message.bot {
                align-items: flex-start;
            }

            .message-bubble {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 16px;
                word-wrap: break-word;
                line-height: 1.4;
            }

            .chat-message.user .message-bubble {
                background: ${CONFIG.primaryColor};
                color: white;
                border-bottom-right-radius: 4px;
            }

            .chat-message.bot .message-bubble {
                background: white;
                color: #333;
                border-bottom-left-radius: 4px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }

            .message-bubble strong {
                font-weight: 600;
            }

            .message-bubble ul, .message-bubble ol {
                margin: 8px 0;
                padding-left: 20px;
            }

            .message-bubble li {
                margin: 4px 0;
            }

            #mavilda-chat-input-container {
                display: flex;
                padding: 12px;
                background: white;
                border-top: 1px solid #e0e0e0;
                gap: 8px;
            }

            #mavilda-chat-input {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid #ddd;
                border-radius: 20px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }

            #mavilda-chat-input:focus {
                border-color: ${CONFIG.primaryColor};
            }

            #mavilda-chat-send {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: ${CONFIG.primaryColor};
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            #mavilda-chat-send:hover {
                background: ${CONFIG.secondaryColor};
                transform: scale(1.05);
            }

            #mavilda-chat-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 10px 14px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #999;
                animation: typing 1.4s infinite;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            /* Responsive */
            @media (max-width: 480px) {
                #mavilda-chat-window {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 120px);
                    right: 10px;
                    bottom: 70px;
                }

                #mavilda-chat-button {
                    right: 40px;
                    bottom: 15px;
                    min-width: 160px;
                    height: 50px;
                    padding: 8px 12px;
                }
                
                #mavilda-chat-button svg {
                    width: 22px !important;
                    height: 22px !important;
                }
                
                #mavilda-chat-button span {
                    font-size: 11px !important;
                    margin-left: 6px !important;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ==========================================
    // MOSTRAR MENSAJE EN EL CHAT
    // ==========================================
    function mostrarMensaje(texto, esUsuario = false) {
        const chatMessages = document.getElementById('mavilda-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${esUsuario ? 'user' : 'bot'}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = formatearMensaje(texto);

        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ==========================================
    // FORMATEAR MENSAJE (negrita, bullets)
    // ==========================================
    function formatearMensaje(texto) {
        // Convertir **texto** a <strong>
        texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convertir bullets
        texto = texto.replace(/^[•\-]\s/gm, '• ');

        // Convertir saltos de línea
        texto = texto.replace(/\n/g, '<br>');

        return texto;
    }

    // ==========================================
    // MOSTRAR INDICADOR DE ESCRITURA
    // ==========================================
    function mostrarEscribiendo() {
        const chatMessages = document.getElementById('mavilda-chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typing-indicator';

        const typingBubble = document.createElement('div');
        typingBubble.className = 'typing-indicator';
        typingBubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

        typingDiv.appendChild(typingBubble);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function ocultarEscribiendo() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // ==========================================
    // ENVIAR MENSAJE A N8N
    // ==========================================
    async function enviarMensaje(mensaje) {
        if (!mensaje.trim()) return;

        const chatInput = document.getElementById('mavilda-chat-input');
        const sendButton = document.getElementById('mavilda-chat-send');

        // Mostrar mensaje del usuario solo si no es el saludo automático
        if (mensaje !== 'Hola') {
            mostrarMensaje(mensaje, true);
        }

        // Deshabilitar input
        chatInput.disabled = true;
        sendButton.disabled = true;

        // Mostrar indicador de escritura
        mostrarEscribiendo();

        try {
            const response = await fetch(CONFIG.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: mensaje,
                    sessionId: sessionId
                })
            });

            const data = await response.json();

            ocultarEscribiendo();

            if (data.output) {
                mostrarMensaje(data.output);
            } else if (data.response) {
                mostrarMensaje(data.response);
            } else {
                mostrarMensaje('Lo siento, hubo un error. ¿Podrías intentar de nuevo?');
            }

        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            ocultarEscribiendo();
            mostrarMensaje('Ups, hubo un problema de conexión. Por favor intentá de nuevo.');
        } finally {
            chatInput.value = '';
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    // ==========================================
    // ENVIAR SALUDO AUTOMÁTICO
    // ==========================================
    function enviarSaludoAutomatico() {
        if (!hasGreeted && CONFIG.autoGreeting) {
            hasGreeted = true;
            // Esperar 500ms para que se vea natural
            setTimeout(() => {
                enviarMensaje('Hola');
            }, 500);
        }
    }

    // ==========================================
    // TOGGLE CHAT (abrir/cerrar)
    // ==========================================
    function toggleChat() {
        const chatWindow = document.getElementById('mavilda-chat-window');
        const chatButton = document.getElementById('mavilda-chat-button');

        isOpen = !isOpen;

        if (isOpen) {
            chatWindow.style.display = 'flex';
            chatButton.style.display = 'none';
            document.getElementById('mavilda-chat-input').focus();

            // ⭐ ENVIAR SALUDO AUTOMÁTICO AL ABRIR
            enviarSaludoAutomatico();
        } else {
            chatWindow.style.display = 'none';
            chatButton.style.display = 'flex';
        }
    }

    // ==========================================
    // INICIALIZAR EVENTOS
    // ==========================================
    function inicializarEventos() {
        const chatButton = document.getElementById('mavilda-chat-button');
        const closeButton = document.getElementById('mavilda-chat-close');
        const chatInput = document.getElementById('mavilda-chat-input');
        const sendButton = document.getElementById('mavilda-chat-send');

        // Abrir/cerrar chat
        chatButton.addEventListener('click', toggleChat);
        closeButton.addEventListener('click', toggleChat);

        // Enviar con botón
        sendButton.addEventListener('click', () => {
            const mensaje = chatInput.value;
            if (mensaje.trim()) {
                enviarMensaje(mensaje);
            }
        });

        // Enviar con Enter
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const mensaje = chatInput.value;
                if (mensaje.trim()) {
                    enviarMensaje(mensaje);
                }
            }
        });
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    function init() {
        // Generar session ID
        sessionId = generateSessionId();

        // Crear widget
        createChatWidget();

        // Agregar estilos
        addStyles();

        // Inicializar eventos
        inicializarEventos();

        console.log('✅ Mavilda Chat Widget cargado correctamente');
        console.log('Session ID:', sessionId);
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();