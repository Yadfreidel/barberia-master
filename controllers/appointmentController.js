export function procesarCita(evento) {
    evento.preventDefault(); 

    // 1. CONFIGURA TU WHATSAPP REAL AQUÍ (Solo números con código de país)
    const TU_TELEFONO = "8292466177"; 

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefonoCliente = document.getElementById('telefono').value.trim();
    const servicio = document.getElementById('servicio-select').value;
    const barbero = document.getElementById('barbero-seleccionado').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora-seleccionada').value; // Captura la píldora activa

    // 2. Validaciones estrictas antifallos
    if (!servicio) {
        alert("Por favor, selecciona un servicio del catálogo.");
        return;
    }
    if (!barbero) {
        alert("Por favor, selecciona tu barbero preferido en la sección de arriba.");
        document.getElementById('staff-seccion').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    if (!hora) {
        alert("Por favor, toca una de las horas disponibles en color negro.");
        return;
    }

    const fechaFormateada = fecha.split('-').reverse().join('/');

    // 3. Estructuración del mensaje de texto
    const mensajeWhatsApp = 
        `🔥 *NUEVA RESERVA PREMIUM* 🔥%0A%0A` +
        `👤 *Cliente:* ${nombre}%0A` +
        `📞 *Teléfono:* ${telefonoCliente}%0A` +
        `📧 *Correo:* ${email}%0A%0A` +
        `💈 *Servicio:* ${servicio}%0A` +
        `💈 *Atendido por:* _${barbero}_%0A%0A` +
        `📅 *Fecha:* ${fechaFormateada}%0A` +
        `⏰ *Hora Elegida:* ⏳ *${hora} AM/PM* ⏳%0A%0A` +
        `⚡ _Turno validado y agendado desde la web oficial._`;

    const urlWhatsApp = `https://wa.me/${TU_TELEFONO}?text=${mensajeWhatsApp}`;
    window.open(urlWhatsApp, '_blank');

    // Resetear todo de forma limpia
    evento.target.reset();
    document.getElementById('barbero-seleccionado').value = "";
    document.getElementById('hora-seleccionada').value = "";
    document.getElementById('contenedor-horas').innerHTML = `<p style="color: var(--gris-texto); font-size: 0.9rem; font-style: italic;">Por favor, selecciona una fecha primero...</p>`;
    document.querySelectorAll('.card-barbero').forEach(t => t.classList.remove('barbero-activo'));
}