// js/actions.js
import { getCurrentLang } from './i18n.js';

let allActions = [];

export async function loadAllActions() {
    try {
        const indexResponse = await fetch('data/articles/index.json');
        const ids = await indexResponse.json();
        allActions = await Promise.all(ids.map(async id => {
            const res = await fetch(`data/articles/${id}.json`);
            return res.json();
        }));
        return allActions;
    } catch (error) {
        console.error('Erreur chargement articles', error);
        return [];
    }
}

export async function displayActions(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (allActions.length === 0) {
        await loadAllActions();
    }

    const lang = getCurrentLang();
    const toShow = limit ? allActions.slice(0, limit) : allActions;

    container.innerHTML = toShow.map(article => `
        <div class="card" data-article-id="${article.id}">
            <div class="card-image" style="background-image: url('${article.image}');"></div>
            <div class="card-content">
                <h3 class="card-title">${article.title[lang]}</h3>
                <div class="card-date"><i class="far fa-calendar-alt"></i> ${article.date}</div>
                <p class="card-excerpt">${article.excerpt[lang]}</p>
                <a href="#" class="article-link card-link" data-id="${article.id}">${lang === 'fr' ? 'Lire la suite' : 'Leer más'} <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');

    // Attacher les événements aux liens
    attachArticleLinks();
}

function attachArticleLinks() {
    document.querySelectorAll('.article-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault(); // Empêche la navigation
            const id = link.dataset.id;
            await openArticleModal(id);
        });
    });
}

async function openArticleModal(id) {
    try {
        const response = await fetch(`data/articles/${id}.json`);
        const article = await response.json();
        const lang = getCurrentLang();
        const modal = document.getElementById('article-modal');
        const contentDiv = document.getElementById('modal-article-content');
        
        contentDiv.innerHTML = `
            <h2>${article.title[lang]}</h2>
            <p><em>${article.date} - ${article.author}</em></p>
            <img src="${article.image}" alt="${article.title[lang]}" style="width:100%; border-radius:15px; margin:1rem 0;">
            <div>${article.content[lang].replace(/\n/g, '<br>')}</div>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Erreur chargement article', error);
    }
}

// Fermeture de la modale
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('article-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Recharger quand la langue change
window.addEventListener('languageChanged', () => {
    if (document.getElementById('recent-actions')) {
        displayActions('recent-actions', 3);
    }
    if (document.getElementById('actions-list')) {
        displayActions('actions-list');
    }
});