(function() {
    'use strict';

    // ==========================================
    // 🔴 CONFIGURACIÓN - AQUÍ VA TU URL DE N8N
    // ==========================================
    const CONFIG = {
        n8nWebhookUrl: 'https://primary-production-396f31.up.railway.app/webhook/mavilda-chat',
        vapiPublicKey: '5a29292f-d9cc-4a21-bb7e-ff8df74763cd',
        vapiAssistantId: '776543a0-f4a2-4ed7-ad7a-f1fe0f6fd4d4',
        primaryColor: '#2E7D32',
        secondaryColor: '#1B5E20'
    };

    let sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    let isModalOpen = false;
    let isChatOpen = false;

    // ==========================================
    // CREAR HTML DEL WIDGET DUAL
    // ==========================================
    function createDualWidget() {
        const widgetHTML = `
            <!-- Botón Principal -->
            <button id="mavilda-main-button" class="mavilda-main-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.60 15.72 3.64 17.19L2.5 21.5L7.08 20.38C8.46 21.24 10.17 21.75 12 21.75C17.52 21.75 22 17.27 22 11.75C22 6.23 17.52 2 12 2ZM12 20C10.43 20 8.95 19.55 7.68 18.76L7.41 18.59L4.65 19.31L5.38 16.65L5.19 16.36C4.33 15.03 3.85 13.47 3.85 11.85C3.85 7.36 7.51 3.7 12 3.7C16.49 3.7 20.15 7.36 20.15 11.85C20.15 16.34 16.49 20 12 20Z"/>
                </svg>
                <span>Chatea con la<br>ingeniera Mavilda</span>
            </button>

            <!-- Modal de Selección -->
            <div id="mavilda-modal" class="mavilda-modal" style="display: none;">
                <div class="mavilda-modal-content">
                    <h3>¿Cómo querés comunicarte?</h3>
                    <button id="mavilda-voice-btn" class="mavilda-option-btn">
                        <span class="mavilda-icon">📞</span>
                        <span>Asistente de Voz</span>
                    </button>
                    <button id="mavilda-text-btn" class="mavilda-option-btn">
                        <span class="mavilda-icon">💬</span>
                        <span>Chat de Texto</span>
                    </button>
                    <button id="mavilda-modal-close" class="mavilda-close-modal">Cancelar</button>
                </div>
            </div>

            <!-- Chat de Texto -->
            <div id="mavilda-text-chat" class="mavilda-text-chat" style="display: none;">
                <div class="mavilda-chat-header">
                    <div class="mavilda-header-content">
                        <img src="imagenes/mavilda ingeniera agronoma.png" alt="Mavilda" class="mavilda-chat-logo">
                        <div class="mavilda-header-text">
                            <strong>Mavilda</strong>
                            <span>Asesora Seragro</span>
                        </div>
                    </div>
                    <button id="mavilda-close-chat" class="mavilda-close-btn">✕</button>
                </div>
                <div id="mavilda-messages" class="mavilda-messages"></div>
                <div class="mavilda-input-container">
                    <input type="text" id="mavilda-input" placeholder="Escribí tu mensaje..." autocomplete="off"/>
                    <button id="mavilda-send-btn" class="mavilda-send-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                            <path d="M2 10L18 2L12 18L10 12L2 10Z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Widget de Vapi (oculto inicialmente) -->
            <vapi-widget
                id="mavilda-vapi-widget"
                public-key="${CONFIG.vapiPublicKey}"
                assistant-id="${CONFIG.vapiAssistantId}"
                mode="voice"
                theme="dark"
                base-bg-color="#000000"
                accent-color="#14B8A6"
                cta-button-color="#000000"
                cta-button-text-color="#ffffff"
                border-radius="large"
                size="full"
                position="bottom-right"
                title="Hablar con Mavilda"
                start-button-text="Comenzar"
                end-button-text="Finalizar llamada"
                consent-required="false"
                style="display: none;"
            ></vapi-widget>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // ==========================================
    // ESTILOS CSS
    // ==========================================
    function addStyles() {
        const styles = `
            /* Botón Principal */
            .mavilda-main-btn {
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
                z-index: 99997;
                color: white;
                gap: 8px;
            }

            .mavilda-main-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                background: ${CONFIG.secondaryColor};
            }

            .mavilda-main-btn span {
                margin-left: 8px;
                font-size: 13px;
                font-weight: 600;
                line-height: 1.2;
            }

            /* Modal */
            .mavilda-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                animation: fadeIn 0.3s ease;
            }

            .mavilda-modal-content {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 450px;
                width: 90%;
                animation: slideUp 0.3s ease;
            }

            .mavilda-modal-content h3 {
                color: #333;
                margin-bottom: 30px;
                font-size: 24px;
            }

            .mavilda-option-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                width: 100%;
                padding: 18px;
                margin: 15px 0;
                border: none;
                border-radius: 15px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }

            #mavilda-voice-btn {
                background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
                color: white;
            }

            #mavilda-voice-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(46, 125, 50, 0.4);
            }

            #mavilda-text-btn {
                background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
                color: white;
            }

            #mavilda-text-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(46, 125, 50, 0.4);
            }

            .mavilda-close-modal {
                margin-top: 20px;
                background: transparent;
                color: #666;
                padding: 10px 20px;
                border: 2px solid #ddd;
                border-radius: 10px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .mavilda-close-modal:hover {
                background: #f5f5f5;
                border-color: #999;
            }

            /* Chat de Texto */
            .mavilda-text-chat {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
                z-index: 99998;
                overflow: hidden;
                animation: slideIn 0.3s ease;
            }

            .mavilda-chat-header {
                background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .mavilda-header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .mavilda-chat-logo {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: white;
                padding: 4px;
                object-fit: contain;
            }

            .mavilda-header-text strong {
                font-size: 16px;
            }

            .mavilda-header-text span {
                font-size: 12px;
                opacity: 0.9;
            }

            .mavilda-close-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 24px;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .mavilda-close-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: rotate(90deg);
            }

            .mavilda-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f8f9fa;
            }

            .mavilda-message {
                margin: 12px 0;
                padding: 12px 16px;
                border-radius: 18px;
                max-width: 80%;
                word-wrap: break-word;
                animation: messageSlide 0.3s ease;
            }

            .mavilda-message.user {
                background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
                color: white;
                margin-left: auto;
                border-bottom-right-radius: 4px;
            }

            .mavilda-message.bot {
                background: white;
                color: #333;
                border: 1px solid #e5e7eb;
                margin-right: auto;
                border-bottom-left-radius: 4px;
            }

            .mavilda-input-container {
                display: flex;
                padding: 15px;
                background: white;
                border-top: 1px solid #e5e7eb;
                gap: 10px;
            }

            #mavilda-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 25px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s ease;
            }

            #mavilda-input:focus {
                border-color: ${CONFIG.primaryColor};
                box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
            }

            .mavilda-send-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, ${CONFIG.secondaryColor} 100%);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .mavilda-send-btn:hover {
                transform: scale(1.1);
            }

            /* Animaciones */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(50px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(100px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes messageSlide {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Responsive */
            @media (max-width: 480px) {
                .mavilda-text-chat {
                    width: calc(100% - 20px);
                    height: calc(100% - 20px);
                    bottom: 10px;
                    right: 10px;
                }

                .mavilda-main-btn {
                    right: 40px;
                    bottom: 15px;
                    min-width: 160px;
                    height: 50px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ==========================================
    // MOSTRAR MENSAJE EN CHAT
    // ==========================================
    function mostrarMensaje(texto, esUsuario = false) {
        const messagesContainer = document.getElementById('mavilda-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `mavilda-message ${esUsuario ? 'user' : 'bot'}`;
        messageDiv.textContent = texto;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ==========================================
    // ENVIAR MENSAJE A N8N
    // ==========================================
    async function enviarMensaje(mensaje) {
        if (!mensaje.trim()) return;

        const input = document.getElementById('mavilda-input');
        const sendBtn = document.getElementById('mavilda-send-btn');

        mostrarMensaje(mensaje, true);
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        try {
            const response = await fetch(CONFIG.n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: mensaje,
                    sessionId: sessionId
                })
            });

            const data = await response.json();
            const respuesta = data.output || data.response || 'Lo siento, hubo un error.';
            mostrarMensaje(respuesta);

        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Hubo un problema de conexión. Intentá de nuevo.');
        } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    // ==========================================
    // EVENTOS
    // ==========================================
    function inicializarEventos() {
        const mainButton = document.getElementById('mavilda-main-button');
        const modal = document.getElementById('mavilda-modal');
        const voiceBtn = document.getElementById('mavilda-voice-btn');
        const textBtn = document.getElementById('mavilda-text-btn');
        const modalClose = document.getElementById('mavilda-modal-close');
        const textChat = document.getElementById('mavilda-text-chat');
        const closeChat = document.getElementById('mavilda-close-chat');
        const input = document.getElementById('mavilda-input');
        const sendBtn = document.getElementById('mavilda-send-btn');
        const vapiWidget = document.getElementById('mavilda-vapi-widget');

        // Abrir modal
        mainButton.addEventListener('click', () => {
            modal.style.display = 'flex';
            mainButton.style.display = 'none';
        });

        // Cerrar modal
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            mainButton.style.display = 'flex';
        });

        // Opción VOZ - Abrir directamente el widget Vapi
        voiceBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            
            // Mostrar el widget y activarlo automáticamente
            vapiWidget.style.display = 'block';
            vapiWidget.style.visibility = 'visible';
            vapiWidget.style.opacity = '1';
            
            // Función rápida para intentar activar el widget INMEDIATAMENTE
            function tryActivateVapi(attempts = 0) {
                if (attempts > 100) return; // Máximo 5 segundos de intentos rápidos
                
                const delay = attempts === 0 ? 0 : 50; // Primer intento inmediato, luego cada 50ms
                
                setTimeout(() => {
                    const shadowRoot = vapiWidget.shadowRoot;
                    if (shadowRoot) {
                        // Buscar botón de inicio con múltiples selectores
                        let startButton = shadowRoot.querySelector('[data-vapi-start-button]') ||
                                        shadowRoot.querySelector('.vapi-start-button') ||
                                        shadowRoot.querySelector('button[aria-label*="start"]') ||
                                        shadowRoot.querySelector('button[aria-label*="Start"]') ||
                                        shadowRoot.querySelector('button[class*="start"]') ||
                                        shadowRoot.querySelector('button[class*="cta"]') ||
                                        shadowRoot.querySelector('button[class*="Call"]') ||
                                        shadowRoot.querySelector('button[class*="call"]');
                        
                        // Si no encontró botón específico, buscar cualquier botón visible
                        if (!startButton) {
                            const allButtons = shadowRoot.querySelectorAll('button');
                            for (let btn of allButtons) {
                                const style = window.getComputedStyle(btn);
                                const text = btn.textContent.toLowerCase();
                                // Buscar botón que contenga palabras clave
                                if ((style.display !== 'none' && style.visibility !== 'hidden') &&
                                    (text.includes('start') || text.includes('comenzar') || text.includes('call') || text === '')) {
                                    startButton = btn;
                                    break;
                                }
                            }
                        }
                        
                        if (startButton) {
                            console.log('🎤 Activando Vapi instantáneamente (intento ' + attempts + ')');
                            // Triple click para asegurar activación
                            startButton.click();
                            setTimeout(() => startButton.click(), 10);
                            setTimeout(() => startButton.click(), 20);
                            return; // Éxito, salir
                        } else {
                            // Si no encontró el botón, seguir intentando rápidamente
                            tryActivateVapi(attempts + 1);
                        }
                    } else {
                        tryActivateVapi(attempts + 1);
                    }
                }, delay);
            }
            
            // Iniciar intentos de activación INMEDIATA
            tryActivateVapi(0);
        });

        // Opción TEXTO
        textBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            textChat.style.display = 'flex';
            mostrarMensaje('¡Hola! Soy Mavilda, tu asesora experta en drones DJI. ¿En qué puedo ayudarte?');
            input.focus();
        });

        // Cerrar chat
        closeChat.addEventListener('click', () => {
            textChat.style.display = 'none';
            mainButton.style.display = 'flex';
        });

        // Enviar mensaje
        sendBtn.addEventListener('click', () => {
            enviarMensaje(input.value);
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensaje(input.value);
            }
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                mainButton.style.display = 'flex';
            }
        });
    }

    // ==========================================
    // INICIALIZAR
    // ==========================================
    function init() {
        createDualWidget();
        addStyles();
        inicializarEventos();
        console.log('✅ Mavilda Dual Widget cargado');
        console.log('📝 Session ID:', sessionId);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();