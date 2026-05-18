export function procesarCita(evento) {
    evento.preventDefault(); // Evita que la página se recargue al enviar

    // 1. CONFIGURA AQUÍ TU NÚMERO DE WHATSAPP (Solo números, con código de país)
    const TU_TELEFONO = "8292466177"; // <-- CAMBIA ESTO CON TU NÚMERO REAL

    // 2. Capturar los valores exactos ingresados por el cliente
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefonoCliente = document.getElementById('telefono').value.trim();
    const servicio = document.getElementById('servicio-select').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Validar rápidamente que el selector tenga un servicio elegido
    if (!servicio) {
        alert("Por favor, selecciona un servicio del catálogo antes de confirmar.");
        return;
    }

    // 3. Formatear la fecha para que se lea de forma más elegante (Opcional)
    const fechaFormateada = fecha.split('-').reverse().join('/');

    // 4. Construir el mensaje con saltos de línea (%0A) y emojis para una apariencia VIP
    const mensajeWhatsApp = 
        `🔥 *NUEVA RESERVA - BARBER SHOP* 🔥%0A%0A` +
        `👤 *Cliente:* ${nombre}%0A` +
        `📞 *Teléfono:* ${telefonoCliente}%0A` +
        `📧 *Correo:* ${email}%0A%0A` +
        `💈 *Servicio:* ${servicio}%0A` +
        `📅 *Fecha:* ${fechaFormateada}%0A` +
        `⏰ *Hora:* ${hora} hrs%0A%0A` +
        `⚡ _Por favor, confirme mi turno maestro._`;

    // 5. Crear el enlace oficial de la API de WhatsApp
    const urlWhatsApp = `https://wa.me/${TU_TELEFONO}?text=${mensajeWhatsApp}`;

    // 6. Redirigir al cliente a WhatsApp (abre en pestaña nueva si está en PC, o directo en la App si está en móvil)
    window.open(urlWhatsApp, '_blank');

    // 7. Opcional: Limpiar el formulario para que quede listo para otra cita
    evento.target.reset();
}