let currentLang = 'fr';
let translations = {};
let onLangChangeCallback = null;

export async function loadTranslations(lang) {
    console.log('loadTranslations appelée avec lang =', lang);
    try {
        const response = await fetch(`data/translations/${lang}.json`);
        translations = await response.json();
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslations();
        updateLangSwitcher();
        console.log('Callback va être appelé, onLangChangeCallback =', onLangChangeCallback);
        //if (onLangChangeCallback) {
            console.log('Appel du callback');
            onLangChangeCallback();
        //}
    } catch (error) {
        console.error('Erreur chargement traductions', error);
    }
}

function applyTranslations() {
    console.log('applyTranslations, nombre éléments data-i18n:', document.querySelectorAll('[data-i18n]').length);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.textContent = translations[key];
        } else {
            console.warn('Clé manquante dans traductions:', key);
        }
    });
}

function updateLangSwitcher() {
    console.log('updateLangSwitcher');
    document.querySelectorAll('.lang-option').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.lang === currentLang) {
            link.classList.add('active');
        }
    });
}

export async function initI18n(callback) {
    console.log('initI18n appelé avec callback =', callback);
    onLangChangeCallback = callback;
    const savedLang = localStorage.getItem('lang') || 'fr';
    await loadTranslations(savedLang);

    document.querySelectorAll('.lang-option').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Clic sur langue', link.dataset.lang);
            const lang = link.dataset.lang;
            await loadTranslations(lang);
        });
    });
}

export function getCurrentLang() {
    return currentLang;
}