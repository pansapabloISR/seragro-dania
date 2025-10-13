(function() {
    'use strict';

    // ==========================================
    // GESTIÓN DE VISIBILIDAD DE WIDGETS
    // ==========================================
    
    let vapiIsActive = false;
    
    // Función para limpiar textos del widget de Vapi
    function cleanVapiWidget() {
        const vapiWidget = document.querySelector('vapi-widget');
        if (!vapiWidget) {
            setTimeout(cleanVapiWidget, 100);
            return;
        }

        const shadowRoot = vapiWidget.shadowRoot;
        if (shadowRoot) {
            // Ocultar textos de instrucción
            const instructionTexts = shadowRoot.querySelectorAll('[class*="instruction"], [class*="subtitle"], [class*="message"], [class*="text"]');
            instructionTexts.forEach(el => {
                if (el.textContent.includes('Click') || el.textContent.includes('microphone') || el.textContent.includes('start')) {
                    el.style.display = 'none';
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                }
            });

            // Ocultar botón "End Chat"
            const endChatButtons = shadowRoot.querySelectorAll('button, [role="button"], [class*="end"], [class*="chat"]');
            endChatButtons.forEach(el => {
                if (el.textContent.includes('End') || el.textContent.includes('Chat') || el.getAttribute('aria-label')?.includes('End')) {
                    el.style.display = 'none';
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                }
            });

            // Observar cambios en el DOM del widget
            const observer = new MutationObserver(() => {
                cleanVapiWidget();
            });
            observer.observe(shadowRoot, { childList: true, subtree: true });
        } else {
            setTimeout(cleanVapiWidget, 100);
        }
    }

    // Función para ocultar/mostrar otros widgets
    function toggleOtherWidgets(hide) {
        const whatsappButton = document.querySelector('.whatsapp-float-button');
        const mavildaButton = document.getElementById('mavilda-chat-button');
        const mavildaWindow = document.getElementById('mavilda-chat-window');

        if (hide) {
            // Ocultar widgets
            if (whatsappButton) {
                whatsappButton.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
                whatsappButton.style.opacity = '0';
                whatsappButton.style.visibility = 'hidden';
                whatsappButton.style.pointerEvents = 'none';
            }
            if (mavildaButton) {
                mavildaButton.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
                mavildaButton.style.opacity = '0';
                mavildaButton.style.visibility = 'hidden';
                mavildaButton.style.pointerEvents = 'none';
            }
            // Si la ventana de Mavilda está abierta, cerrarla
            if (mavildaWindow && mavildaWindow.style.display === 'flex') {
                mavildaWindow.style.display = 'none';
            }
        } else {
            // Mostrar widgets
            if (whatsappButton) {
                whatsappButton.style.opacity = '1';
                whatsappButton.style.visibility = 'visible';
                whatsappButton.style.pointerEvents = 'auto';
            }
            if (mavildaButton) {
                mavildaButton.style.opacity = '1';
                mavildaButton.style.visibility = 'visible';
                mavildaButton.style.pointerEvents = 'auto';
            }
        }
    }

    // Función para detectar si Vapi está activo
    function checkVapiStatus() {
        const vapiWidget = document.querySelector('vapi-widget');
        if (!vapiWidget) return false;

        const shadowRoot = vapiWidget.shadowRoot;
        if (!shadowRoot) return false;

        // Método 1: Buscar diálogo abierto
        const hasDialog = shadowRoot.querySelector('[role="dialog"], [class*="dialog"], [class*="modal"]');
        if (hasDialog) {
            const dialogStyle = window.getComputedStyle(hasDialog);
            if (dialogStyle.display !== 'none' && dialogStyle.visibility !== 'hidden') {
                return true;
            }
        }

        // Método 2: Verificar clases activas
        const activeElements = shadowRoot.querySelectorAll('[class*="active"], [class*="open"], [class*="expanded"]');
        if (activeElements.length > 0) {
            for (let elem of activeElements) {
                const style = window.getComputedStyle(elem);
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                    return true;
                }
            }
        }

        // Método 3: Verificar aria-expanded
        const buttons = shadowRoot.querySelectorAll('button');
        for (let button of buttons) {
            if (button.getAttribute('aria-expanded') === 'true') {
                return true;
            }
        }

        // Método 4: Verificar si hay contenido de conversación visible
        const conversationContent = shadowRoot.querySelector('[class*="conversation"], [class*="chat-content"], [class*="messages"]');
        if (conversationContent) {
            const style = window.getComputedStyle(conversationContent);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                return true;
            }
        }

        return false;
    }

    // Función para monitorear el estado de Vapi
    function monitorVapiWidget() {
        const vapiWidget = document.querySelector('vapi-widget');
        if (!vapiWidget) {
            setTimeout(monitorVapiWidget, 100);
            return;
        }

        // Verificar estado periódicamente
        setInterval(() => {
            const isActive = checkVapiStatus();
            
            if (isActive !== vapiIsActive) {
                vapiIsActive = isActive;
                toggleOtherWidgets(isActive);
                console.log('Vapi status changed:', isActive ? 'ACTIVE' : 'INACTIVE');
            }
        }, 200); // Verificar cada 200ms

        // También escuchar eventos de click en el widget
        vapiWidget.addEventListener('click', () => {
            setTimeout(() => {
                const isActive = checkVapiStatus();
                if (isActive !== vapiIsActive) {
                    vapiIsActive = isActive;
                    toggleOtherWidgets(isActive);
                }
            }, 300);
        });

        // Observar cambios en el shadow DOM
        const shadowRoot = vapiWidget.shadowRoot;
        if (shadowRoot) {
            const observer = new MutationObserver(() => {
                const isActive = checkVapiStatus();
                if (isActive !== vapiIsActive) {
                    vapiIsActive = isActive;
                    toggleOtherWidgets(isActive);
                }
            });

            observer.observe(shadowRoot, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'aria-expanded']
            });
        }

        // Escuchar clicks en el documento para detectar cuando se cierra Vapi
        document.addEventListener('click', (e) => {
            // Si el click no es en Vapi, verificar si se cerró
            if (!vapiWidget.contains(e.target)) {
                setTimeout(() => {
                    const isActive = checkVapiStatus();
                    if (isActive !== vapiIsActive) {
                        vapiIsActive = isActive;
                        toggleOtherWidgets(isActive);
                    }
                }, 100);
            }
        });

        // Escuchar la tecla ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setTimeout(() => {
                    const isActive = checkVapiStatus();
                    if (isActive !== vapiIsActive) {
                        vapiIsActive = isActive;
                        toggleOtherWidgets(isActive);
                    }
                }, 100);
            }
        });
    }

    // Inicializar cuando el DOM esté listo
    function init() {
        cleanVapiWidget();
        monitorVapiWidget();
        console.log('✅ Vapi Widget Manager cargado correctamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
