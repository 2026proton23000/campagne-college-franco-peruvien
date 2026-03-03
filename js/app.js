import { registrarVisita } from "./tracking.js";
// js/app.js
import { initI18n } from './i18n.js';
import { loadPropositions } from './propositions.js';
import { displayActions, loadAllActions } from './actions.js';
import { enviarMensajeContacto } from './telegram.js';

async function reloadDynamicContent() {
    // Recharger les propositions
    if (document.getElementById('propositions-list')) {
        try {
            await loadPropositions('propositions-list');
        } catch (e) {
            console.warn('Erreur rechargement propositions', e);
        }
    }
    // Recharger les actions
    if (document.getElementById('recent-actions') || document.getElementById('actions-list')) {
        try {
            if (document.getElementById('recent-actions')) {
                await displayActions('recent-actions', 3);
            }
            if (document.getElementById('actions-list')) {
                await displayActions('actions-list');
            }
        } catch (e) {
            console.warn('Erreur rechargement actions', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    registrarVisita();
    // Initialiser l'i18n avec le callback de rechargement
    await initI18n(reloadDynamicContent);

    // Chargement initial
    await reloadDynamicContent();

    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !email || !mensaje) {
                alert('Por favor completa todos los campos.');
                return;
            }

            const ok = await enviarMensajeContacto({ nombre, email, mensaje });
            if (ok) {
                alert('Mensaje enviado. Gracias por contactarme.');
                contactForm.reset();
            } else {
                alert('Error al enviar. Intenta de nuevo.');
            }
        });
    }
});