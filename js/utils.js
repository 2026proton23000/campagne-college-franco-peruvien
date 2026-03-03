
/**
 * Génère un identifiant unique pour le visiteur
 * @returns {string} ID unique
 */
export function generarIdUnico() {
    return 'visiteur_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
