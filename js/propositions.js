// js/propositions.js
import { getCurrentLang } from './i18n.js';

export async function loadPropositions(containerId) {
    try {
        const indexResponse = await fetch('data/propositions/index.json');
        const ids = await indexResponse.json();
        const propositions = await Promise.all(ids.map(async id => {
            const res = await fetch(`data/propositions/${id}.json`);
            return res.json();
        }));
        propositions.sort((a, b) => (a.order || 0) - (b.order || 0));
        displayPropositions(propositions, containerId);
    } catch (error) {
        console.error('Erreur chargement propositions', error);
    }
}

function displayPropositions(propositions, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const lang = getCurrentLang();

    container.innerHTML = propositions.map(prop => `
        <div class="proposition-card">
            <i class="fas fa-${prop.icon || 'bullhorn'}" style="font-size: 2.5rem; color: var(--bleu-france); margin-bottom: 1rem;"></i>
            <h3>${prop.title[lang]}</h3>
            <p>${prop.description[lang]}</p>
        </div>
    `).join('');
}