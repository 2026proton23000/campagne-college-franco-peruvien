const TELEGRAM_TOKEN = 'VOTRE_TOKEN';
const TELEGRAM_CHAT_ID = 'VOTRE_CHAT_ID';

export async function enviarMensajeContacto(datos) {
    const mensaje = `
📬 *Nuevo mensaje de contacto - Campaña Barraud*

👤 *Nombre:* ${datos.nombre}
📧 *Email:* ${datos.email}
💬 *Mensaje:* ${datos.mensaje}
    `;
    return enviarMensaje(mensaje);
}

async function enviarMensaje(mensaje) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: mensaje,
                parse_mode: 'Markdown'
            })
        });
        return response.ok;
    } catch {
        return false;
    }
}